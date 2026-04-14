import { createContext, useState, useEffect } from "react";
import { ROLE_PERMISSIONS } from "@/constants/permissions";
import { MOCK_USERS } from "@/data/mockUsers";
import { logoutAPI } from "@/services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(MOCK_USERS.bithu);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("auth_user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const normalizedUser = {
          ...userData,
          role: userData.type || userData.role, // Ensure 'role' field exists
        };
        setUser(normalizedUser);
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData) => {
    const normalizedUser = {
      ...userData,
      role: userData.type, // Map 'type' from backend to 'role' for local use
    };
    setUser(normalizedUser);
    localStorage.setItem("auth_user", JSON.stringify(normalizedUser));
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("auth_user");
      window.location.href = "/login";
    }
  };

  const permissions = ROLE_PERMISSIONS[user?.role] ?? [];

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
