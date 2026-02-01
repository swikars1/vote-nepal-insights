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
  Home,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { translatePartyName, translateQualification, translateProvince, translateDistrict, translateAddress, translateGender } from "@/lib/translations";

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
  const { language, t } = useLanguage();
  
  if (!candidate) return null;

  const shortParty = getShortPartyName(candidate.PoliticalPartyName);
  const partyColor = partyColorMap[candidate.PoliticalPartyName] || "bg-secondary text-secondary-foreground";
  
  const displayParty = language === "en" 
    ? translatePartyName(candidate.PoliticalPartyName, "en")
    : shortParty;
    
  const displayQualification = language === "en"
    ? translateQualification(candidate.QUALIFICATION, "en")
    : candidate.QUALIFICATION;

  const displayProvince = language === "en"
    ? translateProvince(candidate.StateName, "en")
    : candidate.StateName;

  const displayDistrict = language === "en"
    ? translateDistrict(candidate.DistrictName, "en")
    : candidate.DistrictName;

  const displayAddress = language === "en"
    ? translateAddress(candidate.ADDRESS || "", "en")
    : candidate.ADDRESS || "";

  const fatherName = candidate.FATHER_NAME || candidate.FatherName || "N/A";
  const spouseName = candidate.SPOUCE_NAME || candidate.SpouseName || "N/A";
  
  const displayGender = language === "en"
    ? translateGender(candidate.Gender, "en")
    : candidate.Gender;

  const details = [
    {
      icon: Calendar,
      label: language === "en" ? t("candidate.age") : "उमेर",
      value: `${candidate.AGE_YR} ${language === "en" ? "years" : "वर्ष"}`,
    },
    {
      icon: User,
      label: language === "en" ? t("candidate.gender") : "लिङ्ग",
      value: displayGender,
    },
    {
      icon: Flag,
      label: language === "en" ? t("candidate.party") : "पार्टी",
      value: language === "en" ? displayParty : candidate.PoliticalPartyName,
    },
    {
      icon: MapPin,
      label: language === "en" ? t("candidate.province") : "प्रदेश",
      value: displayProvince,
    },
    {
      icon: MapPin,
      label: language === "en" ? t("candidate.district") : "जिल्ला",
      value: displayDistrict,
    },
    {
      icon: GraduationCap,
      label: language === "en" ? t("candidate.qualification") : "शैक्षिक योग्यता",
      value: displayQualification,
    },
    {
      icon: Building,
      label: language === "en" ? t("candidate.institution") : "शिक्षण संस्था",
      value: candidate.NAMEOFINST || "N/A",
    },
    {
      icon: Briefcase,
      label: language === "en" ? t("candidate.experience") : "अनुभव",
      value: candidate.EXPERIENCE || "N/A",
    },
    {
      icon: Home,
      label: language === "en" ? t("candidate.address") : "ठेगाना",
      value: displayAddress,
    },
    {
      icon: Users,
      label: language === "en" ? t("candidate.father") : "बुबाको नाम",
      value: fatherName,
    },
    {
      icon: Users,
      label: language === "en" ? t("candidate.spouse") : "पत्नीको नाम",
      value: spouseName,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <div className="flex items-start gap-4">
            {/* Large Avatar */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary shrink-0">
              <img src={`https://result.election.gov.np/Images/Candidate/${candidate.CandidateID}.jpg`} className="w-100 h-100 object-cover" alt="candidate picture of face"/>
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-xl font-bold font-nepali leading-tight">
                {candidate.CandidateName}
              </DialogTitle>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
                    partyColor
                  )}
                >
                  {displayParty}
                </span>
                <span className="text-sm text-muted-foreground">
                  {language === "en" ? "Symbol:" : "चिन्ह:"} {candidate.SymbolName}
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
