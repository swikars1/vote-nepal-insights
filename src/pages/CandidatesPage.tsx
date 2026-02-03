import { useState, useMemo, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { CandidateCard } from "@/components/candidates/CandidateCard";
import { CandidateDetail } from "@/components/candidates/CandidateDetail";
import { allCandidates } from "@/data/mockCandidates";
import {
  useFilteredCandidates,
  useFilterOptions,
} from "@/hooks/useElectionData";
import { Candidate, FilterState } from "@/types/election";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DISTRICT_MAP_EN_NP, PARTY_MAP_EN_NP, translateToEn } from "@/data/mappings";
import { useLanguage } from "@/context/LanguageContext";
import { ExportDataDialog } from "@/components/export/ExportDataDialog";

const ITEMS_PER_PAGE = 24;

const CandidatesPage = () => {
  const [filters, setFilters] = useState<FilterState>({
    province: null,
    district: null,
    party: null,
    qualification: null,
    constituency: null,
    gender: null,
    ageMin: null,
    ageMax: null,
    excludeIndependent: false,
  });

  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const filterOptions = useFilterOptions(allCandidates, filters);
  const filteredByFilters = useFilteredCandidates(allCandidates, filters);

  // Apply search filter
  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return filteredByFilters;
    
    const query = searchQuery.toLowerCase();
    const searchTerms = [query];

    // Add mapped Nepali terms if English query matches
    Object.keys(DISTRICT_MAP_EN_NP).forEach(enKey => {
      if (enKey.includes(query)) {
        searchTerms.push(DISTRICT_MAP_EN_NP[enKey]);
      }
    });

    Object.keys(PARTY_MAP_EN_NP).forEach(enKey => {
      if (enKey.includes(query)) {
        searchTerms.push(PARTY_MAP_EN_NP[enKey]);
      }
    });

    return filteredByFilters.filter(
      (c) =>
        searchTerms.some(term => 
          c.CandidateName.toLowerCase().includes(term) ||
          c.DistrictName.toLowerCase().includes(term) ||
          c.PoliticalPartyName.toLowerCase().includes(term) ||
          (language === "en" && translateToEn(c.DistrictName).toLowerCase().includes(term)) ||
          (language === "en" && translateToEn(c.PoliticalPartyName).toLowerCase().includes(term))
        )
    );
  }, [filteredByFilters, searchQuery, language]);

  // Paginated results
  const paginatedCandidates = useMemo(() => {
    const start = 0;
    const end = page * ITEMS_PER_PAGE;
    return filteredCandidates.slice(start, end);
  }, [filteredCandidates, page]);

  const hasMore = paginatedCandidates.length < filteredCandidates.length;

  const handleCandidateClick = useCallback((candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDetailOpen(true);
  }, []);

  const loadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  // Reset page when filters change
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground font-nepali">
          {t("उम्मेदवार खोज्नुहोस्", "Search Candidates")}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t("सबै उम्मेदवारहरू खोज्नुहोस् र विवरण हेर्नुहोस्", "Search and explore all candidates and their details")}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("नाम, जिल्ला, वा पार्टी खोज्नुहोस्...", "Search name, district, or party...")}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          className="pl-10 h-11 text-base bg-card"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-card rounded-xl border border-border">
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          options={filterOptions}
          onExportJson={() => setExportOpen(true)}
        />
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {filteredCandidates.length.toLocaleString()} {t("उम्मेदवार फेला पर्यो", "candidates found")}
        </span>
      </div>

      {/* Candidates Grid */}
      {filteredCandidates.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {t("कुनै उम्मेदवार फेला परेन", "No candidates found")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("कृपया आफ्नो फिल्टर वा खोज शब्द परिवर्तन गर्नुहोस्", "Please adjust your filters or search query")}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.CandidateID}
                candidate={candidate}
                onClick={() => handleCandidateClick(candidate)}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-8 text-center">
              <Button onClick={loadMore} size="lg" variant="outline">
                {t("थप लोड गर्नुहोस्", "Load More")}
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`जम्मा ${filteredCandidates.length.toLocaleString()} मध्ये ${paginatedCandidates.length} देखाइएको छ`, `Showing ${paginatedCandidates.length} of ${filteredCandidates.length}`)}
              </p>
            </div>
          )}
        </>
      )}

      {/* Candidate Detail Modal */}
      <CandidateDetail
        candidate={selectedCandidate}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      {/* Export Dialog */}
      <ExportDataDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        data={filteredCandidates}
        fullData={allCandidates}
      />
    </Layout>
  );
};

export default CandidatesPage;
