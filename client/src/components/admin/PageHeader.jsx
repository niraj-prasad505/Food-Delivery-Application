// src/components/admin/PageHeader.jsx

/**
 * action: { label, icon: IconComponent, onClick }
 */
export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
      <div>
        <h1 className="text-[22px] sm:text-[24px] font-extrabold text-gray-900 mb-1">{title}</h1>
        {subtitle && <p className="text-[14px] text-gray-400 max-w-[520px]">{subtitle}</p>}
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-gradient-to-br from-[#ff5a36] to-[#e14a22] shadow-[0_4px_12px_rgba(255,90,54,0.25)] hover:shadow-[0_6px_16px_rgba(255,90,54,0.34)] active:scale-[0.98] transition"
        >
          {action.icon && <action.icon size={16} />}
          {action.label}
        </button>
      )}
    </div>
  );
}
