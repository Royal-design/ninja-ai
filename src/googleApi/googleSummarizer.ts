import { toast } from "sonner";
import { genAI } from "./api";

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

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Summarize the following text concisely. 
    Reply only in JSON format:
    {"summary": "<Your summarized text>"}. 

    Here is the text:
    "${text}"`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawText = response.text();

    // Parse AI response
    let summaryData;
    try {
      summaryData = JSON.parse(rawText);
    } catch (err) {
      throw new Error("Failed to parse summary response.");
    }

    if (!summaryData.summary) {
      throw new Error("Incomplete summary response.");
    }

    return summaryData.summary;
  } catch (error) {
    console.error("Summarization error:", error);

    if (
      error instanceof Error &&
      error.message.includes("Candidate was blocked due to SAFETY")
    ) {
      toast.error(
        "Summarization blocked due to safety filters. Try rephrasing."
      );
    } else {
      toast.error("Summarization failed. Please try again.");
    }

    return null;
  }
};
