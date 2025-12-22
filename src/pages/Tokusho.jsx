import React from "react";
import { ExternalLink } from "lucide-react";

const Tokusho = () => {
  const emailAddress = "mailto:penne0505pp@gmail.com";

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#1e293b] font-sans">
      <main className="container mx-auto px-4 md:px-6 py-14 max-w-3xl">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
            特定商取引法に基づく表記の請求
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">
            特定商取引法に基づく表記は、申請いただいた方に個別にご案内します。以下の電子メールよりご請求ください。
          </p>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            確認でき次第、メールにて詳細をお送りします。返信には、現実的な対応可能時刻などに基づいてお時間をいただく場合があります。
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={emailAddress}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#5fbb4e] text-white font-bold shadow-[0_4px_0_#469e38] hover:bg-[#4a9a3d] active:translate-y-[2px] transition-colors"
            >
              メールを送る
              <ExternalLink size={16} />
            </a>
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
