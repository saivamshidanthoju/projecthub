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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen w-full bg-surface-main text-on-surface flex flex-col md:grid md:grid-cols-2">
      <div 
        className="hidden md:flex flex-col justify-between p-xl bg-cover bg-center text-white relative overflow-hidden min-h-screen"
        style={{ backgroundImage: "url('/landing_collab.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/55 z-0"></div>

        <div className="z-10">
          <div className="flex items-center gap-sm mb-xl">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-title-lg">hub</span>
            </div>
            <span className="font-title-lg text-title-lg font-bold tracking-tight text-white">ProjectHub</span>
          </div>
          <h1 className="font-display-lg text-display-lg leading-tight mb-md text-white font-bold">
            Welcome back to your workspace.
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-[384px]">
            Use your team account to reach projects, tasks, reports, uploads, and role-based controls.
          </p>
        </div>

        <div className="z-10 mt-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-md">
          <p className="font-label-md text-label-md uppercase tracking-widest text-white/80 mb-sm">
            Demo access
          </p>
          <div className="grid grid-cols-3 gap-sm">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => fillDemoAccount(account.email)}
                className="h-9 rounded-lg bg-white/95 text-primary font-button-text text-button-text hover:bg-white active:scale-95 transition-all cursor-pointer"
              >
                {account.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-lg md:p-xl bg-surface-main">
        <div className="w-full max-w-[420px] text-left">
          <div className="mb-lg">
            <Link to="/" className="inline-flex items-center gap-1 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors mb-4 select-none">
              <span className="material-symbols-outlined text-[16px] font-bold">arrow_back</span>
              Back to landing
            </Link>
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
                  placeholder=""
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
                placeholder=""
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
              </div>
              <div className="relative">
                <input
                  className="w-full h-11 pl-md pr-10 rounded border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md bg-surface"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-3.5 text-on-surface-variant/50 hover:text-primary transition-colors cursor-pointer select-none"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-lg select-none">
              <label className="flex items-center gap-xs cursor-pointer text-body-sm text-on-surface-variant">
                <input
                  className="w-4 h-4 rounded border-border-subtle text-primary focus:ring-primary"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full h-12 bg-primary text-white rounded-lg shadow hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-xs cursor-pointer font-bold"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                  <span>Authenticating...</span>
                </>
              ) : isSuccess ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">check</span>
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
      </div>
    </div>
  );
}
