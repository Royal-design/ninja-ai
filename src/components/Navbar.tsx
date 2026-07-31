import { Link } from "react-router-dom";
import { MessageSquarePlus } from "lucide-react";
import logo from "../assets/image/ninjalogo.png";
import { LanguageOptions } from "./LanguageOptions";
import { Theme } from "./Theme";
import { useAppDispatch } from "@/redux/store";
import { createNewChat } from "@/redux/slice/chatSlice";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  sidebarTrigger?: React.ReactNode;
  isSidebarOpen?: boolean;
}

export const Navbar = ({
  sidebarTrigger,
  isSidebarOpen = false
}: NavbarProps) => {
  const dispatch = useAppDispatch();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-1.5">
        {sidebarTrigger}
        <Link
          to="/"
          className={cn(
            "flex items-center gap-2 rounded-lg",
            isSidebarOpen && "md:hidden"
          )}
          aria-label="Ninja.AI home"
        >
          <img src={logo} alt="" className="size-8 object-contain" />
          <span className="font-display text-lg font-bold tracking-tight">
            Ninja.AI
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="hidden sm:block">
          <LanguageOptions />
        </div>
        <div className="sm:hidden">
          <LanguageOptions compact />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="New chat"
          onClick={() => dispatch(createNewChat())}
          className="size-9 rounded-full text-muted-foreground hover:text-foreground md:hidden"
        >
          <MessageSquarePlus className="size-5" />
        </Button>

        <Theme />
      </div>
    </header>
  );
};
