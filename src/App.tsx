import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./aiInterface/Home";
import { TranslatePage } from "./pages/TranslatePage";

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<TranslatePage />} />
      </Routes>
    </Router>
  );
}

export default App;
