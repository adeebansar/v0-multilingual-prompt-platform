// Simple token counting utility
export function countTokens(text: string): number {
  // This is a very simple approximation
  // For production, use a proper tokenizer like GPT-3 Tokenizer
  const words = text.trim().split(/\s+/)
  return Math.ceil(words.length * 1.3) // Rough approximation
}

// Estimate cost based on model and tokens
export function estimateCost(model: string, promptTokens: number, completionTokens: number): number {
  const rates: Record<string, { prompt: number; completion: number }> = {
    "gpt-4o": { prompt: 0.00001, completion: 0.00003 },
    "gpt-4": { prompt: 0.00003, completion: 0.00006 },
    "gpt-3.5-turbo": { prompt: 0.000001, completion: 0.000002 },
  }

  const rate = rates[model] || rates["gpt-3.5-turbo"]
  return promptTokens * rate.prompt + completionTokens * rate.completion
}
