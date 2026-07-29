import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, SESSION_STORAGE_KEY } from "../lib/api";

const AuthContext = createContext(null);

function readStoredSession() {
  try {
    const rawSession = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
    return rawSession ? JSON.parse(rawSession) : null;
  } catch {
    return null;
  }
}

function persistSession(session, rememberMe) {
  const target = rememberMe ? localStorage : sessionStorage;
  const other = rememberMe ? sessionStorage : localStorage;

  target.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  other.removeItem(SESSION_STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession());
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
    setIsBootstrapping(false);
  }, []);

  const login = useCallback(async ({ email, password, orgSlug, rememberMe }) => {
    const nextSession = await authApi.login({ email, password, orgSlug });
    persistSession(nextSession, rememberMe);
    setSession(nextSession);
    return nextSession;
  }, []);

  const register = useCallback(async ({ companyName, orgSlug, fullName, email, password, roleId }) => {
    const nextSession = await authApi.register({
      companyName,
      orgSlug,
      fullName,
      email,
      password,
      roleId,
    });
    persistSession(nextSession, true);
    setSession(nextSession);
    return nextSession;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
  }, []);

  const updateSessionUser = useCallback((updatedUser) => {
    setSession(prev => {
      if (!prev) return null;
      const nextSession = { ...prev, user: { ...prev.user, ...updatedUser } };
      const isLocal = localStorage.getItem(SESSION_STORAGE_KEY) !== null;
      persistSession(nextSession, isLocal);
      return nextSession;
    });
  }, []);

  const value = useMemo(
    () => ({
      isBootstrapping,
      isAuthenticated: Boolean(session?.token && session?.user),
      token: session?.token || "",
      user: session?.user || null,
      sessionSource: session?.source || "",
      login,
      register,
      logout,
      updateSessionUser,
    }),
    [isBootstrapping, login, logout, register, session, updateSessionUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return value;
}
