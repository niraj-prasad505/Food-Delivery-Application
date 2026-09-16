// src/pages/admin/Shops.jsx

import { useEffect, useMemo, useState } from "react";

import AdminLayout from "../../components/admin/AdminLayout";
import PageHeader from "../../components/admin/PageHeader";
import StatCard from "../../components/admin/StatCard";
import SearchBar from "../../components/admin/SearchBar";
import StatusBadge from "../../components/admin/StatusBadge";
import DataTable from "../../components/admin/DataTable";
import ShopModal from "../../components/admin/ShopModal";

import {
  StoreIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  BlockIcon,
  MapPinIcon,
} from "../../components/admin/Icons";

import adminShopService from "../../services/adminShopService";


// Temporary status for shops.
// Your current backend does not have "pending".
const TEMP_PENDING_SHOPS = new Set();


const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "blocked", label: "Blocked" },
];


// Temporary locations.
// Backend currently provides "city".
const LOCATIONS = [
  "All Locations",
  "Patna",
  "Ranchi",
  "Gaya",
  "Darjeeling",
];


export default function Shops() {

  // ==============================
  // STATE
  // ==============================

  const [shops, setShops] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [tab, setTab] = useState("all");

  const [query, setQuery] = useState("");

  const [location, setLocation] = useState("All Locations");

  const [modalOpen, setModalOpen] = useState(false);

  const [editingShop, setEditingShop] = useState(null);


  // ==============================
  // GET ALL SHOPS
  // ==============================

  const fetchShops = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminShopService.getAllShops();

      setShops(response?.shops || []);

    } catch (error) {
      console.error("Failed to fetch shops:", error);

      setError(
        error?.response?.data?.message ||
        "Failed to load shops"
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchShops();
  }, []);


  // ==============================
  // STATS
  // ==============================

  const stats = useMemo(() => {

    const pending = shops.filter((shop) =>
      TEMP_PENDING_SHOPS.has(shop._id)
    ).length;

    const active = shops.filter(
      (shop) =>
        shop.isActive &&
        !TEMP_PENDING_SHOPS.has(shop._id)
    ).length;

    const blocked = shops.filter(
      (shop) => !shop.isActive
    ).length;

    return {
      total: shops.length,
      active,
      pending,
      blocked,
    };

  }, [shops]);


  // ==============================
  // FILTER SHOPS
  // ==============================

  const filteredShops = useMemo(() => {

    return shops.filter((shop) => {

      // --------------------------
      // TAB FILTER
      // --------------------------

      let matchesTab = true;

      if (tab === "active") {
        matchesTab =
          shop.isActive &&
          !TEMP_PENDING_SHOPS.has(shop._id);
      }

      if (tab === "pending") {
        matchesTab =
          TEMP_PENDING_SHOPS.has(shop._id);
      }

      if (tab === "blocked") {
        matchesTab = !shop.isActive;
      }


      // --------------------------
      // LOCATION FILTER
      // --------------------------

      const matchesLocation =
        location === "All Locations" ||
        shop.city === location;


      // --------------------------
      // SEARCH
      // --------------------------

      const q = query.trim().toLowerCase();

      const ownerName =
        typeof shop.owner === "string"
          ? shop.owner
          : shop.owner?.name || "";


      const matchesQuery =
        !q ||
        shop.name?.toLowerCase().includes(q) ||
        ownerName.toLowerCase().includes(q) ||
        shop.city?.toLowerCase().includes(q) ||
        shop.phone?.toLowerCase().includes(q);


      return (
        matchesTab &&
        matchesLocation &&
        matchesQuery
      );
    });

  }, [shops, tab, location, query]);


  // ==============================
  // CREATE SHOP
  // ==============================

  const openCreateModal = () => {

    setEditingShop(null);

    setModalOpen(true);
  };


  // ==============================
  // EDIT SHOP
  // ==============================

  const openEditModal = (shop) => {

    setEditingShop(shop);

    setModalOpen(true);
  };


  // ==============================
  // SAVE SHOP
  // ==============================
  //
  // This function receives the shop
  // from ShopModal.
  //
  // If the modal already calls the API,
  // we simply refresh the list.
  //
  // If the modal only returns data,
  // we update the frontend temporarily.
  // ==============================

  const handleSaveShop = async (shop) => {
    try {
        setError("");

        // ==========================
        // CREATE SHOP
        // ==========================

        if (!shop?._id) {
            const createData = {
                name: shop.name,
                description: shop.description,
                phone: shop.phone,
                address: shop.address,
                city: shop.city,
                deliveryRadiusKm: shop.deliveryRadiusKm,
                icon: shop.icon,
                images: shop.images,
            };

            const response =
                await adminShopService.createShop(createData);

            if (response?.shop) {
                setShops((prev) => [
                    response.shop,
                    ...prev,
                ]);
            }

        }

        // ==========================
        // UPDATE SHOP
        // ==========================

        else {
            const updateData = {
                name: shop.name,
                description: shop.description,
                phone: shop.phone,
                address: shop.address,
                city: shop.city,
                deliveryRadiusKm:
                    shop.deliveryRadiusKm,
                icon: shop.icon,
                images: shop.images,
                isOpen: shop.isOpen,
                isActive: shop.isActive,
            };

            const response =
                await adminShopService.updateShop(
                    shop._id,
                    updateData
                );

            if (response?.shop) {
                setShops((prev) =>
                    prev.map((item) =>
                        item._id === shop._id
                            ? response.shop
                            : item
                    )
                );
            }
        }

        setModalOpen(false);
        setEditingShop(null);

    } catch (error) {
        console.error(
            "Failed to save shop:",
            error
        );

        setError(
            error?.response?.data?.message ||
            "Failed to save shop"
        );
    }
};


  // ==============================
  // BLOCK / UNBLOCK SHOP
  // ==============================

  const toggleBlock = async (shop) => {
    try {
        setError("");

        const newStatus = !shop.isActive;

        const response =
            await adminShopService.updateShop(
                shop._id,
                {
                    isActive: newStatus,
                }
            );

        if (response?.shop) {
            setShops((prev) =>
                prev.map((item) =>
                    item._id === shop._id
                        ? response.shop
                        : item
                )
            );
        }

    } catch (error) {
        console.error(
            "Failed to update shop status:",
            error
        );

        setError(
            error?.response?.data?.message ||
            "Failed to update shop status"
        );
    }
};


  // ==============================
  // TABLE COLUMNS
  // ==============================

  const columns = [

    // --------------------------
    // SHOP
    // --------------------------

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

            <p className="font-semibold text-gray-900 truncate">

              {row.name || "Unnamed Shop"}

            </p>

            <p className="text-[12px] text-gray-400 truncate">

              {row.description || "Food Shop"}

            </p>

          </div>

        </div>
      ),
    },


    // --------------------------
    // OWNER
    // --------------------------

    {
      key: "owner",

      label: "Owner",

      render: (row) => {

        if (!row.owner) {
          return "Unknown";
        }

        if (typeof row.owner === "string") {
          return row.owner;
        }

        return (
          row.owner.name ||
          row.owner.email ||
          "Unknown"
        );
      },
    },


    // --------------------------
    // LOCATION
    // --------------------------

    {
      key: "location",

      label: "Location",

      render: (row) => (

        <span className="inline-flex items-center gap-1 text-gray-600">

          <MapPinIcon className="text-gray-400" />

          {row.city || "Unknown"}

        </span>
      ),
    },


    // --------------------------
    // CATEGORY
    // --------------------------
    //
    // Your current backend doesn't
    // have category.
    //
    // Temporary value.
    // --------------------------

    {
      key: "category",

      label: "Category",

      render: () => (
        <span className="text-gray-500">
          Food
        </span>
      ),
    },


    // --------------------------
    // STATUS
    // --------------------------

    {
      key: "status",

      label: "Status",

      render: (row) => {

        let status = "active";

        if (
          TEMP_PENDING_SHOPS.has(row._id)
        ) {
          status = "pending";

        } else if (!row.isActive) {
          status = "blocked";
        }

        return (
          <StatusBadge
            status={status}
          />
        );
      },
    },


    // --------------------------
    // JOINED ON
    // --------------------------

    {
      key: "joinedOn",

      label: "Joined On",

      render: (row) => {

        if (!row.createdAt) {
          return "-";
        }

        return new Date(
          row.createdAt
        ).toLocaleDateString();
      },
    },


    // --------------------------
    // ACTIONS
    // --------------------------

    {
      key: "actions",

      label: "Actions",

      hideLabel: true,

      render: (row) => (

        <div className="flex items-center gap-1.5">

          {/* VIEW */}

          <button
            onClick={() =>
              openEditModal(row)
            }
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#e14a22] hover:border-[#ff5a36] hover:bg-[#fff0ea]"
            title="View / Edit shop"
          >

            <EyeIcon size={15} />

          </button>


          {/* EDIT */}

          <button
            onClick={() =>
              openEditModal(row)
            }
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#e14a22] hover:border-[#ff5a36] hover:bg-[#fff0ea]"
            title="Edit shop"
          >

            <PencilIcon size={15} />

          </button>


          {/* BLOCK / UNBLOCK */}

          <button
            onClick={() =>
              toggleBlock(row)
            }
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50"
            title={
              row.isActive
                ? "Block shop"
                : "Unblock shop"
            }
          >

            <BlockIcon size={15} />

          </button>

        </div>
      ),
    },
  ];


  // ==============================
  // UI
  // ==============================

  return (

    <AdminLayout
      title="Shops"
      subtitle="Manage all restaurants and food shops on SnackDrop."
    >

      <PageHeader
        title="Shops"
        subtitle="Manage all restaurants and food shops on SnackDrop."
        action={{
          label: "Create New Shop",
          icon: PlusIcon,
          onClick: openCreateModal,
        }}
      />


      {/* ==========================
          STATS
      ========================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4.5 mb-5">

        <StatCard
          icon={StoreIcon}
          label="Total Shops"
          value={stats.total}
          color="orange"
        />

        <StatCard
          icon={StoreIcon}
          label="Active"
          value={stats.active}
          color="green"
        />

        <StatCard
          icon={StoreIcon}
          label="Pending"
          value={stats.pending}
          color="blue"
        />

        <StatCard
          icon={StoreIcon}
          label="Blocked"
          value={stats.blocked}
          color="red"
        />

      </div>


      {/* ==========================
          TABLE CONTAINER
      ========================== */}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_18px_rgba(24,24,48,0.06)] p-5">


        {/* STATUS TABS */}

        <div className="flex gap-2 overflow-x-auto pb-1 mb-4">

          {TABS.map((t) => (

            <button
              key={t.key}
              onClick={() =>
                setTab(t.key)
              }
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


        {/* SEARCH + LOCATION */}

        <div className="flex flex-col sm:flex-row gap-3 mb-5">

          <div className="flex-1">

            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search shops by name, owner or category..."
            />

          </div>


          <select
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            className="px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-700 outline-none focus:border-[#ff5a36] sm:w-45"
          >

            {LOCATIONS.map((loc) => (

              <option
                key={loc}
                value={loc}
              >
                {loc}
              </option>

            ))}

          </select>

        </div>


        {/* ERROR */}

        {error && (

          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">

            {error}

          </div>

        )}


        {/* LOADING */}

        {loading ? (

          <div className="py-12 text-center text-gray-400">

            Loading shops...

          </div>

        ) : (

          <DataTable
            columns={columns}
            rows={filteredShops}
            emptyTitle="No shops found"
            emptyText="Try adjusting your search or filters."
          />

        )}

      </div>


      {/* ==========================
          SHOP MODAL
      ========================== */}

      <ShopModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingShop(null);
        }}
        onSave={handleSaveShop}
        initialData={editingShop}
      />

    </AdminLayout>
  );
}