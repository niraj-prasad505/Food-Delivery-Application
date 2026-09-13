import React from "react";

export default function ProfileHeader({ user }) {
    const firstLetter =
        user?.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <div className="mb-8">
            <p className="text-xs font-bold tracking-[3px] text-[#ff6547] uppercase mb-2">
                Account
            </p>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                        Hey, {user?.name || "there"}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your account and personal information.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-[#fff0eb] text-[#ff6547] flex items-center justify-center font-bold text-sm">
                        {firstLetter}
                    </div>

                    <span className="text-sm font-semibold text-gray-700">
                        Personal Account
                    </span>
                </div>
            </div>
        </div>
    );
}