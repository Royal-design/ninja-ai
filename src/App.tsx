import { ChatLayout } from "./Layout/ChatLayout";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <main className="h-screen overflow-auto scrollbar-hidden ">
      <Toaster position="top-center" />
      <ChatLayout />;
    </main>
  );
}

export default App;
