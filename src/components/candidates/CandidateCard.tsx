import { Candidate } from "@/types/election";
import { getShortPartyName } from "@/hooks/useElectionData";
import { MapPin, GraduationCap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { translateToEn } from "@/data/mappings";

interface CandidateCardProps {
  candidate: Candidate;
  onClick?: () => void;
  className?: string;
}

const partyColorMap: Record<string, string> = {
  "नेपाली काँग्रेस": "bg-blue-50 text-blue-700 border-blue-100",
  "नेपाल कम्युनिष्ट पार्टी (एकीकृत मार्क्सवादी लेनिनवादी)": "bg-red-50 text-red-700 border-red-100",
  "नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)": "bg-rose-50 text-rose-700 border-rose-100",
  "राष्ट्रिय स्वतन्त्र पार्टी": "bg-amber-50 text-amber-700 border-amber-100",
  "राष्ट्रिय प्रजातन्त्र पार्टी": "bg-purple-50 text-purple-700 border-purple-100",
  "जनता समाजवादी पार्टी, नेपाल": "bg-green-50 text-green-700 border-green-100",
  "स्वतन्त्र": "bg-gray-50 text-gray-700 border-gray-100",
};

export function CandidateCard({ candidate, onClick, className }: CandidateCardProps) {
  const { t, language } = useLanguage();
  const shortParty = getShortPartyName(candidate.PoliticalPartyName);
  const partyColor = partyColorMap[candidate.PoliticalPartyName] || "bg-secondary text-secondary-foreground";

  const val = (text: any) => {
    if (typeof text !== "string") return text;
    return language === "en" ? translateToEn(text) : text;
  };

  return (
    <div
      className={cn("candidate-card group", className)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary overflow-hidden border-2 border-primary/5 group-hover:border-primary/20 transition-colors">
          <img 
            src={`https://result.election.gov.np/Images/Candidate/${candidate.CandidateID}.jpg`} 
            className="h-full w-full object-cover" 
            alt={candidate.CandidateName}
            onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.CandidateName)}&background=random`;
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3 className="text-name text-foreground truncate group-hover:text-primary transition-colors">
            {candidate.CandidateName}
          </h3>

          {/* Party Badge */}
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "badge-party border text-[10px] leading-none py-1 px-2 uppercase tracking-wide",
                partyColor
              )}
            >
              {val(shortParty)}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              {val(candidate.SymbolName)}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{val(candidate.DistrictName)} - {t("क्षेत्र", "Area")} {candidate.SCConstID}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{candidate.AGE_YR} {t("वर्ष", "Years")}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>{val(candidate.QUALIFICATION)}</span>
        </div>
      </div>
    </div>
  );
}
