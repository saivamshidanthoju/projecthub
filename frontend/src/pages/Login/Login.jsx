import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const demoAccounts = [
  { label: "Admin", email: "admin@projecthub.test" },
  { label: "Manager", email: "manager@projecthub.test" },
  { label: "Member", email: "member@projecthub.test" },
];

export default function Login() {
  const [orgId, setOrgId] = useState("projecthub");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const fillDemoAccount = (accountEmail) => {
    setOrgId("projecthub");
    setEmail(accountEmail);
    setPassword("password123");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await login({
        orgSlug: orgId.trim() || "projecthub",
        email: email.trim(),
        password,
        rememberMe,
      });
      setIsSuccess(true);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-sunken text-on-surface min-h-screen flex items-center justify-center p-md md:p-lg w-full">
      <main className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 shadow-sm rounded-xl overflow-hidden bg-surface-main border border-border-subtle">
        <div className="hidden md:flex flex-col justify-between p-xl bg-primary text-on-primary relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary-fixed-dim/10 to-transparent"></div>

          <div className="z-10">
            <div className="flex items-center gap-sm mb-xl">
              <div className="w-10 h-10 bg-on-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-title-lg">hub</span>
              </div>
              <span className="font-title-lg text-title-lg font-bold tracking-tight">ProjectHub</span>
            </div>
            <h1 className="font-display-lg text-display-lg leading-tight mb-md">
              Welcome back to your workspace.
            </h1>
            <p className="font-body-lg text-body-lg text-on-primary/80 max-w-[384px]">
              Use your team account to reach projects, tasks, reports, uploads, and role-based controls.
            </p>
          </div>

          <div className="z-10 mt-auto bg-white/10 border border-white/20 rounded-lg p-md">
            <p className="font-label-md text-label-md uppercase tracking-widest text-on-primary/80 mb-sm">
              Demo access
            </p>
            <div className="grid grid-cols-3 gap-sm">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemoAccount(account.email)}
                  className="h-9 rounded-lg bg-white/90 text-primary font-button-text text-button-text hover:bg-white active:scale-95 transition-all"
                >
                  {account.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-lg md:p-xl flex flex-col justify-center bg-surface-main">
          <div className="mb-lg">
            <h2 className="font-headline-lg text-headline-lg text-text-heading mb-xs">
              Log in
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Enter your credentials to access your workspace.
            </p>
          </div>

          {error && (
            <div className="mb-md rounded-lg border border-error-container bg-error-container/40 px-md py-sm text-body-sm text-error">
              {error}
            </div>
          )}

          <form className="space-y-base" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-xs mb-md">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="org_id">
                Organization ID
              </label>
              <div className="relative">
                <input
                  className="w-full h-11 pl-md pr-[70px] rounded border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md bg-surface"
                  id="org_id"
                  name="org_id"
                  placeholder="projecthub"
                  type="text"
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  required
                />
                <span className="absolute right-3 top-3 text-on-surface-variant/50 font-label-md text-label-md select-none pointer-events-none">
                  .phub.io
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-xs mb-md">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="email">
                Work Email
              </label>
              <input
                className="w-full h-11 px-md rounded border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md bg-surface"
                id="email"
                name="email"
                placeholder="john@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-xs mb-lg">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">
                  Password
                </label>
                <button type="button" className="font-body-sm text-body-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <input
                className="w-full h-11 px-md rounded border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md bg-surface"
                id="password"
                name="password"
                placeholder="password123"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-sm mb-xl">
              <input
                className="w-4 h-4 rounded text-primary border-border-subtle focus:ring-primary focus:ring-offset-0 cursor-pointer"
                id="remember_me"
                name="remember_me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                className="font-body-sm text-body-sm text-on-surface-variant select-none cursor-pointer"
                htmlFor="remember_me"
              >
                Keep me logged in
              </label>
            </div>

            <button
              className={`w-full h-12 text-on-primary font-button-text text-button-text rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-sm cursor-pointer disabled:opacity-75 ${
                isSuccess ? "bg-green-600" : "bg-primary hover:bg-surface-tint"
              }`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  <span>Logging in...</span>
                </>
              ) : isSuccess ? (
                <>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Success</span>
                </>
              ) : (
                <>
                  <span>Log In</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-xl pt-lg border-t border-border-subtle flex flex-col items-center gap-md">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Don't have an account?
              <Link className="text-primary font-bold hover:underline ml-1" to="/register">
                Sign Up
              </Link>
            </p>

            <div className="grid grid-cols-3 gap-sm w-full md:hidden">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemoAccount(account.email)}
                  className="h-10 rounded-lg border border-border-subtle bg-white text-primary font-button-text text-button-text hover:bg-surface-sunken active:scale-95 transition-all"
                >
                  {account.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
