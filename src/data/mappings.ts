// Map English search terms to Nepali values
export const DISTRICT_MAP_EN_NP: Record<string, string> = {
  "achham": "अछाम",
  "arghakhanchi": "अर्घाखाँची",
  "baglung": "बागलुङ",
  "baitadi": "बैतडी",
  "bajhang": "बझाङ",
  "bajura": "बाजुरा",
  "banke": "बाँके",
  "bara": "बारा",
  "bardiya": "बर्दिया",
  "bhaktapur": "भक्तपुर",
  "bhojpur": "भोजपुर",
  "chitwan": "चितवन",
  "dadeldhura": "डडेलधुरा",
  "dailekh": "दैलेख",
  "dang": "दाङ",
  "darchula": "दार्चुला",
  "dhading": "धादिङ",
  "dhankuta": "धनकुटा",
  "dhanusha": "धनुषा",
  "dolakha": "दोलखा",
  "dolpa": "डोल्पा",
  "doti": "डोटी",
  "gorkha": "गोरखा",
  "gulmi": "गुल्मी",
  "humla": "हुम्ला",
  "ilam": "इलाम",
  "jajarkot": "जाजरकोट",
  "jhapa": "झापा",
  "jumla": "जुम्ला",
  "kailali": "कैलाली",
  "kalikot": "कालीकोट",
  "kanchanpur": "कञ्चनपुर",
  "kapilvastu": "कपिलवस्तु",
  "kaski": "कास्की",
  "kathmandu": "काठमाडौँ",
  "kavrepalanchok": "काभ्रेपलाञ्चोक",
  "khotang": "खोटाङ",
  "lalitpur": "ललितपुर",
  "lamjung": "लमजुङ",
  "mahottari": "महोत्तरी",
  "makwanpur": "मकवानपुर",
  "manang": "मनाङ",
  "morang": "मोरङ",
  "mugu": "मुगु",
  "mustang": "मुस्ताङ",
  "myagdi": "म्याग्दी",
  "nawalparasi_east": "नवलपरासी (बर्दघाट सुस्ता पूर्व)",
  "nawalparasi_west": "नवलपरासी (बर्दघाट सुस्ता पश्चिम)",
  "nuwakot": "नुवाकोट",
  "okhaldhunga": "ओखलढुङ्गा",
  "palpa": "पाल्पा",
  "panchthar": "पाँचथर",
  "parbat": "पर्वत",
  "parsa": "पर्सा",
  "pyuthan": "प्युठान",
  "ramechhap": "रामेछाप",
  "rasuwa": "रसुवा",
  "rautahat": "रौतहट",
  "rolpa": "रोल्पा",
  "rukum_east": "रुकुम (पूर्व)",
  "rukum_west": "रुकुम (पश्चिम)",
  "rupandehi": "रुपन्देही",
  "salyan": "सल्यान",
  "sankhuwasabha": "सङ्खुवासभा",
  "saptari": "सप्तरी",
  "sarlahi": "सर्लाही",
  "sindhuli": "सिन्धुली",
  "sindhupalchok": "सिन्धुपाल्चोक",
  "siraha": "सिराहा",
  "solukhumbu": "सोलुखुम्बु",
  "sunsari": "सुनसरी",
  "surkhet": "सुर्खेत",
  "syangja": "स्याङ्जा",
  "tanahun": "तनहुँ",
  "taplejung": "ताप्लेजुङ",
  "terhathum": "तेह्रथुम",
  "udayapur": "उदयपुर",
};

export const PARTY_MAP_EN_NP: Record<string, string> = {
  "rastriya swatantra party": "राष्ट्रिय स्वतन्त्र पार्टी",
  "rsp": "राष्ट्रिय स्वतन्त्र पार्टी",
  "congress": "नेपाली काँग्रेस",
  "nepali congress": "नेपाली काँग्रेस",
  "uml": "नेपाल कम्युनिष्ट पार्टी (एकीकृत मार्क्सवादी लेनिनवादी)",
  "cpc uml": "नेपाल कम्युनिष्ट पार्टी (एकीकृत मार्क्सवादी लेनिनवादी)",
  "maoist": "नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)",
  "cpc maoist": "नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)",
  "rpp": "राष्ट्रिय प्रजातन्त्र पार्टी",
  "jsp": "जनता समाजवादी पार्टी, नेपाल",
  "independent": "स्वतन्त्र",
};

export const PROVINCE_MAP_EN_NP: Record<string, string> = {
  "koshi": "कोशी प्रदेश",
  "madhesh": "मधेश प्रदेश",
  "bagmati": "बागमती प्रदेश",
  "gandaki": "गण्डकी प्रदेश",
  "lumbini": "लुम्बिनी प्रदेश",
  "karnali": "कर्णाली प्रदेश",
  "sudurpashchim": "सुदुरपश्चिम प्रदेश",
};

// Reverse mappings (Nepali to English)
export const DISTRICT_MAP_NP_EN: Record<string, string> = Object.fromEntries(
  Object.entries(DISTRICT_MAP_EN_NP).map(([en, np]) => [np, en.charAt(0).toUpperCase() + en.slice(1)])
);

export const PARTY_MAP_NP_EN: Record<string, string> = {
  "राष्ट्रिय स्वतन्त्र पार्टी": "RSP",
  "नेपाली काँग्रेस": "NC",
  "नेपाल कम्युनिष्ट पार्टी (एकीकृत मार्क्सवादी लेनिनवादी)": "CPN UML",
  "नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)": "CPN Maoist",
  "राष्ट्रिय प्रजातन्त्र पार्टी": "RPP",
  "जनता समाजवादी पार्टी, नेपाल": "JSP",
  "स्वतन्त्र": "Independent",
};

export const PROVINCE_MAP_NP_EN: Record<string, string> = {
  "कोशी प्रदेश": "Koshi Province",
  "मधेश प्रदेश": "Madhesh Province",
  "बागमती प्रदेश": "Bagmati Province",
  "गण्डकी प्रदेश": "Gandaki Province",
  "लुम्बिनी प्रदेश": "Lumbini Province",
  "कर्णाली प्रदेश": "Karnali Province",
  "सुदुरपश्चिम प्रदेश": "Sudurpashchim Province",
};

export const GENDER_MAP_NP_EN: Record<string, string> = {
  "पुरुष": "Male",
  "महिला": "Female",
  "अन्य": "Other",
};

export const translateToEn = (text: string): string => {
  if (!text) return text;
  return (
    DISTRICT_MAP_NP_EN[text] ||
    PARTY_MAP_NP_EN[text] ||
    PROVINCE_MAP_NP_EN[text] ||
    GENDER_MAP_NP_EN[text] ||
    text
  );
};
