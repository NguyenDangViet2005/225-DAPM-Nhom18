import { createContext, useState, useEffect } from "react";
import { ROLE_PERMISSIONS } from "@/constants/permissions";
import { getMeAPI, logoutAPI } from "@/apis/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore session from cookie via /auth/me
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const result = await getMeAPI();
        if (result.success) {
          setUser({
            ...result.user,
            role: result.user.type,
          });
        }
      } catch {
        // No valid session — user stays null
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = (userData) => {
    // Cookie is set by the server — just update React state
    setUser({
      ...userData,
      role: userData.type,
    });
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
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
