// src/pages/admin/Shops.jsx
import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import StatCard from "../../components/admin/StatCard";
import SearchBar from "../../components/admin/SearchBar";
import StatusBadge from "../../components/admin/StatusBadge";
import DataTable from "../../components/admin/DataTable";
import ShopModal from "../../components/admin/ShopModal";
import { StoreIcon, PlusIcon, EyeIcon, PencilIcon, BlockIcon, MapPinIcon } from "../../components/admin/Icons";
import { initialShops } from "../../data/admin/shopsData";

const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "blocked", label: "Blocked" },
];

const LOCATIONS = ["All Locations", "Patna", "Ranchi", "Gaya", "Darjeeling"];

export default function Shops() {
  const [shops, setShops] = useState(initialShops);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState(null);

  const stats = useMemo(
    () => ({
      total: shops.length,
      active: shops.filter((s) => s.status === "active").length,
      pending: shops.filter((s) => s.status === "pending").length,
      blocked: shops.filter((s) => s.status === "blocked").length,
    }),
    [shops]
  );

  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      const matchesTab = tab === "all" || shop.status === tab;
      const matchesLocation = location === "All Locations" || shop.location === location;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        shop.name.toLowerCase().includes(q) ||
        shop.owner.toLowerCase().includes(q) ||
        shop.category.toLowerCase().includes(q);
      return matchesTab && matchesLocation && matchesQuery;
    });
  }, [shops, tab, location, query]);

  const openCreateModal = () => {
    setEditingShop(null);
    setModalOpen(true);
  };

  const openEditModal = (shop) => {
    setEditingShop(shop);
    setModalOpen(true);
  };

  const handleSaveShop = (shop) => {
    setShops((prev) => {
      const exists = prev.some((s) => s.id === shop.id);
      return exists ? prev.map((s) => (s.id === shop.id ? shop : s)) : [shop, ...prev];
    });
  };

  const toggleBlock = (shop) => {
    setShops((prev) =>
      prev.map((s) => (s.id === shop.id ? { ...s, status: s.status === "blocked" ? "active" : "blocked" } : s))
    );
  };

  const columns = [
    {
      key: "shop",
      label: "Shop",
      primary: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#fff0ea] text-[#e14a22] flex items-center justify-center shrink-0">
            <StoreIcon size={16} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{row.name}</p>
            <p className="text-[12px] text-gray-400 truncate">{row.category}</p>
          </div>
        </div>
      ),
    },
    { key: "owner", label: "Owner" },
    {
      key: "location",
      label: "Location",
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-gray-600">
          <MapPinIcon className="text-gray-400" /> {row.location}
        </span>
      ),
    },
    { key: "category", label: "Category" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "joinedOn", label: "Joined On" },
    {
      key: "actions",
      label: "Actions",
      hideLabel: true,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openEditModal(row)}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#e14a22] hover:border-[#ff5a36] hover:bg-[#fff0ea]"
            title="View / Edit shop"
          >
            <EyeIcon size={15} />
          </button>
          <button
            onClick={() => openEditModal(row)}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#e14a22] hover:border-[#ff5a36] hover:bg-[#fff0ea]"
            title="Edit shop"
          >
            <PencilIcon size={15} />
          </button>
          <button
            onClick={() => toggleBlock(row)}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50"
            title={row.status === "blocked" ? "Unblock shop" : "Block shop"}
          >
            <BlockIcon size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Shops" subtitle="Manage all restaurants and food shops on SnackDrop.">
      <PageHeader
        title="Shops"
        subtitle="Manage all restaurants and food shops on SnackDrop."
        action={{ label: "Create New Shop", icon: PlusIcon, onClick: openCreateModal }}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4.5 mb-5">
        <StatCard icon={StoreIcon} label="Total Shops" value={stats.total} color="orange" />
        <StatCard icon={StoreIcon} label="Active" value={stats.active} color="green" />
        <StatCard icon={StoreIcon} label="Pending" value={stats.pending} color="blue" />
        <StatCard icon={StoreIcon} label="Blocked" value={stats.blocked} color="red" />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_18px_rgba(24,24,48,0.06)] p-5">
        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold border transition-colors ${
                tab === t.key
                  ? "bg-gray-900 border-gray-900 text-white"
                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1">
            <SearchBar value={query} onChange={setQuery} placeholder="Search shops by name, owner or category..." />
          </div>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-700 outline-none focus:border-[#ff5a36] sm:w-45"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <DataTable
          columns={columns}
          rows={filteredShops}
          emptyTitle="No shops found"
          emptyText="Try adjusting your search or filters."
        />
      </div>

      <ShopModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveShop} initialData={editingShop} />
    </AdminLayout>
  );
}
