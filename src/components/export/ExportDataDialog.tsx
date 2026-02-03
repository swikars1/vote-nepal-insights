import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Candidate } from "@/types/election";
import { useLanguage } from "@/context/LanguageContext";
import { FileJson, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExportDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Candidate[];
  fullData?: Candidate[];
}

const AVAILABLE_COLUMNS: { key: keyof Candidate; label: string; labelEn: string }[] = [
  { key: "CandidateID", label: "आईडी", labelEn: "Candidate ID" },
  { key: "CandidateName", label: "नाम", labelEn: "Name" },
  { key: "PoliticalPartyName", label: "पार्टी", labelEn: "Party" },
  { key: "SymbolName", label: "चुनाव चिन्ह", labelEn: "Symbol" },
  { key: "SYMBOLCODE", label: "चिन्ह कोड", labelEn: "Symbol Code" },
  { key: "DistrictName", label: "जिल्ला", labelEn: "District" },
  { key: "StateName", label: "प्रदेश", labelEn: "Province" },
  { key: "STATE_ID", label: "प्रदेश आईडी", labelEn: "State ID" },
  { key: "SCConstID", label: "क्षेत्र नं", labelEn: "Constituency ID" },
  { key: "ConstName", label: "क्षेत्रको नाम", labelEn: "Constituency Name" },
  { key: "AGE_YR", label: "उमेर", labelEn: "Age" },
  { key: "Gender", label: "लिङ्ग", labelEn: "Gender" },
  { key: "QUALIFICATION", label: "योग्यता", labelEn: "Qualification" },
  { key: "NAMEOFINST", label: "शिक्षण संस्था", labelEn: "Institution" },
  { key: "FATHER_NAME", label: "बुबाको नाम", labelEn: "Father's Name" },
  { key: "SPOUCE_NAME", label: "पति/पत्नीको नाम", labelEn: "Spouse Name" },
  { key: "ADDRESS", label: "ठेगाना", labelEn: "Address" },
  { key: "EXPERIENCE", label: "अनुभव", labelEn: "Experience" },
  { key: "OTHERDETAILS", label: "थप विवरण", labelEn: "Other Details" },
  { key: "R", label: "क्र.सं./मर्यादा", labelEn: "Rank/Position" },
];

export function ExportDataDialog({ open, onOpenChange, data, fullData }: ExportDataDialogProps) {
  const { t, language } = useLanguage();
  const [selectedColumns, setSelectedColumns] = useState<(keyof Candidate)[]>(
    AVAILABLE_COLUMNS.slice(0, 7).map(c => c.key)
  );
  const [exportScope, setExportScope] = useState<"filtered" | "full">(fullData ? "full" : "filtered");

  const toggleColumn = (column: keyof Candidate) => {
    setSelectedColumns(prev =>
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const handleExport = () => {
    const targetData = exportScope === "full" && fullData ? fullData : data;
    const exportData = targetData.map(candidate => {
      const filtered: Record<string, any> = {};
      selectedColumns.forEach(col => {
        filtered[col as string] = candidate[col];
      });
      return filtered;
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nepal_election_data_${exportScope}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onOpenChange(false);
  };

  const currentDataset = exportScope === "full" && fullData ? fullData : data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-primary" />
            {t("डाटा निर्यात गर्नुहोस्", "Export Candidate Data")}
          </DialogTitle>
          <DialogDescription>
            {t("तपाइँ निर्यात गर्न चाहानुहुने स्तम्भहरू र डाटा छान्नुहोस्।", "Select the columns and scope for your JSON export.")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Scope Selector */}
          {fullData && (
            <div className="bg-secondary/30 p-3 rounded-lg border border-border">
              <h4 className="text-sm font-medium mb-3">{t("निर्यात दायरा", "Export Scope")}</h4>
              <div className="flex gap-3">
                <Button 
                  variant={exportScope === "filtered" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setExportScope("filtered")}
                  className="flex-1"
                >
                  {t("हालको फिल्टर", "Filtered Data")} ({data.length})
                </Button>
                <Button 
                  variant={exportScope === "full" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setExportScope("full")}
                  className="flex-1"
                >
                  {t("सबै डाटा", "Full Dataset")} ({fullData.length})
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{t("उपलब्ध स्तम्भहरू", "Available Columns")}</h4>
                <div className="flex gap-2">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedColumns(AVAILABLE_COLUMNS.map(c => c.key))}
                        className="text-[10px] h-7 px-2"
                    >
                        {t("सबै चयन गर्नुहोस्", "Select All")}
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedColumns([])}
                        className="text-[10px] h-7 px-2"
                    >
                        {t("सबै हटाउनुहोस्", "Clear All")}
                    </Button>
                </div>
            </div>
            
            <ScrollArea className="h-[250px] pr-4 border rounded-md p-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AVAILABLE_COLUMNS.map((column) => (
                    <div key={column.key} className="flex items-center space-x-2 p-2 rounded-lg border border-transparent hover:bg-secondary/50 transition-colors">
                        <Checkbox
                            id={`col-${column.key}`}
                            checked={selectedColumns.includes(column.key)}
                            onCheckedChange={() => toggleColumn(column.key)}
                        />
                        <Label
                            htmlFor={`col-${column.key}`}
                            className="text-sm font-normal cursor-pointer flex-1"
                        >
                            {language === "en" ? column.labelEn : column.label}
                            <span className="text-[10px] text-muted-foreground block">
                                {language === "en" ? column.label : column.labelEn}
                            </span>
                        </Label>
                    </div>
                    ))}
                </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 text-xs text-muted-foreground flex items-center">
            {currentDataset.length.toLocaleString()} {t("उम्मेदवारहरू निर्यात गरिनेछ", "candidates will be exported")}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("रद्द गर्नुहोस्", "Cancel")}
          </Button>
          <Button onClick={handleExport} disabled={selectedColumns.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            {t("डाउनलोड गर्नुहोस्", "Download JSON")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
