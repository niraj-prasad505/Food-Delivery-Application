// src/components/admin/ShopModal.jsx
import { useEffect, useState } from "react";
import { CloseIcon } from "./Icons";

const EMPTY_FORM = {
  name: "",
  owner: "",
  category: "",
  location: "",
  phone: "",
  email: "",
  openingTime: "",
  closingTime: "",
};

/**
 * isOpen: boolean
 * onClose: () => void
 * onSave: (shop) => void          // called with the finished shop object
 * initialData: shop object | null // null = "create" mode, object = "edit" mode
 */
export default function ShopModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      id: initialData?.id ?? Date.now(),
      status: initialData?.status ?? "pending",
      joinedOn:
        initialData?.joinedOn ??
        new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    });
    onClose();
  };

  const fields = [
    { key: "name", label: "Shop Name", type: "text", required: true },
    { key: "owner", label: "Owner Name", type: "text", required: true },
    { key: "category", label: "Category", type: "text", required: true },
    { key: "location", label: "Location", type: "text", required: true },
    { key: "phone", label: "Phone", type: "tel", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "openingTime", label: "Opening Time", type: "time", required: true },
    { key: "closingTime", label: "Closing Time", type: "time", required: true },
  ];

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center p-5 z-[100]">
      <div className="bg-white rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 sticky top-0 bg-white">
          <h3 className="text-[17px] font-extrabold text-gray-900">
            {isEdit ? "Edit Shop" : "Create New Shop"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100"
            aria-label="Close"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {fields.map((f) => (
              <div key={f.key} className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-gray-700">{f.label}</label>
                <input
                  type={f.type}
                  required={f.required}
                  value={form[f.key]}
                  onChange={update(f.key)}
                  className="px-3 py-2.5 rounded-lg border border-gray-200 bg-[#f6f7fb] text-[13.5px] outline-none focus:border-[#ff5a36] focus:bg-white transition-colors"
                />
              </div>
            ))}
          </div>

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
              {isEdit ? "Save Changes" : "Create Shop"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
