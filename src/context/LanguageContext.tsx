import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "np";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Comprehensive Translation strings
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    "navbar.dashboard": "Dashboard",
    "navbar.candidates": "Candidates",
    "navbar.analytics": "Analytics",
    "navbar.brand": "Election Data Nepal",
    "navbar.brand.np": "Election Data Nepal",
    "button.language": "Language",

    // Index Page
    "index.title": "Nepal Election Candidates",
    "index.subtitle": "Nepal Election Candidates Dashboard",
    "index.description": "Explore candidates by district, province, and party • जिल्ला, प्रदेश, र पार्टी अनुसार उम्मेदवारहरू खोज्नुहोस्",
    "stats.totalCandidates": "Total Candidates",
    "stats.politicalParties": "Political Parties",
    "stats.districts": "Districts",
    "stats.provinces": "Provinces",
    "candidates.section.title": "Candidates",
    "candidates.found": "candidates found",
    "candidates.viewAll": "View All →",

    // Candidates Page
    "candidates.page.title": "Search Candidates",
    "candidates.page.subtitle": "Search and explore all candidates",
    "candidates.search.placeholder": "Search name, district, or party",
    "candidates.notFound": "No candidates found",
    "candidates.notFound.desc": "Please adjust your filters or search query",
    "candidates.loadMore": "Load More",

    // Analytics Page
    "analytics.title": "Analytics",
    "analytics.subtitle": "Detailed election data analysis",
    "analytics.partyQualification": "Party Qualification Breakdown",
    "analytics.genderByParty": "Gender Distribution by Party",
    "analytics.ageGroup": "Age Group Distribution",
    "analytics.topUniversities": "Top Universities",

    // Candidate Details
    "candidate.name": "Name",
    "candidate.party": "Political Party",
    "candidate.symbol": "Party Symbol",
    "candidate.district": "District",
    "candidate.province": "Province",
    "candidate.constituency": "Constituency",
    "candidate.age": "Age",
    "candidate.gender": "Gender",
    "candidate.qualification": "Qualification",
    "candidate.institution": "Institution",
    "candidate.father": "Father's Name",
    "candidate.spouse": "Spouse's Name",
    "candidate.address": "Address",
    "candidate.experience": "Experience",

    // Filters
    "filter.province": "Province",
    "filter.district": "District",
    "filter.party": "Political Party",
    "filter.qualification": "Qualification",
    "filter.gender": "Gender",
    "filter.age": "Age Range",
    "filter.ageMin": "Min Age",
    "filter.ageMax": "Max Age",
    "filter.clearAll": "Clear All",
    "filter.selectProvince": "Select Province",
    "filter.selectDistrict": "Select District",
    "filter.selectParty": "Select Party",
    "filter.selectQualification": "Select Qualification",
    "filter.selectGender": "Select Gender",

    // Gender
    "gender.male": "Male",
    "gender.female": "Female",
    "gender.other": "Other",

    // Qualifications
    "qualification.phd": "PhD",
    "qualification.masters": "Masters",
    "qualification.bachelor": "Bachelor",
    "qualification.intermediate": "Intermediate/+2",
    "qualification.slc": "SLC/SEE",
    "qualification.other": "Other",

    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.close": "Close",
    "common.save": "Save",
    "common.cancel": "Cancel",
  },
  np: {
    // Navbar
    "navbar.dashboard": "ड्यासबोर्ड",
    "navbar.candidates": "उम्मेदवारहरू",
    "navbar.analytics": "विश्लेषण",
    "navbar.brand": "निर्वाचन डाटा",
    "navbar.brand.np": "निर्वाचन डाटा",
    "button.language": "भाषा",

    // Index Page
    "index.title": "नेपाल निर्वाचन उम्मेदवार",
    "index.subtitle": "नेपाल निर्वाचन उम्मेदवार ड्यासबोर्ड",
    "index.description": "जिल्ला, प्रदेश, र पार्टी अनुसार उम्मेदवारहरू खोज्नुहोस्",
    "stats.totalCandidates": "कुल उम्मेदवार",
    "stats.politicalParties": "राजनीतिक दलहरू",
    "stats.districts": "जिल्लाहरू",
    "stats.provinces": "प्रदेशहरू",
    "candidates.section.title": "उम्मेदवारहरू",
    "candidates.found": "उम्मेदवार फेला पर्यो",
    "candidates.viewAll": "सबै हेर्नुहोस् →",

    // Candidates Page
    "candidates.page.title": "उम्मेदवार खोज्नुहोस्",
    "candidates.page.subtitle": "सबै उम्मेदवारहरू खोज्नुहोस् र अन्वेषण गर्नुहोस्",
    "candidates.search.placeholder": "नाम, जिल्ला, वा पार्टी खोज्नुहोस्",
    "candidates.notFound": "कुनै उम्मेदवार फेला परेन",
    "candidates.notFound.desc": "कृपया आफ्नो फिल्टर वा खोज क्वेरी समायोजन गर्नुहोस्",
    "candidates.loadMore": "अन्य लोड गर्नुहोस्",

    // Analytics Page
    "analytics.title": "विश्लेषण",
    "analytics.subtitle": "विस्तृत निर्वाचन डाटा विश्लेषण",
    "analytics.partyQualification": "पार्टी योग्यता विभाजन",
    "analytics.genderByParty": "पार्टी द्वारा लिङ्ग वितरण",
    "analytics.ageGroup": "आयु समूह वितरण",
    "analytics.topUniversities": "शीर्ष विश्वविद्यालयहरू",

    // Candidate Details
    "candidate.name": "नाम",
    "candidate.party": "राजनीतिक पार्टी",
    "candidate.symbol": "पार्टी प्रतीक",
    "candidate.district": "जिल्ला",
    "candidate.province": "प्रदेश",
    "candidate.constituency": "निर्वाचन क्षेत्र",
    "candidate.age": "उमेर",
    "candidate.gender": "लिङ्ग",
    "candidate.qualification": "योग्यता",
    "candidate.institution": "संस्था",
    "candidate.father": "पितृको नाम",
    "candidate.spouse": "पत्नीको नाम",
    "candidate.address": "ठेगाना",
    "candidate.experience": "अनुभव",

    // Filters
    "filter.province": "प्रदेश",
    "filter.district": "जिल्ला",
    "filter.party": "राजनीतिक पार्टी",
    "filter.qualification": "योग्यता",
    "filter.gender": "लिङ्ग",
    "filter.age": "आयु श्रेणी",
    "filter.ageMin": "न्यूनतम आयु",
    "filter.ageMax": "अधिकतम आयु",
    "filter.clearAll": "सबै हटाउनुहोस्",
    "filter.selectProvince": "प्रदेश चयन गर्नुहोस्",
    "filter.selectDistrict": "जिल्ला चयन गर्नुहोस्",
    "filter.selectParty": "पार्टी चयन गर्नुहोस्",
    "filter.selectQualification": "योग्यता चयन गर्नुहोस्",
    "filter.selectGender": "लिङ्ग चयन गर्नुहोस्",

    // Gender
    "gender.male": "पुरुष",
    "gender.female": "महिला",
    "gender.other": "अन्य",

    // Qualifications
    "qualification.phd": "विद्यावारिधी (पी.एच.डि.)",
    "qualification.masters": "स्नातकोत्तर",
    "qualification.bachelor": "स्नातक",
    "qualification.intermediate": "प्रविणता प्रमाणपत्र/+२",
    "qualification.slc": "एस.एल.सी./एस.इ.इ.",
    "qualification.other": "अन्य",

    // Common
    "common.loading": "लोड हुँदै...",
    "common.error": "एक त्रुटि हुई",
    "common.close": "बन्द गर्नुहोस्",
    "common.save": "सुरक्षित गर्नुहोस्",
    "common.cancel": "रद्द गर्नुहोस्",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
