// Prompt analysis utilities
export type PromptAnalysis = {
  score: number // 0-100
  categoryScores: {
    clarity: number
    specificity: number
    context: number
    length: number
  }
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  promptType: string
  suggestedTemplates: string[] // Category names
  improvedPrompts: string[] // For improved prompt suggestions
  relevantTemplates: PromptTemplate[] // New field for specific template suggestions
}

export interface PromptTemplate {
  title: string
  prompt: string
  category?: string
  tags?: string[]
}

export function analyzePrompt(prompt: string, allTemplates: Record<string, PromptTemplate[]>): PromptAnalysis {
  if (!prompt || typeof prompt !== "string") {
    return {
      score: 0,
      categoryScores: {
        clarity: 0,
        specificity: 0,
        context: 0,
        length: 0,
      },
      strengths: [],
      weaknesses: ["No prompt provided"],
      suggestions: ["Please enter a prompt to analyze"],
      promptType: "none",
      suggestedTemplates: [],
      improvedPrompts: [],
      relevantTemplates: [],
    }
  }

  const analysis: PromptAnalysis = {
    score: 0,
    categoryScores: {
      clarity: 50,
      specificity: 50,
      context: 50,
      length: 50,
    },
    strengths: [],
    weaknesses: [],
    suggestions: [],
    promptType: "general",
    suggestedTemplates: ["general"],
    improvedPrompts: [],
    relevantTemplates: [],
  }

  // Check prompt length
  if (prompt.length < 10) {
    analysis.weaknesses.push("Prompt is too short")
    analysis.suggestions.push("Expand your prompt to provide more context")
    analysis.categoryScores.length = 25
  } else if (prompt.length > 20 && prompt.length < 100) {
    analysis.strengths.push("Good prompt length")
    analysis.categoryScores.length = 75
  } else if (prompt.length >= 100) {
    analysis.strengths.push("Excellent prompt length with detailed information")
    analysis.categoryScores.length = 100
  }

  // Check for clarity
  if (prompt.includes("?")) {
    analysis.strengths.push("Includes a clear question")
    analysis.categoryScores.clarity = 75

    // Check for multiple questions which could reduce clarity
    const questionCount = (prompt.match(/\?/g) || []).length
    if (questionCount > 3) {
      analysis.weaknesses.push("Contains too many questions which may reduce focus")
      analysis.suggestions.push("Consider focusing on fewer, more specific questions")
      analysis.categoryScores.clarity = 50
    }
  } else {
    analysis.weaknesses.push("No clear question")
    analysis.suggestions.push("Consider framing your prompt as a question")
    analysis.categoryScores.clarity = 25
  }

  // Check for specificity
  const specificWords = ["specifically", "exactly", "precisely", "detailed", "particular", "define", "explain"]
  const specificWordCount = specificWords.filter((word) => prompt.toLowerCase().includes(word)).length

  if (specificWordCount > 0) {
    analysis.strengths.push("Uses specific language")
    analysis.categoryScores.specificity = 50 + specificWordCount * 10
    if (analysis.categoryScores.specificity > 100) analysis.categoryScores.specificity = 100
  } else {
    analysis.suggestions.push("Add specific details to get more precise responses")
    analysis.categoryScores.specificity = 40
  }

  // Check for context
  const wordCount = prompt.split(/\s+/).length
  if (wordCount > 15) {
    analysis.strengths.push("Provides good context")
    analysis.categoryScores.context = 75

    if (wordCount > 30) {
      analysis.strengths.push("Provides excellent detailed context")
      analysis.categoryScores.context = 100
    }
  } else {
    analysis.weaknesses.push("Limited context")
    analysis.suggestions.push("Add more context to help the AI understand your request")
    analysis.categoryScores.context = 25
  }

  // Calculate overall score based on category scores
  analysis.score = Math.round(
    (analysis.categoryScores.clarity +
      analysis.categoryScores.specificity +
      analysis.categoryScores.context +
      analysis.categoryScores.length) /
      4,
  )

  // Identify prompt type and suggest templates
  identifyPromptTypeAndSuggestTemplates(prompt, analysis)

  // Generate improved prompts based on the user's input
  generateImprovedPrompts(prompt, analysis)

  // Find relevant templates based on the user's specific prompt
  findRelevantTemplates(prompt, analysis, allTemplates)

  return analysis
}

