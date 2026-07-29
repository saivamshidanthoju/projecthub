import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { can, getRoleLabel } from "../lib/rbac";

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user } = useAuth();

  const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "ProjectHub User";
  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navItems = [
    { label: "Dashboard", icon: "dashboard", path: "/dashboard" },
    { label: "Projects", icon: "assignment", path: "/projects" },
    { label: "Tasks", icon: "check_box", path: "/tasks" },
    { label: "Calendar", icon: "calendar_today", path: "/calendar" },
    { label: "Team", icon: "groups", path: "/team", permission: "manageTeam" },
    { label: "Reports", icon: "bar_chart", path: "/reports", permission: "viewReports" },
  ].filter((item) => !item.permission || can(user, item.permission));

  return (
    <>
      <aside className="hidden md:flex flex-col h-full py-lg px-md gap-base bg-white border-r border-border-subtle w-64 h-screen fixed left-0 top-0 z-50">
        <div className="flex items-center gap-sm mb-lg px-xs">
          <img src="/logo.svg" className="w-8 h-8 object-contain" alt="ProjectHub Logo" />
          <div>
            <h1 className="font-title-md text-title-md font-bold text-primary">ProjectHub</h1>
            <p className="font-label-md text-label-md text-on-surface-variant leading-none uppercase tracking-widest text-[10px]">
              {getRoleLabel(user)} Workspace
            </p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path === "/projects" && pathname.startsWith("/project-details"));
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-sm py-sm active:scale-[0.98] transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary font-bold px-md rounded-lg"
                    : "text-on-surface-variant hover:bg-surface-container-high px-md rounded-lg"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-lg border-t border-border-subtle flex flex-col gap-xs select-none">
          <div className="mt-md p-sm bg-surface-container rounded-lg flex items-center gap-sm">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="font-title-md text-sm font-semibold truncate text-on-surface">{fullName}</p>
              <p className="font-body-sm text-[10px] text-on-surface-variant uppercase">{getRoleLabel(user)} Access</p>
            </div>
          </div>

          {can(user, "manageProjects") && (
            <Link
              to="/projects"
              className="bg-primary text-white py-sm px-md rounded-lg flex items-center justify-center gap-sm font-button-text text-button-text hover:bg-surface-tint active:scale-95 transition-all cursor-pointer mt-sm font-bold"
            >
              <span className="material-symbols-outlined">add</span>
              New Project
            </Link>
          )}
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white flex justify-around items-center py-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-border-subtle">
        {navItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-colors ${isActive ? "text-primary" : "text-on-surface-variant"}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-[10px] font-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
