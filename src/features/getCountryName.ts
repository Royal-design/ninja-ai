import { langToCountryName } from "@/assets/data/Languages";

export const getCountryName = (code: string): string => {
  try {
    const lowerCode = code.toLowerCase();

    if (lowerCode in langToCountryName) {
      return langToCountryName[lowerCode];
    }

    return (
      new Intl.DisplayNames(["en"], { type: "region" }).of(
        code.toUpperCase()
      ) || code
    );
  } catch (error) {
    return code;
  }
};
