import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const pathname = location.pathname;

  const [profileOpen, setProfileOpen] = useState(false);

  // Force light mode (remove dark class) on mount to clear any residual state
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const handleToggleSimulated = () => {
    alert("Workspace is locked to Light Mode only.");
  };

  const isTeamPage = pathname === "/team";
  const isCalendarPage = pathname === "/calendar";

  return (
    <header className="flex items-center justify-between px-margin-desktop w-full h-16 sticky top-0 z-40 bg-surface-container-lowest dark:bg-inverse-surface shadow-sm border-b border-border-subtle dark:border-outline-variant select-none shrink-0">
      {/* Left Navigation / Brand block */}
      <div className="flex items-center gap-xl">
        {isTeamPage ? (
          <>
            <Link to="/" className="font-title-lg text-title-lg text-primary dark:text-inverse-primary font-bold tracking-tight">
              ProjectHub
            </Link>
            <nav className="hidden md:flex items-center gap-base">
              <Link
                to="/dashboard"
                className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors px-3 py-2 rounded-lg"
              >
                Dashboard
              </Link>
              <div className="relative py-2 px-3">
                <Link
                  to="/team"
                  className="font-body-md text-body-md text-primary dark:text-inverse-primary font-semibold"
                >
                  Team
                </Link>
                <div className="absolute bottom-0 left-3 right-3 h-[3px] bg-primary dark:bg-inverse-primary rounded-full"></div>
              </div>
              <Link
                to="/projects"
                className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors px-3 py-2 rounded-lg"
              >
                Projects
              </Link>
            </nav>
          </>
        ) : isCalendarPage ? (
          <>
            <Link to="/" className="font-title-lg text-title-lg text-primary dark:text-inverse-primary font-bold tracking-tight">
              ProjectHub
            </Link>
            <nav className="hidden md:flex items-center gap-base">
              <Link
                to="/dashboard"
                className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors px-3 py-2 rounded-lg"
              >
                Overview
              </Link>
              <div className="relative py-2 px-3">
                <Link
                  to="/calendar"
                  className="font-body-md text-body-md text-primary dark:text-inverse-primary font-semibold"
                >
                  Calendar
                </Link>
                <div className="absolute bottom-0 left-3 right-3 h-[3px] bg-primary dark:bg-inverse-primary rounded-full"></div>
              </div>
              <Link
                to="/projects"
                className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors px-3 py-2 rounded-lg"
              >
                Timeline
              </Link>
              <Link
                to="/tasks"
                className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors px-3 py-2 rounded-lg"
              >
                Milestones
              </Link>
            </nav>
          </>
        ) : (
          <div className="flex items-center bg-surface-sunken dark:bg-inverse-surface px-sm py-xs rounded-lg border border-border-subtle dark:border-outline-variant w-80 md:w-96">
            <span className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant text-md">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-body-md w-full ml-xs outline-none text-on-surface dark:text-surface-main pl-2"
              placeholder="Search projects, tasks, or team members..."
              type="text"
            />
          </div>
        )}
      </div>

      {/* Right Tools / User Profile block */}
      <div className="flex items-center gap-md">
        {isTeamPage && (
          <div className="relative flex items-center bg-surface-sunken dark:bg-inverse-surface px-sm py-xs rounded-lg border border-border-subtle dark:border-outline-variant w-40 md:w-64">
            <span className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant text-md">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-body-sm w-full ml-xs outline-none text-on-surface dark:text-surface-main pl-2"
              placeholder="Global search..."
              type="text"
            />
          </div>
        )}

        {isCalendarPage && (
          <>
            <div className="relative flex items-center bg-surface-sunken dark:bg-inverse-surface px-sm py-xs rounded-lg border border-border-subtle dark:border-outline-variant w-40 md:w-56">
              <span className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant text-md">
                search
              </span>
              <input
                className="bg-transparent border-none focus:ring-0 text-body-sm w-full ml-xs outline-none text-on-surface dark:text-surface-main pl-2"
                placeholder="Search tasks..."
                type="text"
              />
            </div>
            
            <button className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant p-xs hover:bg-surface-container dark:hover:bg-on-surface-variant/40 transition-colors rounded-full cursor-pointer">
              apps
            </button>

            <button
              onClick={() => alert("Simulating team invitation flow...")}
              className="hidden lg:inline-block px-md h-9 bg-primary text-white rounded-lg hover:brightness-110 font-button-text text-button-text active:scale-95 transition-all cursor-pointer"
            >
              Invite Team
            </button>
          </>
        )}

        <button className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant p-xs hover:bg-surface-container dark:hover:bg-on-surface-variant/40 transition-colors rounded-full cursor-pointer relative">
          notifications
          {(isTeamPage || isCalendarPage) && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          )}
        </button>

        {/* Static moon icon toggle button to match design layout screenshot */}
        <button 
          onClick={handleToggleSimulated}
          className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant p-xs hover:bg-surface-container dark:hover:bg-on-surface-variant/40 transition-colors rounded-full cursor-pointer"
        >
          dark_mode
        </button>
        
        <div className="h-8 w-[1px] bg-border-subtle dark:bg-outline-variant mx-xs"></div>
        
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-sm p-1 pr-2 rounded-full hover:bg-surface-container-low dark:hover:bg-on-surface-variant/30 transition-colors duration-200 cursor-pointer"
          >
            <img
              className="w-8 h-8 rounded-full object-cover border border-border-subtle dark:border-outline-variant"
              alt="Sarah Chen avatar."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD71_WId36rvfuPNoxKGJ-w-ieAFxLTHrKxJRxjd12MGRASKQsnGJXo3Kxcp-XK7kd0koMgUjDTMN1xEabBUKaLRGfzYB62aNGccvgt76GWi5ySyYH0bjhxtRj_j5BQkQ-tXgDecssf0nKafomlsYkJkvps5jobV94oPFs9D4q_1TkQnWj-YS1nQ60zxIBr9TZPKhSE6o9m04VJkWVQw4-jPJTaTYOBDc5tQ4B7DMbgcIzt0gJNpZ51Z43qbGnhgLBujLS4vpPA5oA"
            />
            <span className="font-title-md text-sm font-semibold text-text-heading dark:text-surface-main hidden sm:inline-block">
              Sarah Chen
            </span>
            <span className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant text-[18px]">
              keyboard_arrow_down
            </span>
          </button>
          
          {profileOpen && (
            <div className="absolute right-0 top-11 w-48 bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl shadow-lg py-2 z-50 animate-fade-in text-left">
              <div className="px-4 py-2 border-b border-border-subtle dark:border-outline-variant">
                <p className="font-title-md text-sm leading-none text-on-surface dark:text-surface-main font-bold">Sarah Chen</p>
                <p className="font-body-sm text-[10px] text-on-surface-variant dark:text-surface-variant mt-1">sarah.chen@phub.io</p>
              </div>
              <Link 
                to="/" 
                onClick={() => setProfileOpen(false)}
                className="block w-full px-4 py-2 text-body-sm text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/50 transition-colors"
              >
                View Landing
              </Link>
              <Link 
                to="/login" 
                onClick={() => setProfileOpen(false)}
                className="block w-full px-4 py-2 text-body-sm text-error hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-semibold"
              >
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
