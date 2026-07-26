import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../lib/rbac";

export default function Register() {
  const [companyName, setCompanyName] = useState("");
  const [orgId, setOrgId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const orgIdTouched = useRef(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleCompanyNameChange = (e) => {
    const value = e.target.value;
    setCompanyName(value);

    if (!orgIdTouched.current) {
      setOrgId(
        value
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        companyName: companyName.trim(),
        orgSlug: orgId.trim() || "projecthub",
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        roleId: ROLES.ADMIN,
      });
      setIsSuccess(true);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to create workspace.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-surface-main text-on-surface flex flex-col md:grid md:grid-cols-2">
      <div 
        className="hidden md:flex flex-col justify-between p-xl bg-cover bg-center text-white relative overflow-hidden min-h-screen"
        style={{ backgroundImage: "url('/register_left_bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/45 z-0"></div>

        <div className="z-10">
          <div className="flex items-center gap-sm mb-xl">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-title-lg">hub</span>
            </div>
            <span className="font-title-lg text-title-lg font-bold tracking-tight text-white">ProjectHub</span>
          </div>
          <h1 className="font-display-lg text-display-lg leading-tight mb-md text-white font-bold">
            Create a controlled workspace.
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-[384px]">
            Your first account becomes the workspace admin, with manager and member access enforced across the app.
          </p>
        </div>

        <div className="z-10 mt-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-md">
          <p className="font-body-sm text-body-sm italic text-white/90">
            ProjectHub keeps project access, upload permissions, and destructive actions tied to role.
          </p>
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
              Create workspace
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Start with an admin account for your organization.
            </p>
          </div>

          {error && (
            <div className="mb-md rounded-lg border border-error-container bg-error-container/40 px-md py-sm text-body-sm text-error">
              {error}
            </div>
          )}

          <form className="space-y-base" id="registerForm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md mb-md">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="company_name">
                  Company Name
                </label>
                <input
                  className="w-full h-11 px-md rounded border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md bg-surface"
                  id="company_name"
                  name="company_name"
                  placeholder="Acme Corp"
                  type="text"
                  value={companyName}
                  onChange={handleCompanyNameChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-xs">
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
                    onFocus={() => {
                      orgIdTouched.current = true;
                    }}
                    required
                  />
                  <span className="absolute right-3 top-3 text-on-surface-variant/50 font-label-md text-label-md select-none pointer-events-none">
                    .phub.io
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-xs mb-md">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="full_name">
                Full Name
              </label>
              <input
                className="w-full h-11 px-md rounded border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md bg-surface"
                id="full_name"
                name="full_name"
                placeholder="John Doe"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md mb-lg">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-full h-11 px-md rounded border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md bg-surface"
                  id="password"
                  name="password"
                  placeholder="Minimum 6 chars"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="confirm_password">
                  Confirm Password
                </label>
                <input
                  className="w-full h-11 px-md rounded border border-border-subtle focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md bg-surface"
                  id="confirm_password"
                  name="confirm_password"
                  placeholder="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-sm mb-xl">
              <div className="pt-1">
                <input
                  className="w-4 h-4 rounded text-primary border-border-subtle focus:ring-primary focus:ring-offset-0 cursor-pointer"
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                />
              </div>
              <label
                className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed select-none cursor-pointer"
                htmlFor="terms"
              >
                I agree to the Terms of Service and Privacy Policy.
              </label>
            </div>

            <button
              className="w-full h-12 bg-primary text-white rounded-lg shadow hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-xs cursor-pointer font-bold"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                  <span>Creating...</span>
                </>
              ) : isSuccess ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Workspace Created</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-xl pt-lg border-t border-border-subtle flex flex-col items-center gap-md">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Already have an account?
              <Link className="text-primary font-bold hover:underline ml-1" to="/login">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
