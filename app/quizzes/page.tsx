"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Award, BookOpen, CheckCircle, Clock } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function QuizzesPage() {
  const { translations, language } = useLanguage()

  // Get quizzes based on language
  const quizzes = getLocalizedQuizzes(language)

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{translations.quizzes}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} translations={translations} />
        ))}
      </div>
    </div>
  )
}

function QuizCard({ quiz, translations }: { quiz: any; translations: Record<string, string> }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{quiz.title}</CardTitle>
            <CardDescription className="mt-2">{quiz.description}</CardDescription>
          </div>
          {quiz.completed && (
            <Badge variant="success" className="bg-green-500 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              {translations.completed}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {quiz.timeEstimate} {translations.min}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Award className="mr-1 h-4 w-4" />
            {translations[quiz.difficultyKey]}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={quiz.progress} className="h-2" />
          <span className="text-xs text-muted-foreground">{quiz.progress}%</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/quizzes/${quiz.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            <BookOpen className="mr-2 h-4 w-4" />
            {quiz.progress > 0 && quiz.progress < 100 ? translations.continueQuiz : translations.startQuiz}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

// Function to get localized quizzes
function getLocalizedQuizzes(language: string) {
  const quizData = {
    en: [
      {
        id: 1,
        title: "Prompt Engineering Basics",
        description: "Test your knowledge of fundamental prompt engineering concepts",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyBeginner",
        completed: false,
        progress: 0,
      },
      {
        id: 2,
        title: "Advanced Techniques Quiz",
        description: "Challenge yourself with advanced prompt engineering scenarios",
        questions: 15,
        timeEstimate: "25",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
      {
        id: 3,
        title: "Practical Applications",
        description: "Apply prompt engineering to real-world use cases",
        questions: 12,
        timeEstimate: "20",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 4,
        title: "Role-Based Prompting Quiz",
        description: "Test your understanding of role-based prompting techniques",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 5,
        title: "Chain-of-Thought Assessment",
        description: "Evaluate your chain-of-thought prompting skills",
        questions: 8,
        timeEstimate: "20",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
    ],
    es: [
      {
        id: 1,
        title: "Fundamentos de Ingeniería de Prompts",
        description: "Evalúa tu conocimiento de los conceptos fundamentales de ingeniería de prompts",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyBeginner",
        completed: false,
        progress: 0,
      },
      {
        id: 2,
        title: "Cuestionario de Técnicas Avanzadas",
        description: "Ponte a prueba con escenarios avanzados de ingeniería de prompts",
        questions: 15,
        timeEstimate: "25",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
      {
        id: 3,
        title: "Aplicaciones Prácticas",
        description: "Aplica la ingeniería de prompts a casos de uso del mundo real",
        questions: 12,
        timeEstimate: "20",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 4,
        title: "Cuestionario de Prompts Basados en Roles",
        description: "Evalúa tu comprensión de las técnicas de prompts basados en roles",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 5,
        title: "Evaluación de Cadena de Pensamiento",
        description: "Evalúa tus habilidades de prompting con cadena de pensamiento",
        questions: 8,
        timeEstimate: "20",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
    ],
    fr: [
      {
        id: 1,
        title: "Bases de l'Ingénierie de Prompts",
        description: "Testez vos connaissances des concepts fondamentaux de l'ingénierie de prompts",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyBeginner",
        completed: false,
        progress: 0,
      },
      {
        id: 2,
        title: "Quiz sur les Techniques Avancées",
        description: "Défiez-vous avec des scénarios avancés d'ingénierie de prompts",
        questions: 15,
        timeEstimate: "25",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
      {
        id: 3,
        title: "Applications Pratiques",
        description: "Appliquez l'ingénierie de prompts à des cas d'utilisation réels",
        questions: 12,
        timeEstimate: "20",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 4,
        title: "Quiz sur les Prompts Basés sur les Rôles",
        description: "Testez votre compréhension des techniques de prompts basés sur les rôles",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 5,
        title: "Évaluation de la Chaîne de Pensée",
        description: "Évaluez vos compétences en prompting avec chaîne de pensée",
        questions: 8,
        timeEstimate: "20",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
    ],
    de: [
      {
        id: 1,
        title: "Grundlagen des Prompt-Engineering",
        description: "Testen Sie Ihr Wissen über grundlegende Konzepte des Prompt-Engineering",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyBeginner",
        completed: false,
        progress: 0,
      },
      {
        id: 2,
        title: "Quiz zu fortgeschrittenen Techniken",
        description: "Stellen Sie sich fortgeschrittenen Prompt-Engineering-Szenarien",
        questions: 15,
        timeEstimate: "25",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
      {
        id: 3,
        title: "Praktische Anwendungen",
        description: "Wenden Sie Prompt-Engineering auf reale Anwendungsfälle an",
        questions: 12,
        timeEstimate: "20",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 4,
        title: "Quiz zu rollenbasierten Prompts",
        description: "Testen Sie Ihr Verständnis von rollenbasierten Prompt-Techniken",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 5,
        title: "Bewertung der Gedankenkette",
        description: "Bewerten Sie Ihre Fähigkeiten im Gedankenketten-Prompting",
        questions: 8,
        timeEstimate: "20",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
    ],
    zh: [
      {
        id: 1,
        title: "提示工程基础",
        description: "测试您对提示工程基本概念的了解",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyBeginner",
        completed: false,
        progress: 0,
      },
      {
        id: 2,
        title: "高级技术测验",
        description: "挑战自己，应对高级提示工程场景",
        questions: 15,
        timeEstimate: "25",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
      {
        id: 3,
        title: "实际应用",
        description: "将提示工程应用于实际用例",
        questions: 12,
        timeEstimate: "20",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 4,
        title: "基于角色的提示测验",
        description: "测试您对基于角色的提示技术的理解",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 5,
        title: "思维链评估",
        description: "评估您的思维链提示技能",
        questions: 8,
        timeEstimate: "20",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
    ],
    ja: [
      {
        id: 1,
        title: "プロンプトエンジニアリングの基礎",
        description: "プロンプトエンジニアリングの基本概念に関する知識をテストする",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyBeginner",
        completed: false,
        progress: 0,
      },
      {
        id: 2,
        title: "高度なテクニッククイズ",
        description: "高度なプロンプトエンジニアリングのシナリオに挑戦する",
        questions: 15,
        timeEstimate: "25",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
      {
        id: 3,
        title: "実践的なアプリケーション",
        description: "実際のユースケースにプロンプトエンジニアリングを適用する",
        questions: 12,
        timeEstimate: "20",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 4,
        title: "ロールベースのプロンプトクイズ",
        description: "ロールベースのプロンプト技術の理解度をテストする",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 5,
        title: "思考の連鎖評価",
        description: "思考の連鎖プロンプトのスキルを評価する",
        questions: 8,
        timeEstimate: "20",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
    ],
    ar: [
      {
        id: 1,
        title: "أساسيات هندسة الموجهات",
        description: "اختبر معرفتك بمفاهيم هندسة الموجهات الأساسية",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyBeginner",
        completed: false,
        progress: 0,
      },
      {
        id: 2,
        title: "اختبار التقنيات المتقدمة",
        description: "تحدى نفسك مع سيناريوهات هندسة الموجهات المتقدمة",
        questions: 15,
        timeEstimate: "25",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
      {
        id: 3,
        title: "التطبيقات العملية",
        description: "تطبيق هندسة الموجهات على حالات الاستخدام الواقعية",
        questions: 12,
        timeEstimate: "20",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 4,
        title: "اختبار الموجهات القائمة على الأدوار",
        description: "اختبر فهمك لتقنيات الموجهات القائمة على الأدوار",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 5,
        title: "تقييم سلسلة التفكير",
        description: "قيّم مهاراتك في موجهات سلسلة التفكير",
        questions: 8,
        timeEstimate: "20",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
    ],
    hi: [
      {
        id: 1,
        title: "प्रॉम्प्ट इंजीनियरिंग की मूल बातें",
        description: "प्रॉम्प्ट इंजीनियरिंग के मूलभूत सिद्धांतों के अपने ज्ञान का परीक्षण करें",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyBeginner",
        completed: false,
        progress: 0,
      },
      {
        id: 2,
        title: "उन्नत तकनीकों की परीक्षा",
        description: "उन्नत प्रॉम्प्ट इंजीनियरिंग परिदृश्यों के साथ खुद को चुनौती दें",
        questions: 15,
        timeEstimate: "25",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
      {
        id: 3,
        title: "व्यावहारिक अनुप्रयोग",
        description: "वास्तविक उपयोग मामलों में प्रॉम्प्ट इंजीनियरिंग लागू करें",
        questions: 12,
        timeEstimate: "20",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 4,
        title: "रोल-आधारित प्रॉम्प्टिंग परीक्षा",
        description: "रोल-आधारित प्रॉम्प्टिंग तकनीकों की अपनी समझ का परीक्षण करें",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 5,
        title: "चेन-ऑफ-थॉट मूल्यांकन",
        description: "अपने चेन-ऑफ-थॉट प्रॉम्प्टिंग कौशल का मूल्यांकन करें",
        questions: 8,
        timeEstimate: "20",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
    ],
    ur: [
      {
        id: 1,
        title: "پرامپٹ انجینئرنگ کی بنیادیں",
        description: "پرامپٹ انجینئرنگ کے بنیادی تصورات کے بارے میں اپنے علم کا جائزہ لیں",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyBeginner",
        completed: false,
        progress: 0,
      },
      {
        id: 2,
        title: "اعلی تکنیکی کوئز",
        description: "اعلی پرامپٹ انجینئرنگ سناریوز کے ساتھ خود کو چیلنج کریں",
        questions: 15,
        timeEstimate: "25",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
      {
        id: 3,
        title: "عملی ایپلیکیشنز",
        description: "پرامپٹ انجینئرنگ کو حقیقی دنیا کے استعمال کے معاملات پر لاگو کریں",
        questions: 12,
        timeEstimate: "20",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 4,
        title: "کردار پر مبنی پرامپٹنگ کوئز",
        description: "کردار پر مبنی پرامپٹنگ تکنیکوں کی اپنی سمجھ کا جائزہ لیں",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 5,
        title: "سلسلہ سوچ تشخیص",
        description: "اپنی سلسلہ سوچ پرامپٹنگ مہارتوں کا جائزہ لیں",
        questions: 8,
        timeEstimate: "20",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
    ],
    te: [
      {
        id: 1,
        title: "ప్రాంప్ట్ ఇంజనీరింగ్ మూలాలు",
        description: "ప్రాంప్ట్ ఇంజనీరింగ్ యొక్క ప్రాథమిక భావనలపై మీ జ్ఞానాన్ని పరీక్షించండి",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyBeginner",
        completed: false,
        progress: 0,
      },
      {
        id: 2,
        title: "అధునాతన పద్ధతుల క్విజ్",
        description: "అధునాతన ప్రాంప్ట్ ఇంజనీరింగ్ సన్నివేశాలతో మిమ్మల్ని మీరు సవాలు చేసుకోండి",
        questions: 15,
        timeEstimate: "25",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
      {
        id: 3,
        title: "ప్రాక్టికల్ అప్లికేషన్స్",
        description: "వాస్తవ ప్రపంచ కేస్ స్టడీలకు ప్రాంప్ట్ ఇంజనీరింగ్‌ను అనువర్తించండి",
        questions: 12,
        timeEstimate: "20",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 4,
        title: "పాత్ర-ఆధారిత ప్రాంప్టింగ్ క్విజ్",
        description: "పాత్ర-ఆధారిత ప్రాంప్టింగ్ టెక్నిక్‌లపై మీ అవగాహనను పరీక్షించండి",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 5,
        title: "ఆలోచన-శృంఖల అసెస్మెంట్",
        description: "మీ ఆలోచన-శృంఖల ప్రాంప్టింగ్ నైపుణ్యాలను అంచనా వేయండి",
        questions: 8,
        timeEstimate: "20",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
    ],
    ta: [
      {
        id: 1,
        title: "ப்ராம்ப்ட் இன்ஜினியரிங் அடிப்படைகள்",
        description: "ப்ராம்ப்ட் இன்ஜினியரிங்கின் அடிப்படை கருத்துக்களில் உங்கள் அறிவை சோதிக்கவும்",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyBeginner",
        completed: false,
        progress: 0,
      },
      {
        id: 2,
        title: "மேம்பட்ட நுட்பங்கள் வினாடி வினா",
        description: "மேம்பட்ட ப்ராம்ப்ட் இன்ஜினியரிங் சூழல்களுடன் உங்களை சவால் செய்யுங்கள்",
        questions: 15,
        timeEstimate: "25",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
      {
        id: 3,
        title: "நடைமுறை பயன்பாடுகள்",
        description: "உண்மையான பயன்பாட்டு வழக்குகளுக்கு ப்ராம்ப்ட் இன்ஜினியரிங்கைப் பயன்படுத்துங்கள்",
        questions: 12,
        timeEstimate: "20",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 4,
        title: "பாத்திரம் சார்ந்த ப்ராம்ப்டிங் வினாடி வினா",
        description: "பாத்திரம் சார்ந்த ப்ராம்ப்டிங் நுட்பங்களில் உங்கள் புரிதலை சோதிக்கவும்",
        questions: 10,
        timeEstimate: "15",
        difficultyKey: "difficultyIntermediate",
        completed: false,
        progress: 0,
      },
      {
        id: 5,
        title: "சிந்தனை-சங்கிலி மதிப்பீடு",
        description: "உங்கள் சிந்தனை-சங்கிலி ப்ராம்ப்டிங் திறன்களை மதிப்பிடுங்கள்",
        questions: 8,
        timeEstimate: "20",
        difficultyKey: "difficultyAdvanced",
        completed: false,
        progress: 0,
      },
    ],
  }

  // Default to English if the requested language is not available
  return quizData[language as keyof typeof quizData] || quizData.en
}
