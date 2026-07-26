import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleLabel } from "../lib/rbac";
import { notificationsApi } from "../lib/api";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const pathname = location.pathname;
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const count = await notificationsApi.getUnreadCount(token);
        setUnreadCount(count);
      } catch (err) {
        console.error("Failed to load notifications count:", err);
      }
    };
    if (token) {
      fetchCounts();
      const interval = setInterval(fetchCounts, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const toggleNotifications = async () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen && token) {
      try {
        const list = await notificationsApi.list(token);
        setNotifications(list);
      } catch (err) {
        console.error("Failed to load notifications list:", err);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead(token);
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationsApi.markRead(token, id);
      setUnreadCount(c => Math.max(c - 1, 0));
      setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
  }, []);

  const fullName = useMemo(() => {
    const name = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
    return name || "ProjectHub User";
  }, [user]);

  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const isTeamPage = pathname === "/team";
  const isCalendarPage = pathname === "/calendar";

  return (
    <header className="flex items-center justify-between px-margin-desktop w-full h-16 sticky top-0 z-40 bg-white shadow-sm border-b border-border-subtle select-none shrink-0">
      <div className="flex items-center gap-xl min-w-0">
        {isTeamPage ? (
          <>
            <Link to="/dashboard" className="font-title-lg text-title-lg text-primary font-bold tracking-tight">
              ProjectHub
            </Link>
            <nav className="hidden md:flex items-center gap-base">
              <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors px-3 py-2 rounded-lg" to="/dashboard">
                Dashboard
              </Link>
              <div className="relative py-2 px-3">
                <Link className="font-body-md text-body-md text-primary font-semibold" to="/team">
                  Team
                </Link>
                <div className="absolute bottom-0 left-3 right-3 h-[3px] bg-primary rounded-full"></div>
              </div>
              <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors px-3 py-2 rounded-lg" to="/projects">
                Projects
              </Link>
            </nav>
          </>
        ) : isCalendarPage ? (
          <>
            <Link to="/dashboard" className="font-title-lg text-title-lg text-primary font-bold tracking-tight">
              ProjectHub
            </Link>
            <nav className="hidden md:flex items-center gap-base">
              <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors px-3 py-2 rounded-lg" to="/dashboard">
                Overview
              </Link>
              <div className="relative py-2 px-3">
                <Link className="font-body-md text-body-md text-primary font-semibold" to="/calendar">
                  Calendar
                </Link>
                <div className="absolute bottom-0 left-3 right-3 h-[3px] bg-primary rounded-full"></div>
              </div>
              <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors px-3 py-2 rounded-lg" to="/projects">
                Timeline
              </Link>
              <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors px-3 py-2 rounded-lg" to="/tasks">
                Milestones
              </Link>
            </nav>
          </>
        ) : (
          <div className="flex items-center bg-surface-sunken px-sm py-xs rounded-lg border border-border-subtle w-64 md:w-96">
            <span className="material-symbols-outlined text-on-surface-variant text-md">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-body-md w-full ml-xs outline-none text-on-surface pl-2"
              placeholder="Search projects, tasks, or team members..."
              type="text"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-md">
        {(isTeamPage || isCalendarPage) && (
          <div className="hidden lg:flex items-center bg-surface-sunken px-sm py-xs rounded-lg border border-border-subtle w-56">
            <span className="material-symbols-outlined text-on-surface-variant text-md">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-body-sm w-full ml-xs outline-none text-on-surface pl-2"
              placeholder="Global search..."
              type="text"
            />
          </div>
        )}

        {isCalendarPage && (
          <Link
            to="/team"
            className="hidden lg:inline-flex items-center justify-center px-md h-9 bg-primary text-white rounded-lg hover:brightness-110 font-button-text text-button-text active:scale-95 transition-all"
          >
            Invite Team
          </Link>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={toggleNotifications}
            className="material-symbols-outlined text-on-surface-variant p-xs hover:bg-surface-container transition-colors rounded-full cursor-pointer relative"
            title="Notifications"
          >
            notifications
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-error text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-11 w-80 bg-surface-main border border-border-subtle rounded-xl shadow-lg py-2 z-50 animate-fade-in text-left">
              <div className="px-4 py-2 border-b border-border-subtle flex justify-between items-center select-none">
                <span className="font-title-md text-sm font-bold text-on-surface">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-primary hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto custom-scrollbar divide-y divide-border-subtle">
                {notifications.map((n) => (
                  <div 
                    key={n.notification_id || n.id} 
                    onClick={() => handleMarkRead(n.notification_id || n.id)}
                    className={`px-4 py-3 hover:bg-surface-container-low transition-colors cursor-pointer text-left flex flex-col gap-xs ${
                      !n.is_read ? "bg-primary-container/10 font-medium" : ""
                    }`}
                  >
                    <p className="text-body-sm text-on-surface leading-snug">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-on-surface-variant/70">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-center text-body-sm text-on-surface-variant/70 py-6 select-none">
                    No new notifications.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-border-subtle mx-xs"></div>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((open) => !open)}
            className="flex items-center gap-sm p-1 pr-2 rounded-full hover:bg-surface-container-low transition-colors duration-200 cursor-pointer"
          >
            <span className="w-8 h-8 rounded-full bg-primary text-white border border-border-subtle flex items-center justify-center text-[11px] font-bold">
              {initials}
            </span>
            <span className="font-title-md text-sm font-semibold text-text-heading hidden sm:inline-block">
              {fullName}
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">keyboard_arrow_down</span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 w-56 bg-surface-main border border-border-subtle rounded-xl shadow-lg py-2 z-50 animate-fade-in text-left">
              <div className="px-4 py-2 border-b border-border-subtle">
                <p className="font-title-md text-sm leading-none text-on-surface font-bold">{fullName}</p>
                <p className="font-body-sm text-[10px] text-on-surface-variant mt-1">{user?.email}</p>
                <p className="font-label-md text-[10px] text-primary mt-2 uppercase tracking-wider">
                  {getRoleLabel(user)} Access
                </p>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setProfileOpen(false)}
                className="block w-full px-4 py-2 text-body-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/"
                onClick={() => setProfileOpen(false)}
                className="block w-full px-4 py-2 text-body-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                View Landing
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-body-sm text-error hover:bg-red-50 transition-colors font-semibold"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
