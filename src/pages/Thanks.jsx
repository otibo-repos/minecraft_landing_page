import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Copy,
  Crown,
  ExternalLink,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { PLANS } from "../constants/plans";
import { trackEvent, captureError } from "../analytics";

const DISCORD_CTA_URL = "https://discord.com/channels/746587719827980359/947145885798776902";

const formatYmd = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const glowAura = (
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-yellow-200/40 via-[#5fbb4e]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
);

const Confetti = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(22)].map((_, i) => (
      <ConfettiParticle key={i} delay={i * 0.12} x={`${Math.random() * 100}%`} type={i} />
    ))}
  </div>
);

const ConfettiParticle = ({ delay, x, type }) => {
  const colors = ["bg-yellow-400", "bg-[#5fbb4e]", "bg-pink-400", "bg-blue-400", "bg-purple-400"];
  const color = colors[type % colors.length];
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: 0, rotate: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, 150 + Math.random() * 220],
        x: [0, (Math.random() - 0.5) * 200],
        rotate: [0, 180 + Math.random() * 360],
        scale: [0, 1, 0.85],
      }}
      transition={{
        duration: 3 + Math.random() * 1.6,
        delay,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: Math.random() * 2.5,
      }}
      className={`absolute -top-10 w-3 h-3 rounded-sm ${color}`}
      style={{ left: x }}
    />
  );
};

const ReceiptRow = ({ label, value, copyable }) => (
  <div className="col-span-2">
    <div className="text-slate-400 text-xs font-bold mb-1">{label}</div>
    <div
      className={`group flex items-center justify-between rounded-lg px-3 py-2 border border-slate-100 bg-slate-50 ${
        copyable ? "cursor-pointer hover:bg-slate-100" : ""}
      `}
      onClick={() => {
        if (!copyable || !value) return;
        navigator.clipboard.writeText(value).catch(() => {});
        trackEvent("thanks_action_copy_id");
      }}
      role={copyable ? "button" : undefined}
      tabIndex={copyable ? 0 : undefined}
      onKeyDown={(e) => {
        if (!copyable) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigator.clipboard.writeText(value).catch(() => {});
          trackEvent("thanks_action_copy_id");
        }
      }}
    >
      <span className="font-mono text-slate-600 text-xs break-all">{value || "-"}</span>
      {copyable && (
        <span className="text-slate-400 group-hover:text-[#5fbb4e] transition-colors">
          <Copy size={14} />
        </span>
      )}
    </div>
  </div>
);

