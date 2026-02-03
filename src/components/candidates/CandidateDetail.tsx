import { Candidate } from "@/types/election";
import { getShortPartyName } from "@/hooks/useElectionData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  User, 
  MapPin, 
  GraduationCap, 
  Calendar,
  Building,
  Briefcase,
  Flag,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { translateToEn } from "@/data/mappings";

interface CandidateDetailProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const partyColorMap: Record<string, string> = {
  "नेपाली काँग्रेस": "bg-blue-100 text-blue-800",
  "नेपाल कम्युनिष्ट पार्टी (एकीकृत मार्क्सवादी लेनिनवादी)": "bg-red-100 text-red-800",
  "नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)": "bg-rose-100 text-rose-800",
  "राष्ट्रिय स्वतन्त्र पार्टी": "bg-amber-100 text-amber-800",
  "राष्ट्रिय प्रजातन्त्र पार्टी": "bg-purple-100 text-purple-800",
  "जनता समाजवादी पार्टी, नेपाल": "bg-green-100 text-green-800",
  "स्वतन्त्र": "bg-gray-100 text-gray-800",
};

export function CandidateDetail({
  candidate,
  open,
  onOpenChange,
}: CandidateDetailProps) {
  const { t, language } = useLanguage();
  if (!candidate) return null;

  const shortParty = getShortPartyName(candidate.PoliticalPartyName);
  const partyColor = partyColorMap[candidate.PoliticalPartyName] || "bg-secondary text-secondary-foreground";

  // Helper to translate value if needed
  const val = (text: any) => {
    if (typeof text !== "string") return text;
    return language === "en" ? translateToEn(text) : text;
  };

  const details = [
    {
      icon: Calendar,
      label: t("उमेर", "Age"),
      value: `${candidate.AGE_YR} ${t("वर्ष", "Years")}`,
    },
    {
      icon: User,
      label: t("लिङ्ग", "Gender"),
      value: val(candidate.Gender),
    },
    {
      icon: Flag,
      label: t("पार्टी", "Party"),
      value: val(candidate.PoliticalPartyName),
    },
    {
      icon: MapPin,
      label: t("प्रदेश", "Province"),
      value: val(candidate.StateName),
    },
    {
      icon: MapPin,
      label: t("जिल्ला", "District"),
      value: val(candidate.DistrictName),
    },
    {
      icon: GraduationCap,
      label: t("शैक्षिक योग्यता", "Qualification"),
      value: val(candidate.QUALIFICATION),
    },
    {
      icon: Building,
      label: t("शिक्षण संस्था", "Institution"),
      value: candidate.NAMEOFINST && candidate.NAMEOFINST !== "0" ? candidate.NAMEOFINST : t("उपलब्ध छैन", "N/A"),
    },
    {
      icon: Briefcase,
      label: t("अनुभव", "Experience"),
      value: candidate.EXPERIENCE && candidate.EXPERIENCE !== "0" ? candidate.EXPERIENCE : t("उपलब्ध छैन", "N/A"),
    },
    {
      icon: Home,
      label: t("ठेगाना", "Address"),
      value: candidate.ADDRESS || t("उपलब्ध छैन", "N/A"),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <div className="flex items-start gap-4">
            {/* Large Avatar */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary shrink-0 overflow-hidden border-2 border-primary/10">
              <img 
                src={`https://result.election.gov.np/Images/Candidate/${candidate.CandidateID}.jpg`} 
                className="w-full h-full object-cover" 
                alt={candidate.CandidateName}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.CandidateName)}&background=random`;
                }}
              />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-xl font-bold leading-tight">
                {candidate.CandidateName}
              </DialogTitle>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
                    partyColor
                  )}
                >
                  {val(shortParty)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {t("चिन्ह", "Symbol")}: {val(candidate.SymbolName)}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {details.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3 pb-3 border-b border-border last:border-0"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{detail.label}</p>
                  <p className="text-sm font-medium text-foreground break-words">
                    {detail.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
