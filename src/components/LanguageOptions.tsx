import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import { setSelectedLang } from "@/redux/slice/chatSlice";
import { HiOutlineLanguage } from "react-icons/hi2";
import { languages } from "@/assets/data/Languages";

export const LanguageOptions = () => {
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
    <div className="flex items-center justify-center gap-4">
      <div className="flex items-center border rounded-md p-1 px-2 gap-2">
        <img
          src={flagUrl}
          alt="Detected Flag"
          className="w-6 h-6 rounded-full"
        />
        <span className="text-sm font-semibold">
          {detectedName || "Unknown"}
        </span>
      </div>

      {/* Language Swap Button */}
      <button onClick={handleSwapLanguages} className="text-2xl">
        <HiOutlineLanguage />
      </button>

      {/* Language Selection Dropdown */}
      <div className="flex items-center gap-2">
        <Select
          value={selectedLang}
          onValueChange={(value) => dispatch(setSelectedLang(value))}
        >
          <SelectTrigger className="w-40 border rounded-lg p-2">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem
                disabled={
                  lang.name.toLowerCase() === detectedCode.toLowerCase()
                }
                key={lang.code}
                value={lang.code}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={lang.flag}
                    alt={lang.name}
                    className="w-6 h-6 rounded-full"
                  />
                  {lang.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
