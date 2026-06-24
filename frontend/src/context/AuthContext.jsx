// src/context/AuthContext.jsx

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  fetchCsrfCookie,
  loginRequest,
  logoutRequest,
  meRequest,
  registerRequest,
} from "../api/client";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        await fetchCsrfCookie();
      } catch {
        // no backend
      }

      try {
        const me = await meRequest();
        if (isMounted) setUser(me);
      } catch (err) {
        if (isMounted) showError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    bootstrap();
    return () => {
      isMounted = false;
    };
  }, [showError]);

  const login = useCallback(async (credentials) => {
    const me = await loginRequest(credentials);
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (payload) => {
    const me = await registerRequest(payload);
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}