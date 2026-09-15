// src/components/admin/SearchBar.jsx
import { SearchIcon } from "./Icons";

/**
 * Controlled search input.
 *   <SearchBar value={q} onChange={setQ} placeholder="Search shops..." />
 * Also works uncontrolled if you just want the header decoration.
 */
export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative flex items-center w-full">
      <SearchIcon size={17} className="absolute left-3.5 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-[#f6f7fb] text-[13.5px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#ff5a36] focus:bg-white transition-colors"
      />
    </div>
  );
}
