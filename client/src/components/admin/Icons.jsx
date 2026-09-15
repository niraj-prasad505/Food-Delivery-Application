// Small hand-drawn line-icon set for the Admin Panel.
// Kept dependency-free (no lucide/react-icons) so this drops into any
// project regardless of which icon library (if any) is already installed.
// Every icon accepts `size` and `className` and uses `currentColor`,
// so color is controlled entirely via Tailwind text-* classes.

const base = (size) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

export const HomeIcon = ({ size = 18, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </svg>
);

export const StoreIcon = ({ size = 18, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M3 9.5 4.5 4h15L21 9.5" />
    <path d="M3.5 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
    <path d="M5 10v11h14V10" />
    <path d="M9.5 21v-6h5v6" />
  </svg>
);

export const PackageIcon = ({ size = 18, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M21 8 12 3 3 8l9 5 9-5Z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </svg>
);

export const CartIcon = ({ size = 18, className = "" }) => (
  <svg {...base(size)} className={className}>
    <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="17.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
    <path d="M2.5 3h2.2L7.4 14.6a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.5l1.7-6.9H5.4" />
  </svg>
);

export const StarIcon = ({ size = 18, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="m12 3 2.7 5.8 6.3.7-4.7 4.3 1.2 6.3L12 17l-5.5 3.1 1.2-6.3-4.7-4.3 6.3-.7Z" />
  </svg>
);

export const RupeeIcon = ({ size = 18, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M6 4h12" />
    <path d="M6 8h12" />
    <path d="M6 4a5 5 0 0 1 0 8h-1.5L15 20" />
  </svg>
);

export const SettingsIcon = ({ size = 18, className = "" }) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.6V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z" />
  </svg>
);

export const LogOutIcon = ({ size = 18, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M9 21H4.5A1.5 1.5 0 0 1 3 19.5v-15A1.5 1.5 0 0 1 4.5 3H9" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

export const SearchIcon = ({ size = 18, className = "" }) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const BellIcon = ({ size = 18, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M6 9a6 6 0 1 1 12 0c0 5 1.5 6.5 1.5 6.5h-15S6 14 6 9Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

export const ChevronDownIcon = ({ size = 16, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const MenuIcon = ({ size = 20, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M3 6h18" />
    <path d="M3 12h18" />
    <path d="M3 18h18" />
  </svg>
);

export const CloseIcon = ({ size = 18, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="m5 5 14 14" />
    <path d="m19 5-14 14" />
  </svg>
);

export const PlusIcon = ({ size = 16, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export const EyeIcon = ({ size = 16, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const PencilIcon = ({ size = 16, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

export const BlockIcon = ({ size = 16, className = "" }) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="m5.5 5.5 13 13" />
  </svg>
);

export const PercentIcon = ({ size = 18, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="m5 19 14-14" />
    <circle cx="7" cy="7" r="2.3" />
    <circle cx="17" cy="17" r="2.3" />
  </svg>
);

export const MegaphoneIcon = ({ size = 18, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M3 11v2a1 1 0 0 0 1 1h1l2 5h2l-1.6-5H10l9 4V6l-9 4H4a1 1 0 0 0-1 1Z" />
    <path d="M19 9.5v5" />
  </svg>
);

export const ArrowRightIcon = ({ size = 14, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const MapPinIcon = ({ size = 14, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.3" />
  </svg>
);

export const InboxIcon = ({ size = 24, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M3 12h4.5l1.5 3h6l1.5-3H21" />
    <path d="M5.5 5h13L21 12v6a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-6Z" />
  </svg>
);
