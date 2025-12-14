import React from "react";

const Help = () => {
  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#1e293b] flex items-center justify-center px-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 max-w-lg w-full text-center space-y-3">
        <h1 className="text-2xl font-black text-slate-800">ヘルプ / FAQ</h1>
        <p className="text-sm text-slate-600">
          このページは準備中です。ご不便をおかけしますが、もうしばらくお待ちください。
        </p>
        <div className="text-xs text-slate-400">
          必要な情報が見つからない場合はメンバーシップページからお問い合わせください。
        </div>
      </div>
    </div>
  );
};

export default Help;
