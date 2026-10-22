import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Predict from "./pages/Predict";
import Results from "./pages/Results";
import About from "./pages/About";
import History from "./pages/History";
import Explain from "./pages/Explain";
import Report from "./pages/Report";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/results" element={<Results />} />
            <Route path="/explain" element={<Explain />} />
            <Route path="/history" element={<History />} />
            <Route path="/report" element={<Report />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
