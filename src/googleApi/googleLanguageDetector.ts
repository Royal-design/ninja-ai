import { toast } from "sonner";
import { DEFAULT_MODEL, genAI } from "./api";

export const googleLanguageDetector = async (text: string) => {
  try {
    if (!text.trim()) {
      toast.warning("Please enter some text before detecting the language.");
      return null;
    }

    const model = genAI.getGenerativeModel({
      model: DEFAULT_MODEL,
    });

    const prompt = `Detect the language of this text: "${text}"

Reply ONLY with valid JSON in this exact format (no markdown, no extra text):
{"language": "language name", "country": "country name", "code": "ISO country code"}`;

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`Language detection attempt ${attempts}/${maxAttempts}`);

        const result = await model.generateContent(prompt);
        const response = result.response;

        if (!response) {
          throw new Error("No response received from AI.");
        }

        let rawText = response.text().trim();
        console.log("Raw response:", rawText);

        // Remove markdown code blocks if present
        rawText = rawText.replace(/```json\s*/g, "").replace(/```\s*/g, "");

        // Find JSON object boundaries
        const jsonStart = rawText.indexOf("{");
        const jsonEnd = rawText.lastIndexOf("}");

        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error("Invalid JSON response from AI.");
        }

        const jsonString = rawText.substring(jsonStart, jsonEnd + 1);
        console.log("Extracted JSON:", jsonString);

        // Parse JSON response
        const detectedData = JSON.parse(jsonString);

        // Validate required fields
        if (
          !detectedData.language ||
          !detectedData.country ||
          !detectedData.code
        ) {
          throw new Error("Incomplete response.");
        }

        // Success - return the data
        return {
          language: detectedData.language.trim(),
          country: detectedData.country.trim(),
          code: detectedData.code.toLowerCase().trim(),
        };
      } catch (parseError: unknown) {
        console.warn(
          `Attempt ${attempts}/${maxAttempts} failed:`,
          parseError instanceof Error ? parseError.message : String(parseError)
        );

        // If this was the last attempt, throw the error
        if (attempts >= maxAttempts) {
          throw parseError;
        }

        // Wait before retrying (exponential backoff: 1s, 2s, 3s)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
      }
    }

    throw new Error("Failed after 3 attempts.");
  } catch (error: unknown) {
    console.error("Language detection error:", error);

    // Handle specific API errors
    const err = error as { message?: string };
    const errorMessage = err?.message || "";
    const errorString = String(error);

    if (errorMessage.includes("SAFETY") || errorString.includes("SAFETY")) {
      toast.error("Content blocked due to safety filters. Try different text.");
    } else if (errorMessage.includes("503") || errorString.includes("503")) {
      toast.error("AI servers are overloaded. Try again later.");
    } else if (errorMessage.includes("429") || errorString.includes("429")) {
      toast.error("Rate limit reached. Wait before trying again.");
    } else if (
      errorMessage.includes("API key") ||
      errorString.includes("API key")
    ) {
      toast.error("API configuration error. Please check your setup.");
    } else if (
      errorMessage.includes("network") ||
      errorString.includes("network")
    ) {
      toast.error("Network error. Check your connection.");
    } else if (
      errorMessage.includes("JSON") ||
      errorMessage.includes("parse")
    ) {
      toast.error("Error processing response. Please try again.");
    } else if (errorMessage.includes("Failed after")) {
      toast.error(
        "Language detection failed after multiple attempts. Please try again."
      );
    } else {
      toast.error("Failed to detect language. Please try again.");
    }

    return null;
  }
};
