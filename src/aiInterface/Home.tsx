import { motion } from "framer-motion";
import { ArrowRight, Globe, Languages, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/image/ninjalogo.png";
import { Button } from "@/components/ui/button";
import { Theme } from "@/components/Theme";
import { useAppDispatch } from "@/redux/store";
import { createNewChat } from "@/redux/slice/chatSlice";

const FEATURES = [
  {
    icon: Languages,
    title: "Translate",
    copy: "Pick a target language and get a natural, ready-to-listen translation."
  },
  {
    icon: Globe,
    title: "Detect",
    copy: "Paste any text and Ninja.AI tells you which language it's written in."
  },
  {
    icon: Sparkles,
    title: "Summarize",
    copy: "Condense long texts — 150+ characters — into the key points."
  }
];

export const Home = () => {
  const dispatch = useAppDispatch();

  return (
    <main className="flex min-h-dvh flex-col bg-background px-6">
      <header className="flex h-16 shrink-0 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="Ninja.AI home">
          <img src={logo} alt="" className="size-9 object-contain" />
          <span className="font-display text-lg font-bold tracking-tight">
            Ninja.AI
          </span>
        </Link>
        <Theme />
      </header>

      <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-8 flex size-20 items-center justify-center rounded-3xl border bg-card shadow-sm"
        >
          <img src={logo} alt="" className="size-14 object-contain" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
        >
          Translate. Detect.
          <br />
          <span className="text-brand">Summarize.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg"
        >
          An AI language workspace that reads your text, figures out what
          language it is, and handles the rest — all in one conversation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-9 flex flex-col items-center gap-4"
        >
          <Link
            to="/chat"
            onClick={() => dispatch(createNewChat())}
            className="group"
          >
            <Button className="h-12 rounded-full px-7 text-base font-semibold">
              Open the workspace
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            No sign-up · chats stay in your browser
          </p>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mx-auto grid w-full max-w-4xl gap-4 pb-16 sm:grid-cols-3"
      >
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex flex-col gap-3 rounded-2xl border bg-card p-5 text-left shadow-sm"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
              <f.icon className="size-5" />
            </span>
            <h2 className="font-display text-base font-semibold">{f.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {f.copy}
            </p>
          </div>
        ))}
      </motion.section>

      <footer className="shrink-0 border-t border-border py-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
          Ninja.AI · Powered by Gemini
        </p>
      </footer>
    </main>
  );
};
