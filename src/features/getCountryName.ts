export const getCountryName = (code: string) => {
  return new Intl.DisplayNames(["en"], { type: "region" }).of(
    code.toUpperCase()
  );
};
