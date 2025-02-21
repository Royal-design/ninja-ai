import React from "react";
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
  const translatedLanguageData = languages.find(
    (language) => language.code === translatedLang
  );
  const translatedLanguage = translatedLanguageData?.name;
  const translatedFlag = translatedLanguageData?.flag;
  const flag = `https://flagcdn.com/w40/${code}.png`;
  const chatDate = formatDate(date);

  return (
    <div
      className={`flex max-sm:w-full   items-start gap-2 mb-2 ${
        type === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
      }`}
    >
      <figure className="rounded-full bg-card w-8 h-8 p-2 flex items-center justify-center">
        {type === "user" ? (
          <CiUser size={22} />
        ) : (
          <img src={logo} alt="logo" className="size-5 object-cover" />
        )}
      </figure>

      <Card className="p-3 bg-card max-w-md w-sm  border shadow-none rounded-2xl">
        <CardHeader className="p-0">
          <CardTitle />
        </CardHeader>

        <CardContent className="p-0">
          <div className={type === "user" ? "font-semibold" : "text-primary"}>
            {type === "user" ? (
              <div className="flex gap-4 items-center">
                <p className="leading-[150%]">{text}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <p className="leading-[150%]">{text}</p>
                </div>

                {type === "translation" && (
                  <div className="flex gap-4 mt-2 items-center">
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
              </div>
            )}
          </div>

          {type === "user" && (
            <div className="flex gap-4 mt-2 items-center">
              {flag && (
                <img src={flag} alt={lang} className="size-4 rounded-full" />
              )}
              <p className="text-xs">{lang}</p>
            </div>
          )}
        </CardContent>

        {type === "user" && (
          <CardFooter className="p-0 flex gap-2 mt-4 items-end justify-between">
            <div className="flex items-center mt-2">
              <Button
                onClick={() => onTranslate(id, text)}
                className="ml-2 text-sm text-primary bg-button hover:bg-button-hover transition-colors duration-200"
                disabled={isTranslating}
              >
                {isTranslating ? "Translating..." : "Translate"}
              </Button>

              {text.length > 150 && (
                <Button
                  onClick={() => onSummarize(id, text)}
                  className="ml-2 text-sm bg-button hover:bg-button-hover transition-colors duration-200 text-primary"
                  disabled={isSummarizing}
                >
                  {isSummarizing ? "Summarizing..." : "Summarize"}
                </Button>
              )}
            </div>

            <p className="text-[10px] text-primary">{chatDate}</p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
