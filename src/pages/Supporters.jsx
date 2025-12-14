import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Crown, Star, Shield, Filter } from "lucide-react";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";

// --- Mock Data ---
const MOCK_SUPPORTERS = [
  {
    id: "1",
    name: "CraftMaster_99",
    discriminator: "1234",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    plan: "Yearly",
    role: "Legendary Builder",
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    joinedAt: "2023-01-15",
  },
  {
    id: "2",
    name: "RedstonePro",
    discriminator: "5678",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    plan: "Monthly",
    role: "Supporter",
    color: "text-[#5fbb4e]",
    bg: "bg-[#5fbb4e]/10",
    border: "border-[#5fbb4e]/30",
    joinedAt: "2023-03-10",
  },
  {
    id: "3",
    name: "Steve_Jobs",
    discriminator: "9012",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zack",
    plan: "Ticket",
    role: "Member",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    joinedAt: "2023-05-20",
  },
];

const SupporterCard = ({ supporter, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
    className={`bg-white rounded-2xl p-6 border ${supporter.border} shadow-sm relative overflow-hidden group`}
  >
    {/* Decorative Background */}
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-20 transition-transform group-hover:scale-110 ${supporter.bg.replace('/10', '')}`} />
    
    <div className="flex items-start gap-4 relative z-10">
      <div className="relative">
        <img
          src={supporter.avatar}
          alt={supporter.name}
          className="w-16 h-16 rounded-2xl bg-slate-100 object-cover shadow-inner"
        />
        {supporter.plan === "Yearly" && (
          <div className="absolute -top-2 -right-2 bg-amber-400 text-white p-1 rounded-full shadow-sm border-2 border-white">
            <Crown size={12} fill="currentColor" />
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-slate-800 text-lg leading-tight">
            {supporter.name}
          </h3>
          <span className="text-xs text-slate-400 font-mono">#{supporter.discriminator}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${supporter.bg} ${supporter.color}`}>
            {supporter.plan} Plan
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            <Shield size={10} /> {supporter.role}
          </span>
        </div>

        <div className="text-[10px] text-slate-400 font-medium">
          Joined: {supporter.joinedAt}
        </div>
      </div>
    </div>
  </motion.div>
);

const Supporters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("discord_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = () => { window.location.href = "/membership"; };
  const handleLogout = () => { localStorage.removeItem("discord_user"); setUser(null); };
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-[#5fbb4e]/30 text-slate-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&family=Outfit:wght@500;700;900&display=swap');
        .font-display { font-family: 'Outfit', sans-serif; }
        .font-body { font-family: 'M PLUS Rounded 1c', sans-serif; }
      `}</style>

      <Header
        isLoggedIn={!!user}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onScrollTop={scrollToTop}
      />

      <main className="pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider mb-4"
            >
              <Star size={14} className="text-amber-400 fill-current" />
              Community Heroes
            </motion.div>
            <h1 className="font-display text-3xl md:text-4xl font-black text-slate-800 mb-4">
              Our Supporters
            </h1>
            <p className="font-body text-slate-500 font-medium max-w-xl mx-auto">
              サーバーの運営を支えてくれている素晴らしいメンバーたちです。<br className="hidden md:inline"/>
              彼らの支援によって、私たちは新しい冒険を作り続けることができます。
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="名前で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5fbb4e]/50 focus:border-[#5fbb4e] transition-all placeholder:text-slate-400"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                <Filter size={16} />
                <span>All Plans</span>
              </button>
              <div className="text-xs font-bold text-slate-400 px-2">
                Total: <span className="text-slate-800">1,240</span>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_SUPPORTERS.map((supporter, index) => (
              <SupporterCard key={supporter.id} supporter={supporter} index={index} />
            ))}
          </div>

          {/* Pagination Mock */}
          <div className="mt-12 flex justify-center gap-2">
            {[1, 2, 3, '...', 12].map((page, i) => (
              <button
                key={i}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                  page === 1 
                    ? "bg-[#5fbb4e] text-white shadow-md" 
                    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

        </div>
      </main>

      <Footer onScrollTop={scrollToTop} />
    </div>
  );
};

export default Supporters;