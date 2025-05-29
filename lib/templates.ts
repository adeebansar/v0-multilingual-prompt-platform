import type { Language } from "@/components/language-provider"
import type { PromptTemplate } from "@/lib/prompt-analyzer"

export interface TemplateCategories {
  general: PromptTemplate[]
  creative: PromptTemplate[]
  technical: PromptTemplate[]
  business: PromptTemplate[]
  academic: PromptTemplate[]
  marketing: PromptTemplate[]
  healthcare: PromptTemplate[]
  legal: PromptTemplate[]
  education: PromptTemplate[]
  career: PromptTemplate[] // Added career category
}

export function getLocalizedTemplates(language: string): TemplateCategories {
  try {
    const templates: Record<Language, TemplateCategories> = {
      en: {
        general: [
          {
            title: "Basic Question",
            prompt: "What is artificial intelligence and how does it differ from traditional programming?",
            tags: ["basic", "question", "definition"],
          },
          {
            title: "Detailed Explanation",
            prompt:
              "Explain machine learning in detail, including its history, applications in modern technology, and current limitations in real-world scenarios.",
            tags: ["explanation", "detailed", "comprehensive"],
          },
          {
            title: "Pros and Cons",
            prompt:
              "What are the advantages and disadvantages of remote work for both employees and organizations? Include impacts on productivity, work-life balance, and company culture.",
            tags: ["analysis", "comparison", "evaluation"],
          },
          {
            title: "Step-by-Step Guide",
            prompt:
              "Provide a step-by-step guide on how to build a basic web application using React. Include environment setup, component creation, state management, and deployment considerations.",
            tags: ["guide", "instructions", "how-to"],
          },
          {
            title: "Examples and Applications",
            prompt:
              "Give me practical examples and real-world applications of blockchain technology beyond cryptocurrency, including supply chain management, voting systems, and digital identity verification.",
            tags: ["examples", "practical", "applications"],
          },
        ],
        creative: [
          {
            title: "Short Story",
            prompt:
              "Write a short story about a time traveler who accidentally changes history with the following elements: an antique watch, a missed train, and an unexpected friendship.",
            tags: ["story", "fiction", "creative writing"],
          },
          {
            title: "Poem",
            prompt:
              "Write a poem about the changing seasons in the style of Robert Frost, emphasizing the transition from summer to autumn and the feelings it evokes.",
            tags: ["poetry", "creative", "artistic"],
          },
          {
            title: "Character Creation",
            prompt:
              "Create a detailed character profile for a cybernetic detective in a neo-noir science fiction story. Include physical appearance, personality traits, backstory, and unique abilities.",
            tags: ["character", "profile", "fiction"],
          },
          {
            title: "Plot Outline",
            prompt:
              "Develop a plot outline for a mystery thriller story involving a missing artifact from a prestigious museum, an art historian with a secret past, and a series of cryptic messages left at crime scenes.",
            tags: ["plot", "outline", "story structure"],
          },
          {
            title: "Dialogue Writing",
            prompt:
              "Write a dialogue between two characters who were once close friends but haven't spoken in years after a misunderstanding. They unexpectedly meet at an airport during a flight delay.",
            tags: ["dialogue", "conversation", "characters"],
          },
        ],
        technical: [
          {
            title: "Code Generation",
            prompt:
              "Write a Python function that analyzes a text document and returns the most frequent words, their counts, and positions. Include comments explaining the code and handle edge cases like empty documents and punctuation.",
            tags: ["code", "programming", "function"],
          },
          {
            title: "Data Analysis",
            prompt:
              "Analyze the following customer purchase data and provide insights: average purchase value, most popular product categories, customer retention rate, and recommendations for improving sales conversion.",
            tags: ["data", "analysis", "insights"],
          },
          {
            title: "Algorithm Explanation",
            prompt:
              "Explain how the A* pathfinding algorithm works, its time complexity compared to Dijkstra's algorithm, and use cases where it outperforms other pathfinding methods in game development and robotics.",
            tags: ["algorithm", "complexity", "computer science"],
          },
          {
            title: "Technical Troubleshooting",
            prompt:
              "I'm experiencing random system crashes with my Windows PC when running resource-intensive applications. The screen freezes, followed by a blue screen with error code MEMORY_MANAGEMENT. What are the possible causes and solutions?",
            tags: ["troubleshooting", "debugging", "technical support"],
          },
          {
            title: "System Architecture",
            prompt:
              "Design a system architecture for a food delivery application that needs to handle real-time order tracking, payment processing, driver assignment, and scaling to support 100,000 concurrent users during peak hours.",
            tags: ["architecture", "design", "systems"],
          },
        ],
        business: [
          {
            title: "SWOT Analysis",
            prompt:
              "Perform a SWOT analysis for Tesla, identifying key strengths in innovation and brand loyalty, weaknesses in production scalability, opportunities in energy storage markets, and threats from traditional automakers entering the EV market.",
            tags: ["SWOT", "analysis", "business strategy"],
          },
          {
            title: "Business Proposal",
            prompt:
              "Create a business proposal for a subscription-based meal preparation service that includes the value proposition for busy professionals, target market demographics, revenue model with pricing tiers, and initial investment required for kitchen facilities and delivery infrastructure.",
            tags: ["proposal", "business plan", "startup"],
          },
          {
            title: "Executive Summary",
            prompt:
              "Write an executive summary for a quarterly financial report that highlights the key findings of 15% revenue growth, recommendations for expanding into Asian markets, and business impact of new product line launches on overall company valuation.",
            tags: ["executive summary", "report", "business communication"],
          },
          {
            title: "Marketing Strategy",
            prompt:
              "Develop a marketing strategy for a premium fitness wearable targeting health-conscious professionals aged 25-45 with disposable income. Include digital marketing channels, influencer partnerships, and content marketing approaches.",
            tags: ["marketing", "strategy", "business"],
          },
          {
            title: "Financial Projection",
            prompt:
              "Create a 3-year financial projection for a boutique coffee shop with two locations, specialty roasting services, and a wholesale bean distribution channel to local restaurants. Include revenue streams, operating expenses, and growth assumptions.",
            tags: ["finance", "projection", "business planning"],
          },
        ],
        academic: [
          {
            title: "Research Question",
            prompt:
              "Formulate 3-5 research questions for a study on the psychological effects of social media usage among teenagers that address gaps in the current literature on digital well-being and mental health outcomes.",
            tags: ["research", "questions", "academic"],
          },
          {
            title: "Literature Review",
            prompt:
              "Create an outline for a literature review on climate change adaptation strategies in coastal communities, identifying key themes in infrastructure resilience, methodologies for vulnerability assessment, and findings from case studies in Southeast Asia and the Caribbean.",
            tags: ["literature review", "research", "academic writing"],
          },
          {
            title: "Abstract",
            prompt:
              "Write an academic abstract for a research paper on the effectiveness of mindfulness-based interventions for reducing workplace stress that includes the research question, methodology using randomized controlled trials, findings showing 28% reduction in reported stress levels, and implications for corporate wellness programs.",
            tags: ["abstract", "research paper", "academic writing"],
          },
          {
            title: "Thesis Statement",
            prompt:
              "Develop a strong thesis statement for a research paper about the impact of artificial intelligence on employment patterns in the manufacturing sector between 2010-2023, arguing that while automation has eliminated certain roles, it has created more specialized positions requiring advanced training.",
            tags: ["thesis", "research", "academic writing"],
          },
          {
            title: "Methodology Section",
            prompt:
              "Write a methodology section for a research study on the effectiveness of different teaching methods for second language acquisition using a mixed-methods approach combining classroom observation, standardized testing, and semi-structured interviews with both students and educators.",
            tags: ["methodology", "research", "academic"],
          },
        ],
        marketing: [
          {
            title: "Social Media Campaign",
            prompt:
              "Develop a social media campaign strategy for a sustainable clothing brand targeting environmentally conscious millennials. Include content themes around ethical manufacturing, posting schedule across Instagram and TikTok, and KPIs for engagement and conversion tracking.",
            tags: ["social media", "campaign", "marketing"],
          },
          {
            title: "Product Description",
            prompt:
              "Write a compelling product description for a premium noise-cancelling headphones that highlights its unique features like 36-hour battery life and adaptive sound technology, benefits for frequent travelers and remote workers, and value proposition justifying the $299 price point.",
            tags: ["product description", "copywriting", "marketing"],
          },
          {
            title: "Email Newsletter",
            prompt:
              "Create an engaging email newsletter about a summer sale for an outdoor gear retailer with a catchy subject line 'Adventure Awaits: 40% Off Your Summer Essentials', introduction highlighting limited-time offers, main content sections featuring camping, hiking, and water sports categories, and call-to-action for early access shopping.",
            tags: ["email", "newsletter", "marketing"],
          },
          {
            title: "Content Calendar",
            prompt:
              "Create a monthly content calendar for a fitness business focusing on New Year's resolutions and transformation stories, including blog topics, social media themes, video tutorials, and email campaigns that align with customer fitness journey stages.",
            tags: ["content", "calendar", "marketing planning"],
          },
          {
            title: "Brand Voice Guidelines",
            prompt:
              "Develop brand voice guidelines for a financial technology company that wants to appear trustworthy and innovative while making complex financial concepts accessible to young adults new to investing. Include tone examples for different communication channels and customer scenarios.",
            tags: ["brand voice", "guidelines", "branding"],
          },
        ],
        healthcare: [
          {
            title: "Patient Education Material",
            prompt:
              "Create patient-friendly educational material about Type 2 Diabetes that explains causes related to insulin resistance, common symptoms like increased thirst and fatigue, treatment options including lifestyle modifications and medication, and preventive measures focusing on diet and exercise in simple language for newly diagnosed patients.",
            tags: ["patient education", "medical", "healthcare"],
          },
          {
            title: "Clinical Case Summary",
            prompt:
              "Write a clinical case summary for a 58-year-old patient with hypertension including patient history of smoking and family cardiovascular disease, examination findings showing elevated blood pressure of 160/95 mmHg, diagnostic results from blood work and ECG, treatment plan with medication and lifestyle modifications, and follow-up recommendations for monitoring.",
            tags: ["clinical", "case summary", "medical"],
          },
          {
            title: "Health Protocol",
            prompt:
              "Develop a step-by-step protocol for healthcare providers managing patients with suspected COVID-19 in an outpatient setting, including assessment criteria for symptom severity, intervention guidelines for testing and home care instructions, and monitoring parameters for virtual follow-up appointments.",
            tags: ["protocol", "healthcare", "clinical guidelines"],
          },
          {
            title: "Medical Research Hypothesis",
            prompt:
              "Formulate a research hypothesis investigating the relationship between regular mindfulness meditation practice and reduced inflammatory markers in patients with chronic stress-related disorders, including potential mechanisms involving the HPA axis and clinical implications for integrative treatment approaches.",
            tags: ["research", "hypothesis", "medical"],
          },
          {
            title: "Health Promotion Campaign",
            prompt:
              "Design a health promotion campaign to increase awareness about the importance of HPV vaccination among parents of adolescents aged 11-14, addressing common misconceptions, highlighting cancer prevention benefits, and providing accessible information about vaccine safety and efficacy.",
            tags: ["health promotion", "campaign", "public health"],
          },
        ],
        legal: [
          {
            title: "Legal Brief",
            prompt:
              "Draft a legal brief arguing that the defendant's use of copyrighted material constitutes fair use under copyright law. Include relevant case law such as Campbell v. Acuff-Rose Music, statutory references to 17 U.S.C. § 107, and logical reasoning supporting transformative use and market impact considerations.",
            tags: ["legal brief", "argument", "law"],
          },
          {
            title: "Contract Clause",
            prompt:
              "Write a non-compete clause for a contract between a software development company and its senior engineer that addresses specific restrictions on working for direct competitors within a 50-mile radius for 12 months after employment termination, with clear, enforceable language that balances company interests and employee rights.",
            tags: ["contract", "clause", "legal writing"],
          },
          {
            title: "Legal Analysis Memo",
            prompt:
              "Prepare a legal analysis memorandum examining the legal implications of implementing a bring-your-own-device policy under California privacy laws. Include potential risks related to data security breaches, precedents from similar cases, and recommended actions for policy development and employee consent procedures.",
            tags: ["legal analysis", "memo", "law"],
          },
          {
            title: "Client Advisory Letter",
            prompt:
              "Draft a client advisory letter explaining recent changes to data protection regulations in the European Union and how these changes might impact e-commerce businesses targeting EU customers. Include practical recommendations for updating privacy policies, consent mechanisms, and data processing procedures to ensure compliance.",
            tags: ["advisory", "client letter", "legal"],
          },
          {
            title: "Legal Research Question",
            prompt:
              "Formulate a legal research question about the intersection of artificial intelligence and intellectual property law that addresses specific legal issues surrounding ownership of AI-generated creative works and the applicability of current copyright frameworks.",
            tags: ["legal research", "question", "law"],
          },
        ],
        education: [
          {
            title: "Lesson Plan",
            prompt:
              "Create a detailed lesson plan for teaching photosynthesis to 7th grade students. Include learning objectives covering energy transformation and plant anatomy, activities like a hands-on experiment with colored water and plants, materials needed including worksheets and live plants, assessment methods combining quiz and diagram labeling, and differentiation strategies for visual and kinesthetic learners.",
            tags: ["lesson plan", "teaching", "education"],
          },
          {
            title: "Student Assessment",
            prompt:
              "Design a comprehensive assessment for high school world history that evaluates students' understanding of the causes and effects of World War I. Include a mix of multiple choice questions on key events, short answer questions about political alliances, essay prompts analyzing long-term impacts, and a rubric for evaluating critical thinking and historical analysis skills.",
            tags: ["assessment", "evaluation", "education"],
          },
          {
            title: "Educational Activity",
            prompt:
              "Develop an engaging hands-on activity to teach basic coding concepts to 4th grade students. Include step-by-step instructions for creating a simple game using block-based programming, required materials like tablets or computers, expected outcomes demonstrating sequence and conditional logic understanding, and discussion questions to reinforce computational thinking skills.",
            tags: ["activity", "hands-on", "teaching"],
          },
          {
            title: "Parent Communication",
            prompt:
              "Write a communication to parents/guardians about an upcoming digital literacy initiative at the middle school. Provide clear information about the new technology tools being introduced, explain educational benefits for developing research and critical thinking skills, address potential concerns about screen time and online safety, and specify required actions for permission forms and home technology access.",
            tags: ["parent communication", "letter", "education"],
          },
          {
            title: "Curriculum Development",
            prompt:
              "Outline a curriculum for a semester-long course on environmental science for high school juniors and seniors. Include units on ecosystems, climate change, sustainable resource management, and conservation policy, with project-based assessments, field work components, and integration of current environmental data analysis.",
            tags: ["curriculum", "course design", "education"],
          },
        ],
        career: [
          {
            title: "Resume Writing",
            prompt:
              "How do I write an effective resume for a UX/UI designer position? Include key sections like portfolio highlights and design tools proficiency, formatting tips for showcasing visual skills, and examples of strong bullet points that demonstrate measurable impact of design solutions on user engagement and business metrics.",
            tags: ["resume", "CV", "job application"],
          },
          {
            title: "Cover Letter",
            prompt:
              "Write a cover letter template for a digital marketing specialist position that highlights relevant skills in SEO, content strategy, and analytics, with customizable sections to showcase specific campaign results and demonstrate knowledge of the target company's market positioning.",
            tags: ["cover letter", "job application", "career"],
          },
          {
            title: "Interview Preparation",
            prompt:
              "What are the most common interview questions for a project manager position and how should I answer them? Focus particularly on behavioral questions about handling difficult stakeholders, managing scope creep, and leading teams through challenging project phases.",
            tags: ["interview", "job", "career"],
          },
          {
            title: "Career Transition",
            prompt:
              "How can I transition from a career in traditional marketing to data analytics? What transferable skills should I highlight from my experience with market research, campaign performance tracking, and customer segmentation that would be valuable in a data-focused role?",
            tags: ["career change", "transition", "professional development"],
          },
          {
            title: "LinkedIn Profile",
            prompt:
              "How should I optimize my LinkedIn profile as a healthcare administrator to attract recruiters and opportunities? Include specific recommendations for the professional headline, about section, experience descriptions, and industry-specific keywords that will improve visibility in healthcare management searches.",
            tags: ["LinkedIn", "profile", "professional networking"],
          },
        ],
      },
      // Other languages would follow the same pattern
      es: {
        // Spanish templates
        general: [
          // Spanish general templates
        ],
        creative: [
          // Spanish creative templates
        ],
        technical: [
          // Spanish technical templates
        ],
        business: [
          // Spanish business templates
        ],
        academic: [
          // Spanish academic templates
        ],
        marketing: [
          // Spanish marketing templates
        ],
        healthcare: [
          // Spanish healthcare templates
        ],
        legal: [
          // Spanish legal templates
        ],
        education: [
          // Spanish education templates
        ],
        career: [
          // Spanish career templates
        ],
      },
      // Additional languages would be defined here
      fr: {
        general: [],
        creative: [],
        technical: [],
        business: [],
        academic: [],
        marketing: [],
        healthcare: [],
        legal: [],
        education: [],
        career: [],
      },
      de: {
        general: [],
        creative: [],
        technical: [],
        business: [],
        academic: [],
        marketing: [],
        healthcare: [],
        legal: [],
        education: [],
        career: [],
      },
      zh: {
        general: [],
        creative: [],
        technical: [],
        business: [],
        academic: [],
        marketing: [],
        healthcare: [],
        legal: [],
        education: [],
        career: [],
      },
      ja: {
        general: [],
        creative: [],
        technical: [],
        business: [],
        academic: [],
        marketing: [],
        healthcare: [],
        legal: [],
        education: [],
        career: [],
      },
      ar: {
        general: [],
        creative: [],
        technical: [],
        business: [],
        academic: [],
        marketing: [],
        healthcare: [],
        legal: [],
        education: [],
        career: [],
      },
      hi: {
        general: [],
        creative: [],
        technical: [],
        business: [],
        academic: [],
        marketing: [],
        healthcare: [],
        legal: [],
        education: [],
        career: [],
      },
      ur: {
        general: [],
        creative: [],
        technical: [],
        business: [],
        academic: [],
        marketing: [],
        healthcare: [],
        legal: [],
        education: [],
        career: [],
      },
      te: {
        general: [],
        creative: [],
        technical: [],
        business: [],
        academic: [],
        marketing: [],
        healthcare: [],
        legal: [],
        education: [],
        career: [],
      },
      ta: {
        general: [],
        creative: [],
        technical: [],
        business: [],
        academic: [],
        marketing: [],
        healthcare: [],
        legal: [],
        education: [],
        career: [],
      },
    }

    return templates[language as Language] || templates.en
  } catch (error) {
    console.error("Error getting localized templates:", error)
    // Return English templates as fallback
    return {
      general: [],
      creative: [],
      technical: [],
      business: [],
      academic: [],
      marketing: [],
      healthcare: [],
      legal: [],
      education: [],
      career: [],
    }
  }
}

// Get all templates as a flat array
export function getAllTemplates(language: string): PromptTemplate[] {
  const templateCategories = getLocalizedTemplates(language)
  const allTemplates: PromptTemplate[] = []

  for (const [category, templates] of Object.entries(templateCategories)) {
    // Add category to each template
    const templatesWithCategory = templates.map((template) => ({
      ...template,
      category,
    }))

    allTemplates.push(...templatesWithCategory)
  }

  return allTemplates
}
