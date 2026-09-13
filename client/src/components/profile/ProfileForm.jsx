import React from "react";

export default function ProfileForm({
    formData,
    editing,
    saving,
    handleChange,
    handleSave,
    handleCancel,
    setEditing,
}) {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 md:p-8 border-b border-gray-100">

                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Personal Information
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Update your personal details and delivery information.
                    </p>
                </div>

                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="
                            self-start
                            sm:self-auto
                            px-5
                            py-2.5
                            rounded-full
                            border
                            border-[#ff6547]
                            text-[#ff6547]
                            text-sm
                            font-semibold
                            hover:bg-[#ff6547]
                            hover:text-white
                            transition
                        "
                    >
                        Edit Profile
                    </button>
                )}

            </div>

            {/* Form */}
            <div className="p-6 md:p-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="Enter your full name"
                            className="
                            w-full
                            h-12
                            px-4
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            text-sm
                            text-gray-800
                            outline-none
                            transition
                            focus:border-[#ff6547]
                            focus:ring-4
                            focus:ring-[#ff6547]/10
                            disabled:bg-gray-50
                            disabled:text-gray-500
                        "
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="Enter your email"
                            className="
                                w-full
                                h-12
                                px-4
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                text-sm
                                text-gray-800
                                outline-none
                                transition
                                focus:border-[#ff6547]
                                focus:ring-4
                                focus:ring-[#ff6547]/10
                                disabled:bg-gray-50
                                disabled:text-gray-500
                            "
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="Enter your phone number"
                            className="
                                w-full
                                h-12
                                px-4
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                text-sm
                                text-gray-800
                                outline-none
                                transition
                                focus:border-[#ff6547]
                                focus:ring-4
                                focus:ring-[#ff6547]/10
                                disabled:bg-gray-50
                                disabled:text-gray-500
                            "
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Delivery Address
                        </label>

                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!editing}
                            placeholder="Enter your delivery address"
                            className="
                                w-full
                                h-12
                                px-4
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                text-sm
                                text-gray-800
                                outline-none
                                transition
                                focus:border-[#ff6547]
                                focus:ring-4
                                focus:ring-[#ff6547]/10
                                disabled:bg-gray-50
                                disabled:text-gray-500
                            "
                        />
                    </div>

                </div>

                {/* Delivery Address Full Width */}
                <div className="mt-6">

                    <div className="rounded-2xl bg-[#fffaf8] border border-[#ffe5de] p-5 flex gap-4">

                        <div className="w-10 h-10 shrink-0 rounded-xl bg-white flex items-center justify-center text-lg shadow-sm">
                            📍
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-gray-800">
                                Delivery Address
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                                {formData.address ||
                                    "Add an address for faster checkout and delivery."}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Actions */}
                {editing && (
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-8 pt-6 border-t border-gray-100">

                        <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="
                                px-6
                                py-3
                                rounded-full
                                border
                                border-gray-200
                                text-gray-600
                                text-sm
                                font-semibold
                                hover:bg-gray-50
                                transition
                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="
                                px-7
                                py-3
                                rounded-full
                                bg-[#ff6547]
                                text-white
                                text-sm
                                font-semibold
                                hover:bg-[#f5573a]
                                transition
                                disabled:opacity-60
                            "
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>
                )}

            </div>
        </div>
    );
}