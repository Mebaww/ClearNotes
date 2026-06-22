import { GoogleGenerativeAI } from "@google/generative-ai";
import { NOTES_SYSTEM_PROMPT } from "./prompts";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite",
  systemInstruction: NOTES_SYSTEM_PROMPT,
});