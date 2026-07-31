import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Languages, Sparkles, User, Volume2, Square } from "lucide-react";
import { Button } from "./ui/button";
import { languages } from "@/assets/data/Languages";
import { formatDate } from "@/features/formatDate";
import { getSpeechLanguage, speakText } from "@/features/outputSpeech";
import logo from "../assets/image/ninjalogo.png";

interface MessageProps {
  id: number;
  text: string;
  type: "user" | "translation" | "summary";
  lang: string;
  code: string;
  sourceCode?: string;
  sourceName?: string;
  onTranslate: (id: number, text: string) => void;
  onSummarize: (id: number, text: string) => void;
  isTranslating: boolean;
  isSummarizing: boolean;
  date: string;
  translatedLang: string;
}

const flagUrl = (code?: string) =>
  code ? `https://flagcdn.com/w40/${code.toLowerCase()}.png` : undefined;

export const Message: React.FC<MessageProps> = ({
  id,
  text,
  type,
  lang,
  code,
  sourceCode,
  sourceName,
  onTranslate,
  isSummarizing,
  isTranslating,
  date,
  translatedLang,
  onSummarize,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = type === "user";
  const targetLangData = languages.find((l) => l.code === translatedLang);
  const targetName = targetLangData?.name ?? translatedLang;
  const targetFlag = targetLangData?.flag ?? flagUrl(code);
  const sourceFlag = flagUrl(sourceCode);

  const flag = flagUrl(code);
  const chatDate = formatDate(date);
  const speakLang = isUser
    ? getSpeechLanguage(code)
    : translatedLang || undefined;

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const isBusy = (isUser && (isTranslating || isSummarizing)) || false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex w-full items-start gap-3 ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      <figure
        className={`mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border ${
          isUser ? "bg-muted" : "bg-card"
        }`}
      >
        {isUser ? (
          <User className="size-4 text-muted-foreground" />
        ) : (
          <img src={logo} alt="Ninja.AI" className="size-6 object-contain" />
        )}
      </figure>

      <div
        className={`flex max-w-[88%] flex-col gap-1 md:max-w-[75%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl border px-4 py-3 shadow-sm ${
            isUser
              ? "rounded-tr-sm bg-card"
              : "rounded-tl-sm bg-card/80"
          }`}
        >
          {!isUser && (
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {type === "translation" ? (
                <>
                  <Languages className="size-3.5 text-brand" />
                  <span className="font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {sourceName ?? "Original"}
                    <span className="mx-1 text-brand">→</span>
                    {targetName}
                  </span>
                  {sourceFlag && (
                    <img
                      src={sourceFlag}
                      alt={sourceName}
                      className="size-3.5 rounded-full object-cover"
                    />
                  )}
                  {targetFlag && (
                    <img
                      src={targetFlag}
                      alt={targetName}
                      className="size-3.5 rounded-full object-cover"
                    />
                  )}
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5 text-brand" />
                  <span className="font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Summary
                  </span>
                </>
              )}
            </div>
          )}

          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-foreground">
            {text}
          </p>

          {isUser && (
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              {flag && (
                <img
                  src={flag}
                  alt={lang}
                  className="size-4 rounded-full object-cover"
                />
              )}
              <span>{lang}</span>
            </div>
          )}
        </div>

        {isUser && (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              onClick={() => onTranslate(id, text)}
              variant="outline"
              size="sm"
              className="h-8 rounded-full bg-card px-3 text-xs font-medium shadow-none"
              disabled={isTranslating}
            >
              <Languages className="size-3.5" />
              {isTranslating ? "Translating…" : "Translate"}
            </Button>

            {text.length > 150 && (
              <Button
                onClick={() => onSummarize(id, text)}
                variant="outline"
                size="sm"
                className="h-8 rounded-full bg-card px-3 text-xs font-medium shadow-none"
                disabled={isSummarizing}
              >
                <Sparkles className="size-3.5" />
                {isSummarizing ? "Summarizing…" : "Summarize"}
              </Button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 text-muted-foreground">
          {!isUser && (
            <button
              onClick={copyText}
              aria-label="Copy text"
              className="rounded-md p-1 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {copied ? (
                <Check className="size-3.5 text-brand" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
          )}
          <button
            onClick={() =>
              speakText(text, speakLang, isSpeaking, setIsSpeaking)
            }
            aria-label={isSpeaking ? "Stop speaking" : "Listen to text"}
            className="rounded-md p-1 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {isSpeaking ? (
              <Square className="size-3.5 fill-current" />
            ) : (
              <Volume2 className="size-3.5" />
            )}
          </button>
          <time
            className={`font-mono text-[10px] uppercase tracking-wide ${
              isBusy ? "animate-pulse" : ""
            }`}
          >
            {chatDate}
          </time>
        </div>
      </div>
    </motion.div>
  );
};
