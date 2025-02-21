export const speakText = (
  text: string,
  lang: string,
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
    utterance.lang = lang;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }
};
