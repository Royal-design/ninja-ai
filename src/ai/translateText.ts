import { toast } from "sonner";

interface CustomWindow {
  ai?: {
    translator: {
      capabilities: () => Promise<{ available: string }>;
      create: (options: {
        sourceLanguage: string;
        targetLanguage: string;
        monitor?: (m: any) => void;
      }) => Promise<{
        ready?: Promise<void>;
        translate: (text: string) => Promise<string>;
      }>;
    };
  };
}

declare const self: CustomWindow;

export const translateText = async (
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> => {
  try {
    if (!self.ai?.translator) {
      throw new Error("Translation is not supported.");
    }

    const capabilities = await self.ai.translator.capabilities();
    const canTranslate = capabilities.available;
    let translator;

    if (canTranslate === "no") {
      throw new Error("Translation API is not available.");
    }

    if (canTranslate === "readily") {
      translator = await self.ai.translator.create({
        sourceLanguage,
        targetLanguage
      });
    } else {
      translator = await self.ai.translator.create({
        sourceLanguage,
        targetLanguage,
        monitor(m: any) {
          m.addEventListener("downloadprogress", (e: any) => {
            console.log(`Downloading: ${e.loaded} of ${e.total} bytes.`);
          });
        }
      });
      await translator.ready;
    }

    return await translator.translate(text);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during translation.";

    toast.error(errorMessage);

    throw error;
  }
};
