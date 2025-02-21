import { AI } from "./aiInterface/AI";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <main className="h-screen overflow-auto scrollbar-hidden ">
      <Toaster position="top-center" />
      <AI />
    </main>
  );
}

export default App;
