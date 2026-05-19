import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchMeRequest, loginRequest, signupRequest } from "../api/authApi";
import { clearStoredToken, getStoredToken, setStoredToken } from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrateUser = async () => {
    const token = getStoredToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const profile = await fetchMeRequest();
      setUser(profile);
    } catch (error) {
      clearStoredToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hydrateUser();
  }, []);

  const login = async (payload) => {
    const response = await loginRequest(payload);
    setStoredToken(response.token);
    const profile = await fetchMeRequest();
    setUser(profile);
    toast.success("Welcome back");
    return { ...response, user: profile };
  };

  const signup = async (payload) => {
    const response = await signupRequest(payload);
    setStoredToken(response.token);
    const profile = await fetchMeRequest();
    setUser(profile);
    toast.success("Account created");
    return { ...response, user: profile };
  };

  const logout = () => {
    clearStoredToken();
    setUser(null);
    toast.success("Signed out");
  };

  const refreshUser = async () => {
    const profile = await fetchMeRequest();
    setUser(profile);
    return profile;
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    refreshUser,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
