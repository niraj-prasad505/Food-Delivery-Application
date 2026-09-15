// src/components/admin/StatCard.jsx

const ICON_BG = {
  red: "bg-rose-50 text-rose-500",
  orange: "bg-[#fff0ea] text-[#e14a22]",
  green: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
};

/**
 * icon: a component from Icons.jsx, e.g. <CartIcon />
 * color: "red" | "orange" | "green" | "blue"
 * change: optional string like "+12.5%" — shown in green if trend="up", red if "down"
 */
export default function StatCard({ icon: Icon, label, value, change, trend = "up", color = "orange" }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_18px_rgba(24,24,48,0.06)] p-5 flex items-start gap-3.5">
      {Icon && (
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${ICON_BG[color]}`}>
          <Icon size={22} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[13px] text-gray-400 mb-1">{label}</p>
        <p className="text-[24px] font-extrabold leading-tight mb-1 text-gray-900">{value}</p>
        {change && (
          <span
            className={`text-[12px] font-semibold inline-flex items-center gap-1 ${
              trend === "up" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {trend === "up" ? "↑" : "↓"} {change}
            <span className="text-gray-400 font-normal ml-0.5">vs last week</span>
          </span>
        )}
      </div>
    </div>
  );
}
