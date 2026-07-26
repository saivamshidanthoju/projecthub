import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen overflow-hidden bg-surface-sunken dark:bg-inverse-surface text-on-surface w-full">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        <Header />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-margin-desktop space-y-xl bg-surface-sunken dark:bg-surface-dim">
          {/* Hero Section / KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
            {/* Total Projects */}
            <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col gap-sm hover:-translate-y-0.5 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-primary-fixed dark:bg-on-primary-fixed-variant rounded-lg text-primary dark:text-inverse-primary shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined">folder_open</span>
                </div>
                <span className="text-xs font-label-md text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-full select-none">
                  +12%
                </span>
              </div>
              <h3 className="font-body-sm text-on-surface-variant dark:text-surface-variant">Total Projects</h3>
              <div className="font-headline-md text-headline-md text-on-surface dark:text-surface-main">48</div>
            </div>
            
            {/* Active Tasks */}
            <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col gap-sm hover:-translate-y-0.5 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-secondary-container dark:bg-secondary rounded-lg text-secondary dark:text-on-secondary shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined">rule</span>
                </div>
                <span className="text-xs font-label-md text-on-surface-variant dark:text-surface-variant bg-surface-container-low dark:bg-on-surface-variant/30 px-2 py-1 rounded-full select-none">
                  Stable
                </span>
              </div>
              <h3 className="font-body-sm text-on-surface-variant dark:text-surface-variant">Active Tasks</h3>
              <div className="font-headline-md text-headline-md text-on-surface dark:text-surface-main">156</div>
            </div>
            
            {/* Team Velocity */}
            <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col gap-sm hover:-translate-y-0.5 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-tertiary-fixed dark:bg-tertiary-container rounded-lg text-tertiary dark:text-on-tertiary-container shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <span className="text-xs font-label-md text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-full select-none">
                  +5.4%
                </span>
              </div>
              <h3 className="font-body-sm text-on-surface-variant dark:text-surface-variant">Team Velocity</h3>
              <div className="font-headline-md text-headline-md text-on-surface dark:text-surface-main">82 pts</div>
            </div>
            
            {/* Upcoming Deadlines */}
            <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col gap-sm hover:-translate-y-0.5 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-error-container dark:bg-error rounded-lg text-error dark:text-on-error shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined">event_busy</span>
                </div>
                <span className="text-xs font-label-md text-error dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded-full select-none">
                  Urgent
                </span>
              </div>
              <h3 className="font-body-sm text-on-surface-variant dark:text-surface-variant">Upcoming Deadlines</h3>
              <div className="font-headline-md text-headline-md text-on-surface dark:text-surface-main">3</div>
            </div>
          </div>

          {/* Main Grid: Charts and Feed */}
          <div className="grid grid-cols-12 gap-gutter">
            {/* Left: Analytics Charts */}
            <div className="col-span-12 lg:col-span-8 space-y-gutter">
              {/* Line Chart: Project Progress */}
              <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle dark:border-outline-variant shadow-sm">
                <div className="flex items-center justify-between mb-lg">
                  <div>
                    <h2 className="font-title-md text-title-md text-on-surface dark:text-surface-main">Project Progress</h2>
                    <p className="font-body-sm text-on-surface-variant dark:text-surface-variant">Completed vs Scheduled tasks over the last 30 days</p>
                  </div>
                  <select className="bg-surface-sunken dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-sm px-3 py-1 outline-none text-on-surface-variant dark:text-surface-variant cursor-pointer">
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                  </select>
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
                
                <div className="flex gap-md mt-lg">
                  <div className="flex items-center gap-xs">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="font-label-md text-[11px] text-on-surface-variant dark:text-surface-variant">Completed</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <span className="font-label-md text-[11px] text-on-surface-variant dark:text-surface-variant">Target</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart: Task Distribution */}
              <div className="bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle dark:border-outline-variant shadow-sm">
                <div className="flex items-center justify-between mb-lg">
                  <div>
                    <h2 className="font-title-md text-title-md text-on-surface dark:text-surface-main">Task Distribution</h2>
                    <p className="font-body-sm text-on-surface-variant dark:text-surface-variant">Resource allocation across primary departments</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 items-end gap-md h-48 px-md">
                  <div className="flex flex-col items-center gap-sm">
                    <div className="w-full bg-primary-fixed-dim hover:bg-primary dark:bg-primary dark:hover:bg-primary rounded-t-lg transition-all" style={{ height: "60%" }}></div>
                    <span className="font-label-md text-[10px] text-on-surface-variant dark:text-surface-variant select-none">ENG</span>
                  </div>
                  <div className="flex flex-col items-center gap-sm">
                    <div className="w-full bg-primary-fixed-dim hover:bg-primary dark:bg-primary dark:hover:bg-primary rounded-t-lg transition-all" style={{ height: "85%" }}></div>
                    <span className="font-label-md text-[10px] text-on-surface-variant dark:text-surface-variant select-none">DES</span>
                  </div>
                  <div className="flex flex-col items-center gap-sm">
                    <div className="w-full bg-primary-fixed-dim hover:bg-primary dark:bg-primary dark:hover:bg-primary rounded-t-lg transition-all" style={{ height: "40%" }}></div>
                    <span className="font-label-md text-[10px] text-on-surface-variant dark:text-surface-variant select-none">MKT</span>
                  </div>
                  <div className="flex flex-col items-center gap-sm">
                    <div className="w-full bg-primary-fixed-dim hover:bg-primary dark:bg-primary dark:hover:bg-primary rounded-t-lg transition-all" style={{ height: "70%" }}></div>
                    <span className="font-label-md text-[10px] text-on-surface-variant dark:text-surface-variant select-none">OPS</span>
                  </div>
                  <div className="flex flex-col items-center gap-sm">
                    <div className="w-full bg-primary-fixed-dim hover:bg-primary dark:bg-primary dark:hover:bg-primary rounded-t-lg transition-all" style={{ height: "55%" }}></div>
                    <span className="font-label-md text-[10px] text-on-surface-variant dark:text-surface-variant select-none">SAL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Recent Activity Feed */}
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-surface-main dark:bg-inverse-surface h-full rounded-xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col overflow-hidden">
                <div className="p-lg border-b border-border-subtle dark:border-outline-variant flex items-center justify-between">
                  <h2 className="font-title-md text-title-md text-on-surface dark:text-surface-main">Recent Activity</h2>
                  <button className="text-primary dark:text-inverse-primary font-label-md text-[12px] hover:underline cursor-pointer">
                    View All
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-lg space-y-xl">
                  {/* Activity Item 1 */}
                  <div className="flex gap-md relative">
                    <div className="absolute left-4 top-10 bottom-0 w-px bg-border-subtle dark:bg-outline-variant"></div>
                    <div className="w-8 h-8 rounded-full bg-surface-container-high dark:bg-on-surface-variant flex items-center justify-center shrink-0 z-10 overflow-hidden border border-border-subtle dark:border-outline-variant">
                      <img
                        className="w-full h-full object-cover"
                        alt="Julian Vane profile headshot."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZJX5eDduPUiBloJ-Izs-v1-VD_WOIfesACzkOQQTqrDHlob8SAjZzwek25imi3hSPmzdu8QHMAMysHXYhzsP7I1LXBdWY4LGH8qJTHnJN3AaUsSaE4_rI8XZc0b61SNTaUW8K1Pj7cHXBmGHd_LboZZI1Njauy0lkaFsYMSi8NgOxfsVKKyb7E_l12DlK6RS3l_dEkKa8SlDtbLQmWT63yYx1OkP2n5bzAT0im301TLW6jmIQIJLirEgbcP0vZwPskbE20Ss5qVo"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-body-md text-on-surface dark:text-surface-main">
                        <span className="font-bold">Julian Vane</span> updated the brand guidelines for{" "}
                        <span className="text-primary dark:text-inverse-primary font-medium">Project Aurora</span>
                      </p>
                      <span className="font-label-md text-[11px] text-on-surface-variant dark:text-surface-variant mt-1">
                        2 mins ago
                      </span>
                      <div className="mt-md p-md bg-surface-sunken dark:bg-inverse-surface rounded-lg border border-border-subtle dark:border-outline-variant">
                        <p className="font-body-sm italic text-on-surface-variant dark:text-surface-variant">
                          "Updated the typography scale and added the primary blue variants for the new dashboard modules."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Activity Item 2 */}
                  <div className="flex gap-md relative">
                    <div className="absolute left-4 top-10 bottom-0 w-px bg-border-subtle dark:bg-outline-variant"></div>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 z-10">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-body-md text-on-surface dark:text-surface-main">
                        <span className="font-bold">System</span> automatically deployed version 2.4.1 to production
                      </p>
                      <span className="font-label-md text-[11px] text-on-surface-variant dark:text-surface-variant mt-1">
                        45 mins ago
                      </span>
                    </div>
                  </div>

                  {/* Activity Item 3 */}
                  <div className="flex gap-md relative">
                    <div className="absolute left-4 top-10 bottom-0 w-px bg-border-subtle dark:bg-outline-variant"></div>
                    <div className="w-8 h-8 rounded-full bg-surface-container-high dark:bg-on-surface-variant flex items-center justify-center shrink-0 z-10 overflow-hidden border border-border-subtle dark:border-outline-variant">
                      <img
                        className="w-full h-full object-cover"
                        alt="Sarah Chen profile headshot."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD71_WId36rvfuPNoxKGJ-w-ieAFxLTHrKxJRxjd12MGRASKQsnGJXo3Kxcp-XK7kd0koMgUjDTMN1xEabBUKaLRGfzYB62aNGccvgt76GWi5ySyYH0bjhxtRj_j5BQkQ-tXgDecssf0nKafomlsYkJkvps5jobV94oPFs9D4q_1TkQnWj-YS1nQ60zxIBr9TZPKhSE6o9m04VJkWVQw4-jPJTaTYOBDc5tQ4B7DMbgcIzt0gJNpZ51Z43qbGnhgLBujLS4vpPA5oA"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-body-md text-on-surface dark:text-surface-main">
                        <span className="font-bold">Sarah Chen</span> added 3 new team members to{" "}
                        <span className="text-primary dark:text-inverse-primary font-medium">Nexus CRM</span>
                      </p>
                      <span className="font-label-md text-[11px] text-on-surface-variant dark:text-surface-variant mt-1">
                        2 hours ago
                      </span>
                      <div className="flex -space-x-2 mt-sm select-none">
                        <div className="w-6 h-6 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-slate-200"></div>
                        <div className="w-6 h-6 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-slate-300"></div>
                        <div className="w-6 h-6 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-slate-400"></div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Item 4 */}
                  <div className="flex gap-md relative">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 flex items-center justify-center shrink-0 z-10">
                      <span className="material-symbols-outlined text-sm">warning</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-body-md text-on-surface dark:text-surface-main">
                        Deadline approaching for <span className="text-error font-medium">API Documentation</span>
                      </p>
                      <span className="font-label-md text-[11px] text-on-surface-variant dark:text-surface-variant mt-1">
                        5 hours ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Current Projects Bento Grid */}
          <div className="space-y-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-title-lg text-title-lg text-on-surface dark:text-surface-main">High Priority Projects</h2>
              <button className="flex items-center gap-xs font-button-text text-button-text text-primary dark:text-inverse-primary hover:bg-primary-fixed-dim dark:hover:bg-on-surface-variant/50 px-md py-sm rounded-lg transition-colors cursor-pointer">
                All Projects <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {/* Bento Card 1: Large */}
              <div className="md:col-span-2 glass-card rounded-2xl p-xl flex flex-col justify-between min-h-[280px] shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-lg opacity-20 group-hover:opacity-100 transition-opacity select-none pointer-events-none">
                  <span className="material-symbols-outlined text-primary dark:text-inverse-primary text-[120px]" style={{ fontVariationSettings: "'wght' 100" }}>
                    rocket_launch
                  </span>
                </div>
                <div className="relative z-10">
                  <span className="bg-primary-container dark:bg-primary text-on-primary-container dark:text-on-primary font-label-md text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter select-none">
                    In Development
                  </span>
                  <h3 className="font-headline-md text-headline-md mt-md text-on-surface dark:text-surface-main">Project Phoenix</h3>
                  <p className="font-body-md text-on-surface-variant dark:text-surface-variant mt-sm max-w-[448px]">
                    The next-generation cloud infrastructure orchestration layer for enterprise multi-tenant environments.
                  </p>
                </div>
                <div className="relative z-10 mt-lg">
                  <div className="flex items-center justify-between mb-sm select-none">
                    <span className="font-label-md text-label-md text-on-surface dark:text-surface-main">78% Complete</span>
                    <span className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant">Due Sept 12</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container dark:bg-on-surface-variant/30 rounded-full overflow-hidden">
                    <div className="bg-primary dark:bg-inverse-primary h-full rounded-full transition-all duration-1000" style={{ width: "78%" }}></div>
                  </div>
                </div>
              </div>

              {/* Bento Card 2: Medium */}
              <div className="bg-surface-main dark:bg-inverse-surface rounded-2xl p-xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col gap-lg">
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 bg-tertiary-container dark:bg-tertiary text-on-tertiary-container dark:text-on-tertiary rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">brush</span>
                  </div>
                  <div>
                    <h3 className="font-title-md text-title-md text-on-surface dark:text-surface-main">Design System v2</h3>
                    <p className="font-body-sm text-on-surface-variant dark:text-surface-variant">UI Revamp</p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex -space-x-3 mb-md select-none text-on-surface dark:text-inverse-surface">
                    <div className="w-8 h-8 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-blue-100 flex items-center justify-center text-[10px] font-bold">JD</div>
                    <div className="w-8 h-8 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-purple-100 flex items-center justify-center text-[10px] font-bold">AK</div>
                    <div className="w-8 h-8 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-green-100 flex items-center justify-center text-[10px] font-bold">MC</div>
                    <div className="w-8 h-8 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-slate-200 flex items-center justify-center text-[10px] font-bold">+2</div>
                  </div>
                  <p className="font-body-sm text-on-surface-variant dark:text-surface-variant">4 active contributors from the Design and Front-end teams.</p>
                </div>
                <button 
                  onClick={() => alert("Loading design system Kanban board...")}
                  className="w-full py-2 border border-border-subtle dark:border-outline-variant rounded-xl font-label-md text-label-md text-on-surface dark:text-surface-variant hover:bg-surface-sunken dark:hover:bg-on-surface-variant/50 transition-colors cursor-pointer bg-white dark:bg-inverse-surface"
                >
                  Project Board
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
