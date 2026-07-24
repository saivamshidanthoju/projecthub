import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-surface-container-lowest dark:bg-inverse-surface shadow-sm sticky top-0 z-40 w-full h-16 flex items-center justify-between px-margin-desktop border-b border-border-subtle dark:border-outline-variant">
      <div className="flex items-center gap-xl">
        <Link to="/" className="font-title-lg text-title-lg text-primary dark:text-inverse-primary font-bold tracking-tight select-none">
          ProjectHub
        </Link>

        <nav className="hidden md:flex items-center gap-lg">
          <a
            className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant transition-colors duration-200 px-3 py-2 rounded-lg"
            href="/#features"
          >
            Features
          </a>

          <a
            className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant transition-colors duration-200 px-3 py-2 rounded-lg"
            href="/#pricing"
          >
            Pricing
          </a>

          <a
            className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant transition-colors duration-200 px-3 py-2 rounded-lg"
            href="/#testimonials"
          >
            Success Stories
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-md">
        <Link
          className="font-button-text text-button-text text-primary font-semibold px-4 py-2 hover:bg-surface-container-low transition-colors duration-200 rounded-lg"
          to="/login"
        >
          Login
        </Link>

        <Link
          className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-button-text text-button-text shadow-sm hover:opacity-90 active:scale-95 transition-all text-center inline-block"
          to="/register"
        >
          Get Started
        </Link>

        <div className="flex items-center gap-sm ml-xl border-l border-border-subtle pl-xl">
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer p-2 rounded-full hover:bg-surface-container-low">
            notifications
          </span>

          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer p-2 rounded-full hover:bg-surface-container-low">
            account_circle
          </span>
        </div>
      </div>
    </header>
  );
}