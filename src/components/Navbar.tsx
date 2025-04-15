import { LanguageOptions } from "./LanguageOptions";
import logo from "../assets/image/ninjalogo.png";
import { Link } from "react-router-dom";
import { useAppDispatch } from "@/redux/store";
import { createNewChat } from "@/redux/slice/chatSlice";
import { TbMessageCirclePlus } from "react-icons/tb";

export interface SidebarProps {
  isSidebarOpen: boolean;
  sidebarTrigger?: React.ReactNode;
}

export const Navbar = ({ isSidebarOpen, sidebarTrigger }: SidebarProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className="w-full bg-background pt-4">
      <div
        className={`fixed top-0 pt-4 pb-10 flex bg-background items-center w-full max-sm:flex-col max-sm:gap-3 justify-between max-sm:justify-center max-sm:mb-4 ${
          isSidebarOpen ? "md:left-20 md:pl-50 md:pr-30" : "md:left-0 md:px-30"
        } left-0 transition-[left] `}
      >
        <div className="md:flex justify-between w-full hidden">
          <div className="gap-4">
            <Link to="/">
              <div className="flex items-center gap-2">
                <img src={logo} alt="logo" className="size-8" />
                <h2 className="text-xl font-bold">Ninja.AI</h2>
              </div>
            </Link>
          </div>

          <div>
            <LanguageOptions />
          </div>
        </div>

        {/* Mobile layout */}
        <div className="flex flex-col md:hidden w-full">
          <div className="mb-4 flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-3">
              {sidebarTrigger}
              <Link to="/">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="logo" className="size-8" />
                  <h2 className="text-xl font-bold">Ninja.AI</h2>
                </div>
              </Link>
            </div>

            <div onClick={() => dispatch(createNewChat())}>
              <TbMessageCirclePlus size={30} strokeWidth={1} />
            </div>
          </div>

          <LanguageOptions />
        </div>
      </div>
    </div>
  );
};
