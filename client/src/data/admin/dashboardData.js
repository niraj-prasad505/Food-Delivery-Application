// src/data/admin/dashboardData.js
// Temporary mock data for the Admin Dashboard.
// Replace each export with a real API call later — the shape stays the same,
// so the UI components in pages/admin/Dashboard.jsx won't need to change.

export const dashboardStats = [
  { id: "orders", label: "Total Orders", value: "1,284", change: "+12.5%", trend: "up", color: "red" },
  { id: "shops", label: "Total Shops", value: "42", change: "+8.2%", trend: "up", color: "orange" },
  { id: "products", label: "Total Products", value: "362", change: "+5.4%", trend: "up", color: "green" },
  { id: "revenue", label: "Total Revenue", value: "₹8.42L", change: "+14.8%", trend: "up", color: "blue" },
];

export const ordersOverview = [
  { label: "1 Aug", value: 62 },
  { label: "2 Aug", value: 88 },
  { label: "3 Aug", value: 104 },
  { label: "4 Aug", value: 156 },
  { label: "5 Aug", value: 121 },
  { label: "6 Aug", value: 95 },
  { label: "7 Aug", value: 142 },
];

export const quickActions = [
  { id: "add-shop", label: "Add New Shop", color: "red" },
  { id: "add-product", label: "Add New Product", color: "orange" },
  { id: "create-offer", label: "Create Offer", color: "green" },
  { id: "create-ad", label: "Create Ad", color: "blue" },
];

export const recentOrders = [
  { id: "#10245", customer: "Rahul Sharma", shop: "Domino's Pizza", amount: "₹540", status: "preparing" },
  { id: "#10244", customer: "Priya Verma", shop: "Spice Villa", amount: "₹320", status: "confirmed" },
  { id: "#10243", customer: "Amit Kumar", shop: "The Burger Club", amount: "₹680", status: "delivered" },
  { id: "#10242", customer: "Neha Singh", shop: "Tasty Bites", amount: "₹240", status: "cancelled" },
  { id: "#10241", customer: "Rohan Mehta", shop: "Momo Magic", amount: "₹450", status: "preparing" },
];

export const topProducts = [
  { id: 1, name: "Margherita Pizza", shop: "Domino's Pizza", orders: 342, revenue: "₹68,316", status: "active" },
  { id: 2, name: "Chicken Biryani", shop: "Spice Villa", orders: 280, revenue: "₹61,320", status: "active" },
  { id: 3, name: "Veg Burger", shop: "The Burger Club", orders: 265, revenue: "₹39,735", status: "active" },
  { id: 4, name: "Paneer Tikka", shop: "Tasty Bites", orders: 198, revenue: "₹33,660", status: "active" },
  { id: 5, name: "Chocolate Cake", shop: "Food Plaza", orders: 176, revenue: "₹22,880", status: "inactive" },
];
