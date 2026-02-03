import { X, Download, FileJson, FileText } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  options: {
    provinces: string[];
    districts: string[];
    constituencies: number[];
    parties: { name: string; code: string | number; count: number }[];
    qualifications: string[];
    genders: string[];
  };
  onExportJson?: () => void;
  onExportPdf?: () => void;
  className?: string;
}

export function FilterPanel({
  filters,
  onFilterChange,
  options,
  onExportJson,
  onExportPdf,
  className,
}: FilterPanelProps) {
  const { t } = useLanguage();
  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== null && v !== false
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
      excludeIndependent: false,
    });
  };

  const updateFilter = (key: keyof FilterState, value: string | number | boolean | null) => {
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

  const provinceOptions = options.provinces.map(p => ({ 
    label: p, 
    value: p,
    keywords: getKeywords(p, PROVINCE_MAP_EN_NP)
  }));
  
  const districtOptions = options.districts.map(d => ({ 
    label: d, 
    value: d,
    keywords: getKeywords(d, DISTRICT_MAP_EN_NP)
  }));
  
  const partyOptions = options.parties.map(p => ({ 
    label: `${p.name} (${p.code})`, 
    value: p.code.toString(),
    keywords: getKeywords(p.name, PARTY_MAP_EN_NP)
  }));

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">{t("फिल्टर", "Filters")}</h3>
          {activeFiltersCount > 0 && (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-2 mr-4 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
            <Switch 
              id="exclude-independent" 
              checked={filters.excludeIndependent}
              onCheckedChange={(checked) => updateFilter("excludeIndependent", checked)}
            />
            <Label htmlFor="exclude-independent" className="text-xs font-medium cursor-pointer">
              {t("स्वतन्त्र हटाउनुहोस्", "Exclude Independent")}
            </Label>
          </div>

          <div className="flex gap-2">
            {onExportJson && (
              <Button variant="outline" size="sm" onClick={onExportJson} className="h-9">
                <FileJson className="mr-2 h-4 w-4" />
                {t("डाटा डाउनलोड", "Get Data")}
              </Button>
            )}
            {onExportPdf && (
              <Button variant="outline" size="sm" onClick={onExportPdf} className="h-9">
                <FileText className="mr-2 h-4 w-4" />
                {t("रिपोर्ट डाउनलोड", "Get Stats")}
              </Button>
            )}
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground h-9"
              >
                <X className="mr-1 h-4 w-4" />
                {t("सबै हटाउनुहोस्", "Clear all")}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 pt-2">
        {/* Province Filter */}
        <Combobox
          options={provinceOptions}
          value={filters.province}
          onSelect={(v) => updateFilter("province", v)}
          placeholder={t("प्रदेश", "Province")}
          searchPlaceholder="Search province..."
          emptyText="No province found."
        />

        {/* District Filter */}
        <Combobox
          options={districtOptions}
          value={filters.district}
          onSelect={(v) => updateFilter("district", v)}
          placeholder={t("जिल्ला", "District")}
          searchPlaceholder="Search district..."
          emptyText="No district found."
        />

        {/* Constituency Filter */}
        <Select
          value={filters.constituency?.toString() || "all"}
          onValueChange={(v) => updateFilter("constituency", v === "all" ? "all" : parseInt(v))}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder={t("क्षेत्र", "Constituency")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("सबै क्षेत्र", "All Areas")}</SelectItem>
            {options.constituencies.map((constituency) => (
              <SelectItem key={constituency} value={constituency.toString()}>
                {t(`क्षेत्र ${constituency}`, `Area ${constituency}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Party Filter */}
        <Combobox
          options={partyOptions}
          value={filters.party}
          onSelect={(v) => updateFilter("party", v)}
          placeholder={t("पार्टी", "Party")}
          searchPlaceholder="Search party..."
          emptyText="No party found."
        />

        {/* Qualification Filter */}
        <Select
          value={filters.qualification || "all"}
          onValueChange={(v) => updateFilter("qualification", v)}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder={t("योग्यता", "Qualification")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("सबै योग्यता", "All Education")}</SelectItem>
            {options.qualifications.map((qual) => (
              <SelectItem key={qual} value={qual}>
                {qual}
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
            <SelectValue placeholder={t("लिङ्ग", "Gender")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("सबै लिङ्ग", "All Genders")}</SelectItem>
            {options.genders.map((gender) => (
              <SelectItem key={gender} value={gender}>
                {gender}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Age Range Filter */}
      <div className="pt-2 px-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>{t("उमेर दायरा", "Age Range")}: {filters.ageMin || 25} - {filters.ageMax || 75}</span>
        </div>
        <Slider
          min={25}
          max={75}
          step={1}
          value={[filters.ageMin || 25, filters.ageMax || 75]}
          onValueChange={([min, max]) => {
            onFilterChange({
              ...filters,
              ageMin: min === 25 ? null : min,
              ageMax: max === 75 ? null : max,
            });
          }}
          className="py-2"
        />
      </div>
    </div>
  );
}
