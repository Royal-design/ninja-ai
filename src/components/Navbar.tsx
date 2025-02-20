import { LanguageOptions } from "./LanguageOptions";
import logo from "../assets/image/ninjalogo.png";

export const Navbar = () => {
  return (
    <div className="w-full pt-4">
      <div className="flex items-center w-full max-sm:justify-center max-sm:mb-4 justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="size-8" />
          <h2 className="text-xl max-sm:text-center font-bold">Ninja.AI</h2>
        </div>

        <div className="max-sm:hidden">
          <LanguageOptions />
        </div>
      </div>
      <div className="hidden max-sm:block">
        <LanguageOptions />
      </div>
    </div>
  );
};
