import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl } from "../services/Base.jsx";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const accessToken = localStorage.getItem("lm_token");

  const logout = useCallback(() => {
    localStorage.removeItem("lm_token");
    setAuthUser(null);
    setAuthError("");
    setLoading(false);
  }, []);

  const fetchUser = useCallback(async (signal) => {
    if (!accessToken) {
      setAuthUser(null);
      setLoading(false);
      setAuthError("");
      return;
    }

    setLoading(true);
    setAuthError("");
    try {
      const userRes = await fetch(`${baseUrl}/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal,
      });
      if (signal?.aborted || localStorage.getItem("lm_token") !== accessToken) return;
      if (userRes.status === 401) {
        logout();
        return;
      }
      if (!userRes.ok) throw new Error(`Could not load user: ${userRes.status}`);
      const userData = await userRes.json();
      if (!userData.id) throw new Error("The user response is missing an ID.");
      if (!signal?.aborted && localStorage.getItem("lm_token") === accessToken) {
        setAuthUser(userData);
      }
    } catch (error) {
      if (!signal?.aborted && localStorage.getItem("lm_token") === accessToken) {
        setAuthError(error instanceof TypeError ? "Cannot connect to the server. Please try again." : error.message);
      }
    } finally {
      if (!signal?.aborted && localStorage.getItem("lm_token") === accessToken) setLoading(false);
    }
  }, [accessToken, logout]);

  useEffect(() => {
    const controller = new AbortController();
    fetchUser(controller.signal);
    return () => controller.abort();
  }, [fetchUser]);

  useEffect(() => {
    window.addEventListener("auth-expired", logout);
    return () => window.removeEventListener("auth-expired", logout);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, accessToken, logout, loading, authError, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
