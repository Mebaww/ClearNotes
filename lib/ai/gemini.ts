import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { NOTES_SYSTEM_PROMPT } from "./prompts";
import { AppError } from "../errors";

let modelInstance: GenerativeModel | null = null;

export function getGeminiModel(): GenerativeModel {
  if (modelInstance) {
    return modelInstance;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AppError(
      "GENERATION_FAILED",
      "GEMINI_API_KEY is not set in environment variables."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  modelInstance = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: NOTES_SYSTEM_PROMPT,
  });

  return modelInstance;
}