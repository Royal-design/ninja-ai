import { toast } from "sonner";
import { genAI } from "./api";

export const googleTranslator = async (text: string, targetLang: string) => {
  try {
    if (!text.trim()) {
      toast.warning("Please enter text before translating.");
      return null;
    }

    if (!targetLang.trim()) {
      toast.warning("Please select a target language.");
      return null;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Translate the following text to ${targetLang}: "${text}". 
    Reply only in JSON format: 
    {"translatedText": "<Translated Text>", "country": "<Country Name>", "code": "<Country Code>"}.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawText = response.text();

    // Parse the AI response
    let translatedData;
    try {
      translatedData = JSON.parse(rawText);
    } catch (err) {
      throw new Error("Failed to parse translation response.");
    }

    if (
      !translatedData.translatedText ||
      !translatedData.country ||
      !translatedData.code
    ) {
      throw new Error("Incomplete translation response.");
    }

    return {
      translatedText: translatedData.translatedText,
      country: translatedData.country,
      code: translatedData.code.toLowerCase()
    };
  } catch (error) {
    console.error("Translation error:", error);

    if (
      error instanceof Error &&
      error.message.includes("Candidate was blocked due to SAFETY")
    ) {
      toast.error("Translation blocked due to safety filters. Try rephrasing.");
    } else {
      toast.error("Translation failed. Please try again.");
    }

    return null;
  }
};
