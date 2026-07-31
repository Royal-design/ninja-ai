import { Moon, Sun } from "lucide-react";
import { toggleTheme } from "@/redux/slice/themeSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export const Theme = ({ className }: { className?: string }) => {
  const dispatch: AppDispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);

  const changeTheme = () => {
    dispatch(toggleTheme());
    document.documentElement.classList.toggle("dark", theme === "light");
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={changeTheme}
      className={cn("rounded-full text-muted-foreground hover:text-foreground", className)}
    >
      <Sun className="hidden size-5 dark:block" />
      <Moon className="size-5 dark:hidden" />
    </Button>
  );
};
