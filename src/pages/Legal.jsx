import React from "react";

const LegalPage = () => {
  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#1e293b] font-sans">
      <style>{`
        body { font-family: 'M PLUS Rounded 1c', sans-serif; }
        h1, h2, h3, .brand-font { font-family: 'Outfit', sans-serif; }
      `}</style>
      <main className="container mx-auto px-4 md:px-6 py-16 max-w-4xl">
        <div className="rounded-3xl bg-white/80 border border-slate-100 shadow-sm px-6 py-16 text-center">
          <p className="text-base md:text-lg font-semibold text-slate-600">
            現在は規約がありません。
          </p>
        </div>
      </main>
    </div>
  );
};

export default LegalPage;
