"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Add the new languages to the Language type
type Language = "en" | "es" | "fr" | "de" | "zh" | "ja" | "ar" | "hi" | "ur" | "te" | "ta"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  translations: Record<string, string>
  isRTL: boolean
  t: (key: string) => string // Add t function for compatibility
}

const defaultTranslations: Record<Language, Record<string, string>> = {
  // English translations
  en: {
    // Existing translations...
    home: "Home",
    lessons: "Lessons",
    playground: "Playground",
    quizzes: "Quizzes",
    settings: "Settings",
    welcome: "Welcome to ScriptShift Prompt Master",
    subtitle: "Master the art of prompt engineering in your language",
    getStarted: "Get Started",
    continueLesson: "Continue Learning",
    yourProgress: "Your Progress",
    popularLessons: "Popular Lessons",
    recentActivity: "Recent Activity",
    // Lesson categories
    all: "All",
    fundamentals: "Fundamentals",
    advanced: "Advanced",
    specialized: "Specialized",
    // Lesson metadata
    duration: "Duration",
    level: "Level",
    beginner: "Beginner",
    intermediate: "Intermediate",
    allLevels: "All Levels",
    startLesson: "Start Lesson",
    lesson: "Lesson",
    // Lesson titles
    lesson1Title: "Introduction to Prompt Engineering",
    lesson1Desc: "Learn the basics of crafting effective prompts",
    lesson2Title: "Role-Based Prompting",
    lesson2Desc: "Master the technique of assigning roles to AI models",
    lesson3Title: "Chain-of-Thought Prompting",
    lesson3Desc: "Guide AI models through complex reasoning tasks step by step",
    lesson4Title: "Few-Shot Learning",
    lesson4Desc: "Teach AI models by providing examples in your prompts",
    lesson5Title: "Advanced Techniques",
    lesson5Desc: "Master complex prompt structures and patterns",
    lesson6Title: "Domain-Specific Prompting",
    lesson6Desc: "Tailor prompts for specific use cases and industries",
    lesson7Title: "Prompt Optimization",
    lesson7Desc: "Learn techniques to refine and improve your prompts",
    lesson8Title: "Creative Writing Prompts",
    lesson8Desc: "Specialized techniques for creative and narrative tasks",
    // Platform features
    featuredLesson: "Featured Lesson",
    viewAllLessons: "View all lessons",
    platformFeatures: "Platform Features",
    multilingualSupport: "Multilingual Support",
    multilingualSupportDesc:
      "Learn prompt engineering in your preferred language with support for English, Spanish, French, German, Chinese, and Japanese.",
    structuredLessons: "Structured Lessons",
    structuredLessonsDesc:
      "Progress through carefully designed lessons that build your prompt engineering skills from basics to advanced techniques.",
    interactivePlayground: "Interactive Playground",
    interactivePlaygroundDesc:
      "Test your prompts in real-time with our playground that connects to OpenAI's API for immediate feedback.",
    knowledgeQuizzes: "Knowledge Quizzes",
    knowledgeQuizzesDesc:
      "Reinforce your learning with quizzes that test your understanding of prompt engineering concepts.",
    templateLibrary: "Template Library",
    templateLibraryDesc:
      "Access a growing library of prompt templates for various use cases to jumpstart your prompt engineering.",
    progressTracking: "Progress Tracking",
    progressTrackingDesc: "Track your learning journey with detailed progress indicators across all platform content.",
    // Common actions
    back: "Back",
    next: "Next",
    previous: "Previous",
    complete: "Complete",
    min: "min",
    tryPlayground: "Try Playground",
    settings: "Settings",
  },
  // Spanish translations
  es: {
    // Existing translations...
    home: "Inicio",
    lessons: "Lecciones",
    playground: "Área de Práctica",
    quizzes: "Cuestionarios",
    settings: "Configuración",
    welcome: "Bienvenido a ScriptShift Prompt Master",
    subtitle: "Domina el arte de la ingeniería de prompts en tu idioma",
    getStarted: "Comenzar",
    continueLesson: "Continuar Aprendiendo",
    yourProgress: "Tu Progreso",
    popularLessons: "Lecciones Populares",
    recentActivity: "Actividad Reciente",
    // Lesson categories
    all: "Todos",
    fundamentals: "Fundamentos",
    advanced: "Avanzado",
    specialized: "Especializado",
    // Lesson metadata
    duration: "Duración",
    level: "Nivel",
    beginner: "Principiante",
    intermediate: "Intermedio",
    allLevels: "Todos los Niveles",
    startLesson: "Iniciar Lección",
    lesson: "Lección",
    // Lesson titles
    lesson1Title: "Introducción a la Ingeniería de Prompts",
    lesson1Desc: "Aprende los fundamentos para crear prompts efectivos",
    lesson2Title: "Prompts Basados en Roles",
    lesson2Desc: "Domina la técnica de asignar roles a modelos de IA",
    lesson3Title: "Prompts de Cadena de Pensamiento",
    lesson3Desc: "Guía a los modelos de IA a través de tareas de razonamiento complejas paso a paso",
    lesson4Title: "Aprendizaje con Pocos Ejemplos",
    lesson4Desc: "Enseña a los modelos de IA proporcionando ejemplos en tus prompts",
    lesson5Title: "Técnicas Avanzadas",
    lesson5Desc: "Domina estructuras y patrones complejos de prompts",
    lesson6Title: "Prompts para Dominios Específicos",
    lesson6Desc: "Adapta prompts para casos de uso e industrias específicas",
    lesson7Title: "Optimización de Prompts",
    lesson7Desc: "Aprende técnicas para refinar y mejorar tus prompts",
    lesson8Title: "Prompts para Escritura Creativa",
    lesson8Desc: "Técnicas especializadas para tareas creativas y narrativas",
    // Platform features
    featuredLesson: "Lección Destacada",
    viewAllLessons: "Ver todas las lecciones",
    platformFeatures: "Características de la Plataforma",
    multilingualSupport: "Soporte Multilingüe",
    multilingualSupportDesc:
      "Aprende ingeniería de prompts en tu idioma preferido con soporte para inglés, español, francés, alemán, chino y japonés.",
    structuredLessons: "Lecciones Estructuradas",
    structuredLessonsDesc:
      "Progresa a través de lecciones cuidadosamente diseñadas que desarrollan tus habilidades de ingeniería de prompts desde lo básico hasta técnicas avanzadas.",
    interactivePlayground: "Área de Práctica Interactiva",
    interactivePlaygroundDesc:
      "Prueba tus prompts en tiempo real con nuestra área de práctica que se conecta a la API de OpenAI para obtener retroalimentación inmediata.",
    knowledgeQuizzes: "Cuestionarios de Conocimiento",
    knowledgeQuizzesDesc:
      "Refuerza tu aprendizaje con cuestionarios que evalúan tu comprensión de los conceptos de ingeniería de prompts.",
    templateLibrary: "Biblioteca de Plantillas",
    templateLibraryDesc:
      "Accede a una creciente biblioteca de plantillas de prompts para diversos casos de uso para impulsar tu ingeniería de prompts.",
    progressTracking: "Seguimiento de Progreso",
    progressTrackingDesc:
      "Realiza un seguimiento de tu viaje de aprendizaje con indicadores detallados de progreso en todo el contenido de la plataforma.",
    // Common actions
    back: "Atrás",
    next: "Siguiente",
    previous: "Anterior",
    complete: "Completar",
    min: "min",
    tryPlayground: "Probar Área de Práctica",
    settings: "Configuración",
  },
  // Other languages omitted for brevity
  fr: {
    /* Translations omitted for brevity */
    home: "Accueil",
    lessons: "Leçons",
    playground: "Terrain de Jeu",
    quizzes: "Quiz",
    settings: "Paramètres",
    subtitle: "Maîtrisez l'art de l'ingénierie de prompts dans votre langue",
    lesson: "Leçon",
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
    min: "min",
    startLesson: "Commencer la Leçon",
    // Lesson titles
    lesson1Title: "Introduction à l'Ingénierie de Prompts",
    lesson1Desc: "Apprenez les bases de la création de prompts efficaces",
    lesson2Title: "Prompts Basés sur les Rôles",
    lesson2Desc: "Maîtrisez la technique d'attribution de rôles aux modèles d'IA",
    lesson3Title: "Prompts avec Chaîne de Pensée",
    lesson3Desc: "Guidez les modèles d'IA à travers des tâches de raisonnement complexes étape par étape",
    lesson4Title: "Apprentissage par Quelques Exemples",
    lesson4Desc: "Enseignez aux modèles d'IA en fournissant des exemples dans vos prompts",
    lesson5Title: "Techniques Avancées",
    lesson5Desc: "Maîtrisez les structures et modèles complexes de prompts",
    lesson6Title: "Prompts pour Domaines Spécifiques",
    lesson6Desc: "Adaptez les prompts pour des cas d'utilisation et industries spécifiques",
    lesson7Title: "Optimisation de Prompts",
    lesson7Desc: "Apprenez des techniques pour affiner et améliorer vos prompts",
    lesson8Title: "Prompts pour l'Écriture Créative",
    lesson8Desc: "Techniques spécialisées pour les tâches créatives et narratives",
  },
  de: {
    /* Translations omitted for brevity */
    home: "Startseite",
    lessons: "Lektionen",
    subtitle: "Meistern Sie die Kunst des Prompt-Engineerings in Ihrer Sprache",
    lesson: "Lektion",
    beginner: "Anfänger",
    intermediate: "Fortgeschritten",
    advanced: "Experte",
    min: "Min",
    startLesson: "Lektion starten",
  },
  zh: {
    /* Translations omitted for brevity */
    home: "首页",
    lessons: "课程",
    subtitle: "用您的语言掌握提示工程的艺术",
    lesson: "课程",
    beginner: "初级",
    intermediate: "中级",
    advanced: "高级",
    min: "分钟",
    startLesson: "开始课程",
  },
  ja: {
    /* Translations omitted for brevity */
    home: "ホーム",
    lessons: "レッスン",
    subtitle: "あなたの言語でプロンプトエンジニアリングの技術を習得しましょう",
    lesson: "レッスン",
    beginner: "初心者",
    intermediate: "中級者",
    advanced: "上級者",
    min: "分",
    startLesson: "レッスンを始める",
  },
  ar: {
    // Arabic translations - basic set
    home: "الرئيسية",
    lessons: "الدروس",
    playground: "منطقة التجربة",
    quizzes: "الاختبارات",
    settings: "الإعدادات",
    welcome: "مرحبًا بك في ScriptShift Prompt Master",
    subtitle: "أتقن فن هندسة الموجهات بلغتك",
    getStarted: "ابدأ الآن",
    continueLesson: "متابعة التعلم",
    yourProgress: "تقدمك",
    popularLessons: "الدروس الشائعة",
    recentActivity: "النشاط الأخير",
    lesson: "درس",
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم",
    min: "دقيقة",
    startLesson: "ابدأ الدرس",
    // Lesson titles
    lesson1Title: "مقدمة في هندسة الموجهات",
    lesson1Desc: "تعلم أساسيات إنشاء موجهات فعالة",
    lesson2Title: "التوجيه القائم على الأدوار",
    lesson2Desc: "أتقن تقنية تعيين أدوار لنماذج الذكاء الاصطناعي",
    lesson3Title: "التوجيه بسلسلة التفكير",
    lesson3Desc: "توجيه نماذج الذكاء الاصطناعي خلال مهام الاستدلال المعقدة خطوة بخطوة",
    lesson4Title: "التعلم بأمثلة قليلة",
    lesson4Desc: "علّم نماذج الذكاء الاصطناعي من خلال تقديم أمثلة في موجهاتك",
    lesson5Title: "تقنيات متقدمة",
    lesson5Desc: "أتقن هياكل وأنماط الموجهات المعقدة",
    lesson6Title: "التوجيه لمجالات محددة",
    lesson6Desc: "تخصيص الموجهات لحالات استخدام وصناعات محددة",
    lesson7Title: "تحسين الموجهات",
    lesson7Desc: "تعلم تقنيات لتنقيح وتحسين موجهاتك",
    lesson8Title: "موجهات الكتابة الإبداعية",
    lesson8Desc: "تقنيات متخصصة للمهام الإبداعية والسردية",
  },
  hi: {
    // Hindi translations - basic set
    home: "होम",
    lessons: "पाठ",
    playground: "प्लेग्राउंड",
    quizzes: "प्रश्नोत्तरी",
    settings: "सेटिंग्स",
    welcome: "ScriptShift Prompt Master में आपका स्वागत है",
    subtitle: "अपनी भाषा में प्रॉम्प्ट इंजीनियरिंग की कला में महारत हासिल करें",
    getStarted: "शुरू करें",
    continueLesson: "सीखना जारी रखें",
    yourProgress: "आपकी प्रगति",
    popularLessons: "लोकप्रिय पाठ",
    recentActivity: "हाल की गतिविधि",
    lesson: "पाठ",
    beginner: "शुरुआती",
    intermediate: "मध्यवर्ती",
    advanced: "उन्नत",
    min: "मिनट",
    startLesson: "पाठ शुरू करें",
    // Lesson titles
    lesson1Title: "प्रॉम्प्ट इंजीनियरिंग का परिचय",
    lesson1Desc: "प्रभावी प्रॉम्प्ट बनाने की मूल बातें सीखें",
    lesson2Title: "रोल-आधारित प्रॉम्प्टिंग",
    lesson2Desc: "AI मॉडल को भूमिकाएं सौंपने की तकनीक में महारत हासिल करें",
    lesson3Title: "चेन-ऑफ-थॉट प्रॉम्प्टिंग",
    lesson3Desc: "AI मॉडल को जटिल तर्क कार्यों के माध्यम से चरण दर चरण मार्गदर्शन करें",
    lesson4Title: "फ्यू-शॉट लर्निंग",
    lesson4Desc: "अपने प्रॉम्प्ट में उदाहरण प्रदान करके AI मॉडल को सिखाएं",
    lesson5Title: "उन्नत तकनीकें",
    lesson5Desc: "जटिल प्रॉम्प्ट संरचनाओं और पैटर्न में महारत हासिल करें",
    lesson6Title: "डोमेन-विशिष्ट प्रॉम्प्टिंग",
    lesson6Desc: "विशिष्ट उपयोग मामलों और उद्योगों के लिए प्रॉम्प्ट को अनुकूलित करें",
    lesson7Title: "प्रॉम्प्ट अनुकूलन",
    lesson7Desc: "अपने प्रॉम्प्ट को परिष्कृत और सुधारने के लिए तकनीकें सीखें",
    lesson8Title: "रचनात्मक लेखन प्रॉम्प्ट",
    lesson8Desc: "रचनात्मक और कथात्मक कार्यों के लिए विशेष तकनीकें",
  },
  ur: {
    // Urdu translations - basic set
    home: "ہوم",
    lessons: "اسباق",
    playground: "پلے گراؤنڈ",
    quizzes: "کوئز",
    settings: "ترتیبات",
    welcome: "ScriptShift Prompt Master میں خوش آمدید",
    subtitle: "اپنی زبان میں پرامپٹ انجینئرنگ کا فن سیکھیں",
    getStarted: "شروع کریں",
    continueLesson: "سیکھنا جاری رکھیں",
    yourProgress: "آپ کی پیشرفت",
    popularLessons: "مقبول اسباق",
    recentActivity: "حالیہ سرگرمی",
    lesson: "سبق",
    beginner: "مبتدی",
    intermediate: "درمیانی",
    advanced: "ماہر",
    min: "منٹ",
    startLesson: "سبق شروع کریں",
  },
  te: {
    // Telugu translations - basic set
    home: "హోమ్",
    lessons: "పాఠాలు",
    playground: "ప్లేగ్రౌండ్",
    quizzes: "క్విజ్‌లు",
    settings: "సెట్టింగ్‌లు",
    welcome: "ScriptShift Prompt Master కి స్వాగతం",
    subtitle: "మీ భాషలో ప్రాంప్ట్ ఇంజనీరింగ్ కళను నేర్చుకోండి",
    getStarted: "ప్రారంభించండి",
    continueLesson: "నేర్చుకోవడం కొనసాగించండి",
    yourProgress: "మీ పురోగతి",
    popularLessons: "జనాదరణ పొందిన పాఠాలు",
    recentActivity: "ఇటీవలి కార్యకలాపం",
    lesson: "పాఠం",
    beginner: "ప్రారంభకుడు",
    intermediate: "మధ్యస్థం",
    advanced: "అధునాతన",
    min: "నిమిషాలు",
    startLesson: "పాఠం ప్రారంభించండి",
  },
  ta: {
    // Tamil translations - basic set
    home: "முகப்பு",
    lessons: "பாடங்கள்",
    playground: "பயிற்சி மைதானம்",
    quizzes: "வினாடி வினாக்கள்",
    settings: "அமைப்புகள்",
    welcome: "ScriptShift Prompt Master க்கு வரவேற்கிறோம்",
    subtitle: "உங்கள் மொழியில் ப்ராம்ப்ட் பொறியியலை கற்றுக்கொள்ளுங்கள்",
    getStarted: "தொடங்குங்கள்",
    continueLesson: "கற்றலைத் தொடரவும்",
    yourProgress: "உங்கள் முன்னேற்றம்",
    popularLessons: "பிரபலமான பாடங்கள்",
    recentActivity: "சமீபத்திய செயல்பாடு",
    lesson: "பாடம்",
    beginner: "தொடக்கநிலை",
    intermediate: "இடைநிலை",
    advanced: "மேம்பட்ட",
    min: "நிமிடங்கள்",
    startLesson: "பாடத்தைத் தொடங்கு",
  },
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  translations: defaultTranslations.en,
  isRTL: false,
  t: (key: string) => key, // Add default t function
})

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [language, setLanguage] = useState<Language>("en")
  const [translations, setTranslations] = useState<Record<string, string>>(defaultTranslations.en)
  const [isRTL, setIsRTL] = useState(false)

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage && Object.keys(defaultTranslations).includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Update translations when language changes
    setTranslations(defaultTranslations[language] || defaultTranslations.en)
    // Update RTL status
    setIsRTL(language === "ar" || language === "ur")
    // Save language preference
    localStorage.setItem("language", language)

    // Apply RTL class to the root element
    const htmlElement = document.documentElement
    if (language === "ar" || language === "ur") {
      htmlElement.dir = "rtl"
      htmlElement.classList.add("rtl")
      htmlElement.classList.remove("ltr")
    } else {
      htmlElement.dir = "ltr"
      htmlElement.classList.add("ltr")
      htmlElement.classList.remove("rtl")
    }
  }, [language])

  // Translation function for compatibility
  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key]
    }
    // Fallback to English
    if (defaultTranslations.en[key]) {
      return defaultTranslations.en[key]
    }
    // Return key if no translation found
    return key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
