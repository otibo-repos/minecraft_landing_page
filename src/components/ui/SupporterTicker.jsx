import { motion } from "framer-motion";

const SupporterTicker = () => {
  const supporters = [
    { name: "CraftMaster_99", plan: "Monthly" },
    { name: "Yuki_Builder", plan: "Yearly" },
    { name: "Tanaka.T", plan: "Ticket" },
    { name: "Steve_Jobs", plan: "Yearly" },
    { name: "Miner_Alex", plan: "Monthly" },
    { name: "CreeperLover", plan: "Monthly" },
    { name: "RedstonePro", plan: "Yearly" },
    { name: "DiamondHunter", plan: "Ticket" },
  ];

  const getPlanStyle = (plan) => {
    switch (plan) {
      case "Ticket":
        return "text-lime-600 bg-lime-100 border-lime-200";
      case "Yearly":
        return "text-teal-600 bg-teal-100 border-teal-200";
      case "Monthly":
      default:
        return "text-[#5fbb4e] bg-[#5fbb4e]/10 border-green-200";
    }
  };

  const loopSupporters = [...supporters, ...supporters];

  return (
    <div className="flex overflow-hidden select-none">
      <motion.div
        className="flex gap-4 md:gap-6 pr-4 md:pr-6"
        animate={{ x: "-50%" }}
        transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
        whileHover={{ animationPlayState: "paused" }}
        style={{ width: "max-content" }}
      >
        {loopSupporters.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
            className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-slate-200 px-5 py-2.5 rounded-full shadow-sm whitespace-nowrap min-w-[200px] cursor-default transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
              {s.name[0]}
            </div>
            <div className="flex flex-col justify-center leading-none">
              <div className="text-sm font-bold text-slate-700 mb-1">{s.name}</div>
              <div
                className={`text-[9px] font-bold uppercase px-1.5 py-[2px] rounded border w-fit ${getPlanStyle(
                  s.plan
                )}`}
              >
                {s.plan}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SupporterTicker;
