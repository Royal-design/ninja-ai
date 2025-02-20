import { summarizeText } from "@/ai/summarizeText";
import { translateText } from "@/ai/translateText";
import {
  setError,
  setSummarizeLoading,
  setSummary,
  setTranslatedText,
  setTranslateLoading
} from "@/redux/slice/chatSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { TextInput } from "./TextInput";
import { Message } from "./Message";
import { toast } from "sonner";
import { Navbar } from "./Navbar";

export const ChatInterface = () => {
  const dispatch = useAppDispatch();
  const { chats, activeChatId, selectedLang } = useAppSelector(
    (state) => state.chat
  );

  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const messages = activeChat ? activeChat.messages : [];
  console.log(chats);

  console.log("Messages from Redux:", messages);

  const handleTranslate = async (id: number, text: string, lang: string) => {
    if (!activeChatId) return;

    dispatch(setTranslateLoading({ id, loading: true }));

    if (!selectedLang) {
      toast.warning("Please select the language");
      dispatch(setTranslateLoading({ id, loading: false }));
      return;
    }

    try {
      const translatedText = await translateText(text, lang, selectedLang);
      dispatch(setTranslatedText({ id, text: translatedText }));
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
      const summary = await summarizeText(text);
      dispatch(setSummary({ id, text: summary }));
    } catch (err) {
      dispatch(setError("Summarization failed."));
    } finally {
      dispatch(setSummarizeLoading({ id, loading: false }));
    }
  };

  return (
    <div className=" bg-background flex flex-col max-h-screen p-4">
      <Navbar />
      <div className="gap-2 mt-8 overflow-auto scrollbar-hidden  h-screen  w-full max-sm:px-2 px-[4rem]">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <Message
              key={msg.id}
              id={msg.id}
              text={msg.text}
              type={msg.type}
              lang={msg.lang}
              onTranslate={handleTranslate}
              onSummarize={handleSummarize}
              isSummarizing={msg.isSummarizing ?? false}
              isTranslating={msg.isTranslating ?? false}
              date={msg.timestamp}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground mt-10">
            What is on your mind?
          </p>
        )}
      </div>

      <TextInput />
    </div>
  );
};
