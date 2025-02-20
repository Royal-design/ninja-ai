// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from "@/components/ui/card";
// import { RiVoiceprintLine } from "react-icons/ri";
// import { Button } from "./ui/button";
// import { languages } from "@/assets/data/Languages";
// import { HiOutlineLanguage } from "react-icons/hi2";

// interface MessageProps {
//   id: number;
//   text: string;
//   type: "user" | "translation" | "summary";
//   lang: string;
//   onTranslate: (id: number, text: string, lang: string) => void;
//   onSummarize: (id: number, text: string) => void;
//   isTranslating: boolean;
//   isSummarizing: boolean;
// }

// export const Message: React.FC<MessageProps> = ({
//   id,
//   text,
//   type,
//   lang,
//   onTranslate,
//   isSummarizing,
//   isTranslating,
//   onSummarize
// }) => {
//   const language = languages.find((language) => language.code === lang)?.name;
//   const flag = languages.find((language) => language.code === lang)?.flag;
//   return (
//     <Card
//       className={`p-3 max-w-md flex bg-card flex-col gap-4 shadow-none w-sm border rounded-2xl mb-2 ${
//         type === "user" ? "ml-auto" : "mr-auto"
//       } `}
//     >
//       <CardHeader className="p-0">
//         <CardTitle />
//       </CardHeader>
//       <CardContent className="p-0">
//         <p className={type === "user" ? "font-semibold" : "text-primary"}>
//           {type === "user" ? (
//             <div className="flex gap-4 items-center">
//               <div className="">
//                 <RiVoiceprintLine />
//               </div>
//               <p className="leading-[150%]">{text}</p>
//             </div>
//           ) : type === "translation" ? (
//             <div className="flex gap-4 items-center">
//               <div className="">
//                 <HiOutlineLanguage className="size-4" />
//               </div>
//               <p className="leading-[150%]">{text}</p>
//             </div>
//           ) : (
//             `📌 ${text}`
//           )}
//         </p>
//         <div className="flex gap-4 mt-4">
//           {type === "user" && (
//             <img src={flag} alt={lang} className="size-4 rounded-full" />
//           )}
//           {type === "user" && <p className="text-xs"> {language}</p>}
//         </div>
//       </CardContent>

//       <CardFooter className="p-0">
//         {type === "user" && (
//           <div className="flex items-center mt-2">
//             <Button
//               onClick={() => onTranslate(id, text, lang)}
//               className="ml-2 text-sm text-primary bg-button transition-colors hover:bg-button-hover duration-200 "
//             >
//               {isTranslating ? "Translating " : "Translate"}
//             </Button>

//             {text.length > 150 && lang === "en" && (
//               <Button
//                 onClick={() => onSummarize(id, text)}
//                 className="ml-2 text-sm bg-button hover:bg-button-hover duration-200 text-primary "
//               >
//                 {isSummarizing ? "Summarizing " : "Summarize"}
//               </Button>
//             )}
//           </div>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { RiVoiceprintLine } from "react-icons/ri";
import { Button } from "./ui/button";
import { languages } from "@/assets/data/Languages";
import { HiOutlineLanguage } from "react-icons/hi2";
import { formatDate } from "@/features/formatDate";
import { GrLanguage } from "react-icons/gr";

interface MessageProps {
  id: number;
  text: string;
  type: "user" | "translation" | "summary";
  lang: string;
  onTranslate: (id: number, text: string, lang: string) => void;
  onSummarize: (id: number, text: string) => void;
  isTranslating: boolean;
  isSummarizing: boolean;
  date: string;
}

export const Message: React.FC<MessageProps> = ({
  id,
  text,
  type,
  lang,
  onTranslate,
  isSummarizing,
  isTranslating,
  date,
  onSummarize
}) => {
  const languageData = languages.find((language) => language.code === lang);
  const language = languageData?.name || "Unknown";
  const flag = languageData?.flag || "";
  const chatDate = formatDate(date);
  return (
    <Card
      className={`p-3 max-w-md flex bg-card flex-col gap-4 shadow-none max-sm:w-full w-sm border rounded-2xl mb-2 ${
        type === "user" ? "ml-auto" : "mr-auto"
      }`}
    >
      <CardHeader className="p-0">
        <CardTitle />
      </CardHeader>
      <CardContent className="p-0">
        <div className={type === "user" ? "font-semibold" : "text-primary"}>
          {type === "user" ? (
            <div className="flex gap-4 items-center">
              <div className="">
                <RiVoiceprintLine />
              </div>
              <p className="leading-[150%]">{text}</p>
            </div>
          ) : type === "translation" ? (
            <div className="flex gap-4 items-center">
              <HiOutlineLanguage className="size-4" />
              <p className="leading-[150%]">{text}</p>
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <div className="">
                <GrLanguage className="size-4" />
              </div>
              <p className="leading-[150%]">{text}</p>
            </div>
          )}
        </div>

        {type === "user" && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 mt-4 items-center">
              {flag && (
                <img src={flag} alt={lang} className="size-4 rounded-full" />
              )}
              <p className="text-xs">{language}</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-0 flex gap-2  items-end justify-between">
        <div className="">
          {type === "user" && (
            <div className="flex items-center mt-2">
              <Button
                onClick={() => onTranslate(id, text, lang)}
                className="ml-2 text-sm text-primary bg-button transition-colors hover:bg-button-hover duration-200"
                disabled={isTranslating}
              >
                {isTranslating ? "Translating..." : "Translate"}
              </Button>

              {text.length > 150 && lang === "en" && (
                <Button
                  onClick={() => onSummarize(id, text)}
                  className="ml-2 text-sm bg-button hover:bg-button-hover duration-200 text-primary"
                  disabled={isSummarizing}
                >
                  {isSummarizing ? "Summarizing..." : "Summarize"}
                </Button>
              )}
            </div>
          )}
        </div>

        <p className="text-[10px] text-primary">{chatDate}</p>
      </CardFooter>
    </Card>
  );
};
