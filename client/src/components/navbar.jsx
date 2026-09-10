import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LocationContext } from "../context/LocationContext";
import LocationModal from "./LocationModal";
const [showLocationBox, setShowLocationBox] = useState(false);
const [searchInput, setSearchInput] = useState("");
const [recentLocations, setRecentLocations] = useState([]);
import { FakeLocation } from "../extras/FakeLocation"

import {
  MapPin,
  ChevronDown,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  UserCircle,
  Package,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const { location } = useContext(LocationContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const cartCount = 1;
  const wishlistCount = 1;

  const filteredLocations = locations.filter((item) =>
    item.toLowerCase().includes(searchInput.toLowerCase())
  );

  useEffect(() => {
    if (location) {
      const updated = [location, ...recentLocations.filter(l => l !== location)].slice(0, 3);
      setRecentLocations(updated);
      localStorage.setItem("recentLocations", JSON.stringify(updated));
    }
  }, [location]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowAccount(false);
    navigate("/");
  };
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentLocations")) || [];
    setRecentLocations(saved);
  }, []);

  const isActive = (path) => routerLocation.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white px-4 py-4 md:px-8">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-3 rounded-full bg-white px-5 shadow-[0_5px_25px_rgba(0,0,0,0.07)]">

        {/* LOGO */}
        <Link to="/" className="shrink-0 text-2xl font-extrabold tracking-tight text-[#ff6840]">
          Food<span className="text-[#ff8a65]">Ex</span>
        </Link>

        {/* LOCATION BUTTON */}
        {/* LOCATION BUTTON + SEARCH DROPDOWN */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setShowLocationBox(!showLocationBox);
              setShowAccount(false);
            }}
            className="flex h-10 items-center gap-2 rounded-full bg-gray-50 px-4 text-xs text-gray-600 transition hover:bg-gray-100"
          >
            <MapPin size={15} />

            <span className="max-w-[130px] truncate" title={location}>
              {location || "Enter delivery address"}
            </span>

            <ChevronDown size={14} />
          </button>

          {/* DROPDOWN SEARCH BOX */}
          {showLocationBox && (
            <div className="absolute mt-2 w-80 rounded-xl border bg-white p-3 shadow-lg z-50">

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
                        setLocation(item);
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
                        setLocation(item);
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

        {/* NAV LINKS */}
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          <Link
            to="/"
            className={`rounded-full px-4 py-2.5 text-sm transition ${isActive("/") ? "bg-gray-100 font-semibold" : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            Home
          </Link>

          <Link
            to="/foods"
            className={`rounded-full px-4 py-2.5 text-sm transition ${isActive("/foods") ? "bg-gray-100 font-semibold" : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            Explore Foods
          </Link>

          <Link
            to="/restaurants"
            className={`rounded-full px-4 py-2.5 text-sm transition ${isActive("/restaurants") ? "bg-gray-100 font-semibold" : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            Restaurants
          </Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="ml-auto flex items-center gap-1.5 lg:ml-3">

          {/* Wishlist */}
          <button
            onClick={() => navigate("/wishlist")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-orange-50 hover:text-[#ff6840]"
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff6840] px-1 text-[9px] text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-orange-50 hover:text-[#ff6840]"
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff6840] px-1 text-[9px] text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* ACCOUNT */}
          <div className="relative">
            <button
              onClick={() => {
                setShowAccount(!showAccount);
              }}
              className="flex h-10 items-center gap-1.5 rounded-full px-2 text-gray-600 hover:bg-gray-50"
            >
              <User size={18} />
              <span className="hidden text-sm sm:block">Account</span>
              <ChevronDown size={13} />
            </button>

            {showAccount && (
              <div className="absolute right-0 top-12 w-52 rounded-2xl border bg-white p-2 shadow-xl">
                {isLoggedIn ? (
                  <>
                    <button onClick={() => navigate("/profile")} className="block w-full text-left px-3 py-2">
                      My Profile
                    </button>
                    <button onClick={() => navigate("/orders")} className="block w-full text-left px-3 py-2">
                      My Orders
                    </button>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-500">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => navigate("/login")} className="block w-full text-left px-3 py-2">
                      Login
                    </button>
                    <button onClick={() => navigate("/register")} className="block w-full text-left px-3 py-2">
                      Create Account
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LOCATION MODAL */}
      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </header>
  );
};

export default Navbar;