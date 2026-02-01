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
import { DISTRICT_MAP_EN_NP, PARTY_MAP_EN_NP } from "@/data/mappings";
import { useLanguage } from "@/context/LanguageContext";
import { translateDistrict, translatePartyName } from "@/lib/translations";

const ITEMS_PER_PAGE = 24;

const CandidatesPage = () => {
  const { language, t } = useLanguage();
  const [filters, setFilters] = useState<FilterState>({
    province: null,
    district: null,
    party: null,
    qualification: null,
    constituency: null,
    gender: null,
    ageMin: null,
    ageMax: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filterOptions = useFilterOptions(allCandidates, filters);
  const filteredByFilters = useFilteredCandidates(allCandidates, filters);



  // Apply search filter
  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return filteredByFilters;
    
    const query = searchQuery.toLowerCase().trim();
    const searchTerms = [query];

    // Add mapped Nepali terms if English query matches districts
    Object.keys(DISTRICT_MAP_EN_NP).forEach(enKey => {
      if (enKey.includes(query)) {
        searchTerms.push(DISTRICT_MAP_EN_NP[enKey]);
      }
    });

    // Add mapped Nepali terms if English query matches parties
    Object.keys(PARTY_MAP_EN_NP).forEach(enKey => {
      if (enKey.includes(query)) {
        searchTerms.push(PARTY_MAP_EN_NP[enKey]);
      }
    });

    // Also try reverse: if user searches Nepali, find English equivalents
    Object.entries(DISTRICT_MAP_EN_NP).forEach(([enKey, npValue]) => {
      if (npValue.toLowerCase().includes(query)) {
        searchTerms.push(enKey);
        searchTerms.push(npValue);
      }
    });

    Object.entries(PARTY_MAP_EN_NP).forEach(([enKey, npValue]) => {
      if (npValue.toLowerCase().includes(query)) {
        searchTerms.push(enKey);
        searchTerms.push(npValue);
      }
    });

    // Remove duplicates
    const uniqueTerms = [...new Set(searchTerms)];

    return filteredByFilters.filter(
      (c) =>
        uniqueTerms.some(term => {
          const lowerTerm = term.toLowerCase();
          return (
            c.CandidateName.toLowerCase().includes(lowerTerm) ||
            c.DistrictName.toLowerCase().includes(lowerTerm) ||
            c.PoliticalPartyName.toLowerCase().includes(lowerTerm)
          );
        })
    );
  }, [filteredByFilters, searchQuery]);

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
          {language === "en" ? "Search Candidates" : "उम्मेदवार खोज्नुहोस्"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {language === "en" ? "Search and explore all candidates" : "सबै उम्मेदवारहरू खोज्नुहोस् र अन्वेषण गर्नुहोस्"}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={language === "en" ? "Search district, party, or Nepali name" : "जिल्ला, पार्टी, वा नेपाली नाम खोज्नुहोस्"}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-10 h-12 text-base bg-card"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {language === "en" 
            ? "💡 District & party search works in both English & Nepali. Candidate names are in Nepali. (e.g., 'काठमाडौँ' or 'Kathmandu' for district)"
            : "💡 जिल्ला र पार्टी खोज अंग्रेजी र नेपालीमा काम गर्छ। उम्मेदवारको नाम नेपालीमा छ। (उदा. 'काठमाडौँ' वा 'Kathmandu')"}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-card rounded-xl border border-border">
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          options={filterOptions}
        />
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {filteredCandidates.length.toLocaleString()} {language === "en" ? t("candidates.found") : "उम्मेदवार फेला पर्यो"}
        </span>
      </div>

      {/* Candidates Grid */}
      {filteredCandidates.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {language === "en" ? t("candidates.notFound") : "कुनै उम्मेदवार फेला परेन"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === "en" ? t("candidates.notFound.desc") : "कृपया आफ्नो फिल्टर वा खोज क्वेरी समायोजन गर्नुहोस्"}
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
                {language === "en" ? "Load More" : "थप लोड गर्नुहोस्"}
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                {language === "en" 
                  ? `Showing ${paginatedCandidates.length} of ${filteredCandidates.length}`
                  : `${paginatedCandidates.length} को ${filteredCandidates.length} देखाइँदै छ`}
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
    </Layout>
  );
};

export default CandidatesPage;
