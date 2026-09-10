import { useState, useContext, useEffect } from "react";
import { LocationContext } from "../context/LocationContext";

const LocationModal = ({ isOpen, onClose }) => {
  const { setLocation } = useContext(LocationContext);

  const [inputValue, setInputValue] = useState("");
  const [recent, setRecent] = useState([]);

  // Load recent addresses
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentLocations")) || [];
    setRecent(saved);
  }, [isOpen]);

  // Save address
  const handleSave = () => {
    if (!inputValue.trim()) {
      alert("Please enter a valid address");
      return;
    }

    setLocation(inputValue);

    // Save to recent list (max 5)
    let updated = [inputValue, ...recent.filter((r) => r !== inputValue)];
    updated = updated.slice(0, 5);

    localStorage.setItem("recentLocations", JSON.stringify(updated));

    onClose();
    setInputValue("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      
      {/* Modal Box */}
      <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Enter your delivery address
        </h2>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter your delivery address"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Recent Locations */}
        {recent.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Recent</p>
            {recent.map((item, index) => (
              <div
                key={index}
                onClick={() => setInputValue(item)}
                className="cursor-pointer p-2 rounded hover:bg-gray-100"
              >
                📍 {item}
              </div>
            ))}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          Save Address
        </button>
      </div>
    </div>
  );
};

export default LocationModal;