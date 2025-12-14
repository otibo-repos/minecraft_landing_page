import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from "lucide-react";

const PricingComponent = ({ onStartCheckout }) => {
  const [cycle, setCycle] = useState("monthly");

  const plans = {
    ticket: {
      price: 300,
      unit: "回",
      desc: "気軽にサーバーを支援",
      label: "Ticket",
      textColor: "text-lime-600",
      bgColor: "bg-lime-500",
      hoverBgColor: "hover:bg-lime-600",
      borderColor: "border-lime-200",
      iconBg: "bg-lime-500",
      shadowStyle: "shadow-[0_5px_0_#65a30d]",
    },
    monthly: {
      price: 300,
      unit: "月",
      desc: "継続的なサポート",
      label: "Monthly",
      textColor: "text-[#5fbb4e]",
      bgColor: "bg-[#5fbb4e]",
      hoverBgColor: "hover:bg-[#4ea540]",
      borderColor: "border-green-200",
      iconBg: "bg-[#5fbb4e]",
      shadowStyle: "shadow-[0_5px_0_#469e38]",
    },
    yearly: {
      price: 3000,
      unit: "年",
      desc: "１年分をまとめてお得に",
      label: "Yearly",
      textColor: "text-teal-600",
      bgColor: "bg-teal-600",
      hoverBgColor: "hover:bg-teal-700",
      borderColor: "border-teal-200",
      iconBg: "bg-teal-600",
      shadowStyle: "shadow-[0_5px_0_#0d9488]",
    },
  };

  const currentPlan = plans[cycle];
  const planKeys = ["ticket", "monthly", "yearly"];

  const handleDragEnd = (_event, info) => {
    const threshold = 50;
    const currentIndex = planKeys.indexOf(cycle);
    const offset = info.offset.x;

    if (offset < -threshold && currentIndex < planKeys.length - 1) {
      setCycle(planKeys[currentIndex + 1]);
    } else if (offset > threshold && currentIndex > 0) {
      setCycle(planKeys[currentIndex - 1]);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-slate-100 p-1.5 rounded-2xl flex relative mb-8">
        <div
          className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-sm transition-all duration-300 ease-out z-0"
          style={{
            left:
              cycle === "ticket"
                ? "0.375rem"
                : cycle === "monthly"
                ? "33.33%"
                : "calc(66.66% - 0.375rem)",
            width: "calc(33.33% - 0.25rem)",
          }}
        />
        {planKeys.map((c) => (
          <button
            key={c}
            onClick={() => setCycle(c)}
            className={`flex-1 relative z-10 py-2.5 text-sm font-bold capitalize transition-colors duration-300 ${
              cycle === c ? plans[c].textColor : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 -ml-4 md:hidden text-slate-300 animate-pulse pointer-events-none z-20">
          <ChevronLeft size={36} strokeWidth={3} />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-4 md:hidden text-slate-300 animate-pulse pointer-events-none z-20">
          <ChevronRight size={36} strokeWidth={3} />
        </div>

        <motion.div
          key={cycle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          whileHover={{
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            borderColor:
              cycle === "monthly"
                ? "#86efac"
                : cycle === "yearly"
                ? "#5eead4"
                : "#bef264",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ touchAction: "pan-y" }}
          className={`bg-white border-2 rounded-[2.5rem] p-8 soft-shadow relative overflow-hidden transition-colors duration-300 ${currentPlan.borderColor} cursor-grab active:cursor-grabbing z-10`}
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Leaf
              size={120}
              className={currentPlan.textColor.replace("text-", "text-opacity-50 text-")}
            />
          </div>

          <div className="mb-8 select-none">
            <div
              className={`font-bold text-sm uppercase tracking-wider mb-2 opacity-60 ${currentPlan.textColor}`}
            >
              {currentPlan.label} Plan
            </div>
            <div className="flex items-baseline gap-1 text-slate-800">
              <span className="text-2xl font-bold">¥</span>
              <span
                className={`text-6xl font-black tracking-tight brand-font ${currentPlan.textColor}`}
              >
                {currentPlan.price.toLocaleString()}
              </span>
              <span className="text-slate-400 font-bold">/ {currentPlan.unit}</span>
            </div>
            <p className="text-slate-500 mt-2 font-bold text-sm">{currentPlan.desc}</p>
          </div>

          <ul className="space-y-4 mb-8 select-none">
            {["サポーター限定Discordロール", "ゲーム内ネームカラー変更", "限定チャンネルへのアクセス"].map(
              (feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-slate-700 font-bold text-sm group/item"
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 ${currentPlan.iconBg} group-hover/item:scale-110 transition-transform`}
                  >
                    <Check size={12} strokeWidth={4} />
                  </div>
                  {feature}
                </li>
              )
            )}
          </ul>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const priceType =
                cycle === "ticket"
                  ? "one_month"
                  : cycle === "monthly"
                  ? "sub_monthly"
                  : "sub_yearly";

              if (typeof onStartCheckout === "function") {
                onStartCheckout(priceType);
              } else {
                fetch("/create-checkout-session", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    priceType: "one_month",
                    discord_user_id: "placeholder-user",
                  }),
                })
                  .then((res) =>
                    console.log("CTA test ping /create-checkout-session", res.status)
                  )
                  .catch((err) => console.error("CTA test ping failed", err));
              }
            }}
            className={`w-full text-white py-4 rounded-2xl font-bold text-lg btn-push flex justify-center items-center gap-2 group transition-colors duration-300 ${currentPlan.bgColor} ${currentPlan.hoverBgColor} ${currentPlan.shadowStyle} active:shadow-none active:translate-y-[5px]`}
          >
            このプランで支援する{" "}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>

      <div className="md:hidden flex justify-center gap-2 mt-6">
        {planKeys.map((k) => (
          <div
            key={k}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              cycle === k ? "bg-slate-400 scale-125" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingComponent;
