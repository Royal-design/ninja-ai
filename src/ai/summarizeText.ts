import { toast } from "sonner";

declare global {
  interface Window {
    ai: any;
  }
}

export const summarizeText = async (text: string): Promise<string> => {
  try {
    if (!self.ai?.summarizer) {
      throw new Error("Summarization is not supported.");
    }

    const capabilities = await self.ai.summarizer.capabilities();
    const canSummarize = capabilities.available;
    let summarizer;

    if (canSummarize === "no") {
      throw new Error("Summarization API is not available.");
    }

    if (canSummarize === "readily") {
      summarizer = await self.ai.summarizer.create();
    } else {
      summarizer = await self.ai.summarizer.create({
        monitor(m: any) {
          m.addEventListener("downloadprogress", (e: any) => {
            console.log(`Downloading: ${e.loaded} of ${e.total} bytes.`);
          });
        }
      });
      await summarizer.ready;
    }

    return await summarizer.summarize(text);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during summarization.";

    toast.error(errorMessage);

    throw error;
  }
};