// Function to identify prompt type and suggest templates (existing function)
function identifyPromptTypeAndSuggestTemplates(prompt: string, analysis: PromptAnalysis) {
  const promptLower = prompt.toLowerCase()

  // Creative writing patterns
  const creativePatterns = [
    "write a story",
    "poem",
    "creative",
    "fiction",
    "narrative",
    "tale",
    "novel",
    "script",
    "screenplay",
    "dialogue",
    "character",
    "plot",
    "setting",
    "scene",
    "write about",
    "imagine",
    "fantasy",
    "sci-fi",
    "science fiction",
    "horror",
  ]

  // Technical patterns
  const technicalPatterns = [
    "code",
    "function",
    "algorithm",
    "programming",
    "software",
    "develop",
    "technical",
    "technology",
    "engineering",
    "system",
    "data",
    "analysis",
    "javascript",
    "python",
    "java",
    "c++",
    "html",
    "css",
    "sql",
    "database",
    "api",
    "framework",
    "library",
    "debug",
    "error",
    "fix",
    "implement",
  ]

  // Business patterns
  const businessPatterns = [
    "business",
    "company",
    "corporate",
    "strategy",
    "market",
    "marketing",
    "sales",
    "customer",
    "client",
    "product",
    "service",
    "revenue",
    "profit",
    "startup",
    "entrepreneur",
    "management",
    "leadership",
    "team",
    "organization",
    "swot",
    "analysis",
    "plan",
    "proposal",
    "pitch",
    "presentation",
  ]

  // Academic patterns
  const academicPatterns = [
    "research",
    "study",
    "academic",
    "paper",
    "thesis",
    "dissertation",
    "essay",
    "literature",
    "review",
    "analysis",
    "theory",
    "concept",
    "hypothesis",
    "experiment",
    "methodology",
    "results",
    "findings",
    "conclusion",
    "discussion",
    "citation",
    "reference",
    "bibliography",
    "scholarly",
    "journal",
    "publication",
  ]

  // Healthcare patterns
  const healthcarePatterns = [
    "health",
    "medical",
    "medicine",
    "patient",
    "doctor",
    "nurse",
    "hospital",
    "clinic",
    "treatment",
    "therapy",
    "diagnosis",
    "symptom",
    "disease",
    "condition",
    "healthcare",
    "wellness",
    "prevention",
    "care",
    "pharmaceutical",
    "drug",
  ]

  // Legal patterns
  const legalPatterns = [
    "legal",
    "law",
    "attorney",
    "lawyer",
    "court",
    "judge",
    "case",
    "lawsuit",
    "contract",
    "agreement",
    "clause",
    "regulation",
    "compliance",
    "statute",
    "legislation",
    "rights",
    "liability",
    "plaintiff",
    "defendant",
    "jurisdiction",
  ]

  // Education patterns
  const educationPatterns = [
    "education",
    "teaching",
    "learning",
    "student",
    "teacher",
    "school",
    "classroom",
    "lesson",
    "curriculum",
    "instruction",
    "assessment",
    "evaluation",
    "grade",
    "course",
    "subject",
    "topic",
    "lecture",
    "assignment",
    "homework",
    "exam",
  ]

  // Marketing patterns
  const marketingPatterns = [
    "marketing",
    "advertisement",
    "campaign",
    "brand",
    "branding",
    "promotion",
    "social media",
    "content",
    "audience",
    "target",
    "demographic",
    "consumer",
    "customer",
    "engagement",
    "conversion",
    "funnel",
    "seo",
    "analytics",
    "metrics",
  ]

  // Career patterns
  const careerPatterns = [
    "resume",
    "cv",
    "curriculum vitae",
    "job",
    "career",
    "interview",
    "employment",
    "hiring",
    "recruit",
    "skill",
    "experience",
    "qualification",
    "professional",
    "work",
    "position",
    "application",
    "cover letter",
    "linkedin",
    "portfolio",
  ]

  // Check for matches in each category
  const matches = {
    creative: creativePatterns.filter((pattern) => promptLower.includes(pattern)).length,
    technical: technicalPatterns.filter((pattern) => promptLower.includes(pattern)).length,
    business: businessPatterns.filter((pattern) => promptLower.includes(pattern)).length,
    academic: academicPatterns.filter((pattern) => promptLower.includes(pattern)).length,
    healthcare: healthcarePatterns.filter((pattern) => promptLower.includes(pattern)).length,
    legal: legalPatterns.filter((pattern) => promptLower.includes(pattern)).length,
    education: educationPatterns.filter((pattern) => promptLower.includes(pattern)).length,
    marketing: marketingPatterns.filter((pattern) => promptLower.includes(pattern)).length,
    career: careerPatterns.filter((pattern) => promptLower.includes(pattern)).length,
  }

  // Find the category with the most matches
  let maxMatches = 0
  let primaryCategory = "general"

  for (const [category, count] of Object.entries(matches)) {
    if (count > maxMatches) {
      maxMatches = count
      primaryCategory = category
    }
  }

  // Only set a specific category if we have enough matches
  if (maxMatches >= 2) {
    analysis.promptType = primaryCategory
    analysis.suggestedTemplates = [primaryCategory]

    // Add secondary suggestions (categories with at least half as many matches as the primary)
    for (const [category, count] of Object.entries(matches)) {
      if (category !== primaryCategory && count >= Math.max(1, maxMatches / 2)) {
        analysis.suggestedTemplates.push(category)
      }
    }
  }

  // Always include general as a fallback if we don't have many specific suggestions
  if (analysis.suggestedTemplates.length < 2) {
    if (!analysis.suggestedTemplates.includes("general")) {
      analysis.suggestedTemplates.push("general")
    }
  }

  // Limit to top 3 suggestions
  analysis.suggestedTemplates = analysis.suggestedTemplates.slice(0, 3)
}

