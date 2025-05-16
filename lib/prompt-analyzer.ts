// Prompt analysis utilities
export type PromptAnalysis = {
  score: number // 0-100
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
}

export function analyzePrompt(prompt: string): PromptAnalysis {
  const analysis: PromptAnalysis = {
    score: 0,
    strengths: [],
    weaknesses: [],
    suggestions: [],
  }

  // Check prompt length
  if (prompt.length < 10) {
    analysis.weaknesses.push("Prompt is too short")
    analysis.suggestions.push("Expand your prompt to provide more context")
  } else if (prompt.length > 20) {
    analysis.strengths.push("Good prompt length")
  }

  // Check for clarity
  if (prompt.includes("?")) {
    analysis.strengths.push("Includes a clear question")
  } else {
    analysis.weaknesses.push("No clear question")
    analysis.suggestions.push("Consider framing your prompt as a question")
  }

  // Check for specificity
  const specificWords = ["specifically", "exactly", "precisely", "detailed"]
  if (specificWords.some((word) => prompt.toLowerCase().includes(word))) {
    analysis.strengths.push("Uses specific language")
  } else {
    analysis.suggestions.push("Add specific details to get more precise responses")
  }

  // Check for context
  if (prompt.split(" ").length > 15) {
    analysis.strengths.push("Provides good context")
  } else {
    analysis.weaknesses.push("Limited context")
    analysis.suggestions.push("Add more context to help the AI understand your request")
  }

  // Calculate score based on strengths and weaknesses
  analysis.score = Math.min(100, 50 + analysis.strengths.length * 15 - analysis.weaknesses.length * 10)

  return analysis
}
