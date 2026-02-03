import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "np";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (np: string, en?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("np");

  const t = (np: string, en?: string) => {
    if (language === "np") return np;
    return en || np; // Fallback to Nepali if English not provided
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
