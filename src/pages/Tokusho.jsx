import React from "react";
const Tokusho = () => {
  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#1e293b] font-sans">
      <main className="container mx-auto px-4 md:px-6 py-14 max-w-3xl">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
            お知らせ
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">
            現在はご案内を行っていません。
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/legal"
              className="inline-flex items-center justify-center px-5 py-3 rounded-2xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50"
            >
              戻る
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tokusho;
