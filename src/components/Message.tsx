import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { languages } from "@/assets/data/Languages";
import { formatDate } from "@/features/formatDate";
import logo from "../assets/image/ninjalogo.png";
import { CiUser } from "react-icons/ci";
import { BsFillVolumeUpFill, BsFillStopFill } from "react-icons/bs"; // Import icons
import { speakText } from "@/features/outputSpeech";

interface MessageProps {
  id: number;
  text: string;
  type: "user" | "translation" | "summary";
  lang: string;
  code: string;
  onTranslate: (id: number, text: string) => void;
  onSummarize: (id: number, text: string) => void;
  isTranslating: boolean;
  isSummarizing: boolean;
  date: string;
  translatedLang: string;
}

export const Message: React.FC<MessageProps> = ({
  id,
  text,
  type,
  lang,
  code,
  onTranslate,
  isSummarizing,
  isTranslating,
  date,
  translatedLang,
  onSummarize
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const translatedLanguageData = languages.find(
    (language) => language.code === translatedLang
  );
  const translatedLanguage = translatedLanguageData?.name;
  const translatedFlag = translatedLanguageData?.flag;
  const flag = `https://flagcdn.com/w40/${code}.png`;
  const chatDate = formatDate(date);

  return (
    <div
      className={`flex w-full items-start gap-2 mb-2 ${
        type === "user" ? "ml-auto  flex-row-reverse" : "mr-auto justify-start"
      }`}
    >
      {/* User Icon or Logo */}
      <figure className="rounded-full bg-card w-8 h-8 p-2 flex items-center justify-center">
        {type === "user" ? (
          <CiUser size={22} />
        ) : (
          <figure>
            <img src={logo} alt="logo" className="size-5 object-cover" />
          </figure>
        )}
      </figure>

      {/* Chat Message */}
      <Card className="p-3 bg-card max-w-full w-sm   border shadow-none rounded-2xl">
        <CardHeader className="p-0">
          <CardTitle />
        </CardHeader>

        <CardContent className="p-0">
          <div className={type === "user" ? "font-semibold" : "text-primary"}>
            {type === "user" ? (
              <p className="leading-[150%] break-words">{text}</p>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="leading-[150%] break-words">{text}</p>
                <div className="flex justify-between w-full mt-2 items-center">
                  {type === "translation" && (
                    <div className="flex gap-4 w-full items-center">
                      {translatedFlag && (
                        <img
                          src={translatedFlag}
                          alt={translatedLang}
                          className="size-4 rounded-full"
                        />
                      )}
                      <p className="text-xs">{translatedLanguage}</p>
                    </div>
                  )}
                  <div className=" w-full justify-end items-center flex gap-2  ">
                    <button
                      onClick={() =>
                        speakText(
                          text,
                          translatedLang,
                          isSpeaking,
                          setIsSpeaking
                        )
                      }
                      className="text-primary hover:text-blue-500 transition"
                      aria-label={
                        isSpeaking ? "Stop speaking" : "Listen to translation"
                      }
                    >
                      {isSpeaking ? (
                        <BsFillStopFill size={20} />
                      ) : (
                        <BsFillVolumeUpFill size={20} />
                      )}
                    </button>
                    <p className="text-[10px] text-primary text-center sm:text-right">
                      {chatDate}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Language Flag */}
          {type === "user" && (
            <div className="flex gap-4 mt-2 items-center">
              {flag && (
                <img src={flag} alt={lang} className="size-4 rounded-full" />
              )}

              <p className="text-xs">{lang}</p>
            </div>
          )}
        </CardContent>

        {/* Buttons for User Messages */}
        {type === "user" && (
          <CardFooter className="p-0 flex flex-col md:flex-row gap-2 mt-4 items-end justify-start sm:justify-end">
            <div className="flex items-center gap-2 sm:gap-4 w-full">
              <Button
                onClick={() => onTranslate(id, text)}
                className="text-base text-primary bg-button hover:bg-button-hover   transition-colors duration-200 w-full sm:w-auto"
                disabled={isTranslating}
              >
                {isTranslating ? "Translating..." : "Translate"}
              </Button>

              {text.length > 150 && (
                <Button
                  onClick={() => onSummarize(id, text)}
                  className="text-sm bg-button hover:bg-button-hover transition-colors duration-200 text-primary w-full sm:w-auto"
                  disabled={isSummarizing}
                >
                  {isSummarizing ? "Summarizing..." : "Summarize"}
                </Button>
              )}
            </div>
            <div className=" w-full items-center  md:justify-end flex gap-2 ">
              <button
                onClick={() =>
                  speakText(text, translatedLang, isSpeaking, setIsSpeaking)
                }
                className="text-primary  hover:text-blue-500 transition"
                aria-label={
                  isSpeaking ? "Stop speaking" : "Listen to translation"
                }
              >
                {isSpeaking ? (
                  <BsFillStopFill size={20} />
                ) : (
                  <BsFillVolumeUpFill size={20} />
                )}
              </button>
              <p className="text-[10px] text-primary text-center sm:text-right">
                {chatDate}
              </p>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
