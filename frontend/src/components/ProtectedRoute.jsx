import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleLabel, isAllowedRole } from "../lib/rbac";
import { motion } from "framer-motion";

export default function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const { isAuthenticated, isBootstrapping, user } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="min-h-screen w-full bg-white text-on-surface flex flex-col items-center justify-center gap-4">
        <motion.img
          src="/logo.svg"
          alt="ProjectHub Logo"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-16 h-16 object-contain"
        />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="font-body-md text-body-md text-on-surface-variant"
        >
          Loading workspace...
        </motion.span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAllowedRole(user, roles)) {
    return (
      <div className="min-h-screen w-full bg-white text-on-surface flex items-center justify-center p-lg">
        <div className="w-full max-w-md rounded-xl border border-border-subtle bg-surface-main p-xl shadow-sm text-center">
          <span className="material-symbols-outlined text-error text-4xl">lock</span>
          <h1 className="mt-md font-headline-md text-headline-md text-text-heading">Access restricted</h1>
          <p className="mt-sm font-body-md text-body-md text-on-surface-variant">
            Your {getRoleLabel(user).toLowerCase()} role does not include this workspace area.
          </p>
          <NavigateFallback />
        </div>
      </div>
    );
  }

  return children;
}

function NavigateFallback() {
  return (
    <a
      href="/dashboard"
      className="mt-lg inline-flex h-10 items-center justify-center rounded-lg bg-primary px-lg font-button-text text-button-text text-white"
    >
      Back to Dashboard
    </a>
  );
}