// Function to generate improved prompts (existing function)
function generateImprovedPrompts(prompt: string, analysis: PromptAnalysis) {
  // Don't generate suggestions for very short prompts
  if (prompt.length < 5) return

  const improvedPrompts: string[] = []

  // Fix basic grammar issues first
  const cleanedPrompt = fixBasicGrammar(prompt)

  // Detect the intent type of the prompt
  const intentType = detectPromptIntent(cleanedPrompt)

  // Extract key components from the prompt
  const { subject, action, context } = extractPromptComponents(cleanedPrompt)

  // Add clarity improvements
  if (analysis.categoryScores.clarity < 70) {
    improvedPrompts.push(addClarityToPrompt(cleanedPrompt, subject, action))
  }

  // Add specificity improvements
  if (analysis.categoryScores.specificity < 70) {
    improvedPrompts.push(addSpecificityToPrompt(cleanedPrompt, subject, action, intentType))
  }

  // Add structure improvements
  improvedPrompts.push(addStructureToPrompt(cleanedPrompt, intentType))

  // Add context improvements
  if (analysis.categoryScores.context < 70) {
    improvedPrompts.push(addContextToPrompt(cleanedPrompt, subject, intentType))
  }

  // Add format specification
  improvedPrompts.push(addFormatSpecification(cleanedPrompt, intentType))

  // Filter out invalid or duplicate prompts
  const validatedPrompts = improvedPrompts
    .filter((p) => p && p.trim().length > 0)
    .filter((p, i, self) => self.indexOf(p) === i) // Remove duplicates
    .filter((p) => isActualImprovement(cleanedPrompt, p))

  // Limit to 5 suggestions
  analysis.improvedPrompts = validatedPrompts.slice(0, 5)
}

// New function to find relevant templates based on the user's specific prompt
function findRelevantTemplates(
  prompt: string,
  analysis: PromptAnalysis,
  allTemplates: Record<string, PromptTemplate[]>,
) {
  // Extract key components from the prompt
  const { subject, action, context: _unusedContext } = extractPromptComponents(prompt); // Ensured state
  const intentType = detectPromptIntent(prompt)

  // Create a list of keywords from the prompt
  const keywords = extractKeywords(prompt, subject, action)

  // Score all templates based on relevance to the user's prompt
  const scoredTemplates: Array<{ template: PromptTemplate; score: number }> = []

  // Process templates from all categories
  for (const [category, templates] of Object.entries(allTemplates)) {
    // Give a small boost to templates from the detected prompt type category
    const categoryBoost = analysis.suggestedTemplates.includes(category) ? 0.2 : 0

    for (const template of templates) {
      // Calculate relevance score
      const score = calculateTemplateRelevance(template, keywords, intentType, categoryBoost)

      // Add category to template for reference
      const templateWithCategory = {
        ...template,
        category,
      }

      scoredTemplates.push({
        template: templateWithCategory,
        score,
      })
    }
  }

  // Sort templates by relevance score (highest first)
  scoredTemplates.sort((a, b) => b.score - a.score)

  // Take the top 5 most relevant templates
  analysis.relevantTemplates = scoredTemplates.slice(0, 5).map((item) => item.template)

  // If we couldn't find relevant templates, generate some on-the-fly
  if (analysis.relevantTemplates.length < 3 && subject) {
    const generatedTemplates = generateCustomTemplates(subject, action, intentType)

    // Add generated templates and ensure we don't exceed 5 total
    analysis.relevantTemplates = [...analysis.relevantTemplates, ...generatedTemplates].slice(0, 5)
  }
}

