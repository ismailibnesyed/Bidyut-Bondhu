import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl } from "../services/Base.jsx";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("lm_token"));

  const logout = useCallback(() => {
    localStorage.removeItem("lm_token");
    localStorage.removeItem("lm_refresh_token");
    setAccessToken(null);
    setAuthUser(null);
    setAuthError("");
    setLoading(false);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("lm_refresh_token");
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!response.ok) return null;

      const tokens = await response.json();
      localStorage.setItem("lm_token", tokens.access_token);
      localStorage.setItem("lm_refresh_token", tokens.refresh_token);
      setAccessToken(tokens.access_token);
      return tokens.access_token;
    } catch {
      return null;
    }
  }, []);

  const fetchUser = useCallback(async (signal, token = accessToken, hasRefreshed = false) => {
    if (!token) {
      setAuthUser(null);
      setLoading(false);
      setAuthError("");
      return;
    }

    setLoading(true);
    setAuthError("");
    let requestToken = token;
    try {
      let userRes = await fetch(`${baseUrl}/users/me`, {
        headers: { Authorization: `Bearer ${requestToken}` },
        signal,
      });
      if (signal?.aborted || localStorage.getItem("lm_token") !== requestToken) return;
      // An expired access token gets one refresh attempt, then one retry.
      if (userRes.status === 401 && !hasRefreshed) {
        requestToken = await refreshAccessToken();
        if (requestToken) {
          userRes = await fetch(`${baseUrl}/users/me`, {
            headers: { Authorization: `Bearer ${requestToken}` },
            signal,
          });
        }
      }
      if (!requestToken || userRes.status === 401) {
        logout();
        return;
      }
      if (!userRes.ok) throw new Error(`Could not load user: ${userRes.status}`);
      const userData = await userRes.json();
      if (!userData.id) throw new Error("The user response is missing an ID.");
      if (!signal?.aborted && localStorage.getItem("lm_token") === requestToken) {
        setAuthUser(userData);
      }
    } catch (error) {
      if (!signal?.aborted && localStorage.getItem("lm_token") === requestToken) {
        setAuthError(error instanceof TypeError ? "Cannot connect to the server. Please try again." : error.message);
      }
    } finally {
      if (!signal?.aborted && localStorage.getItem("lm_token") === requestToken) setLoading(false);
    }
  }, [accessToken, logout, refreshAccessToken]);

  useEffect(() => {
    const controller = new AbortController();
    fetchUser(controller.signal);
    return () => controller.abort();
  }, [fetchUser]);

  useEffect(() => {
    async function handleAuthExpired() {
      const newToken = await refreshAccessToken();
      if (newToken) {
        await fetchUser(undefined, newToken, true);
      } else {
        logout();
      }
    }

    window.addEventListener("auth-expired", handleAuthExpired);
    return () => window.removeEventListener("auth-expired", handleAuthExpired);
  }, [fetchUser, logout, refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, accessToken, setAccessToken, logout, loading, authError, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
