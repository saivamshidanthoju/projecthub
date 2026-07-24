import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { label: "Dashboard", icon: "dashboard", path: "/dashboard" },
    { label: "Projects", icon: "assignment", path: "/projects" },
    { label: "Tasks", icon: "check_box", path: "/tasks" },
    { label: "Calendar", icon: "calendar_today", path: "/calendar" },
    { label: "Team", icon: "groups", path: "/team" },
    { label: "Reports", icon: "bar_chart", path: "/reports" },
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col h-full py-lg px-md gap-base bg-surface-main dark:bg-inverse-surface border-r border-border-subtle dark:border-outline-variant w-64 h-screen fixed left-0 top-0 z-50">
        <div className="flex items-center gap-sm mb-lg px-xs">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          </div>
          <div>
            <h1 className="font-title-md text-title-md font-bold text-primary dark:text-inverse-primary">
              ProjectHub
            </h1>
            <p className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant leading-none uppercase tracking-widest text-[10px]">
              Enterprise SaaS
            </p>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md active:scale-[0.98] transition-all duration-200 ${
                  isActive
                    ? "bg-secondary-container text-on-secondary-container dark:bg-on-surface-variant dark:text-surface-main"
                    : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-on-surface-variant/50"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
          
        </nav>
        
        <div className="mt-auto pt-lg border-t border-border-subtle dark:border-outline-variant flex flex-col gap-xs select-none">
          {pathname === "/project-details" ? (
            <>
              <Link
                to="/settings"
                className={`flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md active:scale-[0.98] transition-all duration-200 ${
                  pathname === "/settings"
                    ? "bg-secondary-container text-on-secondary-container dark:bg-on-surface-variant dark:text-surface-main"
                    : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-on-surface-variant/50"
                }`}
              >
                <span className="material-symbols-outlined">settings</span>
                <span>Settings</span>
              </Link>
              
              <div className="mt-md p-sm bg-surface-container dark:bg-on-surface-variant/20 rounded-xl flex items-center gap-sm">
                <img 
                  className="w-10 h-10 rounded-full border-2 border-surface-main dark:border-inverse-surface object-cover shrink-0" 
                  alt="Elena Rodriguez"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSrkbKamuBW3btcBS0x2OY-8VPSNa-CZR2De1kGt_mWiijcgKvhjVI-JtMptZ1HbcvFGDYBoe3MaqJs_k3SGYhLP5nPMybl-A0Jws1aiDYu_3l1bpd-xfJ5dveMq8-De7da1C44mF02LYkpmJym9S5oErg5uU193dbvTsrDMYgp3jjYqca0o9XXMCcGCN3qYsm4dMQtVjmf_zWE5IDj6BQ1Nd_cP6iJ7jK7WaXr7eLaAJCP3MtdSlRV5a5Fad4EiW832ooz1SlkFQ" 
                />
                <div className="overflow-hidden">
                  <p className="font-title-md text-sm font-semibold truncate text-on-surface dark:text-surface-main">Elena Rodriguez</p>
                  <p className="font-body-sm text-[10px] text-on-surface-variant dark:text-surface-variant uppercase">Admin Access</p>
                </div>
              </div>
            </>
          ) : pathname === "/projects" ? (
            <>
              <Link
                to="/settings"
                className={`flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md active:scale-[0.98] transition-all duration-200 ${
                  pathname === "/settings"
                    ? "bg-secondary-container text-on-secondary-container dark:bg-on-surface-variant dark:text-surface-main"
                    : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-on-surface-variant/50"
                }`}
              >
                <span className="material-symbols-outlined">settings</span>
                <span>Settings</span>
              </Link>
              
              <Link
                to="/profile"
                className={`flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md active:scale-[0.98] transition-all duration-200 ${
                  pathname === "/profile"
                    ? "bg-secondary-container text-on-secondary-container dark:bg-on-surface-variant dark:text-surface-main"
                    : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-on-surface-variant/50"
                }`}
              >
                <span className="material-symbols-outlined">person</span>
                <span>Profile</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/settings"
                className={`flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md active:scale-[0.98] transition-all duration-200 mb-sm ${
                  pathname === "/settings"
                    ? "bg-secondary-container text-on-secondary-container dark:bg-on-surface-variant dark:text-surface-main"
                    : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-on-surface-variant/50"
                }`}
              >
                <span className="material-symbols-outlined">settings</span>
                <span>Settings</span>
              </Link>
              
              <button 
                onClick={() => alert("Creating a new project workspace...")}
                className="bg-primary text-white py-sm px-md rounded-lg flex items-center justify-center gap-sm font-button-text text-button-text hover:bg-surface-tint active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined">add</span>
                New Project
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest dark:bg-inverse-surface flex justify-around items-center py-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-border-subtle dark:border-outline-variant">
        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === "/dashboard" 
              ? "text-primary dark:text-inverse-primary" 
              : "text-on-surface-variant dark:text-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-label-md">Home</span>
        </Link>
        
        <Link 
          to="/projects" 
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === "/projects" 
              ? "text-primary dark:text-inverse-primary" 
              : "text-on-surface-variant dark:text-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined">assignment</span>
          <span className="text-[10px] font-label-md">Projects</span>
        </Link>
        
        <Link 
          to="/tasks" 
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === "/tasks" 
              ? "text-primary dark:text-inverse-primary" 
              : "text-on-surface-variant dark:text-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined">check_box</span>
          <span className="text-[10px] font-label-md">Tasks</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === "/profile" 
              ? "text-primary dark:text-inverse-primary" 
              : "text-on-surface-variant dark:text-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-label-md">Profile</span>
        </Link>
      </nav>
    </>
  );
}
