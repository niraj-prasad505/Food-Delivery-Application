// src/components/admin/StatusBadge.jsx

// Maps every status string used across the admin panel to a color tone.
// Add new statuses here as new pages (Orders, Reviews...) are built.
const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-600",
  delivered: "bg-emerald-50 text-emerald-600",
  confirmed: "bg-blue-50 text-blue-600",
  pending: "bg-amber-50 text-amber-600",
  preparing: "bg-amber-50 text-amber-600",
  inactive: "bg-rose-50 text-rose-600",
  blocked: "bg-rose-50 text-rose-600",
  cancelled: "bg-rose-50 text-rose-600",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status?.toLowerCase()] || "bg-gray-100 text-gray-500";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-bold capitalize whitespace-nowrap ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
