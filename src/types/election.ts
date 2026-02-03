// Types for Nepal Election Candidates Dashboard

export interface Candidate {
  CandidateID: number;
  CandidateName: string;
  AGE_YR: number;
  Gender: string;
  PoliticalPartyName: string;
  SymbolName: string;
  DistrictName: string;
  StateName: string;
  QUALIFICATION: string;
  NAMEOFINST?: string;
  EXPERIENCE?: string;
  ADDRESS?: string;
  FatherName?: string;
  SpouseName?: string;
  SYMBOLCODE?: number;
  CTZDIST?: string;
  STATE_ID?: number;
  SCConstID?: number;
  ConstName?: number;
  TotalVoteReceived?: number;
  R?: number;
  FATHER_NAME?: string;
  SPOUCE_NAME?: string;
  OTHERDETAILS?: string;
  E_STATUS?: string;
  DOB?: number;
}

export interface FilterState {
  province: string | null;
  district: string | null;
  party: string | number | null;
  qualification: string | null;
  gender: string | null;
  constituency: number | null;
  ageMin: number | null;
  ageMax: number | null;
  excludeIndependent: boolean;
}

export interface AggregatedStats {
  totalCandidates: number;
  byParty: Record<string, number>;
  byProvince: Record<string, number>;
  byDistrict: Record<string, number>;
  byGender: Record<string, number>;
  byQualification: Record<string, number>;
  byAgeGroup: Record<string, number>;
}

export interface ChartDataItem {
  name: string;
  value: number;
  fill?: string;
}

// Province mapping for display
export const PROVINCES: Record<string, string> = {
  "कोशी प्रदेश": "Koshi Pradesh",
  "मधेश प्रदेश": "Madhesh Pradesh",
  "बागमती प्रदेश": "Bagmati Pradesh",
  "गण्डकी प्रदेश": "Gandaki Pradesh",
  "लुम्बिनी प्रदेश": "Lumbini Pradesh",
  "कर्णाली प्रदेश": "Karnali Pradesh",
  "सुदूरपश्चिम प्रदेश": "Sudurpashchim Pradesh",
};

// Color mapping for major parties
export const PARTY_COLORS: Record<string, string> = {
  "नेपाली काँग्रेस": "hsl(215, 55%, 35%)",
  "नेपाल कम्युनिष्ट पार्टी (एकीकृत मार्क्सवादी लेनिनवादी)": "hsl(350, 55%, 50%)",
  "राष्ट्रिय स्वतन्त्र पार्टी": "hsl(35, 70%, 50%)",
  "राष्ट्रिय प्रजातन्त्र पार्टी": "hsl(270, 40%, 55%)",
  "नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)": "hsl(0, 65%, 50%)",
  "जनता समाजवादी पार्टी, नेपाल": "hsl(120, 45%, 45%)",
  "स्वतन्त्र": "hsl(200, 15%, 50%)",
};

// Qualification levels
export const QUALIFICATIONS = [
  "साक्षर",
  "प्रा.वि. (१-५)",
  "माध्यमिक",
  "उच्च माध्यमिक",
  "स्नातक",
  "स्नातकोत्तर",
  "विद्यावारिधि",
];

// Age groups for analytics
export const AGE_GROUPS = [
  { label: "25-35", min: 25, max: 35 },
  { label: "36-45", min: 36, max: 45 },
  { label: "46-55", min: 46, max: 55 },
  { label: "56-65", min: 56, max: 65 },
  { label: "65+", min: 65, max: 100 },
];
