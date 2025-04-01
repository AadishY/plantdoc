
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define translations
const translations = {
  en: {
    // Navigation
    home: 'Home',
    diagnose: 'Diagnose',
    recommend: 'Plant Recommendations',
    
    // Hero section
    heroTitle: 'AI-Powered Plant Disease Diagnosis',
    heroDescription: 'Upload a photo of your plant and get instant diagnosis, treatment recommendations, and care tips to help your plants thrive.',
    diagnoseButton: 'Diagnose Your Plant',
    
    // How it works section
    howItWorks: 'How Plant Doc Works',
    howItWorksDescription: 'Our advanced AI technology helps you identify and treat plant diseases with just a photo.',
    uploadPhotoTitle: 'Upload a Photo',
    uploadPhotoDescription: 'Take a clear picture of your plant showing the affected areas and upload it.',
    getDiagnosisTitle: 'Get Diagnosis',
    getDiagnosisDescription: 'Our AI analyzes your plant\'s condition and identifies any diseases or issues.',
    treatmentPlanTitle: 'Receive Treatment Plan',
    treatmentPlanDescription: 'Get personalized recommendations for treatment, prevention, and care.',
    
    // FAQ section
    faqTitle: 'Frequently Asked Questions',
    faqDescription: 'Common questions about Plant Doc and how it can help your plants thrive.',
    
    // About section
    aboutTitle: 'About Plant Doc',
    aboutDescription1: 'Plant Doc is an AI-powered application designed to help plant enthusiasts diagnose and treat plant diseases efficiently. Using advanced machine learning algorithms, it can identify various plant diseases from photos and provide accurate treatment recommendations.',
    aboutDescription2: 'This project was developed as a way to combine my passion for technology and nature. As a student interested in artificial intelligence and environmental science, I wanted to create a tool that can make plant care more accessible to everyone and help people maintain healthier plants.',
    aboutDescription3: 'At its core, Plant Doc harnesses the power of Google Gemini AI for all aspects of its analysis, ensuring reliable diagnoses and tailored treatment plans that address your plant\'s specific needs.',
  },
  hi: {
    // Navigation
    home: 'होम',
    diagnose: 'निदान',
    recommend: 'पौधों की सिफारिशें',
    
    // Hero section
    heroTitle: 'एआई-संचालित पौधे के रोग का निदान',
    heroDescription: 'अपने पौधे की फोटो अपलोड करें और तुरंत निदान, उपचार सिफारिशें, और देखभाल युक्तियां प्राप्त करें जो आपके पौधों को फलने-फूलने में मदद करेंगी।',
    diagnoseButton: 'अपने पौधे का निदान करें',
    
    // How it works section
    howItWorks: 'प्लांट डॉक कैसे काम करता है',
    howItWorksDescription: 'हमारी उन्नत एआई तकनीक आपको केवल एक फोटो के साथ पौधों के रोगों की पहचान करने और उपचार करने में मदद करती है।',
    uploadPhotoTitle: 'फोटो अपलोड करें',
    uploadPhotoDescription: 'अपने पौधे की प्रभावित क्षेत्रों को दिखाते हुए एक स्पष्ट तस्वीर लें और अपलोड करें।',
    getDiagnosisTitle: 'निदान प्राप्त करें',
    getDiagnosisDescription: 'हमारा एआई आपके पौधे की स्थिति का विश्लेषण करता है और किसी भी रोग या समस्या की पहचान करता है।',
    treatmentPlanTitle: 'उपचार योजना प्राप्त करें',
    treatmentPlanDescription: 'उपचार, रोकथाम और देखभाल के लिए व्यक्तिगत सिफारिशें प्राप्त करें।',
    
    // FAQ section
    faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
    faqDescription: 'प्लांट डॉक के बारे में आम सवाल और यह आपके पौधों को फलने-फूलने में कैसे मदद कर सकता है।',
    
    // About section
    aboutTitle: 'प्लांट डॉक के बारे में',
    aboutDescription1: 'प्लांट डॉक एक एआई-संचालित एप्लिकेशन है जिसे पौधे के शौकीनों को पौधों के रोगों का कुशलतापूर्वक निदान और उपचार करने में मदद करने के लिए डिज़ाइन किया गया है। उन्नत मशीन लर्निंग एल्गोरिदम का उपयोग करके, यह फोटो से विभिन्न पौधों के रोगों की पहचान कर सकता है और सटीक उपचार सिफारिशें प्रदान कर सकता है।',
    aboutDescription2: 'इस प्रोजेक्ट को प्रौद्योगिकी और प्रकृति के प्रति मेरे जुनून को जोड़ने के एक तरीके के रूप में विकसित किया गया था। कृत्रिम बुद्धिमत्ता और पर्यावरण विज्ञान में रुचि रखने वाले एक छात्र के रूप में, मैं एक ऐसा उपकरण बनाना चाहता था जो पौधों की देखभाल को सभी के लिए अधिक सुलभ बना सके और लोगों को स्वस्थ पौधे बनाए रखने में मदद कर सके।',
    aboutDescription3: 'अपने मूल में, प्लांट डॉक अपने विश्लेषण के सभी पहलुओं के लिए Google Gemini AI की शक्ति का उपयोग करता है, जो विश्वसनीय निदान और अनुकूलित उपचार योजनाओं को सुनिश्चित करता है जो आपके पौधे की विशिष्ट जरूरतों को पूरा करते हैं।',
  }
};

// Translation context
interface TranslationContextType {
  translate: (key: string) => string;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

const TranslationContext = createContext<TranslationContextType>({
  translate: () => '',
  currentLanguage: 'en',
  setLanguage: () => {},
});

// Translation provider
interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Try to get the saved language preference from localStorage, default to 'en'
    const savedLanguage = localStorage.getItem('plantdoc-language');
    return savedLanguage || 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('plantdoc-language', language);
  }, [language]);

  const translate = (key: string): string => {
    // Split the key by dots to access nested objects
    const keys = key.split('.');
    let translation: any = translations[language as keyof typeof translations];
    
    // Navigate through the nested objects
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        // If translation not found, return the key
        return key;
      }
    }
    
    return translation;
  };

  return (
    <TranslationContext.Provider value={{ translate, currentLanguage: language, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook to use translation
export const useTranslation = () => useContext(TranslationContext);
