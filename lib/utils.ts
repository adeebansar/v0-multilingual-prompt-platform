import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely parse JSON with error handling
 * @param text The JSON string to parse
 * @param fallback The fallback value to return if parsing fails
 * @returns The parsed JSON or the fallback value
 */
export function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return fallback
  }
}
