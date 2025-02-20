import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

// Add Chrome Origin Trial Tokens
const tokens = [
  import.meta.env.VITE_ORIGIN_TRIAL_TOKEN_TRANSLATE,
  import.meta.env.VITE_ORIGIN_TRIAL_TOKEN_DETECTOR,
  import.meta.env.VITE_ORIGIN_TRIAL_TOKEN_SUMMARISE
];

tokens.forEach((token) => {
  if (token) {
    const metaTag = document.createElement("meta");
    metaTag.name = "origin-trial";
    metaTag.content = token;
    document.head.appendChild(metaTag);
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
