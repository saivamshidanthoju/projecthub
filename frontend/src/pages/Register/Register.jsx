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
              Create a controlled workspace.
            </h1>
            <p className="font-body-lg text-body-lg text-on-primary/80 max-w-[384px]">
              Your first account becomes the workspace admin, with manager and member access enforced across the app.
            </p>
          </div>

          <div className="z-10 mt-auto bg-white/10 border border-white/20 rounded-lg p-md">
            <p className="font-body-sm text-body-sm italic opacity-90 text-on-primary">
              ProjectHub keeps project access, upload permissions, and destructive actions tied to role.
            </p>
          </div>
        </div>

        <div className="p-lg md:p-xl flex flex-col justify-center bg-surface-main">
          <div className="mb-lg">
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
                  placeholder="Minimum 6 characters"
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
                  placeholder="Repeat password"
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
              className={`w-full h-12 text-on-primary font-button-text text-button-text rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-sm cursor-pointer disabled:opacity-75 ${
                isSuccess ? "bg-green-600" : "bg-primary hover:bg-surface-tint"
              }`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  <span>Creating...</span>
                </>
              ) : isSuccess ? (
                <>
                  <span className="material-symbols-outlined">check_circle</span>
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
      </main>
    </div>
  );
}
