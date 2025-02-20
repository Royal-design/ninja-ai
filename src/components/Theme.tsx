import { toggleTheme } from "@/redux/slice/themeSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const Theme = () => {
  const dispatch: AppDispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const changeTheme = () => {
    dispatch(toggleTheme());
  };
  return (
    <div>
      <label htmlFor="switch" className="switch">
        <input onChange={changeTheme} id="switch" type="checkbox" />
        <span className="slider" />
        <span className="decoration" />
      </label>
    </div>
  );
};