// Extract keywords from the prompt
function extractKeywords(prompt: string, subject: string, action: string): string[] {
  const keywords: string[] = []

  // Add the subject and action as keywords
  if (subject) {
    keywords.push(subject)
    // Also add individual words from multi-word subjects
    subject.split(/\s+/).forEach((word) => {
      if (word.length > 3) keywords.push(word.toLowerCase())
    })
  }

  if (action) {
    keywords.push(action)
  }

  // Extract additional keywords from the prompt
  const words = prompt.toLowerCase().split(/\s+/)

  // Filter out common words and keep only meaningful ones
  const meaningfulWords = words.filter(
    (word) =>
      word.length > 3 &&
      ![
        "what",
        "when",
        "where",
        "which",
        "who",
        "whom",
        "whose",
        "why",
        "how",
        "the",
        "and",
        "but",
        "for",
        "nor",
        "yet",
        "so",
        "such",
        "that",
        "than",
        "this",
        "these",
        "those",
        "with",
        "from",
        "about",
        "into",
        "upon",
        "onto",
        "have",
        "has",
        "had",
        "been",
        "being",
        "would",
        "could",
        "should",
        "will",
        "shall",
        "might",
        "must",
        "may",
        "can",
        "your",
        "their",
        "they",
        "them",
        "some",
        "many",
        "much",
        "most",
        "more",
        "please",
        "provide",
        "tell",
        "give",
      ].includes(word),
  )

  // Add these words to keywords
  meaningfulWords.forEach((word) => {
    if (!keywords.includes(word)) {
      keywords.push(word)
    }
  })

  return keywords
}

// Calculate relevance score for a template
function calculateTemplateRelevance(
  template: PromptTemplate,
  keywords: string[],
  intentType: string,
  categoryBoost: number,
): number {
  let score = 0
  const templateLower = template.prompt.toLowerCase()

  // Check for keyword matches in the template
  for (const keyword of keywords) {
    if (templateLower.includes(keyword.toLowerCase())) {
      // Give more weight to longer keywords (likely more specific)
      score += 0.1 * keyword.length
    }
  }

  // Check for intent type match
  if (
    intentType === "how-to" &&
    (templateLower.includes("how to") || templateLower.includes("steps") || templateLower.includes("guide"))
  ) {
    score += 0.5
  } else if (intentType === "explanation" && (templateLower.includes("explain") || templateLower.includes("what is"))) {
    score += 0.5
  } else if (intentType === "creative" && (templateLower.includes("write a") || templateLower.includes("create"))) {
    score += 0.5
  } else if (
    intentType === "comparison" &&
    (templateLower.includes("compare") || templateLower.includes("versus") || templateLower.includes("vs"))
  ) {
    score += 0.5
  } else if (
    intentType === "career" &&
    (templateLower.includes("resume") || templateLower.includes("job") || templateLower.includes("career"))
  ) {
    score += 0.5
  }

  // Add the category boost
  score += categoryBoost

  // Adjust score based on template complexity
  // Prefer templates that are neither too simple nor too complex
  const wordCount = template.prompt.split(/\s+/).length
  if (wordCount > 5 && wordCount < 30) {
    score += 0.2
  } else if (wordCount >= 30) {
    score -= 0.1
  }

  return score
}

