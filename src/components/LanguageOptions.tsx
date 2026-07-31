import { ArrowLeftRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import { setSelectedLang } from "@/redux/slice/chatSlice";
import { languages } from "@/assets/data/Languages";

export const LanguageOptions = ({ compact = false }: { compact?: boolean }) => {
  const dispatch = useAppDispatch();
  const { selectedLang, detectedName, detectedCode } = useAppSelector(
    (state) => state.chat
  );

  const handleSwapLanguages = () => {
    if (detectedCode !== selectedLang) {
      dispatch(setSelectedLang(detectedCode));
    }
  };

  const flagUrl = detectedCode
    ? `https://flagcdn.com/w40/${detectedCode}.png`
    : "/default-flag.png";

  return (
    <div className="flex items-center gap-1.5">
      {!compact && (
        <div className="flex items-center gap-2 rounded-full border bg-card py-1 pl-2 pr-3">
          <img
            src={flagUrl}
            alt="Detected language"
            className="size-5 rounded-full object-cover"
          />
          <span className="text-xs font-medium">{detectedName || "Auto"}</span>
        </div>
      )}

      <button
        onClick={handleSwapLanguages}
        aria-label="Swap source and target language"
        className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <ArrowLeftRight className="size-4" />
      </button>

      <Select
        value={selectedLang}
        onValueChange={(value) => dispatch(setSelectedLang(value))}
      >
        <SelectTrigger
          aria-label="Target language"
          className="h-9 min-w-0 gap-2 rounded-full border bg-card px-3 text-xs font-medium [&>span]:flex [&>span]:items-center [&>span]:gap-1.5"
        >
          <SelectValue placeholder="Target" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <img
                src={lang.flag}
                alt={lang.name}
                className="size-5 rounded-full object-cover"
              />
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
