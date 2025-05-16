export function getLocalizedTemplates(language: string) {
  const templates = {
    en: {
      general: [
        {
          title: "Basic Question",
          prompt: "What is [topic]?",
        },
        {
          title: "Detailed Explanation",
          prompt: "Explain [concept] in detail, including its history, applications, and limitations.",
        },
      ],
      creative: [
        {
          title: "Short Story",
          prompt: "Write a short story about [topic] with the following elements: [element1], [element2], [element3].",
        },
        {
          title: "Poem",
          prompt: "Write a poem about [topic] in the style of [poet].",
        },
      ],
      technical: [
        {
          title: "Code Generation",
          prompt: "Write a [language] function that [functionality]. Include comments explaining the code.",
        },
        {
          title: "Data Analysis",
          prompt: "Analyze the following data and provide insights: [data]",
        },
      ],
    },
    es: {
      general: [
        {
          title: "Pregunta Básica",
          prompt: "¿Qué es [tema]?",
        },
        {
          title: "Explicación Detallada",
          prompt: "Explica [concepto] en detalle, incluyendo su historia, aplicaciones y limitaciones.",
        },
      ],
      creative: [
        {
          title: "Cuento Corto",
          prompt:
            "Escribe un cuento corto sobre [tema] con los siguientes elementos: [elemento1], [elemento2], [elemento3].",
        },
        {
          title: "Poema",
          prompt: "Escribe un poema sobre [tema] al estilo de [poeta].",
        },
      ],
      technical: [
        {
          title: "Generación de Código",
          prompt: "Escribe una función en [lenguaje] que [funcionalidad]. Incluye comentarios explicando el código.",
        },
        {
          title: "Análisis de Datos",
          prompt: "Analiza los siguientes datos y proporciona ideas: [datos]",
        },
      ],
    },
    fr: {
      general: [
        {
          title: "Question de Base",
          prompt: "Qu'est-ce que [sujet]?",
        },
        {
          title: "Explication Détaillée",
          prompt: "Expliquez [concept] en détail, y compris son histoire, ses applications et ses limites.",
        },
      ],
      creative: [
        {
          title: "Courte Histoire",
          prompt:
            "Écrivez une courte histoire sur [sujet] avec les éléments suivants: [élément1], [élément2], [élément3].",
        },
        {
          title: "Poème",
          prompt: "Écrivez un poème sur [sujet] dans le style de [poète].",
        },
      ],
      technical: [
        {
          title: "Génération de Code",
          prompt:
            "Écrivez une fonction en [langage] qui [fonctionnalité]. Incluez des commentaires expliquant le code.",
        },
        {
          title: "Analyse de Données",
          prompt: "Analysez les données suivantes et fournissez des informations: [données]",
        },
      ],
    },
    de: {
      general: [
        {
          title: "Grundlegende Frage",
          prompt: "Was ist [Thema]?",
        },
        {
          title: "Detaillierte Erklärung",
          prompt:
            "Erklären Sie [Konzept] im Detail, einschließlich seiner Geschichte, Anwendungen und Einschränkungen.",
        },
      ],
      creative: [
        {
          title: "Kurzgeschichte",
          prompt:
            "Schreiben Sie eine Kurzgeschichte über [Thema] mit den folgenden Elementen: [Element1], [Element2], [Element3].",
        },
        {
          title: "Gedicht",
          prompt: "Schreiben Sie ein Gedicht über [Thema] im Stil von [Dichter].",
        },
      ],
      technical: [
        {
          title: "Code-Generierung",
          prompt:
            "Schreiben Sie eine [Sprache]-Funktion, die [Funktionalität]. Fügen Sie Kommentare hinzu, die den Code erklären.",
        },
        {
          title: "Datenanalyse",
          prompt: "Analysieren Sie die folgenden Daten und liefern Sie Erkenntnisse: [Daten]",
        },
      ],
    },
    zh: {
      general: [
        {
          title: "基本问题",
          prompt: "什么是[主题]？",
        },
        {
          title: "详细解释",
          prompt: "详细解释[概念]，包括其历史、应用和局限性。",
        },
      ],
      creative: [
        {
          title: "短篇小说",
          prompt: "写一篇关于[主题]的短篇小说，包含以下元素：[元素1]、[元素2]、[元素3]。",
        },
        {
          title: "诗",
          prompt: "以[诗人]的风格写一首关于[主题]的诗。",
        },
      ],
      technical: [
        {
          title: "代码生成",
          prompt: "编写一个[语言]函数，该函数[功能]。包括解释代码的注释。",
        },
        {
          title: "数据分析",
          prompt: "分析以下数据并提供见解：[数据]",
        },
      ],
    },
    ja: {
      general: [
        {
          title: "基本的な質問",
          prompt: "[トピック]とは何ですか？",
        },
        {
          title: "詳細な説明",
          prompt: "[概念]について、その歴史、応用、制限事項を含めて詳細に説明してください。",
        },
      ],
      creative: [
        {
          title: "短編小説",
          prompt: "次の要素を含む[トピック]に関する短編小説を書いてください：[要素1]、[要素2]、[要素3]。",
        },
        {
          title: "詩",
          prompt: "[詩人]のスタイルで[トピック]に関する詩を書いてください。",
        },
      ],
      technical: [
        {
          title: "コード生成",
          prompt: "[言語]で[機能]を実行する関数を記述します。コードを説明するコメントを含めてください。",
        },
        {
          title: "データ分析",
          prompt: "次のデータを分析し、洞察を提供してください：[データ]",
        },
      ],
    },
    ar: {
      general: [
        {
          title: "سؤال أساسي",
          prompt: "ما هو [الموضوع]؟",
        },
        {
          title: "شرح مفصل",
          prompt: "اشرح [المفهوم] بالتفصيل، بما في ذلك تاريخه وتطبيقاته وقيوده.",
        },
      ],
      creative: [
        {
          title: "قصة قصيرة",
          prompt: "اكتب قصة قصيرة عن [الموضوع] مع العناصر التالية: [عنصر1]، [عنصر2]، [عنصر3].",
        },
        {
          title: "شعر",
          prompt: "اكتب قصيدة عن [الموضوع] بأسلوب [شاعر].",
        },
      ],
      technical: [
        {
          title: "توليد الكود",
          prompt: "اكتب دالة بلغة [اللغة] تقوم بـ [الوظيفة]. قم بتضمين تعليقات تشرح الكود.",
        },
        {
          title: "تحليل البيانات",
          prompt: "حلل البيانات التالية وقدم رؤى: [البيانات]",
        },
      ],
    },
    hi: {
      general: [
        {
          title: "बुनियादी प्रश्न",
          prompt: "[विषय] क्या है?",
        },
        {
          title: "विस्तृत स्पष्टीकरण",
          prompt: "[अवधारणा] को विस्तार से बताएं, जिसमें इसका इतिहास, अनुप्रयोग और सीमाएं शामिल हैं।",
        },
      ],
      creative: [
        {
          title: "लघु कहानी",
          prompt: "निम्नलिखित तत्वों के साथ [विषय] के बारे में एक लघु कहानी लिखें: [तत्व1], [तत्व2], [तत्व3]।",
        },
        {
          title: "कविता",
          prompt: "[कवि] की शैली में [विषय] के बारे में एक कविता लिखें।",
        },
      ],
      technical: [
        {
          title: "कोड जनरेशन",
          prompt: "[भाषा] में एक फ़ंक्शन लिखें जो [कार्यक्षमता] करता है। कोड को समझाने वाली टिप्पणियां शामिल करें।",
        },
        {
          title: "डेटा विश्लेषण",
          prompt: "निम्नलिखित डेटा का विश्लेषण करें और अंतर्दृष्टि प्रदान करें: [डेटा]",
        },
      ],
    },
    ur: {
      general: [
        {
          title: "بنیادی سوال",
          prompt: "[موضوع] کیا ہے؟",
        },
        {
          title: "تفصیلی وضاحت",
          prompt: "[تصور] کی تفصیل سے وضاحت کریں، بشمول اس کی تاریخ، اطلاقات اور حدود۔",
        },
      ],
      creative: [
        {
          title: "مختصر کہانی",
          prompt: "مندرجہ ذیل عناصر کے ساتھ [موضوع] کے بارے میں ایک مختصر کہانی لکھیں: [عنصر1]، [عنصر2]، [عنصر3]۔",
        },
        {
          title: "نظم",
          prompt: "[شاعر] کے انداز میں [موضوع] کے بارے میں ایک نظم لکھیں۔",
        },
      ],
      technical: [
        {
          title: "کوڈ جنریشن",
          prompt: "[زبان] میں ایک فنکشن لکھیں جو [فعالیت] انجام دیتا ہے۔ کوڈ کی وضاحت کرنے والے تبصرے شامل کریں۔",
        },
        {
          title: "ڈیٹا تجزیہ",
          prompt: "مندرجہ ذیل ڈیٹا کا تجزیہ کریں اور بصیرت فراہم کریں: [ڈیٹا]",
        },
      ],
    },
    te: {
      general: [
        {
          title: "ప్రాథమిక ప్రశ్న",
          prompt: "[విషయం] అంటే ఏమిటి?",
        },
        {
          title: "వివరణాత్మక వివరణ",
          prompt: "[భావన] యొక్క చరిత్ర, అనువర్తనాలు మరియు పరిమితులతో సహా వివరంగా వివరించండి.",
        },
      ],
      creative: [
        {
          title: "చిన్న కథ",
          prompt: "కింది అంశాలతో [విషయం] గురించి ఒక చిన్న కథను వ్రాయండి: [అంశం1], [అంశం2], [అంశం3].",
        },
        {
          title: "పద్యం",
          prompt: "[కవి] శైలిలో [విషయం] గురించి ఒక పద్యం వ్రాయండి.",
        },
      ],
      technical: [
        {
          title: "కోడ్ జనరేషన్",
          prompt: "[భాష]లో [కార్యాచరణ] చేసే ఫంక్షన్‌ను వ్రాయండి. కోడ్‌ను వివరించే వ్యాఖ్యలను చేర్చండి.",
        },
        {
          title: "డేటా విశ్లేషణ",
          prompt: "కింది డేటాను విశ్లేషించి, అంతర్దృష్టులను అందించండి: [డేటా]",
        },
      ],
    },
    ta: {
      general: [
        {
          title: "அடிப்படை கேள்வி",
          prompt: "[தலைப்பு] என்றால் என்ன?",
        },
        {
          title: "விரிவான விளக்கம்",
          prompt: "[கருத்து] பற்றி அதன் வரலாறு, பயன்பாடுகள் மற்றும் வரம்புகள் உட்பட விரிவாக விளக்கவும்.",
        },
      ],
      creative: [
        {
          title: "சிறுகதை",
          prompt: "பின்வரும் கூறுகளுடன் [தலைப்பு] பற்றி ஒரு சிறுகதை எழுதுங்கள்: [கூறு1], [கூறு2], [கூறு3].",
        },
        {
          title: "கவிதை",
          prompt: "[கவிஞர்] பாணியில் [தலைப்பு] பற்றி ஒரு கவிதை எழுதுங்கள்.",
        },
      ],
      technical: [
        {
          title: "குறியீடு உருவாக்கம்",
          prompt: "[மொழி]யில் [செயல்பாடு] செய்யும் ஒரு செயல்பாட்டை எழுதுங்கள். குறியீட்டை விளக்கும் கருத்துகளைச் சேர்க்கவும்.",
        },
        {
          title: "தரவு பகுப்பாய்வு",
          prompt: "பின்வரும் தரவை பகுப்பாய்வு செய்து நுண்ணறிவுகளை வழங்கவும்: [தரவு]",
        },
      ],
    },
  }

  return templates[language] || templates.en
}
