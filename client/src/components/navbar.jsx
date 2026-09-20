// client/src/components/Navbar.jsx
import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { LocationContext } from "../context/LocationContext";
import API from "../services/api";
import icon from "../assets/icon.png";
import {
  MapPin,
  ChevronDown,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  UserCircle,
  Package,
  Navigation,
  Loader2,
  Search,
  Home,
  Briefcase,
  Check,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const locationPath = useLocation();

  const [showAddress, setShowAddress] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  // Saved DB Addresses State
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Auto-suggestion Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Centralized Location Context
  const { location, setLocation, setCoordinates } = useContext(LocationContext);

  // Context Hook Values
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, loading, isAuthenticated, logout } = useUser();

  // Fetch Saved Addresses on Dropdown Open
  useEffect(() => {
    if (isAuthenticated && showAddress) {
      API.get("/location")
        .then((res) => {
          if (res.data?.addresses) {
            setSavedAddresses(res.data.addresses);
          }
        })
        .catch((err) => console.warn("Could not load saved addresses in Navbar"));
    }
  }, [isAuthenticated, showAddress]);

  const formatShortAddress = (data) => {
    if (!data) return "Selected Location";
    const addr = data.address || {};

    const specificLocality =
      addr.road ||
      addr.suburb ||
      addr.neighbourhood ||
      addr.residential ||
      addr.quarter ||
      addr.postcode_locality ||
      addr.village ||
      data.name ||
      "";

    const city =
      addr.city ||
      addr.town ||
      addr.municipality ||
      addr.city_district ||
      addr.county ||
      "";

    if (specificLocality && city && specificLocality !== city) {
      return `${specificLocality}, ${city}`;
    }
    
    if (specificLocality) return specificLocality;
    if (city) return city;

    const rawParts = data.display_name ? data.display_name.split(",") : [];
    return rawParts.slice(0, 2).join(",").trim() || "Location Selected";
  };

  // Live Search Auto-suggestions
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&addressdetails=1&limit=6&countrycodes=in`
        );
        const data = await res.json();
        setSuggestions(data || []);
      } catch (err) {
        console.error("Failed to fetch address suggestions:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 350);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle GPS Current Location Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setGeoLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let detectedName = "";

        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (res.ok) {
            const data = await res.json();
            const locality =
              data.locality ||
              data.localityInfo?.informal?.[0]?.name ||
              data.localityInfo?.administrative?.[3]?.name ||
              "";
            const city = data.city || data.localityInfo?.administrative?.[2]?.name || "";

            if (locality && city && locality.toLowerCase() !== city.toLowerCase()) {
              detectedName = `${locality}, ${city}`;
            } else if (locality || city) {
              detectedName = locality || city;
            }
          }
        } catch (err) {
          console.warn("BigDataCloud error:", err);
        }

        const finalAddress = detectedName || "Central Area";

        setLocation(finalAddress);
        if (setCoordinates) {
          setCoordinates({ latitude, longitude });
        }

        if (isAuthenticated) {
          try {
            await API.post("/location", {
              latitude,
              longitude,
              address: finalAddress,
              label: "Current GPS",
            });
          } catch (dbErr) {
            console.error("Failed to save location to DB:", dbErr);
          }
        }

        setGeoLoading(false);
        setShowAddress(false);
      },
      (error) => {
        alert("Unable to fetch location. Please check browser location permissions.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSelectSuggestion = async (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const finalAddress = formatShortAddress(item);

    setLocation(finalAddress);
    if (setCoordinates) {
      setCoordinates({ latitude: lat, longitude: lon });
    }

    if (isAuthenticated) {
      try {
        await API.post("/location", {
          latitude: lat,
          longitude: lon,
          address: finalAddress,
          label: "Searched Place",
        });
      } catch (err) {
        console.error("Failed to save location to DB:", err);
      }
    }

    setSearchQuery("");
    setSuggestions([]);
    setShowAddress(false);
  };

  // Select Saved Address from Navbar Dropdown
  const handleSelectSavedAddress = (addr) => {
    const shortLabel = addr.street ? `${addr.street}, ${addr.city}` : addr.formattedAddress;
    setLocation(shortLabel);
    setShowAddress(false);
  };

  const isActive = (path) => locationPath.pathname === path;

  if (loading) return null;

  const currentDisplayAddress = location || "Choose Location";

  return (
    <header className="sticky top-0 z-50 bg-white px-4 py-4 md:px-8">
      <div className="mx-auto flex h-17 max-w-7xl items-center gap-3 rounded-full bg-white px-5 shadow-[0_5px_25px_rgba(0,0,0,0.07)]">
        
        {/* LOGO */}
        <Link to="/" className="shrink-0 text-2xl font-extrabold tracking-tight text-[#ff6840]">
          <img src={icon} alt="Logo" className="h-12" />
        </Link>

        {/* LOCATION SELECTOR WITH SAVED ADDRESSES */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setShowAddress(!showAddress);
              setShowAccount(false);
            }}
            className="flex h-10 items-center gap-2 rounded-full bg-gray-50 px-4 text-xs text-gray-600 transition hover:bg-gray-100 cursor-pointer"
          >
            <MapPin size={15} className="text-[#ff6840] shrink-0" />
            <span className="max-w-36 truncate font-semibold text-gray-800">
              {currentDisplayAddress}
            </span>
            <ChevronDown size={14} className={`transition-transform shrink-0 ${showAddress ? "rotate-180" : ""}`} />
          </button>

          {showAddress && (
            <div className="absolute left-0 top-12 w-80 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-xl z-50 space-y-3">
              
              {/* Option 1: Use GPS Location */}
              <button
                onClick={handleDetectLocation}
                disabled={geoLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-50 px-3 py-2.5 text-center text-xs font-bold text-[#ff6840] transition hover:bg-orange-100 disabled:opacity-50 cursor-pointer"
              >
                {geoLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Navigation size={15} />
                )}
                {geoLoading ? "Detecting location..." : "Use Current GPS Location"}
              </button>

              {/* SAVED ADDRESSES SECTION IN NAVBAR */}
              {isAuthenticated && savedAddresses.length > 0 && (
                <div className="border-t border-gray-100 pt-2">
                  <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1.5 px-1">
                    Your Saved Addresses
                  </p>
                  <div className="max-h-36 overflow-y-auto space-y-1 scrollbar-none">
                    {savedAddresses.map((addr, idx) => {
                      const shortText = addr.street ? `${addr.street}, ${addr.city}` : addr.formattedAddress;
                      const isCurrent = location === shortText;

                      return (
                        <button
                          key={addr._id || idx}
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={`flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-xs transition cursor-pointer ${
                            isCurrent
                              ? "bg-orange-100/60 text-[#ff6840] font-bold"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {addr.label === "Work" ? <Briefcase size={14} className="shrink-0" /> : <Home size={14} className="shrink-0" />}
                            <div className="truncate">
                              <span className="block font-bold">{addr.label}</span>
                              <span className="block text-[10px] text-gray-400 truncate">{shortText}</span>
                            </div>
                          </div>
                          {isCurrent && <Check size={14} className="shrink-0 text-[#ff6840]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Search Bar Input */}
              <div className="relative border-t border-gray-100 pt-2">
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 focus-within:border-[#ff6840] focus-within:bg-white">
                  <Search size={14} className="text-gray-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search road, area, station..."
                    className="w-full bg-transparent text-xs text-gray-800 focus:outline-none"
                  />
                  {searchLoading && <Loader2 size={13} className="animate-spin text-gray-400 shrink-0" />}
                </div>
              </div>

              {/* Suggestions List */}
              {suggestions.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-1 scrollbar-none">
                  {suggestions.map((item, index) => (
                    <button
                      key={item.place_id || index}
                      onClick={() => handleSelectSuggestion(item)}
                      className="flex w-full items-start gap-2 rounded-xl px-2.5 py-2 text-left text-xs text-gray-700 transition hover:bg-orange-50 hover:text-[#ff6840] cursor-pointer"
                    >
                      <MapPin size={14} className="mt-0.5 shrink-0 text-[#ff6840]" />
                      <div>
                        <p className="font-semibold text-gray-900">{formatShortAddress(item)}</p>
                        <p className="text-[10px] text-gray-400 line-clamp-1">{item.display_name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          <Link to="/" className={`rounded-full px-4 py-2.5 text-sm transition ${isActive("/") ? "bg-gray-100 font-semibold text-gray-900" : "text-gray-600 hover:bg-gray-50"}`}>
            Home
          </Link>
          <Link to="/explore" className={`rounded-full px-4 py-2.5 text-sm transition ${isActive("/explore") ? "bg-gray-100 font-semibold text-gray-900" : "text-gray-600 hover:bg-gray-50"}`}>
            Explore Foods
          </Link>
          <Link to="/restaurants" className={`rounded-full px-4 py-2.5 text-sm transition ${isActive("/restaurants") ? "bg-gray-100 font-semibold text-gray-900" : "text-gray-600 hover:bg-gray-50"}`}>
            Restaurants
          </Link>
        </nav>

        {/* ACTION BUTTONS */}
        <div className="ml-auto flex items-center gap-1.5 lg:ml-3">
          <button
            onClick={() => navigate("/wishlist")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-orange-50 hover:text-[#ff6840] cursor-pointer"
            title="Wishlist"
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff6840] px-1 text-[9px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-orange-50 hover:text-[#ff6840] cursor-pointer"
            title="Cart"
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff6840] px-1 text-[9px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setShowAccount(!showAccount);
                setShowAddress(false);
              }}
              className="flex h-10 items-center gap-1.5 rounded-full px-2 text-gray-600 transition hover:bg-gray-50 cursor-pointer"
            >
              <User size={18} />
              <span className="hidden text-sm sm:block">
                {user ? user.fullname : "Account"}
              </span>
              <ChevronDown size={13} className={`transition-transform ${showAccount ? "rotate-180" : ""}`} />
            </button>

            {showAccount && (
              <div className="absolute right-0 top-12 w-52 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl z-50">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        setShowAccount(false);
                        navigate("/profile");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                      <UserCircle size={17} />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowAccount(false);
                        navigate("/orders");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                      <Package size={17} />
                      My Orders
                    </button>
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setShowAccount(false);
                        navigate("/login");
                      }}
                      className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setShowAccount(false);
                        navigate("/register");
                      }}
                      className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                      Create Account
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;