import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext(null);

export const TRANSLATIONS = {
  en: {
    // Navigation
    app_title: "MediVault AI",
    nav_dashboard: "Dashboard",
    nav_records: "Medical Records",
    nav_medications: "Medications",
    nav_appointments: "Appointments",
    nav_timeline: "Health Timeline",
    nav_analytics: "Health Analytics",
    nav_diabetes: "Diabetes Screening",
    nav_documents: "Documents Vault",
    nav_expenses: "Medical Expenses",
    nav_profile: "Profile & Settings",

    // Common UI
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    upload: "Upload",
    download: "Download",
    search: "Search...",
    filter: "Filter",
    all: "All",
    status: "Status",
    date: "Date",
    actions: "Actions",
    notes: "Notes",
    refresh: "Refresh",
    confirm_delete: "Are you sure you want to delete this item?",
    verified_secure: "AES-256 Encrypted & Isolated User Storage",

    // Family Member Switcher
    family_active_profile: "Active Patient Profile",
    family_switch_patient: "Switch Family Member",
    family_add_member: "Add Family Member",
    family_self: "Self",
    family_father: "Father",
    family_mother: "Mother",
    family_spouse: "Spouse",
    family_child: "Child",
    family_other: "Other",

    // Documents Vault
    doc_vault_title: "Medical Documents Vault",
    doc_vault_subtitle: "Secure cloud repository for official clinical reports, lab PDFs, prescriptions, and radiology scans with AI text extraction.",
    doc_upload_heading: "Upload Medical Document",
    doc_name_label: "Document Name",
    doc_category_label: "Document Category",
    doc_ai_extract_btn: "Extract Clinical Data with AI",
    doc_ai_extracting: "Analyzing document clinical markers...",
    doc_extracted_preview: "AI Extracted Clinical Insights",
    doc_empty: "No documents stored yet. Upload a diagnostic report or prescription to get started.",
    doc_cat_lab: "Laboratory Report",
    doc_cat_prescription: "Prescription",
    doc_cat_discharge: "Discharge Summary",
    doc_cat_imaging: "Imaging / Radiology",
    doc_cat_invoice: "Hospital / Medical Bill",
    doc_cat_insurance: "Health Insurance Document",

    // Medical Expenses Tracker
    expense_title: "Medical Expenses Tracker",
    expense_subtitle: "Log, track, and aggregate out-of-pocket healthcare expenditures and insurance claims in Indian Rupees (₹).",
    expense_total_spent: "Total Healthcare Expenditure",
    expense_records_count: "Total Expense Entries",
    expense_add_heading: "Log Healthcare Expense",
    expense_title_label: "Expense Description / Reason",
    expense_amount_label: "Amount (₹)",
    expense_category_label: "Expense Category",
    expense_facility_label: "Clinic / Hospital / Pharmacy",
    expense_date_label: "Payment Date",
    expense_method_label: "Payment Method",
    expense_status_label: "Payment Status",
    expense_bill_no_label: "Invoice / Bill Number",
    expense_dup_warning: "Warning: An invoice with this bill number already exists!",
    expense_empty: "No medical expenses recorded yet.",

    // Doctor Visit Summary
    summary_btn: "Generate Doctor-Visit Summary",
    summary_title: "Physician Clinical Visit Summary",
    summary_subtitle: "Consolidated health snapshot designed for medical consultations and diagnostic discussions.",
    summary_active_meds: "Currently Active Medications",
    summary_recent_records: "Recent Diagnostic & Clinical Records",
    summary_chronic_markers: "Chronic Health & Vitals Overview",
    summary_physician_questions: "Key Questions for the Attending Physician",
    summary_print_btn: "Print / Export Summary",
    summary_close_btn: "Close Summary",

    // Chronic Disease Guidance & Warnings
    chronic_diabetes_title: "Diabetes & Glycemic Monitoring",
    chronic_anemia_warning: "Clinical Note on HbA1c: Conditions that alter red blood cell turnover (such as iron deficiency anemia, hemoglobinopathies, or recent blood loss) may falsely skew HbA1c values. Always correlate with daily capillary fasting and post-prandial blood glucose logs.",
    chronic_heart_title: "Cardiovascular & Blood Pressure Tracking",
    chronic_heart_guidance: "Track systolic and diastolic blood pressure twice daily. Note any changes in dosage of antihypertensive therapies.",
  },
  hi: {
    // Navigation
    app_title: "मेडीवॉल्ट एआई",
    nav_dashboard: "डैशबोर्ड",
    nav_records: "मेडिकल रिकॉर्ड्स",
    nav_medications: "दवाइयां (प्रिस्क्रिप्शन)",
    nav_appointments: "डॉक्टर अपॉइंटमेंट्स",
    nav_timeline: "स्वास्थ्य टाइमलाइन",
    nav_analytics: "हेल्थ एनालिटिक्स",
    nav_diabetes: "मधुमेह (डायबिटीज) जांच",
    nav_documents: "दस्तावेज़ वॉल्ट (फाइलें)",
    nav_expenses: "चिकित्सा व्यय (खर्चे)",
    nav_profile: "प्रोफ़ाइल एवं सेटिंग्स",

    // Common UI
    loading: "लोड हो रहा है...",
    save: "सुरक्षित करें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    upload: "अपलोड करें",
    download: "डाउनलोड करें",
    search: "खोजें...",
    filter: "फ़िल्टर",
    all: "सभी",
    status: "स्थिति",
    date: "दिनांक",
    actions: "कार्रवाई",
    notes: "टिप्पणियाँ",
    refresh: "ताज़ा करें",
    confirm_delete: "क्या आप वाकई इस आइटम को हटाना चाहते हैं?",
    verified_secure: "एईएस-256 एन्क्रिप्टेड और सुरक्षित उपयोगकर्ता डेटा",

    // Family Member Switcher
    family_active_profile: "सक्रिय रोगी प्रोफ़ाइल",
    family_switch_patient: "परिवार का सदस्य बदलें",
    family_add_member: "परिवार का सदस्य जोड़ें",
    family_self: "स्वयं (Self)",
    family_father: "पिताजी (Father)",
    family_mother: "माताजी (Mother)",
    family_spouse: "जीवनसाथी (Spouse)",
    family_child: "बच्चा (Child)",
    family_other: "अन्य (Other)",

    // Documents Vault
    doc_vault_title: "मेडिकल दस्तावेज़ वॉल्ट",
    doc_vault_subtitle: "लैब रिपोर्ट, पर्चे (प्रिस्क्रिप्शन), और डिस्चार्ज समरी के लिए सुरक्षित रिपॉजिटरी।",
    doc_upload_heading: "मेडिकल दस्तावेज़ अपलोड करें",
    doc_name_label: "दस्तावेज़ का नाम",
    doc_category_label: "दस्तावेज़ की श्रेणी",
    doc_ai_extract_btn: "एआई द्वारा नैदानिक डेटा निकालें (OCR)",
    doc_ai_extracting: "रिपोर्ट से महत्वपूर्ण डेटा निकाला जा रहा है...",
    doc_extracted_preview: "एआई द्वारा निकाले गए नैदानिक निष्कर्ष",
    doc_empty: "अभी कोई दस्तावेज़ संग्रहीत नहीं है। शुरू करने के लिए कोई रिपोर्ट या पर्चा अपलोड करें।",
    doc_cat_lab: "प्रयोगशाला रिपोर्ट",
    doc_cat_prescription: "डॉक्टर का पर्चा",
    doc_cat_discharge: "डिस्चार्ज समरी",
    doc_cat_imaging: "रेडियोलॉजी / स्कैन",
    doc_cat_invoice: "अस्पताल / मेडिकल बिल",
    doc_cat_insurance: "स्वास्थ्य बीमा दस्तावेज़",

    // Medical Expenses Tracker
    expense_title: "चिकित्सा व्यय ट्रैकर",
    expense_subtitle: "स्वास्थ्य देखभाल खर्चों और बिलों का भारतीय रुपये (₹) में प्रबंधन और हिसाब।",
    expense_total_spent: "कुल चिकित्सा व्यय",
    expense_records_count: "कुल प्रविष्टियाँ",
    expense_add_heading: "नया चिकित्सा व्यय जोड़ें",
    expense_title_label: "व्यय का विवरण / कारण",
    expense_amount_label: "राशि (₹)",
    expense_category_label: "व्यय की श्रेणी",
    expense_facility_label: "अस्पताल / क्लिनिक / फार्मेसी",
    expense_date_label: "भुगतान की तारीख",
    expense_method_label: "भुगतान का तरीका (UPI/नकद/कार्ड)",
    expense_status_label: "भुगतान की स्थिति",
    expense_bill_no_label: "बिल / इनवॉइस नंबर",
    expense_dup_warning: "चेतावनी: इस बिल नंबर का इनवॉइस पहले से मौजूद है!",
    expense_empty: "अभी तक कोई चिकित्सा व्यय दर्ज नहीं किया गया है।",

    // Doctor Visit Summary
    summary_btn: "डॉक्टर विज़िट समरी बनाएं",
    summary_title: "चिकित्सक परामर्श सारांश",
    summary_subtitle: "डॉक्टर परामर्श और त्वरित नैदानिक समीक्षा के लिए समेकित स्वास्थ्य रिपोर्ट।",
    summary_active_meds: "वर्तमान में सक्रिय दवाएं",
    summary_recent_records: "हालिया नैदानिक और लैब परीक्षण",
    summary_chronic_markers: "दीर्घकालिक रोग और महत्वपूर्ण पैरामीटर",
    summary_physician_questions: "उपचार करने वाले चिकित्सक के लिए मुख्य प्रश्न",
    summary_print_btn: "सारांश प्रिंट / निर्यात करें",
    summary_close_btn: "सारांश बंद करें",

    // Chronic Disease Guidance & Warnings
    chronic_diabetes_title: "मधुमेह और ग्लूकोज निगरानी",
    chronic_anemia_warning: "HbA1c पर नैदानिक चेतावनी: ऐसी स्थितियाँ जो लाल रक्त कोशिकाओं के जीवनकाल को बदलती हैं (जैसे आयरन की कमी से एनीमिया या हालिया रक्त की कमी), HbA1c के स्तर को गलत प्रभावित कर सकती हैं। हमेशा दैनिक उपवास और भोजन के बाद के ग्लूकोज स्तर से मिलान करें।",
    chronic_heart_title: "हृदय स्वास्थ्य और रक्तचाप की निगरानी",
    chronic_heart_guidance: "दिन में दो बार सिस्टोलिक और डायस्टोलिक रक्तचाप रिकॉर्ड करें। उच्च रक्तचाप की दवाओं में किसी भी बदलाव पर ध्यान दें।",
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("medivault_lang") || "en";
  });

  const toggleLanguage = () => {
    const next = lang === "en" ? "hi" : "en";
    setLang(next);
    localStorage.setItem("medivault_lang", next);
  };

  const setLanguage = (newLang) => {
    if (newLang === "en" || newLang === "hi") {
      setLang(newLang);
      localStorage.setItem("medivault_lang", newLang);
    }
  };

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
