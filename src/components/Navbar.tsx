import { LanguageOptions } from "./LanguageOptions";
import logo from "../assets/image/ninjalogo.png";
import { Link } from "react-router-dom";
import { SidebarProps } from "@/aiInterface/ChatInterface";
import { useAppDispatch } from "@/redux/store";
import { IoCreateOutline } from "react-icons/io5";
import { createNewChat } from "@/redux/slice/chatSlice";

export const Navbar = ({ isSidebarOpen }: SidebarProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className="w-full bg-background pt-4 ">
      <div
        className={`fixed top-0 pt-4 pb-10 flex bg-background items-center w-full max-sm:flex-col max-sm:gap-3 justify-between max-sm:justify-center max-sm:mb-4 ${
          isSidebarOpen ? "md:left-20 md:pl-50 md:pr-30" : "md:left-0 md:px-30"
        } left-0 transition-[left]`}
      >
        <div className="max-sm:flex  max-sm:justify-between max-sm:w-full max-sm:px-12">
          <Link to="/">
            <div className="flex items-center gap-2">
              <img src={logo} alt="logo" className="size-8" />
              <h2 className="text-xl max-sm:text-center font-bold">Ninja.AI</h2>
            </div>
          </Link>
          <div
            onClick={() => dispatch(createNewChat())}
            className="hidden max-sm:block"
          >
            <IoCreateOutline size={30} />
          </div>
        </div>

        <div className="max-sm:mt-6">
          <LanguageOptions />
        </div>
      </div>
    </div>
  );
};
