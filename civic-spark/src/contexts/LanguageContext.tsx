import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "hi";

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

// Global dictionary for translations
const translations: Translations = {
  // Navbar
  "nav.home": { en: "Home", hi: "होम" },
  "nav.about": { en: "About", hi: "हमारे बारे में" },
  "nav.programs": { en: "Programs", hi: "कार्यक्रम" },
  "nav.impact": { en: "Impact", hi: "प्रभाव" },
  "nav.track issues": { en: "Track Your Issue", hi: "अपनी शिकायत ट्रैक करें" },
  "nav.blog": { en: "Blog", hi: "ब्लॉग" },
  "nav.contact": { en: "Contact", hi: "संपर्क करें" },
  "nav.volunteer": { en: "Volunteer", hi: "स्वयंसेवक बनें" },
  "nav.reportIssue": { en: "Report Issue", hi: "समस्या दर्ज करें" },

  // Hero Section
  "hero.title1": { en: "Empowering Citizens,", hi: "नागरिकों को सशक्त बनाना," },
  "hero.title2": { en: "Enhancing Cities.", hi: "शहरों को बेहतर बनाना।" },
  "hero.subtitle": {
    en: "CivicSense is a next-generation platform bridging the gap between citizens and local government. Report issues, track progress, and contribute to the development of a smarter, more responsive city.",
    hi: "सिविकसेंस एक अगली पीढ़ी का मंच है जो नागरिकों और स्थानीय सरकार के बीच की खाई को पाटता है। समस्याओं की रिपोर्ट करें, प्रगति को ट्रैक करें, और एक स्मार्ट, अधिक उत्तरदायी शहर के विकास में योगदान दें।",
  },
  "hero.cta.report": { en: "Report an Issue Now", hi: "अभी समस्या दर्ज करें" },
  "hero.cta.learn": {
    en: "Learn How It Works",
    hi: "जानें यह कैसे काम करता है",
  },

  // Features Section
  "features.title": {
    en: "Smart Civic Management",
    hi: "स्मार्ट नागरिक प्रबंधन",
  },
  "features.subtitle": {
    en: "Our platform leverages AI and real-time data to streamline civic problem resolution and empower communities.",
    hi: "हमारा मंच नागरिक समस्या समाधान को सुव्यवस्थित करने और समुदायों को सशक्त बनाने के लिए एआई और वास्तविक समय डेटा का लाभ उठाता है।",
  },

  "feature.report.title": { en: "Easy Reporting", hi: "आसान रिपोर्टिंग" },
  "feature.report.desc": {
    en: "Snap a photo and submit civic issues in seconds. Our AI automatically categorizes and routes it to the right department.",
    hi: "एक तस्वीर लें और सेकंडों में नागरिक समस्याएं प्रस्तुत करें। हमारा एआई स्वचालित रूप से इसे वर्गीकृत करता है और सही विभाग को भेजता है।",
  },

  "feature.track.title": {
    en: "Transparent Tracking",
    hi: "पारदर्शी ट्रैकिंग",
  },
  "feature.track.desc": {
    en: "Get real-time updates on your reported issues. Watch as they move from 'Open' to 'In Progress' to 'Resolved'.",
    hi: "अपनी रिपोर्ट की गई समस्याओं पर रीयल-टाइम अपडेट प्राप्त करें। देखें कि वे 'ओपन' से 'प्रगति में' से 'हल' कैसे होते हैं।",
  },

  "feature.data.desc": {
    en: "Municipalities use our analytics dashboard to identify recurring problems, allocate resources efficiently, and plan better.",
    hi: "नगरपालिकाएं आवर्ती समस्याओं की पहचान करने, संसाधनों को कुशलतापूर्वक आवंटित करने और बेहतर योजना बनाने के लिए हमारे एनालिटिक्स डैशबोर्ड का उपयोग करती हैं।",
  },

  // How It Works Section
  "how.badge": { en: "How It Works", hi: "यह कैसे काम करता है" },
  "how.title": {
    en: "Report → Verify → Resolve → Reward",
    hi: "रिपोर्ट करें → सत्यापित करें → हल करें → पुरस्कार",
  },
  "how.subtitle": {
    en: "A complete civic issue lifecycle platform with SLA timers and escalation at every level.",
    hi: "हर स्तर पर SLA टाइमर और एस्केलेशन के साथ एक संपूर्ण नागरिक समस्या जीवनचक्र मंच।",
  },
  "how.step1.title": { en: "Report Issue", hi: "समस्या दर्ज करें" },
  "how.step1.desc": {
    en: "Citizen uploads photo, description, and location via mobile-first interface with offline queueing.",
    hi: "नागरिक ऑफ़लाइन कतार के साथ मोबाइल-प्रथम इंटरफ़ेस के माध्यम से फोटो, विवरण और स्थान अपलोड करता है।",
  },
  "how.step2.title": { en: "AI Verification", hi: "AI सत्यापन" },
  "how.step2.desc": {
    en: "Image & text analysed: issue type, confidence score, duplicate check, severity estimation.",
    hi: "छवि और पाठ का विश्लेषण: समस्या का प्रकार, विश्वास स्कोर, डुप्लिकेट जांच, गंभीरता का अनुमान।",
  },
  "how.step3.title": {
    en: "Verify & Act",
    hi: "सत्यापित करें और कार्रवाई करें",
  },
  "how.step3.desc": {
    en: "Nearest volunteers notified, one accepts and verifies on ground. Municipality takes action.",
    hi: "निकटतम स्वयंसेवकों को सूचित किया गया, एक स्वीकार करता है और जमीन पर सत्यापित करता है। नगरपालिका कार्रवाई करती है।",
  },
  "how.step4.title": { en: "Resolve & Reward", hi: "हल करें और इनाम दें" },
  "how.step4.desc": {
    en: "Reporter confirms resolution. Points awarded, progress toward certificates and badges.",
    hi: "रिपोर्टर समाधान की पुष्टि करता है। अंक प्रदान किए गए, प्रमाण पत्र और बैज की दिशा में प्रगति।",
  },

  // Impact Stats Section
  "impact.badge": { en: "Our Impact", hi: "हमारा प्रभाव" },
  "impact.title": {
    en: "Driving Real Change Across India",
    hi: "पूरे भारत में वास्तविक परिवर्तन लाना",
  },
  "impact.desc": {
    en: "Every number represents a citizen empowered, an issue resolved, and a step toward a better India.",
    hi: "हर संख्या एक सशक्त नागरिक, हल की गई समस्या और बेहतर भारत की ओर एक कदम का प्रतिनिधित्व करती है।",
  },
  "impact.stat1.label": { en: "Certified Citizens", hi: "प्रमाणित नागरिक" },
  "impact.stat1.desc": {
    en: "Active civic participants across India",
    hi: "पूरे भारत में सक्रिय नागरिक भागीदार",
  },
  "impact.stat2.label": { en: "Issues Resolved", hi: "हल की गई समस्याएं" },
  "impact.stat2.desc": {
    en: "From potholes to public safety",
    hi: "गड्ढों से लेकर सार्वजनिक सुरक्षा तक",
  },
  "impact.stat3.label": { en: "Cities Covered", hi: "कवर किए गए शहर" },
  "impact.stat3.desc": {
    en: "And growing every month",
    hi: "और हर महीने बढ़ रहा है",
  },
  "impact.stat4.label": { en: "CSR Funds Deployed", hi: "CSR फंड तैनात" },
  "impact.stat4.desc": {
    en: "For grassroots civic initiatives",
    hi: "जमीनी स्तर की नागरिक पहल के लिए",
  },

  // CTA Section
  "cta.title1": { en: "Ready to Make a", hi: "क्या आप करने के लिए तैयार हैं" },
  "cta.title2": { en: "Difference", hi: "एक बदलाव" },
  "cta.subtitle": {
    en: "Join millions of citizens who are transforming India, one issue at a time. Download the app or register online to get started.",
    hi: "लाखों नागरिकों से जुड़ें जो एक समय में एक समस्या को हल करके भारत को बदल रहे हैं। शुरू करने के लिए ऐप डाउनलोड करें या ऑनलाइन पंजीकरण करें।",
  },
  "cta.btn.download": { en: "Download App", hi: "ऐप डाउनलोड करें" },
  "cta.btn.hero": { en: "Become a Civic Hero", hi: "सिविक हीरो बनें" },
  "cta.app.avail": { en: "Available on", hi: "पर उपलब्ध" },
  "cta.app.down": { en: "Download on", hi: "से डाउनलोड करें" },
  "cta.card.title": { en: "Become a Civic Hero", hi: "सिविक हीरो बनें" },
  "cta.card.subtitle": {
    en: "Earn recognition for your contributions",
    hi: "अपने योगदान के लिए पहचान अर्जित करें",
  },
  "cta.card.item1": {
    en: "Report 10 Issues",
    hi: "10 समस्याओं की रिपोर्ट करें",
  },
  "cta.card.item2": { en: "Complete Certification", hi: "प्रमाणन पूरा करें" },
  "cta.card.item3": {
    en: "Lead a Community Drive",
    hi: "समुदाय अभियान का नेतृत्व करें",
  },
  "cta.card.score": { en: "Your Civic Score", hi: "आपका सिविक स्कोर" },
  "cta.card.btn": {
    en: "Start Earning Points",
    hi: "अंक अर्जित करना शुरू करें",
  },

  // Footer Section
  "footer.desc": {
    en: "Building India's largest citizen-driven civic discipline ecosystem through technology and community action.",
    hi: "प्रौद्योगिकी और सामुदायिक कार्रवाई के माध्यम से भारत का सबसे बड़ा नागरिक-संचालित नागरिक अनुशासन पारिस्थितिकी तंत्र बनाना।",
  },
  "footer.group.about": { en: "About", hi: "हमारे बारे में" },
  "footer.group.programs": { en: "Programs", hi: "कार्यक्रम" },
  "footer.group.resources": { en: "Resources", hi: "संसाधन" },
  "footer.group.legal": { en: "Legal", hi: "कानूनी" },
  "footer.link.mission": { en: "Our Mission", hi: "हमारा लक्ष्य" },
  "footer.link.team": { en: "Our Team", hi: "हमारी टीम" },
  "footer.link.partners": { en: "Partners", hi: "भागीदार" },
  "footer.link.careers": { en: "Careers", hi: "करियर" },
  "footer.link.heroes": { en: "Civic Heroes", hi: "नागरिक नायक" },
  "footer.link.clean": { en: "Clean City Initiative", hi: "स्वच्छ शहर पहल" },
  "footer.link.traffic": { en: "Traffic Discipline", hi: "यातायात अनुशासन" },
  "footer.link.green": { en: "Green Spaces", hi: "हरित स्थान" },
  "footer.link.blog": { en: "Blog", hi: "ब्लॉग" },
  "footer.link.impact": { en: "Impact Reports", hi: "प्रभाव रिपोर्ट" },
  "footer.link.media": { en: "Media Kit", hi: "मीडिया किट" },
  "footer.link.faqs": { en: "FAQs", hi: "पूछे जाने वाले प्रश्न" },
  "footer.link.privacy": { en: "Privacy Policy", hi: "गोपनीयता नीति" },
  "footer.link.terms": { en: "Terms of Service", hi: "सेवा की शर्तें" },
  "footer.link.cookies": { en: "Cookie Policy", hi: "कुकी नीति" },
  "footer.rights": {
    en: "Civic India. All rights reserved.",
    hi: "सिविक इंडिया। सर्वाधिकार सुरक्षित।",
  },

  // Report Issue Page
  "report.title": { en: "Report a Civic Issue", hi: "नागरिक समस्या दर्ज करें" },
  "report.subtitle": {
    en: "Help us keep the city clean and safe. Provide details about the issue below.",
    hi: "शहर को स्वच्छ और सुरक्षित रखने में हमारी मदद करें। नीचे समस्या के बारे में विवरण प्रदान करें।",
  },
  "report.step1": { en: "Issue Details", hi: "समस्या का विवरण" },
  "report.step2": { en: "Location", hi: "स्थान" },
  "report.step3": { en: "Your Info", hi: "आपकी जानकारी" },

  // Common Actions
  "action.next": { en: "Next Step", hi: "अगला कदम" },
  "action.back": { en: "Back", hi: "पीछे" },
  "action.submit": { en: "Submit Report", hi: "रिपोर्ट जमा करें" },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Try to load language preference from localStorage, default to English
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("civic-language");
    return saved === "hi" || saved === "en" ? saved : "en";
  });

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === "en" ? "hi" : "en";
      localStorage.setItem("civic-language", next);
      return next;
    });
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
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
