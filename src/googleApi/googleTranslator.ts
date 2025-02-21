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

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });

    const prompt = `
      Translate the following text to ${targetLang}: "${text}". 
      Reply ONLY in this exact JSON format:
      {
        "translatedText": "<Translated Text>",
        "country": "<Country Name>",
        "code": "<Country Code>"
      }
      Do NOT include any extra text or explanation.
    `;

    let attempts = 0;
    let result, response, rawText, translatedData;

    while (attempts < 3) {
      try {
        result = await model.generateContent(prompt);
        response = result.response;

        if (!response) throw new Error("No response received from AI.");
        rawText = response.text().trim();

        // Ensure JSON starts correctly
        const jsonStart = rawText.indexOf("{");
        const jsonEnd = rawText.lastIndexOf("}");
        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error("Invalid JSON response from AI.");
        }

        const jsonString = rawText.substring(jsonStart, jsonEnd + 1);

        // Parse JSON response
        translatedData = JSON.parse(jsonString);

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
          code: translatedData.code.toLowerCase() // Ensure lowercase for consistency
        };
      } catch (error) {
        attempts++;
        console.warn(`Retrying (${attempts}/3)...`);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
      }
    }

    throw new Error("Failed after 3 attempts.");
  } catch (error: any) {
    console.error("Translation error:", error);

    // Handle specific API errors
    if (error.message.includes("Failed to parse")) {
      toast.error("Error parsing translation response. Try again.");
    } else if (error.message.includes("No response received")) {
      toast.error("No response from AI. Try again later.");
    } else if (error.message.includes("503")) {
      toast.error("Service is overloaded. Please wait and try again.");
    } else if (error.message.includes("429")) {
      toast.error("API rate limit reached. Please wait before trying again.");
    } else if (error.message.includes("network")) {
      toast.error("Network error. Check your connection and try again.");
    } else if (
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
