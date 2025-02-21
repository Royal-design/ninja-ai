import { toast } from "sonner";
import { genAI } from "./api";

export const googleLanguageDetector = async (text: string) => {
  try {
    if (!text.trim()) {
      toast.warning("Please enter some text before detecting the language.");
      return null;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });

    const prompt = `
      Detect the language of this text: "${text}". 
      Reply ONLY in this exact JSON format:
      {
        "language": "<Language Name>",
        "country": "<Country Name>",
        "code": "<Country Code>"
      }
      Do NOT include any extra text or explanation.
    `;

    let attempts = 0;
    let result, response, rawText, detectedData;

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
        detectedData = JSON.parse(jsonString);

        if (
          !detectedData.language ||
          !detectedData.country ||
          !detectedData.code
        ) {
          throw new Error("Incomplete response.");
        }

        return {
          language: detectedData.language,
          country: detectedData.country,
          code: detectedData.code.toLowerCase()
        };
      } catch (error) {
        attempts++;
        console.warn(`Retrying (${attempts}/3)...`);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
      }
    }

    throw new Error("Failed after 3 attempts.");
  } catch (error: any) {
    console.error("Language detection error:", error);

    if (error.message.includes("503")) {
      toast.error("AI servers are overloaded. Try again later.");
    } else if (error.message.includes("429")) {
      toast.error("Rate limit reached. Wait before trying again.");
    } else if (error.message.includes("network")) {
      toast.error("Network error. Check your connection.");
    } else {
      toast.error("Failed to detect language. Please try again.");
    }

    return null;
  }
};
