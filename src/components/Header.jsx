import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="flex items-center justify-between px-margin-desktop w-full h-16 sticky top-0 z-40 bg-surface-container-lowest dark:bg-inverse-surface shadow-sm border-b border-border-subtle dark:border-outline-variant select-none">
      <div className="flex items-center gap-lg">
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
      </div>
      
      <div className="flex items-center gap-md">
        <button className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant p-xs hover:bg-surface-container dark:hover:bg-on-surface-variant/40 transition-colors rounded-full cursor-pointer">
          notifications
        </button>
        <button 
          onClick={toggleDarkMode}
          className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant p-xs hover:bg-surface-container dark:hover:bg-on-surface-variant/40 transition-colors rounded-full cursor-pointer"
        >
          {darkMode ? "light_mode" : "dark_mode"}
        </button>
        
        <div className="h-8 w-[1px] bg-border-subtle dark:bg-outline-variant mx-xs"></div>
        
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-sm p-1 pr-2 rounded-full hover:bg-surface-container-low dark:hover:bg-on-surface-variant/30 transition-colors duration-200 cursor-pointer"
          >
            <img
              className="w-8 h-8 rounded-full object-cover border border-border-subtle dark:border-outline-variant"
              alt="Alex Rivera"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxj80x9RWxJQ4AzWlur52xcsE0i1HBIkNBt4Osn-cTVudkAiC-DX4pu1v0rN5QJ1eKqF3b8IoEsWBDbz3rzT3SNja8oN5EwrD8etLB_dag8b4y4DxDN88A4ikjV454h5OHs8HrVWsKf3GgMzxiZdkTwi5kOSstKGfq1Apv-CR1L-lBYRnr9JyQxubE_W98i0pb3ck4aUEDR0uYEHmQblScFwllnsiLCXmj4vPMCqbiPnonaS6mpaKDeX5RLl5gNYhEy6U8uJY8I4U"
            />
            <span className="font-title-md text-sm font-semibold text-text-heading dark:text-surface-main hidden sm:inline-block">
              Alex Rivera
            </span>
            <span className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant text-[18px]">
              keyboard_arrow_down
            </span>
          </button>
          
          {profileOpen && (
            <div className="absolute right-0 top-11 w-48 bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl shadow-lg py-2 z-50 animate-fade-in text-left">
              <div className="px-4 py-2 border-b border-border-subtle dark:border-outline-variant">
                <p className="font-title-md text-sm leading-none text-on-surface dark:text-surface-main font-bold">Alex Rivera</p>
                <p className="font-body-sm text-[10px] text-on-surface-variant dark:text-surface-variant mt-1">alex.rivera@phub.io</p>
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
