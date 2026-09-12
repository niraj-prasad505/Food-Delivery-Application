import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
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
  const location = useLocation();

  const [showAddress, setShowAddress] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  // Temporary data
  const [address, setAddress] = useState("Amborkhana, Sylhet");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const cartCount = 2;
  const wishlistCount = 3;

  const addresses = [
    "Amborkhana, Sylhet",
    "Zindabazar, Sylhet",
    "Shibganj, Sylhet",
  ];

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowAccount(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const {
    user,
    loading,
    isAuthenticated,
    logout
  } = useUser();

  if (loading) {
    return null;
  }


  return (
    <header className="sticky top-0 z-50 bg-white px-4 py-4 md:px-8">
      <div
        className="
          mx-auto flex h-17 max-w-7xl items-center
          gap-3 rounded-full bg-white px-5
          shadow-[0_5px_25px_rgba(0,0,0,0.07)]
        "
      >
        {/* LOGO*/}
        <Link
          to="/"
          className="shrink-0 text-2xl font-extrabold tracking-tight text-[#ff6840]"
        >
          Snack<span className="text-[#ff8a65]">Drop</span>
        </Link>

        {/*ADDRESS*/}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setShowAddress(!showAddress);
              setShowAccount(false);
            }}
            className="
              flex h-10 items-center gap-2 rounded-full
              bg-gray-50 px-4 text-xs text-gray-600
              transition hover:bg-gray-100
            "
          >
            <MapPin size={15} />

            <span className="max-w-32.5 truncate">
              {address}
            </span>

            <ChevronDown
              size={14}
              className={`transition-transform ${showAddress ? "rotate-180" : ""
                }`}
            />
          </button>

          {/* Address Dropdown */}
          {showAddress && (
            <div
              className="
                absolute left-0 top-12 w-64 rounded-2xl
                border border-gray-100 bg-white p-3
                shadow-xl
              "
            >
              <p className="mb-2 px-2 text-xs font-medium text-gray-400">
                Choose your location
              </p>

              {addresses.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setAddress(item);
                    setShowAddress(false);
                  }}
                  className="
                    flex w-full items-center gap-2 rounded-xl
                    px-3 py-2.5 text-left text-sm text-gray-600
                    transition hover:bg-orange-50 hover:text-[#ff6840]
                  "
                >
                  <MapPin size={15} />
                  {item}
                </button>
              ))}

              <button
                onClick={() => {
                  setShowAddress(false);
                  navigate("/address");
                }}
                className="
                  mt-1 w-full rounded-xl px-3 py-2.5
                  text-left text-sm font-semibold
                  text-[#ff6840] hover:bg-orange-50
                "
              >
                + Add new address
              </button>
            </div>
          )}
        </div>

        {/*NAVIGATION*/}
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          <Link
            to="/"
            className={`
              rounded-full px-4 py-2.5 text-sm transition
              ${isActive("/")
                ? "bg-gray-100 font-semibold text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            Home
          </Link>

          <Link
            to="/explore"
            className={`
              rounded-full px-4 py-2.5 text-sm transition
              ${isActive("/explore")
                ? "bg-gray-100 font-semibold text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            Explore Foods
          </Link>

          <Link
            to="/restaurants"
            className={`
              rounded-full px-4 py-2.5 text-sm transition
              ${isActive("/restaurants")
                ? "bg-gray-100 font-semibold text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            Restaurants
          </Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="ml-auto flex items-center gap-1.5 lg:ml-3">

          {/* Wishlist */}
          <button
            onClick={() => navigate("/wishlist")}
            className="
              relative flex h-10 w-10 items-center justify-center
              rounded-full text-gray-500 transition
              hover:bg-orange-50 hover:text-[#ff6840]
            "
            title="Wishlist"
          >
            <Heart size={19} />

            {wishlistCount > 0 && (
              <span
                className="
                  absolute right-0.5 top-0.5 flex h-4 min-w-4
                  items-center justify-center rounded-full
                  bg-[#ff6840] px-1 text-[9px] font-bold text-white
                "
              >
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="
              relative flex h-10 w-10 items-center justify-center
              rounded-full text-gray-500 transition
              hover:bg-orange-50 hover:text-[#ff6840]
            "
            title="Cart"
          >
            <ShoppingCart size={19} />

            {cartCount > 0 && (
              <span
                className="
                  absolute right-0.5 top-0.5 flex h-4 min-w-4
                  items-center justify-center rounded-full
                  bg-[#ff6840] px-1 text-[9px] font-bold text-white
                "
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* ACCOUNT  */}
          <div className="relative">
            <button
              onClick={() => {
                setShowAccount(!showAccount);
                setShowAddress(false);
              }}
              className="
                flex h-10 items-center gap-1.5 rounded-full
                px-2 text-gray-600 transition hover:bg-gray-50
              "
            >
              <User size={18} />

              <span className="hidden text-sm sm:block">
                {loading ? "..." : user ? user.fullname : "Account"}
              </span>


              <ChevronDown
                size={13}
                className={`transition-transform ${showAccount ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Account Dropdown */}
            {showAccount && (
              <div
                className="
                  absolute right-0 top-12 w-52 rounded-2xl
                  border border-gray-100 bg-white p-2
                  shadow-xl
                "
              >
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        setShowAccount(false);
                        navigate("/profile");
                      }}
                      className="
                        flex w-full items-center gap-3 rounded-xl
                        px-3 py-2.5 text-sm text-gray-600
                        hover:bg-gray-50
                      "
                    >
                      <UserCircle size={17} />
                      My Profile
                    </button>

                    <button
                      onClick={() => {
                        setShowAccount(false);
                        navigate("/orders");
                      }}
                      className="
                        flex w-full items-center gap-3 rounded-xl
                        px-3 py-2.5 text-sm text-gray-600
                        hover:bg-gray-50
                      "
                    >
                      <Package size={17} />
                      My Orders
                    </button>

                    <button
                      onClick={logout}
                      className="
                        flex w-full items-center gap-3 rounded-xl
                        px-3 py-2.5 text-sm text-red-500
                        hover:bg-red-50
                      "
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/login")}
                      className="
                        w-full rounded-xl px-3 py-2.5
                        text-left text-sm text-gray-600
                        hover:bg-gray-50
                      "
                    >
                      Login
                    </button>

                    <button
                      onClick={() => navigate("/register")}
                      className="
                        w-full rounded-xl px-3 py-2.5
                        text-left text-sm text-gray-600
                        hover:bg-gray-50
                      "
                    >
                      Create Account
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Login */}
          {!isAuthenticated && (
            <button
              onClick={() => navigate("/login")}
              className="
                hidden h-9 rounded-full bg-[#ff996f]
                px-4 text-xs font-semibold text-white
                transition hover:bg-[#ff8050] sm:block
              "
            >
              Log in
            </button>
          )}

          {/* Sign Up / Logout */}
          {!isAuthenticated ? (
            <button
              onClick={() => navigate("/register")}
              className="
                hidden h-9 rounded-full bg-[#ff625d]
                px-4 text-xs font-semibold text-white
                transition hover:bg-[#f34d48] sm:block
              "
            >
              Sign Up
            </button>
          ) : (
            <button
              onClick={logout}
              className="
                hidden h-9 rounded-full bg-orange-50
                px-4 text-xs font-semibold text-[#ff6840]
                sm:block
              "
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;