// Generate custom templates based on the user's prompt
function generateCustomTemplates(subject: string, action: string, intentType: string): PromptTemplate[] {
  const templates: PromptTemplate[] = []

  if (intentType === "how-to" && action) {
    templates.push({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Guide`,
      prompt: `What are the step-by-step instructions to ${action} ${subject}? Please include any necessary tools and common mistakes to avoid.`,
      category: "custom",
    })

    templates.push({
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Best Practices`,
      prompt: `What are the best practices and expert tips for ${action} ${subject}? Please provide examples and case studies.`,
      category: "custom",
    })
  } else if (intentType === "explanation" && subject) {
    templates.push({
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Explanation`,
      prompt: `Explain ${subject} in detail, including its key components, how it works, and real-world applications.`,
      category: "custom",
    })

    templates.push({
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Comprehensive Guide`,
      prompt: `What is ${subject}? Please provide a comprehensive explanation with examples, history, current applications, and future trends.`,
      category: "custom",
    })
  } else if (intentType === "creative" && subject) {
    templates.push({
      title: `Creative ${subject.charAt(0).toUpperCase() + subject.slice(1)}`,
      prompt: `Write a creative piece about ${subject} with vivid descriptions, engaging characters, and an unexpected twist.`,
      category: "custom",
    })
  } else if (intentType === "comparison" && subject) {
    // Try to extract two items being compared
    const items = subject.split(/\s+and\s+|\s+vs\.?\s+|\s+versus\s+/)
    if (items.length === 2) {
      templates.push({
        title: `${items[0]} vs ${items[1]} Comparison`,
        prompt: `Compare and contrast ${items[0]} and ${items[1]} in terms of their features, advantages, disadvantages, and ideal use cases.`,
        category: "custom",
      })
    } else {
      templates.push({
        title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Comparison`,
        prompt: `What are the key factors to consider when comparing different ${subject}? Please provide a structured analysis.`,
        category: "custom",
      })
    }
  } else if (intentType === "career" && subject) {
    if (subject.toLowerCase().includes("resume") || subject.toLowerCase().includes("cv")) {
      templates.push({
        title: "Resume Writing Guide",
        prompt: `What are the most effective strategies for writing a compelling resume? Include specific sections, formatting tips, and examples of strong bullet points.`,
        category: "custom",
      })
    } else if (subject.toLowerCase().includes("interview")) {
      templates.push({
        title: "Interview Preparation",
        prompt: `What are the most effective strategies to prepare for a job interview? Include how to research the company, prepare for common questions, and demonstrate value.`,
        category: "custom",
      })
    } else {
      templates.push({
        title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Career Advice`,
        prompt: `What are the most effective strategies for advancing in a ${subject} career? Include both short-term tactics and long-term planning.`,
        category: "custom",
      })
    }
  } else if (subject) {
    // Generic templates for other intent types
    templates.push({
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Insights`,
      prompt: `What are the most important things to know about ${subject}? Please provide a comprehensive and structured response.`,
      category: "custom",
    })
  }

  return templates
}

// Fix basic grammar issues (existing function)
function fixBasicGrammar(prompt: string): string {
  let fixed = prompt.trim()

  // Fix missing "how" in "explain you" patterns
  fixed = fixed.replace(/explain you /i, "explain how you ")
  fixed = fixed.replace(/explain you write/i, "explain how to write")

  // Fix missing articles
  fixed = fixed.replace(/explain ([\w]+)( |$)/i, (match, word, space) => {
    // Don't add articles before certain words
    if (["how", "why", "when", "where", "who", "what"].includes(word.toLowerCase())) {
      return match
    }
    return `explain a ${word}${space}`
  })

  // Fix capitalization at the beginning
  if (fixed.length > 0) {
    fixed = fixed.charAt(0).toUpperCase() + fixed.slice(1)
  }

  // Add missing question marks
  if (
    (fixed.match(/^(what|how|why|when|where|who|can|could|would|should|is|are|do|does)/i) ||
      fixed.match(/^(explain|tell me|describe)/i)) &&
    !fixed.endsWith("?") &&
    !fixed.endsWith(".") &&
    !fixed.endsWith("!")
  ) {
    fixed += "?"
  }

  return fixed
}

// Helper function to detect the intent of a prompt (existing function)
function detectPromptIntent(prompt: string): string {
  const promptLower = prompt.toLowerCase()

  // How-to patterns
  if (
    promptLower.includes("how to") ||
    promptLower.includes("how do i") ||
    promptLower.includes("steps to") ||
    promptLower.includes("guide for") ||
    promptLower.includes("tutorial") ||
    promptLower.match(/ways? to/i) ||
    promptLower.match(/tips? for/i)
  ) {
    return "how-to"
  }

  // Explanation patterns
  if (
    promptLower.includes("explain") ||
    promptLower.includes("what is") ||
    promptLower.includes("define") ||
    promptLower.includes("describe") ||
    promptLower.includes("tell me about") ||
    promptLower.includes("concept of")
  ) {
    return "explanation"
  }

  // Creative patterns
  if (
    promptLower.includes("write a story") ||
    promptLower.includes("create a") ||
    promptLower.includes("generate a") ||
    promptLower.includes("poem") ||
    promptLower.includes("fiction") ||
    promptLower.includes("imagine")
  ) {
    return "creative"
  }

  // Comparison patterns
  if (
    promptLower.includes("compare") ||
    promptLower.includes("difference between") ||
    promptLower.includes("versus") ||
    promptLower.includes(" vs ") ||
    promptLower.includes("similarities") ||
    promptLower.includes("differences")
  ) {
    return "comparison"
  }

  // Opinion patterns
  if (
    promptLower.includes("opinion") ||
    promptLower.includes("thoughts on") ||
    promptLower.includes("do you think") ||
    promptLower.includes("what do you think") ||
    promptLower.includes("perspective on") ||
    promptLower.includes("view on")
  ) {
    return "opinion"
  }

  // Career patterns
  if (
    promptLower.includes("resume") ||
    promptLower.includes("cv") ||
    promptLower.includes("job application") ||
    promptLower.includes("cover letter") ||
    promptLower.includes("interview") ||
    promptLower.includes("career advice") ||
    promptLower.includes("linkedin")
  ) {
    return "career"
  }

  // Default to general
  return "general"
}

// Extract key components from the prompt (existing function)
function extractPromptComponents(prompt: string): { subject: string; action: string; context: string } {
  const promptLower = prompt.toLowerCase()
  let subject = ""
  let action = ""
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let context = ""

  // Extract subject for different prompt types
  if (promptLower.includes("how to")) {
    const match = promptLower.match(/how to ([\w\s]+)(?:\?|$|\.)/i)
    action = match ? match[1].trim() : ""
    subject = action
  } else if (promptLower.match(/what is|explain|tell me about|describe/i)) {
    const match = promptLower.match(/(?:what is|explain|tell me about|describe) (?:a |an |the )?([\w\s]+)(?:\?|$|\.)/i)
    subject = match ? match[1].trim() : ""
  } else if (promptLower.includes("write a")) {
    const match = promptLower.match(/write a(?:n)? ([\w\s]+)(?:\?|$|\.)/i)
    subject = match ? match[1].trim() : ""
    action = "write"
  } else if (promptLower.includes("compare")) {
    const match = promptLower.match(
      /compare (?:a |an |the )?([\w\s]+) (?:to|and|with) (?:a |an |the )?([\w\s]+)(?:\?|$|\.)/i,
    )
    if (match) {
      subject = `${match[1].trim()} and ${match[2].trim()}`
      action = "compare"
    }
  } else {
    // Default extraction for other types
    const words = prompt.split(/\s+/)
    const filteredWords = words.filter(
      (word) =>
        ![
          "what",
          "how",
          "why",
          "when",
          "where",
          "who",
          "is",
          "are",
          "do",
          "does",
          "can",
          "could",
          "would",
          "should",
          "the",
          "a",
          "an",
          "about",
          "tell",
          "me",
          "explain",
          "describe",
        ].includes(word.toLowerCase()),
    )
    subject = filteredWords.slice(0, Math.min(3, filteredWords.length)).join(" ")
  }

  // Extract any context (additional qualifiers or specifications)
  const contextPatterns = [
    /for ([\w\s]+) purposes/i,
    /in the context of ([\w\s]+)/i,
    /with respect to ([\w\s]+)/i,
    /in ([\w\s]+) field/i,
    /for ([\w\s]+) audience/i,
  ]

  for (const pattern of contextPatterns) {
    const match = promptLower.match(pattern)
    if (match) {
      context = match[1].trim()
      break
    }
  }

  return { subject, action, context }
}

// Add clarity to the prompt (existing function)
function addClarityToPrompt(prompt: string, subject: string, action: string): string {
  // If it's not a question, make it a clear question
  if (!prompt.includes("?")) {
    if (prompt.toLowerCase().startsWith("explain")) {
      return `${prompt}? Please provide a clear and comprehensive explanation.`
    } else if (action) {
      return `What is the best way to ${action} ${subject}?`
    } else if (subject) {
      return `What exactly is ${subject} and what are its key characteristics?`
    } else {
      return `${prompt}? Please provide a clear and detailed response.`
    }
  }

  // If it's already a question but could be clearer
  if (prompt.match(/^(what|how|why|when|where|who)/i)) {
    return `${prompt.replace(/\?$/, "")} exactly?`
  }

  return prompt
}

// Add specificity to the prompt (existing function)
function addSpecificityToPrompt(prompt: string, subject: string, action: string, intentType: string): string {
  let improved = prompt

  // Don't add a period if there's already punctuation at the end
  const hasEndPunctuation = /[.!?]$/.test(improved)

  if (intentType === "how-to" && action) {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please include specific steps, tools needed, and common pitfalls to avoid when ${action}.`
  } else if (intentType === "explanation" && subject) {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please include specific examples, key components, and practical applications of ${subject}.`
  } else if (intentType === "creative") {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please make it detailed with vivid descriptions and well-developed characters.`
  } else if (intentType === "comparison") {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please include specific criteria for comparison, key differences, and situations where each option is preferable.`
  } else if (intentType === "career" && prompt.toLowerCase().includes("resume")) {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please include specific sections to include, formatting best practices, and examples of effective bullet points.`
  } else {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please be specific and include detailed examples.`
  }

  return improved
}

// Add structure to the prompt (existing function)
function addStructureToPrompt(prompt: string, intentType: string): string {
  let improved = prompt

  // Don't add a period if there's already punctuation at the end
  const hasEndPunctuation = /[.!?]$/.test(improved)

  if (intentType === "how-to") {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please structure your response as a step-by-step guide.`
  } else if (intentType === "explanation") {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please structure your response with clear headings for definition, key concepts, applications, and limitations.`
  } else if (intentType === "comparison") {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please structure your response with clear categories for comparison and a summary table if possible.`
  } else if (intentType === "career" && prompt.toLowerCase().includes("resume")) {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please structure your response with sections for each part of the resume and include before/after examples.`
  } else {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please provide a well-structured response with clear headings and logical flow.`
  }

  return improved
}

// Add context to the prompt (existing function)
function addContextToPrompt(prompt: string, subject: string, intentType: string): string {
  let improved = prompt

  // Don't add a period if there's already punctuation at the end
  const hasEndPunctuation = /[.!?]$/.test(improved)

  if (intentType === "explanation" && subject) {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please include historical context, current applications, and future trends related to ${subject}.`
  } else if (intentType === "how-to") {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please consider both beginners and more advanced users in your response.`
  } else if (intentType === "career" && prompt.toLowerCase().includes("resume")) {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please consider current industry standards and ATS optimization in your response.`
  } else {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please consider different perspectives and contexts in your response.`
  }

  return improved
}

// Add format specification to the prompt (existing function)
function addFormatSpecification(prompt: string, intentType: string): string {
  let improved = prompt

  // Don't add a period if there's already punctuation at the end
  const hasEndPunctuation = /[.!?]$/.test(improved)

  if (intentType === "how-to") {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please format your response with numbered steps, bullet points for materials needed, and tips in a separate section.`
  } else if (intentType === "explanation") {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please format your response with clear headings, concise paragraphs, and bullet points for key takeaways.`
  } else if (intentType === "comparison") {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please include a comparison table and bullet points highlighting key differences.`
  } else if (intentType === "career" && prompt.toLowerCase().includes("resume")) {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please include example formats, templates, and bullet point formulas in your response.`
  } else {
    improved = `${improved}${hasEndPunctuation ? "" : "."} Please format your response with clear headings and bullet points for easy readability.`
  }

  return improved
}

// Check if the improved prompt is actually better than the original (existing function)
function isActualImprovement(original: string, improved: string): boolean {
  // Must be longer to add value
  if (improved.length <= original.length) return false

  // Must not just be the original with a generic suffix
  if (improved === original + " Please be specific and include detailed examples.") return false

  // Must not be too repetitive
  const repetitionCheck = improved.replace(original, "")
  if (repetitionCheck.includes("Please") && repetitionCheck.includes("Please")) {
    const pleaseCount = (repetitionCheck.match(/Please/g) || []).length
    if (pleaseCount > 1) return false
  }

  return true
}
