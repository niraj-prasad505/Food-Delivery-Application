import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { getMyOrders } from "../services/orderService";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-semibold">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <Package className="w-20 h-20 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">No Orders Placed Yet</h1>
        <p className="text-gray-500 mt-1 text-sm text-center">Your order history is empty. Start ordering delicious food now!</p>
        <button
          onClick={() => navigate("/explore")}
          className="mt-6 bg-[#ff6840] text-white px-7 py-3 rounded-full font-bold text-sm hover:bg-[#e05530] transition shadow-md"
        >
          Explore Foods
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-12 py-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</span>
                  <p className="text-xs font-mono font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                    <Clock size={14} />
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-[#ff6840]">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="py-4 space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image || "https://via.placeholder.com/100"} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Address & Price Breakdown */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                <div className="flex items-start gap-2 text-gray-600 max-w-sm">
                  <MapPin size={16} className="text-[#ff6840] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-800 block">{order.deliveryAddress?.name}</span>
                    <span className="text-gray-500">{order.deliveryAddress?.details}</span>
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Total Paid ({order.paymentMethod.toUpperCase()})</span>
                  <span className="text-lg font-extrabold text-[#ff6840]">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}