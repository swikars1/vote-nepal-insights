import { useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { allCandidates } from "@/data/mockCandidates";
import { useAggregatedStats, useFilteredCandidates } from "@/hooks/useElectionData";
import { getShortPartyName } from "@/hooks/useElectionData";
import { translateToEn } from "@/data/mappings";
import { useLanguage } from "@/context/LanguageContext";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { useFilterOptions } from "@/hooks/useElectionData";
import { FilterState } from "@/types/election";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const CHART_COLORS = [
  "hsl(215, 55%, 35%)",
  "hsl(350, 55%, 50%)",
  "hsl(160, 50%, 45%)",
  "hsl(35, 70%, 55%)",
  "hsl(270, 40%, 55%)",
  "hsl(190, 55%, 45%)",
  "hsl(25, 65%, 50%)",
  "hsl(300, 35%, 50%)",
];

const AnalyticsPage = () => {
  const { t, language } = useLanguage();
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

  const filterOptions = useFilterOptions(allCandidates, filters);
  const filteredCandidates = useFilteredCandidates(allCandidates, filters);
  const stats = useAggregatedStats(filteredCandidates, filters);

  // Party qualification breakdown
  const partyQualificationData = useMemo(() => {
    const partyData: Record<string, Record<string, number>> = {};
    
    filteredCandidates.forEach((c) => {
      const shortParty = getShortPartyName(c.PoliticalPartyName);
      const partyName = language === "en" ? translateToEn(shortParty) : shortParty;
      if (!partyData[partyName]) {
        partyData[partyName] = {};
      }
      const qual = language === "en" ? translateToEn(c.QUALIFICATION) : c.QUALIFICATION;
      partyData[partyName][qual] = 
        (partyData[partyName][qual] || 0) + 1;
    });

    // Get top 5 parties
    const topParties = Object.entries(stats.byParty)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => language === "en" ? translateToEn(getShortPartyName(name)) : getShortPartyName(name));

    const qualifications = language === "en" 
      ? ["Bachelors", "Masters", "Higher Secondary", "Secondary", "Ph.D"] 
      : ["स्नातक", "स्नातकोत्तर", "उच्च माध्यमिक", "माध्यमिक", "विद्यावारिधि"];

    return topParties.map((party) => ({
      name: party,
      ...qualifications.reduce((acc, qual) => ({
        ...acc,
        [qual]: partyData[party]?.[qual] || 0,
      }), {}),
    }));
  }, [stats.byParty, language, filteredCandidates]);

  // Gender by party
  const genderByPartyData = useMemo(() => {
    const partyGender: Record<string, { male: number; female: number }> = {};
    
    filteredCandidates.forEach((c) => {
      const shortParty = getShortPartyName(c.PoliticalPartyName);
      const partyName = language === "en" ? translateToEn(shortParty) : shortParty;
      if (!partyGender[partyName]) {
        partyGender[partyName] = { male: 0, female: 0 };
      }
      if (c.Gender === "पुरुष") {
        partyGender[partyName].male++;
      } else if (c.Gender === "महिला") {
        partyGender[partyName].female++;
      }
    });

    return Object.entries(partyGender)
      .map(([name, data]) => ({
        name,
        [t("पुरुष", "Male")]: data.male,
        [t("महिला", "Female")]: data.female,
        femalePercent: ((data.female / (data.male + data.female)) * 100).toFixed(1),
      }))
      .sort((a, b) => {
        const maleKey = t("पुरुष", "Male");
        const femaleKey = t("महिला", "Female");
        return ((b[maleKey] as number) + (b[femaleKey] as number)) - ((a[maleKey] as number) + (a[femaleKey] as number));
      })
      .slice(0, 7);
  }, [language, filteredCandidates, t]);

  // Age group data
  const ageGroupData = useMemo(() => {
    return Object.entries(stats.byAgeGroup).map(([name, value]) => ({
      name,
      value,
    }));
  }, [stats.byAgeGroup]);

  // Top universities
  const topUniversities = useMemo(() => {
    const unis: Record<string, number> = {};
    filteredCandidates.forEach((c) => {
      if (c.NAMEOFINST && c.NAMEOFINST !== "0" && c.NAMEOFINST !== "-") {
        unis[c.NAMEOFINST] = (unis[c.NAMEOFINST] || 0) + 1;
      }
    });
    return Object.entries(unis)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [filteredCandidates]);

  // Province insights
  const provinceInsights = useMemo(() => {
    const provinceAge: Record<string, { total: number; sum: number }> = {};
    
    filteredCandidates.forEach((c) => {
      if (!provinceAge[c.StateName]) {
        provinceAge[c.StateName] = { total: 0, sum: 0 };
      }
      provinceAge[c.StateName].total++;
      provinceAge[c.StateName].sum += c.AGE_YR;
    });

    return Object.entries(provinceAge)
      .map(([name, data]) => ({
        name: (language === "en" ? translateToEn(name) : name).replace(" प्रदेश", ""),
        avgAge: Math.round(data.sum / data.total),
        count: data.total,
      }))
      .sort((a, b) => a.avgAge - b.avgAge);
  }, [language, filteredCandidates]);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground font-nepali">
            {t("विस्तृत विश्लेषण", "Detailed Analytics")}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t("निर्वाचन तथ्याङ्क र अन्तर्दृष्टि", "Election Statistics & Insights")}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 p-4 bg-card rounded-xl border border-border no-print">
        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          options={filterOptions}
          onExportPdf={() => window.print()}
        />
      </div>

      <div className="printable-report">
        {/* Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Gender by Party */}
          <div className="chart-container">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">{t("पार्टी अनुसार लिङ्ग", "Gender by Party")}</h3>
              <p className="text-xs text-muted-foreground">Gender distribution by political party</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={genderByPartyData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }} width={60} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey={t("पुरुष", "Male")} stackId="a" fill="hsl(215, 55%, 45%)" />
                  <Bar dataKey={t("महिला", "Female")} stackId="a" fill="hsl(350, 55%, 55%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Age Distribution */}
          <div className="chart-container">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">{t("उमेर समूह वितरण", "Age Distribution")}</h3>
              <p className="text-xs text-muted-foreground">Age group distribution of candidates</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageGroupData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {ageGroupData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value} ${t("उम्मेदवार", "Candidates")}`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Province Average Age */}
          <div className="chart-container">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">{t("प्रदेश अनुसार औसत उमेर", "Avg Age by Province")}</h3>
              <p className="text-xs text-muted-foreground">Average candidate age by province</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={provinceInsights}
                  margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    angle={-30}
                    textAnchor="end"
                  />
                  <YAxis
                    domain={[35, 55]}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="avgAge" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                    {provinceInsights.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.avgAge < 44 ? "hsl(160, 50%, 45%)" : "hsl(var(--primary))"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Universities */}
          <div className="chart-container">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">{t("शीर्ष शैक्षिक संस्थाहरू", "Top Institutions")}</h3>
              <p className="text-xs text-muted-foreground">Top institutions producing candidates</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topUniversities}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }} 
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Key Insights Summary */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">{t("मुख्य निष्कर्षहरू", "Key Insights")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground">{t("महिला प्रतिनिधित्व", "Female Representation")}</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {((stats.byGender["महिला"] || 0) / stats.totalCandidates * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground">{t("औसत उमेर", "Average Age")}</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {Math.round(filteredCandidates.reduce((a, c) => a + c.AGE_YR, 0) / (filteredCandidates.length || 1))} {t("वर्ष", "Years")}
              </p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground">{t("कुल उम्मेदवार", "Total Candidates")}</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                    {stats.totalCandidates.toLocaleString()}
                </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
