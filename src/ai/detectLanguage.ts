import { toast } from "sonner";

interface CustomWindow extends Window {
  ai: {
    languageDetector?: {
      capabilities: () => Promise<{ available: string }>;
      create: (options?: { monitor?: (m: any) => void }) => Promise<{
        detect: (
          text: string
        ) => Promise<{ detectedLanguage: string; confidence: number }[]>;
        ready?: Promise<void>;
      }>;
    };
    summarizer?: any;
  };
}

declare const self: CustomWindow;

export const detectLanguage = async (text: string) => {
  try {
    if (!self.ai?.languageDetector) {
      throw new Error("Language detection is not supported.");
    }

    const capabilities = await self.ai.languageDetector.capabilities();
    const canDetect = capabilities.available;
    let detector;

    if (canDetect === "no") {
      throw new Error("Language detection API is not available.");
    }

    if (canDetect === "readily") {
      detector = await self.ai.languageDetector.create();
    } else {
      detector = await self.ai.languageDetector.create({
        monitor(m: any) {
          m.addEventListener("downloadprogress", (e: any) => {
            console.log(`Downloading: ${e.loaded} of ${e.total} bytes.`);
          });
        }
      });
      await detector.ready;
    }

    const detectedResults = await detector.detect(text.trim());
    if (!detectedResults.length) {
      throw new Error("Could not detect language.");
    }

    const { detectedLanguage, confidence } = detectedResults[0];

    const readableLanguage = new Intl.DisplayNames(["en"], {
      type: "language"
    }).of(detectedLanguage);

    return {
      detectedLanguage,
      confidence: (confidence * 100).toFixed(1),
      readableLanguage
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during language detection.";

    toast.error(errorMessage);

    throw error;
  }
};
