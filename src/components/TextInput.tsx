import { chatSchema } from "@/chatSchema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/redux/store";
import { addMessage, setError } from "@/redux/slice/chatSlice";
import { Textarea } from "./ui/textarea";
import { IoIosSend } from "react-icons/io";
import { useState } from "react";
import { Button } from "./ui/button";
import { googleLanguageDetector } from "@/googleApi/googleLanguageDetector";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { toast } from "sonner";
const inputSchema = chatSchema.pick({
  text: true
});
type InputSchema = z.infer<typeof inputSchema>;

type TextInputProps = {
  scrollToBottom: () => void;
};

export const TextInput = ({ scrollToBottom }: TextInputProps) => {
  const dispatch = useAppDispatch();
  const [isListening, setIsListening] = useState(false);

  const form = useForm<InputSchema>({
    resolver: zodResolver(inputSchema),
    defaultValues: { text: "" }
  });

  const textValue = form.watch("text") || "";

  const onSubmit = async (data: InputSchema) => {
    try {
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
    }
  };

  // Speech-to-Text Functionality
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.warning("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;

      const currentText = form.getValues("text");
      form.setValue("text", currentText + " " + spokenText);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="relative">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative flex flex-col border rounded-3xl w-full overflow-hidden"
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type or speak your message..."
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    className="w-full min-h-[3rem]  max-h-[5rem] max-sm:min-h-[3rem] max-sm:max-h-[4rem] resize-none overflow-y-auto  shadow-none border-none scrollbar-hidden"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center px-2 pb-2 bg-background w-full">
            {/* Microphone Button */}
            <Button
              type="button"
              onClick={startListening}
              className="bg-background rounded-full border   size-9 hover:bg-transparent text-primary"
            >
              {isListening ? (
                <FaMicrophoneSlash size={16} />
              ) : (
                <FaMicrophone size={16} />
              )}
            </Button>

            {/* Send Button */}
            <Button
              variant="ghost"
              type="submit"
              aria-label="Send Message"
              disabled={
                form.formState.isSubmitting || textValue.trim().length === 0
              }
              className={`border rounded-full size-9 bg-gray-800 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-400 text-primary ${
                textValue.trim().length === 0
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              <IoIosSend className="text-white size-6" strokeWidth={"0.5rem"} />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
