import { motion } from "framer-motion";
import { Crown } from "lucide-react";

const DiscordMemberListMock = ({ user }) => (
  <motion.div
    whileHover={{
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
      borderColor: "rgba(100, 100, 100, 0.5)",
    }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="w-64 bg-[#313338] rounded-xl overflow-hidden shadow-2xl border border-[#1e1f22] font-sans"
  >
    <div className="bg-[#2b2d31] p-3 border-b border-[#1e1f22] flex items-center justify-between">
      <span className="text-[#f2f3f5] font-bold text-xs"># general</span>
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-[#1e1f22]"></div>
        <div className="w-2 h-2 rounded-full bg-[#1e1f22]"></div>
      </div>
    </div>

    <div className="p-3 bg-[#313338]">
      <div className="text-[#949ba4] text-[11px] font-bold uppercase tracking-wide mb-2 px-1 hover:text-[#dbdee1] transition-colors cursor-default">
        Supporters — 1
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, x: -10 }}
        whileInView={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ backgroundColor: "rgba(64, 66, 73, 0.6)", x: 2 }}
        className="flex items-center gap-3 p-1.5 rounded cursor-pointer group relative"
      >
        <div className="relative">
          <img
            src={
              user?.avatar ||
              "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f464.svg"
            }
            className="w-8 h-8 rounded-full bg-slate-200"
            alt=""
          />
          <div className="absolute -bottom-0.5 -right-0.5 bg-[#313338] rounded-full p-[3px]">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div>
          <div className="text-[#5fbb4e] font-medium text-sm group-hover:underline flex items-center gap-1">
            {user?.name ?? "Guest"}
            <Crown
              size={12}
              className="fill-current text-[#ffcc00] stroke-[#ffcc00] stroke-[1px]"
            />
          </div>
          <div className="text-[11px] text-[#949ba4]">Playing Minecraft</div>
        </div>
      </motion.div>

      <div className="mt-4 opacity-50">
        <div className="text-[#949ba4] text-[11px] font-bold uppercase tracking-wide mb-2 px-1">
          Members — 3
        </div>
        {["Steve", "Alex", "Zombie"].map((name, i) => (
          <motion.div
            key={i}
            whileHover={{ backgroundColor: "rgba(64, 66, 73, 0.6)", x: 2 }}
            className="flex items-center gap-3 p-1.5 rounded cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-xs font-bold">
              {name[0]}
            </div>
            <div>
              <div className="text-[#dbdee1] text-sm font-medium">{name}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default DiscordMemberListMock;
