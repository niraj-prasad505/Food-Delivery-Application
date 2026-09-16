// src/components/admin/ShopModal.jsx

import { useEffect, useState } from "react";
import { CloseIcon } from "./Icons";

const EMPTY_FORM = {
  name: "",
  description: "",
  phone: "",
  address: "",
  city: "",
  deliveryRadiusKm: 5,
  icon: "",
  images: [],
  isOpen: true,
  isActive: true,
};

export default function ShopModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}) {
  const [form, setForm] =
    useState(EMPTY_FORM);

  const isEdit =
    Boolean(initialData);

  // ==========================================
  // LOAD FORM DATA
  // ==========================================

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        ...EMPTY_FORM,
        ...initialData,

        deliveryRadiusKm:
          initialData.deliveryRadiusKm ??
          5,

        isOpen:
          initialData.isOpen ??
          true,

        isActive:
          initialData.isActive ??
          true,

        images:
          initialData.images ??
          [],
      });
    } else {
      setForm({
        ...EMPTY_FORM,
      });
    }
  }, [
    isOpen,
    initialData,
  ]);

  if (!isOpen) {
    return null;
  }

  // ==========================================
  // UPDATE FIELD
  // ==========================================

  const update = (field) => (e) => {
    setForm((current) => ({
      ...current,
      [field]: e.target.value,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const shopData = {
      ...(initialData?._id
        ? { _id: initialData._id }
        : {}),

      name: form.name.trim(),

      description:
        form.description.trim(),

      phone:
        form.phone.trim(),

      address:
        form.address.trim(),

      city:
        form.city.trim(),

      deliveryRadiusKm:
        Number(form.deliveryRadiusKm),

      icon:
        form.icon.trim(),

      images:
        form.images,

      isOpen:
        form.isOpen,

      isActive:
        form.isActive,
    };

    onSave(shopData);
  };


  // ==========================================
  // FIELDS
  // ==========================================

  const fields = [
    {
      key: "name",
      label: "Shop Name",
      type: "text",
      required: true,
    },

    {
      key: "description",
      label: "Description",
      type: "text",
      required: false,
    },

    {
      key: "phone",
      label: "Phone",
      type: "tel",
      required: true,
    },

    {
      key: "address",
      label: "Address",
      type: "text",
      required: true,
    },

    {
      key: "city",
      label: "City",
      type: "text",
      required: true,
    },

    {
      key: "deliveryRadiusKm",
      label: "Delivery Radius (KM)",
      type: "number",
      required: true,
    },

    {
      key: "icon",
      label: "Shop Icon URL",
      type: "text",
      required: false,
    },
  ];


  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center p-5 z-[100]">

      <div className="bg-white rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 sticky top-0 bg-white">

          <h3 className="text-[17px] font-extrabold text-gray-900">
            {isEdit
              ? "Edit Shop"
              : "Create New Shop"}
          </h3>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100"
            aria-label="Close"
          >
            <CloseIcon size={16} />
          </button>

        </div>


        {/* =====================================
            FORM
        ===================================== */}

        <form onSubmit={handleSubmit}>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">

            {fields.map((field) => (

              <div
                key={field.key}
                className="flex flex-col gap-1.5"
              >

                <label className="text-[12.5px] font-semibold text-gray-700">
                  {field.label}
                </label>

                <input
                  type={field.type}
                  required={field.required}
                  min={
                    field.key ===
                    "deliveryRadiusKm"
                      ? 1
                      : undefined
                  }
                  max={
                    field.key ===
                    "deliveryRadiusKm"
                      ? 50
                      : undefined
                  }
                  value={
                    form[field.key] ??
                    ""
                  }
                  onChange={update(
                    field.key
                  )}
                  className="px-3 py-2.5 rounded-lg border border-gray-200 bg-[#f6f7fb] text-[13.5px] outline-none focus:border-[#ff5a36] focus:bg-white transition-colors"
                />

              </div>

            ))}

          </div>


          {/* =====================================
              OPEN / ACTIVE
          ===================================== */}

          <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">

            <label className="flex items-center gap-2 text-[13px] text-gray-700">

              <input
                type="checkbox"
                checked={form.isOpen}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    isOpen:
                      e.target.checked,
                  }))
                }
              />

              Shop is open

            </label>


            <label className="flex items-center gap-2 text-[13px] text-gray-700">

              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    isActive:
                      e.target.checked,
                  }))
                }
              />

              Shop is active

            </label>

          </div>


          {/* =====================================
              FOOTER
          ===================================== */}

          <div className="flex justify-end gap-2.5 px-5 py-4 border-t border-gray-100">

            <button
              type="button"
              onClick={onClose}
              className="px-[18px] py-2.5 rounded-xl text-[13.5px] font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              className="px-[18px] py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-gradient-to-br from-[#ff5a36] to-[#e14a22] shadow-[0_4px_12px_rgba(255,90,54,0.25)]"
            >
              {isEdit
                ? "Save Changes"
                : "Create Shop"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}