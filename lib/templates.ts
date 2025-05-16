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
            prompt: "What is [topic]?",
            tags: ["basic", "question", "definition"],
          },
          {
            title: "Detailed Explanation",
            prompt: "Explain [concept] in detail, including its history, applications, and limitations.",
            tags: ["explanation", "detailed", "comprehensive"],
          },
          {
            title: "Pros and Cons",
            prompt: "What are the advantages and disadvantages of [topic]?",
            tags: ["analysis", "comparison", "evaluation"],
          },
          {
            title: "Step-by-Step Guide",
            prompt: "Provide a step-by-step guide on how to [task].",
            tags: ["guide", "instructions", "how-to"],
          },
          {
            title: "Examples and Applications",
            prompt: "Give me practical examples and real-world applications of [concept].",
            tags: ["examples", "practical", "applications"],
          },
        ],
        creative: [
          {
            title: "Short Story",
            prompt:
              "Write a short story about [topic] with the following elements: [element1], [element2], [element3].",
            tags: ["story", "fiction", "creative writing"],
          },
          {
            title: "Poem",
            prompt: "Write a poem about [topic] in the style of [poet].",
            tags: ["poetry", "creative", "artistic"],
          },
          {
            title: "Character Creation",
            prompt: "Create a detailed character profile for a [character type] in a [setting/genre] story.",
            tags: ["character", "profile", "fiction"],
          },
          {
            title: "Plot Outline",
            prompt: "Develop a plot outline for a [genre] story involving [theme/element].",
            tags: ["plot", "outline", "story structure"],
          },
          {
            title: "Dialogue Writing",
            prompt: "Write a dialogue between two characters who [relationship/situation].",
            tags: ["dialogue", "conversation", "characters"],
          },
        ],
        technical: [
          {
            title: "Code Generation",
            prompt: "Write a [language] function that [functionality]. Include comments explaining the code.",
            tags: ["code", "programming", "function"],
          },
          {
            title: "Data Analysis",
            prompt: "Analyze the following data and provide insights: [data]",
            tags: ["data", "analysis", "insights"],
          },
          {
            title: "Algorithm Explanation",
            prompt: "Explain how the [algorithm name] algorithm works, its time complexity, and use cases.",
            tags: ["algorithm", "complexity", "computer science"],
          },
          {
            title: "Technical Troubleshooting",
            prompt: "I'm experiencing [issue] with my [technology]. What are the possible causes and solutions?",
            tags: ["troubleshooting", "debugging", "technical support"],
          },
          {
            title: "System Architecture",
            prompt: "Design a system architecture for [application type] that needs to handle [requirements].",
            tags: ["architecture", "design", "systems"],
          },
        ],
        business: [
          {
            title: "SWOT Analysis",
            prompt:
              "Perform a SWOT analysis for [company/product], identifying key strengths, weaknesses, opportunities, and threats.",
            tags: ["SWOT", "analysis", "business strategy"],
          },
          {
            title: "Business Proposal",
            prompt:
              "Create a business proposal for [business idea] that includes the value proposition, target market, revenue model, and initial investment required.",
            tags: ["proposal", "business plan", "startup"],
          },
          {
            title: "Executive Summary",
            prompt:
              "Write an executive summary for [project/report] that highlights the key findings, recommendations, and business impact.",
            tags: ["executive summary", "report", "business communication"],
          },
          {
            title: "Marketing Strategy",
            prompt: "Develop a marketing strategy for [product/service] targeting [audience].",
            tags: ["marketing", "strategy", "business"],
          },
          {
            title: "Financial Projection",
            prompt: "Create a 3-year financial projection for a [business type] with [specific characteristics].",
            tags: ["finance", "projection", "business planning"],
          },
        ],
        academic: [
          {
            title: "Research Question",
            prompt:
              "Formulate 3-5 research questions for a study on [topic] that address gaps in the current literature.",
            tags: ["research", "questions", "academic"],
          },
          {
            title: "Literature Review",
            prompt:
              "Create an outline for a literature review on [topic], identifying key themes, methodologies, and findings from existing research.",
            tags: ["literature review", "research", "academic writing"],
          },
          {
            title: "Abstract",
            prompt:
              "Write an academic abstract for a research paper on [topic] that includes the research question, methodology, findings, and implications.",
            tags: ["abstract", "research paper", "academic writing"],
          },
          {
            title: "Thesis Statement",
            prompt: "Develop a strong thesis statement for a research paper about [topic].",
            tags: ["thesis", "research", "academic writing"],
          },
          {
            title: "Methodology Section",
            prompt: "Write a methodology section for a research study on [topic] using [research method].",
            tags: ["methodology", "research", "academic"],
          },
        ],
        marketing: [
          {
            title: "Social Media Campaign",
            prompt:
              "Develop a social media campaign strategy for [product/service] targeting [audience]. Include content themes, posting schedule, and KPIs.",
            tags: ["social media", "campaign", "marketing"],
          },
          {
            title: "Product Description",
            prompt:
              "Write a compelling product description for [product] that highlights its unique features, benefits, and value proposition for [target audience].",
            tags: ["product description", "copywriting", "marketing"],
          },
          {
            title: "Email Newsletter",
            prompt:
              "Create an engaging email newsletter about [topic/product] with a catchy subject line, introduction, main content sections, and call-to-action.",
            tags: ["email", "newsletter", "marketing"],
          },
          {
            title: "Content Calendar",
            prompt: "Create a monthly content calendar for a [industry] business focusing on [theme/goal].",
            tags: ["content", "calendar", "marketing planning"],
          },
          {
            title: "Brand Voice Guidelines",
            prompt: "Develop brand voice guidelines for a [industry] company that wants to appear [desired traits].",
            tags: ["brand voice", "guidelines", "branding"],
          },
        ],
        healthcare: [
          {
            title: "Patient Education Material",
            prompt:
              "Create patient-friendly educational material about [medical condition] that explains causes, symptoms, treatment options, and preventive measures in simple language.",
            tags: ["patient education", "medical", "healthcare"],
          },
          {
            title: "Clinical Case Summary",
            prompt:
              "Write a clinical case summary for a patient with [condition] including patient history, examination findings, diagnostic results, treatment plan, and follow-up recommendations.",
            tags: ["clinical", "case summary", "medical"],
          },
          {
            title: "Health Protocol",
            prompt:
              "Develop a step-by-step protocol for healthcare providers managing patients with [condition/situation], including assessment criteria, intervention guidelines, and monitoring parameters.",
            tags: ["protocol", "healthcare", "clinical guidelines"],
          },
          {
            title: "Medical Research Hypothesis",
            prompt:
              "Formulate a research hypothesis investigating the relationship between [factor A] and [health outcome B], including potential mechanisms and clinical implications.",
            tags: ["research", "hypothesis", "medical"],
          },
          {
            title: "Health Promotion Campaign",
            prompt:
              "Design a health promotion campaign to increase awareness about [health issue] among [target population].",
            tags: ["health promotion", "campaign", "public health"],
          },
        ],
        legal: [
          {
            title: "Legal Brief",
            prompt:
              "Draft a legal brief arguing [position] regarding [legal issue]. Include relevant case law, statutory references, and logical reasoning to support your argument.",
            tags: ["legal brief", "argument", "law"],
          },
          {
            title: "Contract Clause",
            prompt:
              "Write a [type] clause for a contract between [party A] and [party B] that addresses [specific issue/risk] with clear, enforceable language.",
            tags: ["contract", "clause", "legal writing"],
          },
          {
            title: "Legal Analysis Memo",
            prompt:
              "Prepare a legal analysis memorandum examining the legal implications of [situation/action] under [relevant jurisdiction/law]. Include potential risks, precedents, and recommended actions.",
            tags: ["legal analysis", "memo", "law"],
          },
          {
            title: "Client Advisory Letter",
            prompt:
              "Draft a client advisory letter explaining recent changes to [area of law] and how these changes might impact clients in [industry/situation]. Include practical recommendations for compliance.",
            tags: ["advisory", "client letter", "legal"],
          },
          {
            title: "Legal Research Question",
            prompt: "Formulate a legal research question about [legal topic] that addresses [specific legal issue].",
            tags: ["legal research", "question", "law"],
          },
        ],
        education: [
          {
            title: "Lesson Plan",
            prompt:
              "Create a detailed lesson plan for teaching [subject/topic] to [grade/level] students. Include learning objectives, activities, materials needed, assessment methods, and differentiation strategies for diverse learners.",
            tags: ["lesson plan", "teaching", "education"],
          },
          {
            title: "Student Assessment",
            prompt:
              "Design a comprehensive assessment for [subject/topic] that evaluates students' understanding of [key concepts]. Include a mix of question types (multiple choice, short answer, essay) and a rubric for evaluation.",
            tags: ["assessment", "evaluation", "education"],
          },
          {
            title: "Educational Activity",
            prompt:
              "Develop an engaging hands-on activity to teach [concept] to [age/grade] students. Include step-by-step instructions, required materials, expected outcomes, and discussion questions to reinforce learning.",
            tags: ["activity", "hands-on", "teaching"],
          },
          {
            title: "Parent Communication",
            prompt:
              "Write a communication to parents/guardians about [educational topic/issue/event]. Provide clear information, explain educational benefits, address potential concerns, and specify any required actions.",
            tags: ["parent communication", "letter", "education"],
          },
          {
            title: "Curriculum Development",
            prompt: "Outline a curriculum for a [duration] course on [subject] for [level] students.",
            tags: ["curriculum", "course design", "education"],
          },
        ],
        career: [
          {
            title: "Resume Writing",
            prompt:
              "How do I write an effective resume for a [job title] position? Include key sections, formatting tips, and examples of strong bullet points.",
            tags: ["resume", "CV", "job application"],
          },
          {
            title: "Cover Letter",
            prompt:
              "Write a cover letter template for a [job title] position that highlights relevant skills and experience.",
            tags: ["cover letter", "job application", "career"],
          },
          {
            title: "Interview Preparation",
            prompt:
              "What are the most common interview questions for a [job title] position and how should I answer them?",
            tags: ["interview", "job", "career"],
          },
          {
            title: "Career Transition",
            prompt:
              "How can I transition from a career in [current field] to [target field]? What transferable skills should I highlight?",
            tags: ["career change", "transition", "professional development"],
          },
          {
            title: "LinkedIn Profile",
            prompt:
              "How should I optimize my LinkedIn profile as a [profession] to attract recruiters and opportunities?",
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