const Thanks = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user] = useState(() => {
    const stored = localStorage.getItem("discord_user");
    try {
      const parsed = stored ? JSON.parse(stored) : null;
      return parsed && parsed.id ? parsed : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    const sid = url.searchParams.get("session_id");
    if (!sid) {
      setError("セッションIDが見つかりません。決済の再実行をお試しください。");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/get-checkout-session?session_id=${encodeURIComponent(sid)}`);
        if (!res.ok) {
          setError("決済情報の取得に失敗しました。");
          captureError(new Error("session fetch failed"), { status: res.status, sid });
          setLoading(false);
          return;
        }
        const data = await res.json();
        setSession(data);
        trackEvent("thanks_view", { mode: data.mode, price_type: data.price_type });
      } catch (err) {
        captureError(err, { stage: "thanks_fetch" });
        setError("ネットワークエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const planLabel = useMemo(() => {
    if (!session?.price_type) return "";
    const plan = PLANS[session.price_type];
    if (!plan) return session.price_type;
    return `${plan.label} Plan`;
  }, [session]);

  const displayName = useMemo(() => {
    if (user?.name) return user.name;
    if (session?.customer_name) return session.customer_name;
    return "Guest";
  }, [user, session]);

  const amountDisplay = useMemo(() => {
    if (!session?.amount_total || !session.currency) return "-";
    const yen = session.currency.toLowerCase() === "jpy";
    if (yen) return `¥${session.amount_total.toLocaleString()}`;
    return `${session.currency.toUpperCase()} ${session.amount_total}`;
  }, [session]);

  const isSuccess = session?.payment_status === "paid" || session?.status === "complete";

  return (
    <div className="min-h-screen bg-[#f0f9ff] font-sans selection:bg-[#5fbb4e]/30 text-slate-800 flex flex-col overflow-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&family=Outfit:wght@500;700;900&display=swap');
        .font-display { font-family: 'Outfit', sans-serif; }
        .font-body { font-family: 'M PLUS Rounded 1c', sans-serif; }
        .text-gradient-gold {
          background: linear-gradient(135deg, #F59E0B 0%, #FCD34D 50%, #F59E0B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <Header
        isLoggedIn={!!user}
        user={user}
        onLogin={() => {}}
        onLogout={() => { localStorage.removeItem("discord_user"); window.location.reload(); }}
        onScrollTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />

      {glowAura}
      <Confetti />

      <main className="flex-grow pt-32 md:pt-36 pb-16 px-4 md:px-6 relative z-10 flex flex-col items-center">
        <div className="max-w-xl w-full text-center">
          {loading && (
            <div className="py-20 text-slate-500 font-bold">読み込み中です...</div>
          )}

          {!loading && error && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-6 shadow-sm">
              <div className="font-black text-lg mb-2">決済情報を確認できませんでした</div>
              <div className="text-sm font-medium mb-4">{error}</div>
              <a
                href="/membership"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                メンバーシップに戻る
              </a>
            </div>
          )}

          {!loading && !error && session && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                className="mb-6 relative inline-block"
              >
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: -35, opacity: 1, rotate: [0, -10, 10, 0] }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  className="absolute left-1/2 -translate-x-1/2 -top-2 z-20 text-yellow-400 drop-shadow-lg"
                >
                  <Crown size={48} fill="currentColor" strokeWidth={1.5} />
                </motion.div>

                <div className="relative z-10 p-2 bg-white rounded-full shadow-xl">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-yellow-300 relative bg-slate-100">
                    <img
                      src={user?.avatar || "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg"}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#5fbb4e] text-white p-2 rounded-full border-4 border-white shadow-lg">
                    <Check size={20} strokeWidth={4} />
                  </div>
                </div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 -m-8 pointer-events-none"
                >
                  <Sparkles className="absolute top-0 right-0 text-yellow-400" size={24} />
                  <Sparkles className="absolute bottom-0 left-0 text-[#5fbb4e]" size={20} />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                <div className="flex items-center justify-center gap-2 mb-2 text-yellow-500 font-bold uppercase tracking-widest text-xs">
                  <PartyPopper size={16} />
                  <span>Welcome to the club</span>
                  <PartyPopper size={16} className="scale-x-[-1]" />
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight leading-tight">
                  Thank You,
                  <br />
                  <span className="text-gradient-gold">{displayName}!</span>
                </h1>
                <p className="font-body text-slate-500 font-bold text-lg md:text-xl max-w-sm mx-auto">
                  ご支援ありがとうございます！
                  <br />
                  あなたのサポートがサーバーの力になります。
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 40, opacity: 0, rotateX: -15 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="perspective-1000 mb-10"
              >
                <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative transform transition-transform hover:scale-[1.02] duration-300">
                  <div className="h-3 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 w-full" />
                  <div className="p-8 pb-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="text-left">
                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-black text-[10px] uppercase tracking-wider mb-2">
                          Official Supporter
                        </span>
                        <h3 className="font-display font-bold text-xl text-slate-800">
                          {planLabel || "Support Plan"}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="font-display font-black text-2xl text-[#5fbb4e]">{amountDisplay}</div>
                        <div className="text-xs font-bold text-slate-400">Paid</div>
                      </div>
                    </div>

                    <div className="relative h-px w-full bg-slate-200 my-6">
                      <div className="absolute -left-10 -top-3 w-6 h-6 rounded-full bg-[#f0f9ff]" />
                      <div className="absolute -right-10 -top-3 w-6 h-6 rounded-full bg-[#f0f9ff]" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-left font-body text-sm">
                      <div>
                        <div className="text-slate-400 text-xs font-bold mb-1">Date</div>
                        <div className="font-bold text-slate-700">{formatYmd(session.created)}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs font-bold mb-1">Payment</div>
                        <div className="font-bold text-slate-700 flex items-center gap-2">
                          {session.payment_method || "-"}
                        </div>
                      </div>

                      <ReceiptRow
                        label="Transaction ID"
                        value={session.transaction_id}
                        copyable
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-12"
              >
                <div className="group relative bg-white p-1 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2] to-[#404EED] rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10 blur-sm translate-y-2" />
                  <div className="bg-white rounded-xl p-5 h-full flex flex-col items-center text-center border border-slate-100 group-hover:border-[#5865F2]/30 transition-colors">
                    <div className="w-12 h-12 bg-[#5865F2]/10 text-[#5865F2] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <ExternalLink size={24} />
                    </div>
                    <h3 className="font-display font-bold text-slate-800 mb-1">Discord を開く</h3>
                    <p className="text-xs text-slate-500 font-bold mb-4">
                      ロール付与を確認し、限定チャンネルへどうぞ。
                    </p>
                    <a
                      href={DISCORD_CTA_URL}
                      className="mt-auto w-full py-2 rounded-lg bg-[#5865F2] text-white text-sm font-bold shadow-[0_3px_0_#4752c4] active:shadow-none active:translate-y-[3px] transition-all flex items-center justify-center gap-2"
                      onClick={() => trackEvent("thanks_action_open_discord")}
                    >
                      Open Discord <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>

              {!isSuccess && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                  決済ステータスが未確定です。反映まで数分かかる場合があります。
                </div>
              )}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <a
                  className="text-slate-400 font-bold font-body text-sm hover:text-slate-600 transition-colors inline-flex items-center justify-center gap-2 mx-auto"
                  href="/membership"
                >
                  メンバーシップへ戻る
                </a>
              </motion.div>
            </>
          )}
        </div>
      </main>

      <Footer onScrollTop={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
    </div>
  );
};

export default Thanks;
