import {
  setError,
  setSummarizeLoading,
  setSummary,
  setTranslatedText,
  setTranslateLoading
} from "@/redux/slice/chatSlice";
import { motion } from "framer-motion";

import { useAppDispatch, useAppSelector } from "@/redux/store";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Message } from "@/components/Message";
import { TextInput } from "@/components/TextInput";
import { googleTranslator } from "@/googleApi/googleTranslator";
import { googleSummarizer } from "@/googleApi/googleSummarizer";
import { Button } from "@/components/ui/button";

export interface SidebarProps {
  isSidebarOpen: boolean;
}

export const ChatInterface = ({ isSidebarOpen }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const { chats, activeChatId, selectedLang } = useAppSelector(
    (state) => state.chat
  );

  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const messages = activeChat ? activeChat.messages : [];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTranslate = async (id: number, text: string) => {
    if (!activeChatId) return;

    dispatch(setTranslateLoading({ id, loading: true }));

    if (!selectedLang) {
      toast.warning("Please select the language");
      dispatch(setTranslateLoading({ id, loading: false }));
      return;
    }

    try {
      const translatedText = await googleTranslator(text, selectedLang);
      setTimeout(() => {
        if (translatedText) {
          dispatch(
            setTranslatedText({
              id,
              code: translatedText.code,
              text: translatedText.translatedText,
              name: translatedText.country,
              translatedLang: selectedLang
            })
          );
        } else {
          dispatch(setError("Translation returned null."));
        }
      }, 200);
    } catch (err) {
      dispatch(setError("Translation failed."));
    } finally {
      dispatch(setTranslateLoading({ id, loading: false }));
    }
  };

  const handleSummarize = async (id: number, text: string) => {
    if (!activeChatId) return;

    dispatch(setSummarizeLoading({ id, loading: true }));

    try {
      const summary = await googleSummarizer(text);
      setTimeout(() => {
        if (summary) {
          dispatch(setSummary({ id, text: summary }));
        } else {
          dispatch(setError("Summarization returned null or undefined."));
        }
      }, 200);
    } catch (err) {
      dispatch(setError("Summarization failed."));
    } finally {
      dispatch(setSummarizeLoading({ id, loading: false }));
    }
  };

  return (
    <div className="bg-background flex flex-col max-h-screen  p-4 md:p-8 pb-12">
      <Navbar isSidebarOpen={isSidebarOpen} />
      <div className=" mt-8 overflow-auto py-20 flex flex-col gap-8 scrollbar-hidden h-screen w-full px-2 md:px-[1rem]">
        {messages.length > 0 ? (
          <>
            {messages.map((msg) => (
              <Message
                key={msg.id}
                id={msg.id}
                text={msg.text}
                type={msg.type}
                lang={msg.lang}
                code={msg.code ?? ""}
                translatedLang={msg.translatedLang ?? ""}
                onTranslate={handleTranslate}
                onSummarize={handleSummarize}
                isSummarizing={msg.isSummarizing ?? false}
                isTranslating={msg.isTranslating ?? false}
                date={msg.timestamp}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <motion.div
            className="mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="text-center text-3xl md:text-4xl text-muted-foreground mt-10">
              What can I help you with?
            </p>
            <p className="text-sm text-slate-400 px-8 mt-3 text-center">
              Summarization is available only for texts with a minimum of 150
              words
            </p>

            <div className=" justify-center mt-4 flex flex-wrap  gap-2">
              <Button className="px-2 text-xs md:text-sm h-4 w-auto py-3 bg-blue-500 rounded-lg text-white font-bold hover:bg-blue-600 transition">
                Translation
              </Button>
              <Button className="px-2 text-xs md:text-sm h-4 w-auto py-3 bg-[#421f08] rounded-lg text-white font-bold hover:bg-[#4d250b] transition">
                Language Detection
              </Button>
              <Button className="px-2 text-xs md:text-sm h-4 w-auto py-3 bg-green-500 rounded-lg text-white font-bold hover:bg-green-600 transition">
                Summarization
              </Button>
            </div>
          </motion.div>
        )}
      </div>
      <div
        className={`fixed bottom-12 bg-background w-full transition-all duration-200 px-6 md:px-0 flex justify-center ${
          isSidebarOpen ? "md:left-35" : "md:left-0"
        } left-0`}
      >
        <div className="w-full max-w-2xl">
          <TextInput scrollToBottom={scrollToBottom} />
        </div>
      </div>
    </div>
  );
};
