import { toast } from "sonner";
import { DEFAULT_MODEL, genAI } from "./api";

export const googleSummarizer = async (text: string) => {
  try {
    if (!text.trim()) {
      toast.warning("Please enter some text before summarizing.");
      return null;
    }

    if (text.length < 150) {
      toast.warning(
        "Text must be at least 150 characters long for summarization."
      );
      return null;
    }

    const model = genAI.getGenerativeModel({
      model: DEFAULT_MODEL,
    });

    const prompt = `
      Summarize the following text concisely.
      Reply ONLY in this exact JSON format:
      {
        "summary": "<Your summarized text>"
      }
      Do NOT include any extra text or explanation.

      Here is the text:
      "${text}"
    `;

    let attempts = 0;
    let result, response, rawText, summaryData;

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
        summaryData = JSON.parse(jsonString);

        if (!summaryData.summary) {
          throw new Error("Incomplete summary response.");
        }

        return summaryData.summary;
      } catch {
        attempts++;
        console.warn(`Retrying (${attempts}/3)...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    throw new Error("Failed after 3 attempts.");
  } catch (error: unknown) {
    console.error("Summarization error:", error);

    const err = error as { message?: string };

    // Handle specific API errors
    if (err.message?.includes("Failed to parse")) {
      toast.error("Error parsing summary response. Try again.");
    } else if (err.message?.includes("No response received")) {
      toast.error("No response from AI. Try again later.");
    } else if (err.message?.includes("503")) {
      toast.error("Service is overloaded. Please wait and try again.");
    } else if (err.message?.includes("429")) {
      toast.error("API rate limit reached. Please wait before trying again.");
    } else if (err.message?.includes("network")) {
      toast.error("Network error. Check your connection and try again.");
    } else if (err.message?.includes("Candidate was blocked due to SAFETY")) {
      toast.error(
        "Summarization blocked due to safety filters. Try rephrasing."
      );
    } else {
      toast.error("Summarization failed. Please try again.");
    }

    return null;
  }
};
