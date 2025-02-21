import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CryptoPortfolio from "./pages/Portfolio";
import WalletAccounts from "./pages/Wallet";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/markets" element={<Market />} />
          <Route path="/portfolio" element={<CryptoPortfolio />} />
          <Route path="/wallet" element={<WalletAccounts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
