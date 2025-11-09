import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import RoutesPage from "./pages/RoutesPage";
import ComparePage from "./pages/ComparePage";
import BankingPage from "./pages/BankingPage";
import PoolingPage from "./pages/PoolingPage";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<RoutesPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/banking" element={<BankingPage />} />
          <Route path="/pooling" element={<PoolingPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
