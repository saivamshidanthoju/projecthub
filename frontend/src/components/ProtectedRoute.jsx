import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleLabel, isAllowedRole } from "../lib/rbac";

export default function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const { isAuthenticated, isBootstrapping, user } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="min-h-screen w-full bg-white text-on-surface flex items-center justify-center">
        <span className="font-body-md text-body-md text-on-surface-variant">Loading workspace...</span>
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
