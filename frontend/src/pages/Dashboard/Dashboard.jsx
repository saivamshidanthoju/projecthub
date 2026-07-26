import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { dashboardApi, projectsApi } from "../../lib/api";

export default function Dashboard() {
  const { token } = useAuth();
  
  const [overview, setOverview] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    tasksInProgress: 0,
    overdueTasks: 0,
    totalUsers: 0,
    totalActivities: 0
  });

  const [activities, setActivities] = useState([]);
  const [highPriorityProjects, setHighPriorityProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Overview Metrics
        const metrics = await dashboardApi.overview(token);
        setOverview(metrics);

        // 2. Fetch Recent Activities
        const activityData = await dashboardApi.activity(token);
        setActivities(activityData.recentActivities || []);

        // 3. Fetch Projects to show in Bento Grid
        const projects = await projectsApi.list(token);
        setHighPriorityProjects(projects.slice(0, 3)); // show top 3 projects

      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const activeTasksCount = overview.totalTasks - overview.completedTasks;
  const velocityLabel = overview.completedTasks > 0 ? `${overview.completedTasks} completed` : "0 pts";

  return (
    <div className="flex min-h-screen overflow-hidden bg-surface-sunken dark:bg-inverse-surface text-on-surface w-full">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        <Header />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-margin-desktop space-y-xl bg-surface-sunken dark:bg-surface-dim">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-body-lg">
              Loading dashboard analytics...
            </div>
          ) : (
            <>
              {/* Hero Section / KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-lg">
                {/* Total Projects */}
                <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle/70 dark:border-outline-variant/30 shadow-sm flex flex-col gap-sm hover:border-primary/30 transition-all duration-200 text-left">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 bg-primary/5 rounded-lg text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">folder_open</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full select-none">
                      Active Org
                    </span>
                  </div>
                  <h3 className="font-body-sm text-[12px] text-on-surface-variant dark:text-surface-variant font-medium mt-sm">Total Projects</h3>
                  <div className="font-display-lg text-2xl text-on-surface dark:text-surface-main font-bold mt-1">
                    {overview.totalProjects}
                  </div>
                </div>
                
                {/* Active Tasks */}
                <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle/70 dark:border-outline-variant/30 shadow-sm flex flex-col gap-sm hover:border-primary/30 transition-all duration-200 text-left">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 bg-secondary-container/30 rounded-lg text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">rule</span>
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant/80 bg-surface-container/50 px-2 py-0.5 rounded-full select-none">
                      Queue
                    </span>
                  </div>
                  <h3 className="font-body-sm text-[12px] text-on-surface-variant dark:text-surface-variant font-medium mt-sm">Active Tasks</h3>
                  <div className="font-display-lg text-2xl text-on-surface dark:text-surface-main font-bold mt-1">
                    {activeTasksCount}
                  </div>
                </div>
                
                {/* Team Velocity */}
                <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle/70 dark:border-outline-variant/30 shadow-sm flex flex-col gap-sm hover:border-primary/30 transition-all duration-200 text-left">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 bg-tertiary-fixed rounded-lg text-tertiary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">bolt</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full select-none">
                      Throughput
                    </span>
                  </div>
                  <h3 className="font-body-sm text-[12px] text-on-surface-variant dark:text-surface-variant font-medium mt-sm">Team Velocity</h3>
                  <div className="font-display-lg text-2xl text-on-surface dark:text-surface-main font-bold mt-1">
                    {velocityLabel}
                  </div>
                </div>
                
                {/* Upcoming Deadlines */}
                <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle/70 dark:border-outline-variant/30 shadow-sm flex flex-col gap-sm hover:border-primary/30 transition-all duration-200 text-left">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 bg-error-container/30 rounded-lg text-error flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">event_busy</span>
                    </div>
                    <span className="text-[10px] font-bold text-error bg-red-50 px-2 py-0.5 rounded-full select-none font-bold">
                      Overdue
                    </span>
                  </div>
                  <h3 className="font-body-sm text-[12px] text-on-surface-variant dark:text-surface-variant font-medium mt-sm">Overdue Tasks</h3>
                  <div className="font-display-lg text-2xl text-on-surface dark:text-surface-main font-bold mt-1">
                    {overview.overdueTasks}
                  </div>
                </div>
              </div>

              {/* Main Grid: Charts and Feed */}
              <div className="grid grid-cols-12 gap-lg">
                {/* Left: Analytics Charts */}
                <div className="col-span-12 lg:col-span-8 space-y-lg text-left">
                  {/* Line Chart: Project Progress */}
                  <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle/70 dark:border-outline-variant/30 shadow-sm">
                    <div className="flex items-center justify-between mb-lg select-none">
                      <div>
                        <h2 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main">Project Progress</h2>
                        <p className="font-body-sm text-[12px] text-on-surface-variant dark:text-surface-variant mt-0.5">Completed vs Scheduled tasks over the last 30 days</p>
                      </div>
                    </div>
                    
                    <div className="chart-container h-52 relative flex items-end justify-between px-2">
                      <svg className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="100" y2="20" stroke="var(--color-outline-variant)" strokeWidth="0.2" strokeDasharray="3" opacity="0.3" />
                        <line x1="0" y1="50" x2="100" y2="50" stroke="var(--color-outline-variant)" strokeWidth="0.2" strokeDasharray="3" opacity="0.3" />
                        <line x1="0" y1="80" x2="100" y2="80" stroke="var(--color-outline-variant)" strokeWidth="0.2" strokeDasharray="3" opacity="0.3" />
                        <line x1="0" y1="100" x2="100" y2="100" stroke="var(--color-outline-variant)" strokeWidth="0.4" opacity="0.5" />

                        <defs>
                          <linearGradient id="dashboardAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* Completed line & fill area */}
                        <path d="M 0 85 Q 25 75 50 45 T 100 20 L 100 100 L 0 100 Z" fill="url(#dashboardAreaGrad)" />
                        <path d="M 0 85 Q 25 75 50 45 T 100 20" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
                        
                        {/* Scheduled line */}
                        <path d="M 0 90 Q 25 80 50 65 T 100 55" fill="none" stroke="var(--color-secondary)" strokeDasharray="4" strokeWidth="1.5" opacity="0.7" />

                        {/* Intersection indicator dots */}
                        <circle cx="50" cy="45" r="2" fill="var(--color-primary)" stroke="white" strokeWidth="0.5" />
                        <circle cx="100" cy="20" r="2" fill="var(--color-primary)" stroke="white" strokeWidth="0.5" />
                      </svg>
                    </div>
                    <div className="w-full flex justify-between px-2 pt-md border-t border-border-subtle/50 select-none text-[10px] font-label-md text-outline">
                      <span>WEEK 1</span>
                      <span>WEEK 2</span>
                      <span>WEEK 3</span>
                      <span>WEEK 4</span>
                    </div>
                  </div>

                  {/* Bar Chart: Task Distribution */}
                  <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle/70 dark:border-outline-variant/30 shadow-sm">
                    <div className="flex items-center justify-between mb-lg select-none">
                      <div>
                        <h2 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main">Task Distribution</h2>
                        <p className="font-body-sm text-[12px] text-on-surface-variant dark:text-surface-variant mt-0.5">Resource allocation across primary departments</p>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-around h-44 px-md select-none border-b border-border-subtle/50 pb-sm">
                      <div className="flex flex-col items-center gap-xs w-12">
                        <div className="w-4 bg-primary/20 hover:bg-primary rounded-t-sm transition-all" style={{ height: "70px" }}></div>
                        <span className="font-label-md text-[10px] text-on-surface-variant font-bold mt-1">ENG</span>
                      </div>
                      <div className="flex flex-col items-center gap-xs w-12">
                        <div className="w-4 bg-primary hover:brightness-110 rounded-t-sm transition-all" style={{ height: "120px" }}></div>
                        <span className="font-label-md text-[10px] text-primary font-bold mt-1">DES</span>
                      </div>
                      <div className="flex flex-col items-center gap-xs w-12">
                        <div className="w-4 bg-primary/20 hover:bg-primary rounded-t-sm transition-all" style={{ height: "95px" }}></div>
                        <span className="font-label-md text-[10px] text-on-surface-variant font-bold mt-1">OPS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Recent Activity Feed */}
                <div className="col-span-12 lg:col-span-4">
                  <div className="bg-surface-main dark:bg-inverse-surface h-full rounded-xl border border-border-subtle/70 dark:border-outline-variant/30 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-lg border-b border-border-subtle/50 dark:border-outline-variant/30 flex items-center justify-between select-none text-left">
                      <h2 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main">Recent Activity</h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-lg space-y-lg">
                      {activities.map((act, i) => {
                        const userInitials = act.first_name ? `${act.first_name[0]}${act.last_name ? act.last_name[0] : ""}`.toUpperCase() : "SYS";
                        const actionLabel = act.action.toLowerCase();
                        
                        return (
                          <div key={act.activity_id} className="flex gap-md relative">
                            {i < activities.length - 1 && (
                              <div className="absolute left-4 top-9 bottom-0 w-px bg-border-subtle/50 dark:bg-outline-variant/30"></div>
                            )}
                            <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface border border-border-subtle/50 flex items-center justify-center shrink-0 z-10 font-bold text-xs select-none">
                              {userInitials}
                            </div>
                            <div className="flex flex-col text-left">
                              <p className="font-body-md text-sm text-on-surface dark:text-surface-main leading-snug">
                                <span className="font-bold">{act.first_name} {act.last_name}</span> {actionLabel}d {act.entity_type.toLowerCase()}{" "}
                                {act.project_name && (
                                  <span className="text-primary font-bold">{act.project_name}</span>
                                )}
                              </p>
                              <span className="font-label-md text-[10px] text-on-surface-variant mt-1.5 font-medium">
                                {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      {activities.length === 0 && (
                        <p className="text-on-surface-variant text-center py-8 text-body-sm">No recent activity logged.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Current Projects Bento Grid */}
              <div className="space-y-lg text-left">
                <div className="flex items-center justify-between select-none">
                  <h2 className="font-title-lg text-title-lg font-bold text-on-surface dark:text-surface-main">High Priority Projects</h2>
                  <Link to="/projects" className="flex items-center gap-xs font-button-text text-sm text-primary hover:underline px-md py-sm rounded-lg transition-colors cursor-pointer font-bold">
                    All Projects <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                  {highPriorityProjects.map((p, idx) => {
                    const isLarge = idx === 0;
                    return (
                      <div 
                        key={p.project_id || p.id}
                        className={`${
                          isLarge ? "md:col-span-2" : ""
                        } bg-surface-main border border-border-subtle/70 dark:bg-inverse-surface dark:border-outline-variant/30 rounded-xl p-lg flex flex-col justify-between min-h-[250px] shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all`}
                      >
                        <div className="relative z-10 text-left">
                          <span className="bg-primary/5 text-primary border border-primary/20 font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider select-none">
                            {p.status}
                          </span>
                          <h3 className="font-title-lg text-lg font-bold mt-md text-on-surface dark:text-surface-main hover:text-primary transition-colors">
                            <Link to={`/project-details/${p.project_id || p.id}`}>
                              {p.project_name || p.name}
                            </Link>
                          </h3>
                          <p className="font-body-md text-sm text-on-surface-variant dark:text-surface-variant mt-sm max-w-[580px] line-clamp-2 leading-relaxed">
                            {p.description || "No project description provided. Navigate to the project details to specify overview requirements."}
                          </p>
                        </div>
                        <div className="relative z-10 mt-lg">
                          <div className="flex items-center justify-between mb-sm select-none">
                            <span className="font-label-md text-[11px] text-on-surface font-bold">{p.progress}% Complete</span>
                          </div>
                          <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${p.progress}%` }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {highPriorityProjects.length === 0 && (
                    <div className="col-span-3 text-center py-8 text-on-surface-variant">
                      No projects active in the organization workspace yet.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
