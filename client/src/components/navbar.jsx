import { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LocationContext } from "../context/LocationContext";
import LocationModal from "./LocationModal";

import {
  MapPin,
  ChevronDown,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  // Renamed context value to avoid shadowing routerLocation
  const { location: userLocation, setLocation } = useContext(LocationContext) || {};

  // Component States
  const [showLocationBox, setShowLocationBox] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [recentLocations, setRecentLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const cartCount = 1;
  const wishlistCount = 1;

  // Static list for search suggestions
  const locationsList = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "Amborkhana, Sylhet",
  ];

  const filteredLocations = locationsList.filter((item) =>
    item.toLowerCase().includes(searchInput.toLowerCase())
  );

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentLocations")) || [];
    setRecentLocations(saved);
  }, []);

  useEffect(() => {
    if (userLocation) {
      const updated = [
        userLocation,
        ...recentLocations.filter((l) => l !== userLocation),
      ].slice(0, 3);
      setRecentLocations(updated);
      localStorage.setItem("recentLocations", JSON.stringify(updated));
    }
  }, [userLocation]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowAccount(false);
    navigate("/");
  };

  const isActive = (path) => routerLocation.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white px-4 py-4 md:px-8">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-3 rounded-full bg-white px-5 shadow-[0_5px_25px_rgba(0,0,0,0.07)]">

        {/* LOGO */}
        <Link to="/" className="shrink-0 text-2xl font-extrabold tracking-tight text-[#ff6840]">
          Food<span className="text-[#ff8a65]">Ex</span>
        </Link>

        {/* LOCATION BUTTON + DROPDOWN */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setShowLocationBox(!showLocationBox);
              setShowAccount(false);
            }}
            className="flex h-10 items-center gap-2 rounded-full bg-gray-50 px-4 text-xs text-gray-600 transition hover:bg-gray-100"
          >
            <MapPin size={15} />

            <span className="max-w-[130px] truncate" title={userLocation}>
              {userLocation || "Enter delivery address"}
            </span>

            <ChevronDown size={14} />
          </button>

          {/* DROPDOWN SEARCH BOX */}
          {showLocationBox && (
            <div className="absolute z-50 mt-2 w-80 rounded-xl border bg-white p-3 shadow-lg">

              {/* INPUT */}
              <input
                type="text"
                placeholder="Search your location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
              />

              {/* SUGGESTIONS */}
              <div className="mt-2 max-h-40 overflow-y-auto">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        if (setLocation) setLocation(item);
                        setShowLocationBox(false);
                        setSearchInput("");
                      }}
                      className="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-orange-50"
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <p className="px-3 py-2 text-xs text-gray-400">
                    No results found
                  </p>
                )}
              </div>

              {/* RECENT */}
              {recentLocations.length > 0 && (
                <div className="mt-3">
                  <p className="px-2 text-xs text-gray-400">Recent</p>
                  {recentLocations.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        if (setLocation) setLocation(item);
                        setShowLocationBox(false);
                      }}
                      className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          <Link
            to="/"
            className={`rounded-full px-4 py-2.5 text-sm transition ${
              isActive("/") ? "bg-gray-100 font-semibold" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Home
          </Link>

          <Link
            to="/foods"
            className={`rounded-full px-4 py-2.5 text-sm transition ${
              isActive("/foods") ? "bg-gray-100 font-semibold" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Explore Foods
          </Link>

          <Link
            to="/restaurants"
            className={`rounded-full px-4 py-2.5 text-sm transition ${
              isActive("/restaurants") ? "bg-gray-100 font-semibold" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Restaurants
          </Link>
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="ml-auto flex items-center gap-1.5 lg:ml-3">
          {/* Wishlist */}
          <button
            onClick={() => navigate("/wishlist")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-orange-50 hover:text-[#ff6840]"
            title="Wishlist"
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff6840] px-1 text-[9px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-orange-50 hover:text-[#ff6840]"
            title="Cart"
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff6840] px-1 text-[9px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* ACCOUNT */}
          <div className="relative">
            <button
              onClick={() => {
                setShowAccount(!showAccount);
                setShowLocationBox(false);
              }}
              className="flex h-10 items-center gap-1.5 rounded-full px-2 text-gray-600 transition hover:bg-gray-50"
            >
              <User size={18} />
              <span className="hidden text-sm sm:block">Account</span>
              <ChevronDown
                size={13}
                className={`transition-transform ${showAccount ? "rotate-180" : ""}`}
              />
            </button>

            {/* Account Dropdown */}
            {showAccount && (
              <div className="absolute right-0 top-12 w-52 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => navigate("/orders")}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/login")}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
                    >
                      Create Account
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Auth CTA Buttons */}
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="hidden h-9 rounded-full bg-[#ff996f] px-4 text-xs font-semibold text-white transition hover:bg-[#ff8050] sm:block"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/register")}
                className="hidden h-9 rounded-full bg-[#ff625d] px-4 text-xs font-semibold text-white transition hover:bg-[#f34d48] sm:block"
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="hidden h-9 rounded-full bg-orange-50 px-4 text-xs font-semibold text-[#ff6840] sm:block"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </header>
  );
};

export default Navbar;