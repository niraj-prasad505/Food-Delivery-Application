// src/components/admin/EmptyState.jsx
import { InboxIcon } from "./Icons";

export default function EmptyState({ title = "Nothing here yet", text }) {
  return (
    <div className="text-center py-12 px-5 text-gray-400">
      <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3.5 text-gray-400">
        <InboxIcon size={26} />
      </div>
      <h4 className="text-gray-900 text-[15px] font-semibold mb-1">{title}</h4>
      {text && <p className="text-[13px]">{text}</p>}
    </div>
  );
}
