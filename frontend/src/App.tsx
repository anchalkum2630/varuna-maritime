import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import RoutesPage from "./pages/RoutesPage";
import ComparePage from "./pages/ComparePage";
import BankingPage from "./pages/BankingPage";
import PoolingPage from "./pages/PoolingPage";

export default function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/routes" />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/banking" element={<BankingPage />} />
        <Route path="/pooling" element={<PoolingPage />} />
      </Routes>
    </Router>
  );
}
