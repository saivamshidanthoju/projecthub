import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [searchFocused, setSearchFocused] = useState(false);
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
    <header className="flex items-center justify-between px-margin-desktop w-full h-16 sticky top-0 z-40 bg-surface-container-lowest dark:bg-inverse-surface shadow-sm border-b border-border-subtle dark:border-outline-variant">
      <div className="flex items-center gap-lg">
        <div className={`flex items-center bg-surface-container-low dark:bg-inverse-surface rounded-full px-md py-1 border border-border-subtle dark:border-outline-variant transition-all duration-300 ${searchFocused ? "w-96 md:w-[32rem]" : "w-64 md:w-80"}`}>
          <span className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant text-sm select-none">
            search
          </span>
          <input
            className="bg-transparent border-none focus:ring-0 text-body-md font-body-md w-full placeholder:text-outline outline-none pl-2"
            placeholder="Search tasks..."
            type="text"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-md">
        <button className="p-base rounded-full text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/50 transition-colors active:scale-95 cursor-pointer">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button 
          onClick={toggleDarkMode}
          className="p-base rounded-full text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/50 transition-colors active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined">
            {darkMode ? "light_mode" : "dark_mode"}
          </span>
        </button>
        
        <div className="h-8 w-[1px] bg-border-subtle dark:bg-outline-variant mx-sm"></div>
        
        <div 
          onClick={() => setProfileOpen(!profileOpen)}
          className="relative w-8 h-8 rounded-full bg-surface-container-highest dark:bg-on-surface-variant flex items-center justify-center border border-border-subtle dark:border-outline-variant overflow-hidden cursor-pointer hover:opacity-90 shrink-0"
        >
          <img
            className="w-full h-full object-cover"
            alt="Alex Rivera profile avatar."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxj80x9RWxJQ4AzWlur52xcsE0i1HBIkNBt4Osn-cTVudkAiC-DX4pu1v0rN5QJ1eKqF3b8IoEsWBDbz3rzT3SNja8oN5EwrD8etLB_dag8b4y4DxDN88A4ikjV454h5OHs8HrVWsKf3GgMzxiZdkTwi5kOSstKGfq1Apv-CR1L-lBYRnr9JyQxubE_W98i0pb3ck4aUEDR0uYEHmQblScFwllnsiLCXmj4vPMCqbiPnonaS6mpaKDeX5RLl5gNYhEy6U8uJY8I4U"
          />
          
          {profileOpen && (
            <div className="absolute right-0 top-9 w-48 bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-border-subtle dark:border-outline-variant text-left">
                <p className="font-title-md text-title-md leading-none text-on-surface dark:text-surface-main font-bold">Alex Rivera</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-surface-variant mt-1">alex@phub.io</p>
              </div>
              <Link to="/" className="block w-full text-left px-4 py-2 text-body-sm text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/50 transition-colors">
                View Landing
              </Link>
              <Link to="/login" className="block w-full text-left px-4 py-2 text-body-sm text-error hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
