import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Home, 
  MessageSquare, 
  ListChecks, 
  Briefcase, 
  Grid, 
  Plus, 
  Diamond, 
  Search, 
  Star, 
  Clock, 
  FileText, 
  Bell, 
  History, 
  ChevronDown,
  X,
  Sparkles,
  ArrowRight,
  LogOut,
  Settings as SettingsIcon,
  CheckCircle,
  Menu
} from "lucide-react";

// Helper component for narrow sidebar icons
const NarrowSidebarIcon = ({ Icon, active, to, onClick }) => {
  const activeClass = active 
    ? "bg-white text-[#2f5ad8] rounded-xl shadow-sm"
    : "text-white/75 hover:bg-white/10 hover:text-white rounded-xl";

  const content = (
    <div 
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center transition-all duration-200 cursor-pointer ${activeClass}`}
    >
      <Icon size={19} strokeWidth={active ? 2.5 : 2} />
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
};

export default function DoubleSidebarLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const pathname = location.pathname;

  // Sidebar collapse state for full-screen mode
  const [isCollapsed, setIsCollapsed] = useState(
    localStorage.getItem("projecthub.sidebar.collapsed") === "true"
  );

  // Custom views list
  const [customViews, setCustomViews] = useState(() => {
    const saved = localStorage.getItem("projecthub.customviews");
    return saved ? JSON.parse(saved) : [];
  });

  // Modal open states
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [isNewViewModalOpen, setIsNewViewModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isRecentDropdownOpen, setIsRecentDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form states
  const [newViewName, setNewViewName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickAddType, setQuickAddType] = useState("task"); // task | note | timelog
  const [quickTitle, setQuickTitle] = useState("");

  // Listening to sidebar toggle events
  useEffect(() => {
    const handleToggle = () => {
      setIsCollapsed((prev) => {
        const next = !prev;
        localStorage.setItem("projecthub.sidebar.collapsed", String(next));
        return next;
      });
    };
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, []);

  // Resolve user initials for avatar
  const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "ProjectHub User";
  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SK";

  // Check if Home icon is selected on left sidebar
  const isHomeSelected = 
    pathname === "/my-work" || 
    pathname === "/my-tasks" || 
    pathname === "/time-tracking" || 
    pathname === "/notepad" || 
    pathname === "/notifications" ||
    pathname === "/dashboard";

  // Left Sidebar items
  const leftNavItems = [
    { icon: Home, active: isHomeSelected, to: "/my-work" },
    { icon: ListChecks, active: pathname === "/my-tasks", to: "/my-tasks" },
    { icon: Briefcase, active: pathname === "/projects", to: "/projects" },
  ];

  // Middle Sidebar Home section items
  const homeItems = [
    { label: "My Work", path: "/my-work", icon: (active) => (
      <div className={`relative w-4 h-4 border ${active ? "border-[#2563eb]" : "border-slate-400"} rounded flex items-center justify-center shrink-0`}>
        <Star size={10} className={active ? "fill-[#2563eb] text-[#2563eb]" : "text-slate-400"} strokeWidth={3} />
      </div>
    )},
    { label: "My Tasks", path: "/my-tasks", icon: (active) => (
      <ListChecks size={15} className={active ? "text-[#2563eb]" : "text-slate-500"} />
    )},
    { label: "Time Tracking", path: "/time-tracking", icon: (active) => (
      <Clock size={15} className={active ? "text-[#2563eb]" : "text-slate-500"} />
    )},
    { label: "Notepad", path: "/notepad", icon: (active) => (
      <FileText size={15} className={active ? "text-[#2563eb]" : "text-slate-500"} />
    )},
    { label: "Notifications", path: "/notifications", icon: (active) => (
      <div className="relative">
        <Bell size={15} className={active ? "text-[#2563eb]" : "text-slate-500"} />
      </div>
    )},
  ];

  const handleAddNewView = (e) => {
    e.preventDefault();
    if (!newViewName.trim()) return;
    const updated = [...customViews, { id: Date.now(), name: newViewName }];
    setCustomViews(updated);
    localStorage.setItem("projecthub.customviews", JSON.stringify(updated));
    setNewViewName("");
    setIsNewViewModalOpen(false);
  };

  const handleDeleteView = (id, e) => {
    e.stopPropagation();
    const updated = customViews.filter(v => v.id !== id);
    setCustomViews(updated);
    localStorage.setItem("projecthub.customviews", JSON.stringify(updated));
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    if (quickAddType === "task") {
      const saved = localStorage.getItem("projecthub.tasks") || "[]";
      const tasks = JSON.parse(saved);
      tasks.push({
        id: Date.now(),
        title: quickTitle,
        priority: "MEDIUM",
        status: "TODO",
        due_date: new Date(Date.now() + 5*24*60*60*1000).toISOString()
      });
      // Try listing to window update event or save to api/localStorage
      localStorage.setItem("projecthub.tasks", JSON.stringify(tasks));
      window.dispatchEvent(new Event("task-added"));
    } else if (quickAddType === "note") {
      const saved = localStorage.getItem("projecthub.notes") || "[]";
      const notes = JSON.parse(saved);
      notes.unshift({
        id: Date.now(),
        title: quickTitle,
        content: "Blank note content. Click to edit...",
        type: "plain",
        createdAt: new Date().toLocaleDateString()
      });
      localStorage.setItem("projecthub.notes", JSON.stringify(notes));
      window.dispatchEvent(new Event("notes-updated"));
    } else if (quickAddType === "timelog") {
      const saved = localStorage.getItem("projecthub.timelogs") || "[]";
      const logs = JSON.parse(saved);
      logs.push({
        id: Date.now(),
        title: quickTitle,
        comment: "Logged from quick add shortcut",
        time: 1.0,
        createdAt: new Date().toLocaleDateString()
      });
      localStorage.setItem("projecthub.timelogs", JSON.stringify(logs));
      window.dispatchEvent(new Event("timelog-added"));
    }

    setQuickTitle("");
    setIsQuickAddModalOpen(false);
    alert(`Successfully added new ${quickAddType}!`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-[#0b1c30] font-sans antialiased relative">
      
      {/* 1. Left Narrow Blue Sidebar */}
      {!isCollapsed && (
        <aside className="hidden md:flex flex-col items-center py-4 bg-[#2f5ad8] w-14 h-full shrink-0 select-none justify-between border-r border-[#1f45be]/10 z-20">
          <div className="flex flex-col items-center gap-4 w-full">
            {/* Logo Container */}
            <div 
              onClick={() => navigate("/my-work")}
              className="w-10 h-10 bg-[#1c3f95] rounded-xl flex items-center justify-center text-white mb-2 cursor-pointer shadow-inner"
            >
              <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                <div className="bg-[#b4c5ff] rounded-sm"></div>
                <div className="bg-[#10b981] rounded-sm"></div>
                <div className="bg-[#b4c5ff] rounded-sm"></div>
                <div className="bg-[#60a5fa] rounded-sm"></div>
              </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex flex-col items-center gap-3 w-full">
              {leftNavItems.map((item, idx) => (
                <NarrowSidebarIcon 
                  key={idx} 
                  Icon={item.icon} 
                  active={item.active} 
                  to={item.to} 
                  onClick={item.onClick}
                />
              ))}
            </div>

            <div className="w-8 h-[1px] bg-white/20 my-2"></div>

            {/* Apps and Quick Add */}
            <div className="flex flex-col items-center gap-3 w-full">
              <div 
                onClick={() => setIsQuickAddModalOpen(true)}
                className="w-6 h-6 flex items-center justify-center bg-white text-[#2f5ad8] rounded-full hover:scale-105 active:scale-95 cursor-pointer shadow transition-transform"
                title="Quick Add Task/Note"
              >
                <Plus size={14} strokeWidth={3} />
              </div>
            </div>
          </div>

          {/* Bottom Utility Icons */}
          <div className="flex flex-col items-center gap-4 w-full relative">
            <div 
              onClick={() => setIsUpgradeModalOpen(true)}
              className="w-9 h-9 flex items-center justify-center text-white/75 hover:text-white cursor-pointer hover:bg-white/10 rounded-xl"
              title="Upgrade Premium"
            >
              <Diamond size={18} />
            </div>
            
            <div 
              onClick={() => setIsSearchModalOpen(true)}
              className="w-9 h-9 flex items-center justify-center text-white/75 hover:text-white cursor-pointer hover:bg-white/10 rounded-xl"
              title="Search Spotlight"
            >
              <Search size={18} />
            </div>

            {/* User Initials Circle / Profile Dropdown Trigger */}
            <div className="relative">
              <div 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-8 h-8 rounded-full bg-fuchsia-600 text-white font-semibold flex items-center justify-center text-xs border border-white/10 cursor-pointer hover:brightness-110 active:scale-95 transition-all"
              >
                {initials}
              </div>

              {isProfileDropdownOpen && (
                <div className="absolute bottom-10 left-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 text-left z-50 text-[13px] animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-800">{fullName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email || "user@projecthub.test"}</p>
                  </div>
                  <button className="w-full px-3 py-2 text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-left">
                    <SettingsIcon size={14} />
                    <span>Account Settings</span>
                  </button>
                  <button 
                    onClick={() => { logout(); navigate("/login"); }}
                    className="w-full px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 text-left border-t border-slate-100"
                  >
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* 2. Middle Sidebar (Home Navigation) */}
      {!isCollapsed && (
        <aside className="hidden md:flex flex-col w-56 h-full bg-[#f8f9fa] border-r border-[#eef1f6] shrink-0 py-4 px-3 select-none justify-between z-10">
          <div className="flex flex-col gap-4">
            <div className="px-2">
              <h2 className="text-[14px] font-bold text-[#0f172a] tracking-tight">Home</h2>
            </div>

            {/* Home Items List */}
            <nav className="flex flex-col gap-[3px]">
              {homeItems.map((item) => {
                const isSelected = pathname === item.path;
                return (
                  <div
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-3 px-3 py-[7px] text-[13px] rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#eff6ff] text-[#2563eb] font-semibold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    {item.icon(isSelected)}
                    <span>{item.label}</span>
                  </div>
                );
              })}

              {/* Recent Item Dropdown */}
              <div className="relative">
                <div
                  onClick={() => setIsRecentDropdownOpen(!isRecentDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-[7px] text-[13px] rounded-lg transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                >
                  <History size={15} className="text-slate-500" />
                  <span>Recent</span>
                </div>
                {isRecentDropdownOpen && (
                  <div className="absolute left-4 top-8 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 text-xs text-slate-600 z-50 animate-fade-in text-left">
                    <p className="px-2.5 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[9px] border-b border-slate-100">Recently Visited</p>
                    <button onClick={() => { navigate("/my-work"); setIsRecentDropdownOpen(false); }} className="w-full text-left px-3 py-1.5 hover:bg-slate-50">My Work</button>
                    <button onClick={() => { navigate("/my-tasks"); setIsRecentDropdownOpen(false); }} className="w-full text-left px-3 py-1.5 hover:bg-slate-50">My Tasks</button>
                    <button onClick={() => { navigate("/notepad"); setIsRecentDropdownOpen(false); }} className="w-full text-left px-3 py-1.5 hover:bg-slate-50">Notepad</button>
                  </div>
                )}
              </div>

              {/* More Item */}
              <div
                onClick={() => alert("ProjectHub Workspace features are fully expanded.")}
                className="flex items-center gap-3 px-3 py-[7px] text-[13px] rounded-lg transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
              >
                <ChevronDown size={15} className="text-slate-500" />
                <span>More</span>
              </div>
            </nav>

            {/* Views Section */}
            <div className="mt-2 px-2 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Views</span>
              
              {/* Render dynamic Custom Views */}
              {customViews.map(view => (
                <div 
                  key={view.id}
                  className="flex items-center justify-between text-[12px] font-medium text-slate-600 hover:bg-slate-100 py-1 px-1.5 rounded group cursor-pointer"
                >
                  <span className="truncate"># {view.name}</span>
                  <button 
                    onClick={(e) => handleDeleteView(view.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 text-xs px-1"
                  >
                    ×
                  </button>
                </div>
              ))}

              <button 
                onClick={() => setIsNewViewModalOpen(true)}
                className="flex items-center gap-2 text-[12px] font-medium text-slate-500 hover:text-[#2563eb] transition-colors pl-1"
              >
                <Plus size={14} />
                <span>New View</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 3. Right Content Panel */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white z-0">
        {/* Mobile Top Header */}
        <div className="flex md:hidden items-center justify-between px-4 h-12 bg-[#2f5ad8] text-white shrink-0 border-b border-[#1f45be]/10 z-30 select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-white cursor-pointer" onClick={() => navigate("/my-work")}>
              <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                <div className="bg-[#b4c5ff] rounded-sm"></div>
                <div className="bg-[#10b981] rounded-sm"></div>
                <div className="bg-[#b4c5ff] rounded-sm"></div>
                <div className="bg-[#60a5fa] rounded-sm"></div>
              </div>
              <span className="text-[13px] font-bold">ProjectHub</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
            >
              <Search size={16} />
            </button>
            <div
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-7 h-7 rounded-full bg-fuchsia-600 text-white font-semibold flex items-center justify-center text-xs border border-white/20 cursor-pointer hover:brightness-110"
            >
              {initials}
            </div>
          </div>
        </div>

        {/* Inner Content Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="flex md:hidden items-center justify-around h-14 bg-white border-t border-slate-200 shrink-0 z-30 select-none px-2 shadow-lg">
          {[
            { label: "Work", path: "/my-work", icon: Home },
            { label: "Tasks", path: "/my-tasks", icon: ListChecks },
            { label: "Projects", path: "/projects", icon: Briefcase },
            { label: "Notepad", path: "/notepad", icon: FileText },
          ].map((item) => {
            const isSelected = pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full cursor-pointer transition-all ${
                  isSelected ? "text-[#2f5ad8]" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon size={18} strokeWidth={isSelected ? 2.5 : 2} />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 w-14 h-full cursor-pointer text-slate-500 hover:text-slate-800 transition-all"
          >
            <Menu size={18} />
            <span className="text-[10px] font-medium leading-none">Menu</span>
          </button>
        </div>
      </main>

      {/* Mobile Menu Side Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] flex md:hidden">
          {/* Style injection for smooth animations */}
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(-100%); }
              to { transform: translateX(0); }
            }
            @keyframes fadeInBg {
              from { opacity: 0; }
              to { opacity: 0.4; }
            }
            .animate-slide-in {
              animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .animate-fade-in-bg {
              animation: fadeInBg 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>

          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900 animate-fade-in-bg transition-opacity duration-300"
          />

          {/* Drawer content */}
          <div className="relative flex flex-col w-[280px] max-w-[85vw] h-full bg-white shadow-2xl z-10 animate-slide-in flex-shrink-0">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#2f5ad8] text-white shrink-0">
              <div className="flex items-center gap-2 font-bold">
                <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                  <div className="bg-[#b4c5ff] rounded-sm"></div>
                  <div className="bg-[#10b981] rounded-sm"></div>
                  <div className="bg-[#b4c5ff] rounded-sm"></div>
                  <div className="bg-[#60a5fa] rounded-sm"></div>
                </div>
                <span className="text-sm">ProjectHub</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg cursor-pointer text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile banner inside drawer */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-fuchsia-600 text-white font-semibold flex items-center justify-center text-sm border border-white/20">
                {initials}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-bold text-slate-800 truncate">{fullName}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || "user@projecthub.test"}</p>
              </div>
            </div>

            {/* Scrollable menu items */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4 text-left">
              {/* Main navigation */}
              <div className="flex flex-col gap-1">
                <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Navigation</span>
                {homeItems.map((item) => {
                  const isSelected = pathname === item.path;
                  return (
                    <div
                      key={item.label}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#eff6ff] text-[#2563eb] font-semibold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                      }`}
                    >
                      {item.icon(isSelected)}
                      <span>{item.label}</span>
                    </div>
                  );
                })}
                
                {/* Additional main navigation links */}
                <div
                  onClick={() => {
                    navigate("/projects");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                    pathname === "/projects"
                      ? "bg-[#eff6ff] text-[#2563eb] font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  <Briefcase size={15} className={pathname === "/projects" ? "text-[#2563eb]" : "text-slate-500"} />
                  <span>Projects</span>
                </div>
              </div>

              {/* Views section */}
              <div className="flex flex-col gap-1.5">
                <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Views</span>
                {customViews.map(view => (
                  <div 
                    key={view.id}
                    className="flex items-center justify-between text-xs font-medium text-slate-600 hover:bg-slate-100 py-1.5 px-2.5 rounded group cursor-pointer"
                  >
                    <span className="truncate"># {view.name}</span>
                    <button 
                      onClick={(e) => handleDeleteView(view.id, e)}
                      className="text-slate-400 hover:text-red-500 text-xs px-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    setIsNewViewModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-[#2563eb] transition-colors pl-2.5 py-1"
                >
                  <Plus size={13} />
                  <span>New View</span>
                </button>
              </div>

              {/* Actions section */}
              <div className="flex flex-col gap-1">
                <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</span>
                <button 
                  onClick={() => {
                    setIsQuickAddModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-600 text-left rounded-lg cursor-pointer"
                >
                  <Plus size={14} className="text-slate-500" />
                  <span>Quick Add</span>
                </button>
                <button 
                  onClick={() => {
                    setIsUpgradeModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-600 text-left rounded-lg cursor-pointer"
                >
                  <Diamond size={14} className="text-slate-500" />
                  <span>Upgrade Premium</span>
                </button>
              </div>
            </div>

            {/* Logout button at bottom of drawer */}
            <div className="p-3 border-t border-slate-100 shrink-0">
              <button 
                onClick={() => { logout(); navigate("/login"); }}
                className="w-full px-3 py-2.5 text-red-600 hover:bg-red-50 flex items-center gap-2.5 text-xs font-semibold rounded-lg text-left cursor-pointer border border-red-100/50"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals Implementation */}
      
      {/* Search Spotlight Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-[1px] flex items-start justify-center pt-24 p-4 z-[9999] animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-xl w-[480px] max-w-full shadow-2xl overflow-hidden text-left">
            <div className="flex items-center px-4 py-3 border-b border-slate-100 gap-3">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search tasks, notes, documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-none text-slate-700 bg-transparent"
              />
              <button onClick={() => setIsSearchModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 max-h-72 overflow-y-auto text-xs text-slate-500 flex flex-col gap-2">
              <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Search suggestions</span>
              <button 
                onClick={() => { navigate("/my-tasks"); setIsSearchModalOpen(false); }} 
                className="w-full text-left p-2 rounded hover:bg-slate-50 text-slate-700 font-semibold"
              >
                Go to Tasks checklist
              </button>
              <button 
                onClick={() => { navigate("/notepad"); setIsSearchModalOpen(false); }} 
                className="w-full text-left p-2 rounded hover:bg-slate-50 text-slate-700 font-semibold"
              >
                Go to Notepad documents
              </button>
              <button 
                onClick={() => { navigate("/time-tracking"); setIsSearchModalOpen(false); }} 
                className="w-full text-left p-2 rounded hover:bg-slate-50 text-slate-700 font-semibold"
              >
                Go to Time logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Premium Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-[9999] animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-[400px] max-w-full shadow-2xl p-6 text-center text-left">
            <div className="flex justify-end">
              <button onClick={() => setIsUpgradeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center">
                <Diamond size={24} />
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-1">Upgrade to Enterprise Premium</h3>
            <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">Access unlimited workspace teams, custom note templates, and priority report export dashboards.</p>
            
            <div className="space-y-3 mb-6 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /><span>Unlimited project workspaces</span></div>
              <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /><span>Advanced Time Sheet export metrics</span></div>
              <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /><span>Secure database attachments encryption</span></div>
            </div>

            <button 
              onClick={() => { alert("Thank you for upgrading! Premium license activated."); setIsUpgradeModalOpen(false); }}
              className="w-full py-2.5 bg-[#2563eb] text-white rounded-xl font-semibold text-sm hover:bg-[#1d4ed8]"
            >
              Start 14-day free trial
            </button>
          </div>
        </div>
      )}

      {/* New View Modal */}
      {isNewViewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-[400px] max-w-full shadow-xl text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Create New View</h3>
              <button onClick={() => setIsNewViewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNewView} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">View Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  placeholder=""
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-[#2563eb] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsNewViewModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-xs font-semibold hover:bg-[#1d4ed8]"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Task/Note Modal */}
      {isQuickAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-[400px] max-w-full shadow-xl text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Quick Add Shortcut</h3>
              <button onClick={() => setIsQuickAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleQuickAdd} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">What would you like to add?</label>
                <div className="grid grid-cols-3 gap-2">
                  {["task", "note", "timelog"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setQuickAddType(type)}
                      className={`py-1.5 rounded-lg border text-xs font-bold capitalize transition-all ${
                        quickAddType === type 
                          ? "bg-slate-100 border-slate-300 text-slate-800" 
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Title / Details</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder=""
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-[#2563eb] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setIsQuickAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-xs font-semibold hover:bg-[#1d4ed8]"
                >
                  Save Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
