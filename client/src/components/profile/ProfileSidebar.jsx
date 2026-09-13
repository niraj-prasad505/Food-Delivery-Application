import React from "react";

export default function ProfileSidebar({ user }) {
    const firstLetter =
        user?.name?.charAt(0)?.toUpperCase() || "U";

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString(
              "en-IN",
              {
                  month: "long",
                  year: "numeric",
              }
          )
        : "Recently";

    return (
        <div className="space-y-5">

            {/* Main Profile Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Top Area */}
                <div className="h-24 bg-liner-to-r from-[#ff6547] to-[#ff876f]" />

                <div className="px-6 pb-6">

                    {/* Avatar */}
                    <div className="-mt-12 mb-4">
                        <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-md">
                            <div className="w-full h-full rounded-full bg-[#fff0eb] flex items-center justify-center text-[#ff6547] text-3xl font-bold">
                                {firstLetter}
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900">
                        {user?.fullname || "User"}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1 break-all">
                        {user?.email || "No email available"}
                    </p>

                    {/* Member Badge */}
                    <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fff4f0] text-[#ff6547] text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6547]" />
                        Active Member
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-5" />

                    {/* Account Details */}
                    <div className="space-y-4">

                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                                Member Since
                            </p>

                            <p className="text-sm font-semibold text-gray-800 mt-1">
                                {memberSince}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                                Account Type
                            </p>

                            <p className="text-sm font-semibold text-gray-800 mt-1">
                                Customer
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Quick Menu */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-3">

                <div className="px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Account Menu
                    </p>
                </div>

                <button
                    className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        rounded-2xl
                        bg-[#fff4f0]
                        text-[#ff6547]
                        text-sm
                        font-semibold
                        text-left
                    "
                >
                    <span className="text-lg">👤</span>
                    Profile Information
                </button>

                <button
                    onClick={() =>
                        (window.location.href = "/wishlist")
                    }
                    className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        rounded-2xl
                        text-gray-600
                        hover:bg-gray-50
                        text-sm
                        font-medium
                        text-left
                        transition
                    "
                >
                    <span className="text-lg">♥</span>
                    My Wishlist
                </button>

                <button
                    onClick={() =>
                        (window.location.href = "/cart")
                    }
                    className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        rounded-2xl
                        text-gray-600
                        hover:bg-gray-50
                        text-sm
                        font-medium
                        text-left
                        transition
                    "
                >
                    <span className="text-lg">🛒</span>
                    My Cart
                </button>

                <button
                    onClick={() =>
                        (window.location.href = "/order")
                    }
                    className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        rounded-2xl
                        text-gray-600
                        hover:bg-gray-50
                        text-sm
                        font-medium
                        text-left
                        transition
                    "
                >
                    <span className="text-lg">♥</span>
                    My orders
                </button>

            </div>
        </div>
    );
}