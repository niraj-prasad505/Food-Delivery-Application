
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentAdmin,
  adminLogout,
} from "../services/adminAuthService";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check admin authentication
  const checkAdmin = async () => {
    try {
      const response = await getCurrentAdmin();

      setAdmin(response.data.owner);
    } catch (error) {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = (adminData) => {
    setAdmin(adminData);
  };

  // Logout
  const logout = async () => {
    try {
      await adminLogout();
    } catch (error) {
      console.error("Admin logout failed:", error);
    } finally {
      setAdmin(null);
    }
  };

  // Check session when application starts
  useEffect(() => {
    checkAdmin();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        checkAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  return useContext(AdminContext);
};
