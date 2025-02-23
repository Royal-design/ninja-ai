import { chatSchema } from "@/chatSchema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/redux/store";
import { addMessage, setError } from "@/redux/slice/chatSlice";
import { Textarea } from "./ui/textarea";
import { IoIosSend } from "react-icons/io";
import { useState } from "react";
import { Button } from "./ui/button";
import { googleLanguageDetector } from "@/googleApi/googleLanguageDetector";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa"; // Microphone Icons
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
  const [loading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const form = useForm<InputSchema>({
    resolver: zodResolver(inputSchema),
    defaultValues: { text: "" }
  });

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
          className="items-center relative w-full rounded"
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Type or speak your message..."
                      {...field}
                      className="w-full p-4 pl-10 md:pt-7 pt-6 min-h-[5rem] max-h-[8rem] max-sm:max-h-[8rem] rounded-4xl resize-none overflow-y-auto scrollbar-hidden"
                    />
                    {/* Microphone Button */}
                    <button
                      type="button"
                      onClick={startListening}
                      className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 text-primary"
                    >
                      {isListening ? (
                        <FaMicrophoneSlash size={20} />
                      ) : (
                        <FaMicrophone size={20} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Send Button */}
          <Button
            variant="ghost"
            className="ml-2 hover:bg-transparent absolute right-4 top-[3rem] -translate-y-1/2 bg-transparent text-primary cursor-pointer"
            type="submit"
            disabled={loading || form.formState.isSubmitting}
            aria-label="Send Message"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <div className="bg-card hover:border-2 duration-100 dark:border-yellow-500 border rounded-full p-2">
                <IoIosSend className="size-6" />
              </div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
