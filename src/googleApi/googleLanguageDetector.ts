import { toast } from "sonner";
import { genAI } from "./api";

export const googleLanguageDetector = async (text: string) => {
  try {
    if (!text.trim()) {
      toast.warning("Please enter some text before detecting the language.");
      return;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Detect the language of this text: "${text}". 
    Reply only in this format: 
    {"language": "<Language Name>", "country": "<Country Name>", "code": "<Country Code>"}.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawText = response.text();

    let detectedData;
    try {
      detectedData = JSON.parse(rawText);
    } catch (err) {
      throw new Error("Failed to parse detected language response.");
    }

    if (!detectedData.language || !detectedData.country || !detectedData.code) {
      throw new Error("Incomplete language detection response.");
    }

    return {
      language: detectedData.language,
      country: detectedData.country,
      code: detectedData.code.toLowerCase() // Ensure country code is lowercase for flag URLs
    };
  } catch (error) {
    console.error("Language detection error:", error);
    toast.error("Failed to detect language. Please try again.");
    return null;
  }
};
