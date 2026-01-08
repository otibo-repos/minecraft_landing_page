import React from "react";
import Seo from "../components/Seo";
import Footer from "../components/layout/Footer";

const Help = () => {
  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#1e293b] font-sans">
      <main className="container mx-auto px-4 md:px-6 py-16 max-w-4xl">
        <div className="rounded-3xl bg-white/80 border border-slate-100 shadow-sm px-6 py-16 text-center">
          <p className="text-base md:text-lg font-bold text-slate-600">
            現在はヘルプページがありません。 (Dummy)
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
