import { langToCountry } from "@/assets/data/Languages";

const countryToLanguage: Record<string, string> = {
  us: "en",
  gb: "en",
  uk: "en",
  au: "en",
  ca: "en",
  ie: "en",
  nz: "en",
  za: "en",
  ng: "en",
  en: "en",
  pt: "pt",
  es: "es",
  ru: "ru",
  tr: "tr",
  fr: "fr",
  de: "de"
};

Object.entries(langToCountry).forEach(([langCode, countryCode]) => {
  if (!(countryCode in countryToLanguage)) {
    countryToLanguage[countryCode] = langCode;
  }
});

export const getSpeechLanguage = (code?: string): string | undefined => {
  const c = (code || "").toLowerCase();
  if (!c) return undefined;
  return countryToLanguage[c] ?? c;
};

export const speakText = (
  text: string,
  lang: string | undefined,
  isSpeaking: boolean,
  setIsSpeaking: (state: boolean) => void
) => {
  if (!window.speechSynthesis) {
    alert("Your browser does not support text-to-speech.");
    return;
  }

  if (isSpeaking) {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  } else {
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang) {
      utterance.lang = lang;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }
};
