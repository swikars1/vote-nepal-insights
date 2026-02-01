import { useState, useMemo } from "react";
import { Users, Flag, MapPin, GraduationCap, TrendingUp } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { CandidateCard } from "@/components/candidates/CandidateCard";
import { CandidateDetail } from "@/components/candidates/CandidateDetail";
import { PartyBarChart } from "@/components/charts/PartyBarChart";
import { QualificationPieChart } from "@/components/charts/QualificationPieChart";
import { GenderChart } from "@/components/charts/GenderChart";
import { ProvinceChart } from "@/components/charts/ProvinceChart";
import { allCandidates } from "@/data/mockCandidates";
import {
  useAggregatedStats,
  useFilteredCandidates,
  useFilterOptions,
} from "@/hooks/useElectionData";
import { Candidate, FilterState } from "@/types/election";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const Index = () => {
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

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filterOptions = useFilterOptions(allCandidates, filters);
  const filteredCandidates = useFilteredCandidates(allCandidates, filters);
  const stats = useAggregatedStats(filteredCandidates);

  // Get top candidates to show preview
  const previewCandidates = useMemo(() => {
    return filteredCandidates.slice(0, 6);
  }, [filteredCandidates]);

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDetailOpen(true);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground font-nepali">
          {language === "en" ? "Nepal Election Candidates" : "नेपाल निर्वाचन उम्मेदवार"}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {language === "en" ? "Nepal Election Candidates Dashboard" : "नेपाल निर्वाचन उम्मेदवार ड्यासबोर्ड"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          {language === "en" 
            ? "Explore candidates by district, province, and party" 
            : "जिल्ला, प्रदेश, र पार्टी अनुसार उम्मेदवारहरू खोज्नुहोस्"}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-in-bottom">
        <StatCard
          title={language === "en" ? t("stats.totalCandidates") : "कुल उम्मेदवार"}
          titleNp={language === "np" ? t("stats.totalCandidates") : "कुल उम्मेदवार"}
          value={stats.totalCandidates}
          icon={Users}
          variant="primary"
        />
        <StatCard
          title={language === "en" ? t("stats.politicalParties") : "राजनीतिक दलहरू"}
          titleNp={language === "np" ? t("stats.politicalParties") : "राजनीतिक दलहरू"}
          value={Object.keys(stats.byParty).length}
          icon={Flag}
        />
        <StatCard
          title={language === "en" ? t("stats.districts") : "जिल्लाहरू"}
          titleNp={language === "np" ? t("stats.districts") : "जिल्लाहरू"}
          value={Object.keys(stats.byDistrict).length}
          icon={MapPin}
        />
        <StatCard
          title={language === "en" ? t("stats.provinces") : "प्रदेशहरू"}
          titleNp={language === "np" ? t("stats.provinces") : "प्रदेशहरू"}
          value={Object.keys(stats.byProvince).length}
          icon={TrendingUp}
        />
      </div>

      {/* Filters */}
      <div className="mb-8 p-4 bg-card rounded-xl border border-border animate-slide-in-bottom">
        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          options={filterOptions}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="animate-slide-in-bottom" style={{ animationDelay: "0.1s" }}>
          <PartyBarChart data={stats.byParty} />
        </div>
        <div className="animate-slide-in-bottom" style={{ animationDelay: "0.15s" }}>
          <QualificationPieChart data={stats.byQualification} />
        </div>
        <div className="animate-slide-in-bottom" style={{ animationDelay: "0.2s" }}>
          <GenderChart data={stats.byGender} />
        </div>
        <div className="animate-slide-in-bottom" style={{ animationDelay: "0.25s" }}>
          <ProvinceChart data={stats.byProvince} />
        </div>
      </div>

      {/* Candidate Preview */}
      <div className="animate-slide-in-bottom" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {language === "en" ? "Candidates" : "उम्मेदवारहरू"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredCandidates.length.toLocaleString()} {language === "en" ? t("candidates.found") : "उम्मेदवार फेला पर्यो"}
            </p>
          </div>
          <Link to="/candidates">
            <Button variant="outline" size="sm">
              {language === "en" ? "View All →" : "सबै हेर्नुहोस् →"}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {previewCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.CandidateID}
              candidate={candidate}
              onClick={() => handleCandidateClick(candidate)}
            />
          ))}
        </div>

        {filteredCandidates.length > 6 && (
          <div className="mt-6 text-center">
            <Link to="/candidates">
              <Button size="lg">
                {language === "en" 
                  ? `View all ${filteredCandidates.length.toLocaleString()} candidates`
                  : `सबै ${filteredCandidates.length.toLocaleString()} उम्मेदवार हेर्नुहोस्`}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Candidate Detail Modal */}
      <CandidateDetail
        candidate={selectedCandidate}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </Layout>
  );
};

export default Index;
