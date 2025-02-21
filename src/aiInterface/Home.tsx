import { motion } from "framer-motion";
import logo from "../assets/image/ninjalogo.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <main className="flex flex-col gap-8 items-center justify-center min-h-screen bg-background text-white px-6">
      <motion.img
        src={logo}
        alt="AI Translation"
        className="w-20 md:w-20 mt-8"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1 }}
      />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl text-primary font-extrabold">
          Welcome to{" "}
          <span className="text-[#2b1902] dark:text-[#4c310f]">Ninja.AI</span>
        </h1>
        <p className="text-lg md:text-xl mt-4 text-gray-500 dark:text-gray-300">
          AI-powered <span className="text-blue-400">Translation</span> and{" "}
          <span className="text-green-400">Summarization</span> at your
          fingertips.
        </p>
      </motion.div>

      <motion.div
        className="mt-8 flex flex-col md:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <Link to="/translate">
          <Button className="px-6 py-3 bg-blue-500 rounded-lg text-white font-bold hover:bg-blue-600 transition">
            Try Translation
          </Button>
        </Link>
        <Link to="/summarize">
          <Button className="px-6 py-3 bg-green-500 rounded-lg text-white font-bold hover:bg-green-600 transition">
            Try Summarization
          </Button>
        </Link>
      </motion.div>
    </main>
  );
};
