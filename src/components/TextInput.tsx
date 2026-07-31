import { forwardRef, useImperativeHandle, useState } from "react";
import { Mic, MicOff, SendHorizontal, Loader2 } from "lucide-react";
import { chatSchema } from "@/chatSchema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { addMessage, setError } from "@/redux/slice/chatSlice";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { googleLanguageDetector } from "@/googleApi/googleLanguageDetector";
import { languages } from "@/assets/data/Languages";
import { toast } from "sonner";

const inputSchema = chatSchema.pick({ text: true });
type InputSchema = z.infer<typeof inputSchema>;

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  onstart: (() => void) | null;
  onresult:
    | ((event: {
        results: ArrayLike<ArrayLike<{ transcript: string }>>;
      }) => void)
    | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

type TextInputProps = {
  scrollToBottom: () => void;
};

export type TextInputHandle = {
  setText: (text: string) => void;
};

const flagUrl = (code?: string) =>
  code ? `https://flagcdn.com/w40/${code.toLowerCase()}.png` : undefined;

export const TextInput = forwardRef<TextInputHandle, TextInputProps>(
  function TextInput({ scrollToBottom }, ref) {
    const dispatch = useAppDispatch();
    const { selectedLang, detectedCode } = useAppSelector((state) => state.chat);
    const [isListening, setIsListening] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);

    const form = useForm<InputSchema>({
      resolver: zodResolver(inputSchema),
      defaultValues: { text: "" }
    });

    const textValue = form.watch("text") || "";

    useImperativeHandle(ref, () => ({
      setText: (text: string) => {
        form.setValue("text", text);
        form.setFocus("text");
      }
    }));

    const onSubmit = async (data: InputSchema) => {
      try {
        setIsDetecting(true);
        const detectedLanguage = await googleLanguageDetector(data.text);

        dispatch(
          addMessage({
            text: data.text,
            lang: detectedLanguage?.language,
            name: detectedLanguage?.country,
            code: detectedLanguage?.code
          })
        );
        form.reset();
        scrollToBottom();
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(`Language Detection Failed: ${err.message}`);
          dispatch(setError("Failed to detect language."));
        }
      } finally {
        setIsDetecting(false);
      }
    };
    // Speech-to-Text Functionality
    const startListening = () => {
      const SpeechRecognition = (
        window as unknown as {
          webkitSpeechRecognition?: new () => SpeechRecognitionLike;
        }
      ).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        toast.warning("Your browser does not support speech recognition.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        const currentText = form.getValues("text");
        form.setValue("text", currentText + " " + spokenText);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
      };

      recognition.onend = () => setIsListening(false);

      recognition.start();
    };

    const sourceFlag = flagUrl(detectedCode);
    const targetLangData = languages.find((l) => l.code === selectedLang);
    const targetFlag = targetLangData?.flag ?? flagUrl(selectedLang);

    return (
      <div className="rounded-2xl border bg-card shadow-sm transition-[box-shadow] focus-within:ring-2 focus-within:ring-ring/40">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between gap-2 px-3 pt-2">
              <div className="flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5">
                {sourceFlag && (
                  <img
                    src={sourceFlag}
                    alt="Source"
                    className="size-3.5 rounded-full object-cover"
                  />
                )}
                <span className="font-mono text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {(detectedCode || "us").toUpperCase() || "AUTO"}
                </span>
                <span className="font-mono text-[10px] text-brand">→</span>
                {targetFlag && (
                  <img
                    src={targetFlag}
                    alt="Target"
                    className="size-3.5 rounded-full object-cover"
                  />
                )}
                <span className="font-mono text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {selectedLang.toUpperCase()}
                </span>
              </div>

              <span className="hidden font-mono text-[10px] uppercase tracking-wide text-muted-foreground sm:block">
                Enter ↵ to send
              </span>
            </div>

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Type or speak your message…"
                      aria-label="Message"
                      {...field}
                      onChange={(e) => {
                        const el = e.target;
                        el.style.height = "auto";
                        el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                        field.onChange(e);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                      className="min-h-[3rem] resize-none overflow-y-auto border-none bg-transparent px-3 py-2 text-[15px] leading-relaxed shadow-none scrollbar-hidden"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between px-2 pb-2">
              <Button
                type="button"
                onClick={startListening}
                aria-label={isListening ? "Stop listening" : "Speak to type"}
                className={`size-9 rounded-full border bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground ${
                  isListening ? "mic-live border-destructive bg-destructive/10 text-destructive" : ""
                }`}
              >
                {isListening ? (
                  <MicOff className="size-4" />
                ) : (
                  <Mic className="size-4" />
                )}
              </Button>

              <div className="flex items-center gap-2">
                {isDetecting && (
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                    <Loader2 className="size-3 animate-spin" />
                    Detecting
                  </span>
                )}
                <Button
                  type="submit"
                  aria-label="Send Message"
                  disabled={
                    form.formState.isSubmitting ||
                    isDetecting ||
                    textValue.trim().length === 0
                  }
                  className={`size-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 ${
                    textValue.trim().length === 0 && !isDetecting
                      ? "cursor-not-allowed opacity-40"
                      : ""
                  }`}
                >
                  <SendHorizontal className="size-4" />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    );
  }
);
