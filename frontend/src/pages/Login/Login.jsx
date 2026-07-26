import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [orgId, setOrgId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        // Clear form
        setOrgId("");
        setEmail("");
        setPassword("");
        setRememberMe(false);
        navigate("/dashboard");
      }, 1000);
    }, 1500);
  };

  return (
    <div className="bg-surface-sunken text-on-surface min-h-screen flex items-center justify-center p-md md:p-lg w-full">
      <main className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 shadow-sm rounded-xl overflow-hidden bg-surface-main">
        {/* Brand/Visual Side (Desktop Only) */}
        <div className="hidden md:flex flex-col justify-between p-xl bg-primary text-on-primary relative overflow-hidden">
          {/* Background Decorative Element */}
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
              Accelerate your team's velocity.
            </h1>
            <p className="font-body-lg text-body-lg text-on-primary/80 max-w-[384px]">
              Join over 10,000+ enterprise teams managing complex workflows with precision and clarity.
            </p>
          </div>
          
          <div className="z-10 mt-auto">
            <div className="glass-panel p-md rounded-lg flex items-center gap-md">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-on-primary/20 shrink-0">
                <img
                  className="w-full h-full object-cover"
                  alt="A professional headshot of a corporate project manager."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgO_UjBQ9aVz4uapH1urW6gIcZL1KtZMzMGsjQ2fw6Gj7J2GIN2aYVDJ7y3QVq7yGi6S9d7wxMsZTDYWlfA10Bk5mup5iZK7wOGEWWt3FhhBlqjGfUNwAM3uuznY_29iC9JdHWb9829D_xl535i38TKtldnpJegp0ewFZHjTkmqqOi4BW4sKt1h_vsxo2MIqjur8x76LfaMjt5QEO5sfRYWvHVKw8MopMdqDlS50xr50ZklnhG_FWdjzX93SvPU6d6wktPg4HkQLs"
                />
              </div>
              <div>
                <p className="font-body-sm text-body-sm italic opacity-90 text-on-primary">
                  "ProjectHub transformed how we handle massive technical debt and daily sprints."
                </p>
                <p className="font-label-md text-label-md font-bold mt-xs text-on-primary">
                  — Sarah Chen, CTO at TechFlow
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="p-lg md:p-xl flex flex-col justify-center bg-surface-main">
          <div className="mb-lg">
            <h2 className="font-headline-lg text-headline-lg text-text-heading mb-xs">
              Welcome back
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Enter your credentials to access your workspace.
            </p>
          </div>
          
          <form className="space-y-base" onSubmit={handleSubmit}>
            {/* Workspace ID Group */}
            <div className="flex flex-col gap-xs mb-md">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="org_id">
                Organization ID
              </label>
              <div className="relative">
                <input
                  className="w-full h-11 pl-md pr-[70px] rounded border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md bg-surface"
                  id="org_id"
                  name="org_id"
                  placeholder="acme-hq"
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
            
            {/* Email Group */}
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

            {/* Password Group */}
            <div className="flex flex-col gap-xs mb-lg">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">
                  Password
                </label>
                <a className="font-body-sm text-body-sm text-primary hover:underline" href="#">
                  Forgot password?
                </a>
              </div>
              <input
                className="w-full h-11 px-md rounded border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md bg-surface"
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me */}
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

            {/* Action */}
            <button
              className={`w-full h-12 text-on-primary font-button-text text-button-text rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-sm cursor-pointer ${
                isSuccess
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-primary hover:bg-surface-tint"
              }`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-on-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : isSuccess ? (
                <>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Success!</span>
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
            
            <div className="flex items-center gap-md w-full">
              <div className="flex-grow h-[1px] bg-border-subtle"></div>
              <span className="font-label-md text-label-md text-outline uppercase tracking-widest">
                or continue with
              </span>
              <div className="flex-grow h-[1px] bg-border-subtle"></div>
            </div>

            <div className="grid grid-cols-2 gap-md w-full">
              <button className="flex items-center justify-center gap-sm h-11 border border-border-subtle rounded-lg font-button-text text-button-text hover:bg-surface-sunken transition-colors cursor-pointer bg-white">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center gap-sm h-11 border border-border-subtle rounded-lg font-button-text text-button-text hover:bg-surface-sunken transition-colors cursor-pointer bg-white">
                <svg className="w-5 h-5 fill-[#000000]" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}