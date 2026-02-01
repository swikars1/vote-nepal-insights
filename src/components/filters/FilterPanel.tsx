import { X } from "lucide-react";
import { useMemo } from "react";
import { FilterState } from "@/types/election";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/combobox";
import { DISTRICT_MAP_EN_NP, PARTY_MAP_EN_NP, PROVINCE_MAP_EN_NP } from "@/data/mappings";
import { useLanguage } from "@/context/LanguageContext";
import { translateQualification, translateGender, translateProvince, translateDistrict, translatePartyName } from "@/lib/translations";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  options: {
    provinces: string[];
    districts: string[];
    constituencies: number[];
    parties: string[];
    qualifications: string[];
    genders: string[];
  };
  className?: string;
}

export function FilterPanel({
  filters,
  onFilterChange,
  options,
  className,
}: FilterPanelProps) {
  const { language } = useLanguage();
  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== null
  ).length;

  const clearFilters = () => {
    onFilterChange({
      province: null,
      district: null,
      constituency: null,
      party: null,
      qualification: null,
      gender: null,
      ageMin: null,
      ageMax: null,
    });
  };

  const updateFilter = (key: keyof FilterState, value: string | number | null) => {
    onFilterChange({
      ...filters,
      [key]: value === "all" ? null : value,
    });
  };

  // Helper to reverse map for search keywords
  const getKeywords = (value: string, map: Record<string, string>) => {
    return Object.entries(map)
      .filter(([_, v]) => v === value)
      .map(([k]) => k);
  };

  const provinceOptions = useMemo(() => options.provinces.map(p => ({ 
    label: language === "en" ? translateProvince(p, "en") : p, 
    value: p,
    keywords: getKeywords(p, PROVINCE_MAP_EN_NP)
  })), [options.provinces, language]);
  
  const districtOptions = useMemo(() => options.districts.map(d => ({ 
    label: language === "en" ? translateDistrict(d, "en") : d, 
    value: d,
    keywords: getKeywords(d, DISTRICT_MAP_EN_NP)
  })), [options.districts, language]);
  
  const partyOptions = useMemo(() => options.parties.map(p => ({ 
    label: language === "en" ? translatePartyName(p, "en") : p, 
    value: p,
    keywords: getKeywords(p, PARTY_MAP_EN_NP)
  })), [options.parties, language]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">
            {language === "en" ? "Filters" : "फिल्टर"}
          </h3>
          {activeFiltersCount > 0 && (
            <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-4 w-4" />
            {language === "en" ? "Clear All" : "सबै हटाउनुहोस्"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Province Filter */}
        <Combobox
          options={provinceOptions}
          value={filters.province}
          onSelect={(v) => updateFilter("province", v)}
          placeholder={language === "en" ? "Select Province" : "प्रदेश चयन गर्नुहोस्"}
          searchPlaceholder={language === "en" ? "Search province..." : "प्रदेश खोज्नुहोस्..."}
          emptyText={language === "en" ? "No province found." : "कुनै प्रदेश फेला परेन।"}
        />

        {/* District Filter */}
        <Combobox
          options={districtOptions}
          value={filters.district}
          onSelect={(v) => updateFilter("district", v)}
          placeholder={language === "en" ? "Select District" : "जिल्ला चयन गर्नुहोस्"}
          searchPlaceholder={language === "en" ? "Search district..." : "जिल्ला खोज्नुहोस्..."}
          emptyText={language === "en" ? "No district found." : "कुनै जिल्ला फेला परेन।"}
        />

        {/* Constituency Filter */}
        <Select
          value={filters.constituency?.toString() || "all"}
          onValueChange={(v) => updateFilter("constituency", v === "all" ? "all" : parseInt(v))}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder={language === "en" ? "Select Area" : "क्षेत्र चयन गर्नुहोस्"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {language === "en" ? "All Areas" : "सबै क्षेत्र"}
            </SelectItem>
            {options.constituencies.map((constituency) => (
              <SelectItem key={constituency} value={constituency.toString()}>
                {language === "en" ? "Area" : "क्षेत्र"} {constituency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Party Filter */}
        <Combobox
          options={partyOptions}
          value={filters.party}
          onSelect={(v) => updateFilter("party", v)}
          placeholder={language === "en" ? "Select Party" : "पार्टी चयन गर्नुहोस्"}
          searchPlaceholder={language === "en" ? "Search party..." : "पार्टी खोज्नुहोस्..."}
          emptyText={language === "en" ? "No party found." : "कुनै पार्टी फेला परेन।"}
        />

        {/* Qualification Filter */}
        <Select
          value={filters.qualification || "all"}
          onValueChange={(v) => updateFilter("qualification", v)}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder={language === "en" ? "Select Qualification" : "योग्यता चयन गर्नुहोस्"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {language === "en" ? "All Qualifications" : "सबै योग्यता"}
            </SelectItem>
            {options.qualifications.map((qual) => (
              <SelectItem key={qual} value={qual}>
                {language === "en" ? translateQualification(qual, "en") : qual}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Gender Filter */}
        <Select
          value={filters.gender || "all"}
          onValueChange={(v) => updateFilter("gender", v)}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder={language === "en" ? "Select Gender" : "लिङ्ग चयन गर्नुहोस्"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {language === "en" ? "All Genders" : "सबै लिङ्ग"}
            </SelectItem>
            {options.genders.map((gender) => (
              <SelectItem key={gender} value={gender}>
                {language === "en" ? translateGender(gender, "en") : gender}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Age Range Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{language === "en" ? "Age:" : "उमेर:"} {filters.ageMin || 25} - {filters.ageMax || 70}</span>
          </div>
          <Slider
            min={25}
            max={70}
            step={5}
            value={[filters.ageMin || 25, filters.ageMax || 70]}
            onValueChange={([min, max]) => {
              onFilterChange({
                ...filters,
                ageMin: min === 25 ? null : min,
                ageMax: max === 70 ? null : max,
              });
            }}
            className="py-2"
          />
        </div>
      </div>
    </div>
  );
}
