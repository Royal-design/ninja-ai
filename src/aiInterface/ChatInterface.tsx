import { Fragment, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Languages, Sparkles, Globe } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Message } from "@/components/Message";
import { TextInput, TextInputHandle } from "@/components/TextInput";
import {
  setError,
  setSummarizeLoading,
  setSummary,
  setTranslatedText,
  setTranslateLoading
} from "@/redux/slice/chatSlice";
import { googleTranslator } from "@/googleApi/googleTranslator";
import { googleSummarizer } from "@/googleApi/googleSummarizer";
import { toast } from "sonner";
import logo from "../assets/image/ninjalogo.png";

const SUGGESTIONS = [
  {
    id: "translate",
    icon: Languages,
    title: "Translate",
    sample:
      "Hello, my name is Aisha. How do I get to the train station from here?"
  },
  {
    id: "detect",
    icon: Globe,
    title: "Detect language",
    sample: "Bonjour le monde, je m'appelle Hugo et j'habite à Paris."
  },
  {
    id: "summarize",
    icon: Sparkles,
    title: "Summarize",
    sample:
      "The northern lights, also known as aurora borealis, are caused by charged particles from the sun colliding with gases in Earth's atmosphere. When these particles hit oxygen and nitrogen molecules, they release energy in the form of light, creating ribbons of green, purple, and red that dance across polar skies. While they are most commonly seen near the Arctic Circle, strong solar storms can push them much further south, occasionally making them visible across parts of Europe and North America."
  }
];

const PendingBubble = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className="flex items-start gap-3"
  >
    <figure className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border bg-card">
      <img src={logo} alt="Ninja.AI" className="size-6 object-contain" />
    </figure>
    <div className="rounded-2xl rounded-tl-sm border bg-card/80 px-4 py-3">
      <div className="flex items-center gap-1.5">
        <span className="typing-dot size-1.5 rounded-full bg-brand" />
        <span
          className="typing-dot size-1.5 rounded-full bg-brand"
          style={{ animationDelay: "0.15s" }}
        />
        <span
          className="typing-dot size-1.5 rounded-full bg-brand"
          style={{ animationDelay: "0.3s" }}
        />
        <span className="ml-1.5 font-mono text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Working…
        </span>
      </div>
    </div>
  </motion.div>
);

export const ChatInterface = () => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<TextInputHandle>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { chats, activeChatId, selectedLang } = useAppSelector(
    (state) => state.chat
  );

  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const messages = useMemo(
    () => (activeChat ? activeChat.messages : []),
    [activeChat]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTranslate = async (id: number, text: string) => {
    if (!activeChatId) return;

    if (!selectedLang) {
      toast.warning("Please select a target language first.");
      return;
    }

    dispatch(setTranslateLoading({ id, loading: true }));

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
    } catch {
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
    } catch {
      dispatch(setError("Summarization failed."));
    } finally {
      dispatch(setSummarizeLoading({ id, loading: false }));
    }
  };

  let lastSource: { code?: string; name?: string } = {};

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hidden">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 md:px-6">
          {messages.length > 0 ? (
            <>
              {messages.map((msg) => {
                const item = (
                  <Message
                    key={msg.id}
                    id={msg.id}
                    text={msg.text}
                    type={msg.type}
                    lang={msg.lang}
                    code={msg.code ?? ""}
                    sourceCode={
                      msg.type === "translation" ? lastSource.code : undefined
                    }
                    sourceName={
                      msg.type === "translation" ? lastSource.name : undefined
                    }
                    onTranslate={handleTranslate}
                    onSummarize={handleSummarize}
                    isSummarizing={msg.isSummarizing ?? false}
                    isTranslating={msg.isTranslating ?? false}
                    date={msg.timestamp}
                    translatedLang={msg.translatedLang ?? ""}
                  />
                );

                if (msg.type === "user") {
                  lastSource = { code: msg.code, name: msg.lang };
                }

                const pending =
                  msg.type === "user" &&
                  (msg.isTranslating || msg.isSummarizing);

                return (
                  <Fragment key={msg.id}>
                    {item}
                    {pending && <PendingBubble />}
                  </Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center px-4 py-16 text-center"
            >
              <figure className="mb-6 flex size-16 items-center justify-center rounded-2xl border bg-card shadow-sm">
                <img src={logo} alt="Ninja.AI" className="size-10 object-contain" />
              </figure>
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                What can I help you with?
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Paste any text and I&apos;ll detect its language, translate it,
                or summarize it — all in one conversation.
              </p>

              <div className="mt-8 grid w-full max-w-xl gap-3 sm:grid-cols-3">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => inputRef.current?.setText(s.sample)}
                    className="group flex flex-col items-start gap-2 rounded-2xl border bg-card p-4 text-left transition-colors hover:border-brand/50 hover:bg-accent/50"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-muted text-foreground transition-colors group-hover:bg-brand/15 group-hover:text-brand">
                      <s.icon className="size-4" />
                    </span>
                    <span className="text-sm font-semibold">{s.title}</span>
                    <span className="line-clamp-2 text-xs text-muted-foreground">
                      {s.sample}
                    </span>
                  </button>
                ))}
              </div>

              <p className="mt-8 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                Summarization works on texts with 150+ characters
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="shrink-0 px-4 pb-4 md:px-6 md:pb-6">
        <div className="mx-auto w-full max-w-3xl">
          <TextInput ref={inputRef} scrollToBottom={scrollToBottom} />
        </div>
      </div>
    </div>
  );
};
