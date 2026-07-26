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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
                {/* Total Projects */}
                <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col gap-sm hover:-translate-y-0.5 transition-transform duration-200">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-primary-fixed dark:bg-on-primary-fixed-variant rounded-lg text-primary dark:text-inverse-primary shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined">folder_open</span>
                    </div>
                    <span className="text-xs font-label-md text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-full select-none">
                      Active Org
                    </span>
                  </div>
                  <h3 className="font-body-sm text-on-surface-variant dark:text-surface-variant">Total Projects</h3>
                  <div className="font-headline-md text-headline-md text-on-surface dark:text-surface-main">
                    {overview.totalProjects}
                  </div>
                </div>
                
                {/* Active Tasks */}
                <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col gap-sm hover:-translate-y-0.5 transition-transform duration-200">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-secondary-container dark:bg-secondary rounded-lg text-secondary dark:text-on-secondary shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined">rule</span>
                    </div>
                    <span className="text-xs font-label-md text-on-surface-variant dark:text-surface-variant bg-surface-container-low dark:bg-on-surface-variant/30 px-2 py-1 rounded-full select-none">
                      Queue
                    </span>
                  </div>
                  <h3 className="font-body-sm text-on-surface-variant dark:text-surface-variant">Active Tasks</h3>
                  <div className="font-headline-md text-headline-md text-on-surface dark:text-surface-main">
                    {activeTasksCount}
                  </div>
                </div>
                
                {/* Team Velocity */}
                <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col gap-sm hover:-translate-y-0.5 transition-transform duration-200">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-tertiary-fixed dark:bg-tertiary-container rounded-lg text-tertiary dark:text-on-tertiary-container shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined">bolt</span>
                    </div>
                    <span className="text-xs font-label-md text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-full select-none">
                      Throughput
                    </span>
                  </div>
                  <h3 className="font-body-sm text-on-surface-variant dark:text-surface-variant">Team Velocity</h3>
                  <div className="font-headline-md text-headline-md text-on-surface dark:text-surface-main">
                    {velocityLabel}
                  </div>
                </div>
                
                {/* Upcoming Deadlines */}
                <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col gap-sm hover:-translate-y-0.5 transition-transform duration-200">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-error-container dark:bg-error rounded-lg text-error dark:text-on-error shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined">event_busy</span>
                    </div>
                    <span className="text-xs font-label-md text-error dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded-full select-none font-bold">
                      Overdue
                    </span>
                  </div>
                  <h3 className="font-body-sm text-on-surface-variant dark:text-surface-variant">Overdue Tasks</h3>
                  <div className="font-headline-md text-headline-md text-on-surface dark:text-surface-main">
                    {overview.overdueTasks}
                  </div>
                </div>
              </div>

              {/* Main Grid: Charts and Feed */}
              <div className="grid grid-cols-12 gap-gutter">
                {/* Left: Analytics Charts */}
                <div className="col-span-12 lg:col-span-8 space-y-gutter">
                  {/* Line Chart: Project Progress */}
                  <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle dark:border-outline-variant shadow-sm">
                    <div className="flex items-center justify-between mb-lg select-none">
                      <div>
                        <h2 className="font-title-md text-title-md text-on-surface dark:text-surface-main">Project Progress</h2>
                        <p className="font-body-sm text-on-surface-variant dark:text-surface-variant">Completed vs Scheduled tasks over the last 30 days</p>
                      </div>
                    </div>
                    
                    <div className="chart-container flex items-end justify-between gap-base px-2">
                      <div className="w-full h-full relative overflow-hidden flex flex-col justify-between">
                        <svg className="w-full h-[180px]" preserveAspectRatio="none" viewBox="0 0 100 100">
                          <path d="M0,80 Q25,70 40,40 T70,30 T100,10" fill="none" stroke="#004ac6" strokeWidth="2"></path>
                          <path d="M0,85 Q25,80 40,60 T70,55 T100,45" fill="none" stroke="#565e74" strokeDasharray="4" strokeWidth="1.5"></path>
                        </svg>
                        <div className="w-full flex justify-between px-2 pt-2 border-t border-border-subtle dark:border-outline-variant select-none">
                          <span className="font-label-md text-[10px] text-outline">WEEK 1</span>
                          <span className="font-label-md text-[10px] text-outline">WEEK 2</span>
                          <span className="font-label-md text-[10px] text-outline">WEEK 3</span>
                          <span className="font-label-md text-[10px] text-outline">WEEK 4</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bar Chart: Task Distribution */}
                  <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle dark:border-outline-variant shadow-sm">
                    <div className="flex items-center justify-between mb-lg select-none">
                      <div>
                        <h2 className="font-title-md text-title-md text-on-surface dark:text-surface-main">Task Distribution</h2>
                        <p className="font-body-sm text-on-surface-variant dark:text-surface-variant">Resource allocation across primary departments</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 items-end gap-md h-48 px-md select-none">
                      <div className="flex flex-col items-center gap-sm">
                        <div className="w-full bg-primary-fixed-dim hover:bg-primary rounded-t-lg transition-all" style={{ height: "60%" }}></div>
                        <span className="font-label-md text-[10px] text-on-surface-variant dark:text-surface-variant">ENG</span>
                      </div>
                      <div className="flex flex-col items-center gap-sm">
                        <div className="w-full bg-primary-fixed-dim hover:bg-primary rounded-t-lg transition-all" style={{ height: "85%" }}></div>
                        <span className="font-label-md text-[10px] text-on-surface-variant dark:text-surface-variant">DES</span>
                      </div>
                      <div className="flex flex-col items-center gap-sm">
                        <div className="w-full bg-primary-fixed-dim hover:bg-primary rounded-t-lg transition-all" style={{ height: "70%" }}></div>
                        <span className="font-label-md text-[10px] text-on-surface-variant dark:text-surface-variant">OPS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Recent Activity Feed */}
                <div className="col-span-12 lg:col-span-4">
                  <div className="bg-surface-main dark:bg-inverse-surface h-full rounded-xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col overflow-hidden">
                    <div className="p-lg border-b border-border-subtle dark:border-outline-variant flex items-center justify-between select-none">
                      <h2 className="font-title-md text-title-md text-on-surface dark:text-surface-main">Recent Activity</h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-lg space-y-xl">
                      {activities.map((act) => {
                        const userInitials = act.first_name ? `${act.first_name[0]}${act.last_name ? act.last_name[0] : ""}`.toUpperCase() : "SYS";
                        const actionLabel = act.action.toLowerCase();
                        
                        return (
                          <div key={act.activity_id} className="flex gap-md relative">
                            <div className="absolute left-4 top-10 bottom-0 w-px bg-border-subtle dark:bg-outline-variant"></div>
                            <div className="w-8 h-8 rounded-full bg-surface-container-high dark:bg-on-surface-variant flex items-center justify-center shrink-0 z-10 font-bold text-xs select-none">
                              {userInitials}
                            </div>
                            <div className="flex flex-col text-left">
                              <p className="font-body-md text-on-surface dark:text-surface-main">
                                <span className="font-bold">{act.first_name} {act.last_name}</span> {actionLabel}d the {act.entity_type.toLowerCase()}{" "}
                                {act.project_name && (
                                  <span className="text-primary font-medium">{act.project_name}</span>
                                )}
                              </p>
                              <span className="font-label-md text-[11px] text-on-surface-variant dark:text-surface-variant mt-1">
                                {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      {activities.length === 0 && (
                        <p className="text-on-surface-variant text-center py-4">No recent activity logged.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Current Projects Bento Grid */}
              <div className="space-y-lg text-left">
                <div className="flex items-center justify-between select-none">
                  <h2 className="font-title-lg text-title-lg text-on-surface dark:text-surface-main">High Priority Projects</h2>
                  <Link to="/projects" className="flex items-center gap-xs font-button-text text-button-text text-primary hover:bg-primary-fixed-dim px-md py-sm rounded-lg transition-colors cursor-pointer">
                    All Projects <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                  {highPriorityProjects.map((p, idx) => {
                    const isLarge = idx === 0;
                    return (
                      <div 
                        key={p.project_id || p.id}
                        className={`${
                          isLarge ? "md:col-span-2" : ""
                        } bg-surface-main border border-border-subtle dark:bg-inverse-surface dark:border-outline-variant rounded-2xl p-xl flex flex-col justify-between min-h-[280px] shadow-sm relative overflow-hidden group`}
                      >
                        <div className="relative z-10 text-left">
                          <span className="bg-primary-container text-on-primary-container font-label-md text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter select-none">
                            {p.status}
                          </span>
                          <h3 className="font-headline-md text-headline-md mt-md text-on-surface dark:text-surface-main hover:text-primary transition-colors">
                            <Link to={`/project-details/${p.project_id || p.id}`}>
                              {p.project_name || p.name}
                            </Link>
                          </h3>
                          <p className="font-body-md text-on-surface-variant dark:text-surface-variant mt-sm max-w-[448px] line-clamp-3">
                            {p.description || "No project description provided. Navigate to the project details to specify overview requirements."}
                          </p>
                        </div>
                        <div className="relative z-10 mt-lg">
                          <div className="flex items-center justify-between mb-sm select-none">
                            <span className="font-label-md text-label-md text-on-surface dark:text-surface-main">{p.progress}% Complete</span>
                          </div>
                          <div className="w-full h-2 bg-surface-container dark:bg-on-surface-variant/30 rounded-full overflow-hidden">
                            <div className="bg-primary dark:bg-inverse-primary h-full rounded-full transition-all duration-1000" style={{ width: `${p.progress}%` }}></div>
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
