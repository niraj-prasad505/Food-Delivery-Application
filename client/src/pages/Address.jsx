// src/pages/Address.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, CheckCircle, Home, Briefcase, MapPin } from "lucide-react";
import API from "../services/api";

export default function Address() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    label: "Home",
    houseNo: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  // Fetch current user addresses
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/location");
      setAddresses(res.data?.addresses || []);
    } catch (err) {
      console.error("Failed to load addresses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.street || !formData.city || !formData.pincode) {
      setError("Please fill in all required fields (Street, City, Pincode).");
      return;
    }

    // Combine fields into formattedAddress required by the schema
    const formattedAddress = [formData.houseNo, formData.street, formData.city, formData.state, formData.pincode]
      .filter(Boolean)
      .join(", ");

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        formattedAddress,
      };

      await API.post("/location", payload);
      await fetchAddresses();

      // Reset form
      setFormData({
        label: "Home",
        houseNo: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
      setShowAddForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save address.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await API.delete(`/location/${addressId}`);
      setAddresses((prev) => prev.filter((a) => (a._id || a.id) !== addressId));
    } catch (err) {
      alert("Failed to delete address.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-12 py-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#ff6840] transition"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="text-xl font-extrabold text-gray-900">Manage Addresses</h1>
        </div>

        {/* Existing Addresses List */}
        <div className="space-y-4 mb-6">
          {loading ? (
            <p className="text-center text-xs text-gray-400 py-8">Loading addresses...</p>
          ) : addresses.length === 0 && !showAddForm ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-800">No saved addresses</p>
              <p className="text-xs text-gray-400 mt-1">Add a delivery address to complete orders faster.</p>
            </div>
          ) : (
            addresses.map((addr) => {
              const id = addr._id || addr.id;
              return (
                <div
                  key={id}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-2 bg-orange-50 text-[#ff6840] rounded-xl">
                      {addr.label === "Work" ? (
                        <Briefcase size={16} />
                      ) : addr.label === "Home" ? (
                        <Home size={16} />
                      ) : (
                        <MapPin size={16} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {addr.formattedAddress || `${addr.houseNo ? addr.houseNo + ", " : ""}${addr.street}, ${addr.city} - ${addr.pincode}`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAddress(id)}
                    className="text-gray-400 hover:text-red-500 transition p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Add Address Form Toggle */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-[#ff6840] text-[#ff6840] rounded-2xl font-bold text-sm hover:bg-orange-50 transition cursor-pointer"
          >
            <Plus size={18} /> Add New Address
          </button>
        ) : (
          <form onSubmit={handleSaveAddress} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base font-bold text-gray-900">Add Delivery Location</h2>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs font-semibold text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100 font-semibold">
                {error}
              </p>
            )}

            {/* Label Selector */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Address Type</label>
              <div className="grid grid-cols-3 gap-2">
                {["Home", "Work", "Other"].map((labelType) => (
                  <button
                    key={labelType}
                    type="button"
                    onClick={() => setFormData({ ...formData, label: labelType })}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      formData.label === labelType
                        ? "border-[#ff6840] bg-orange-50 text-[#ff6840]"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {labelType}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">House / Flat No.</label>
                <input
                  type="text"
                  name="houseNo"
                  placeholder="e.g. Flat 402, Block B"
                  value={formData.houseNo}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#ff6840]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="e.g. 560001"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#ff6840]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Street / Area *</label>
              <input
                type="text"
                name="street"
                placeholder="e.g. 100 Feet Road, Indiranagar"
                value={formData.street}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#ff6840]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Bengaluru"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#ff6840]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="e.g. Karnataka"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#ff6840]"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="accent-[#ff6840] w-4 h-4 rounded"
              />
              <span className="text-xs font-semibold text-gray-700">Make this my default address</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 bg-[#ff6840] hover:bg-[#e05530] text-white py-3 rounded-xl font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Saving Address..." : "Save Address"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}