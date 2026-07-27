import React, { useState, useEffect } from "react";
import DoubleSidebarLayout from "../../layouts/DoubleSidebarLayout";
import { 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sliders, 
  MoreHorizontal, 
  Settings, 
  User, 
  Layout, 
  Plus, 
  Clock, 
  X
} from "lucide-react";

export default function TimeTracking() {
  const [activeTab, setActiveTab] = useState("Daily");
  
  // Active date tracking
  const [activeDate, setActiveDate] = useState(new Date());

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem("projecthub.timelogs");
    return saved ? JSON.parse(saved) : [];
  });

  // Modal / Preferences
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPrefPanel, setShowPrefPanel] = useState(false);
  const [logTitle, setLogTitle] = useState("");
  const [logComment, setLogComment] = useState("");
  const [logTime, setLogTime] = useState("");
  const [workdayTarget, setWorkdayTarget] = useState(8);

  const syncLogs = () => {
    const saved = localStorage.getItem("projecthub.timelogs");
    setLogs(saved ? JSON.parse(saved) : []);
  };

  useEffect(() => {
    syncLogs();
  }, []);

  // Sync quick adds
  useEffect(() => {
    window.addEventListener("timelog-added", syncLogs);
    return () => window.removeEventListener("timelog-added", syncLogs);
  }, []);

  const saveLogs = (updated) => {
    setLogs(updated);
    localStorage.setItem("projecthub.timelogs", JSON.stringify(updated));
  };

  const handleLogSubmit = (e) => {
    e.preventDefault();
    if (!logTitle.trim() || !logTime.trim()) return;

    const newLog = {
      id: Date.now(),
      title: logTitle,
      comment: logComment,
      time: parseFloat(logTime) || 0,
      dateString: activeDate.toLocaleDateString(),
      createdAt: new Date().toLocaleDateString(),
    };

    saveLogs([...logs, newLog]);
    setLogTitle("");
    setLogComment("");
    setLogTime("");
    setIsModalOpen(false);
  };

  const handleDeleteLog = (id) => {
    if (confirm("Delete this time entry?")) {
      saveLogs(logs.filter(log => log.id !== id));
    }
  };

  // Shift date
  const handlePrevDay = () => {
    setActiveDate(prev => {
      const copy = new Date(prev);
      copy.setDate(copy.getDate() - 1);
      return copy;
    });
  };

  const handleNextDay = () => {
    setActiveDate(prev => {
      const copy = new Date(prev);
      copy.setDate(copy.getDate() + 1);
      return copy;
    });
  };

  const handleResetToday = () => {
    setActiveDate(new Date());
  };

  // Filter logs for selected date
  const dailyLogs = logs.filter(log => {
    // If log does not have dateString, fallback to comparing createdAt or just date
    return log.dateString === activeDate.toLocaleDateString();
  });

  const totalHours = dailyLogs.reduce((sum, item) => sum + item.time, 0);
  const progressPercent = Math.min(100, Math.round((totalHours / workdayTarget) * 100));

  const toggleSidebarFullScreen = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  // Date format label (e.g. "Today" or specific date)
  const getDateLabel = () => {
    const todayStr = new Date().toLocaleDateString();
    const activeStr = activeDate.toLocaleDateString();
    
    if (todayStr === activeStr) return "Today";
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday.toLocaleDateString() === activeStr) return "Yesterday";
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow.toLocaleDateString() === activeStr) return "Tomorrow";

    return activeDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <DoubleSidebarLayout>
      <div className="flex flex-col h-full w-full bg-white relative text-left">
        {/* Header */}
        <header className="flex flex-col border-b border-[#eef1f6] shrink-0 select-none">
          <div className="px-6 pt-4 pb-2 flex items-center justify-between">
            <h1 className="text-[14px] font-bold text-[#0f172a]">Time Tracking</h1>
            {/* Workday Progress Mini Bar */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400">Target Progress:</span>
              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    progressPercent >= 100 ? "bg-emerald-500" : "bg-[#2563eb]"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-bold text-slate-600">{progressPercent}%</span>
            </div>
          </div>
          
          {/* Subheader tabs */}
          <div className="flex gap-4 px-6 h-9">
            {["Daily", "Weekly", "Report"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[13px] font-semibold h-full px-1 border-b-2 transition-all ${
                  activeTab === tab 
                    ? "text-[#2563eb] border-[#2563eb]" 
                    : "text-slate-500 border-transparent hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* Toolbar matching Image 3 */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-[#eef1f6] bg-slate-50/40 select-none shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebarFullScreen}
              className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors"
              title="Full screen workspace"
            >
              <Maximize2 size={14} />
            </button>
            <div className="w-[1px] h-4 bg-slate-200"></div>
            
            <button className="flex flex-col justify-center items-center gap-[2px] p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100">
              <span className="w-3.5 h-[1.5px] bg-slate-400"></span>
              <span className="w-3.5 h-[1.5px] bg-slate-400"></span>
            </button>
            
            <button className="flex flex-col justify-center items-center gap-[2px] p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100">
              <span className="w-2.5 h-[1.5px] bg-slate-400"></span>
              <span className="w-3.5 h-[1.5px] bg-slate-400"></span>
            </button>
            
            <div className="w-[1px] h-4 bg-slate-200"></div>

            <button 
              onClick={() => alert("Select a team member view for timeline logs.")}
              className="flex items-center gap-1 px-2 py-1 text-slate-500 hover:text-slate-700 rounded hover:bg-slate-100 text-[12px] font-medium transition-colors"
            >
              <User size={13} className="text-slate-400" />
              <span>View for</span>
              <ChevronDown size={11} className="text-slate-400" />
            </button>

            <button 
              onClick={() => alert("Change daily layouts settings.")}
              className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-600 rounded text-[12px] font-semibold hover:bg-slate-200 transition-colors"
            >
              <Layout size={13} className="text-slate-400" />
              <span>Default</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowPrefPanel(!showPrefPanel)}
              className="flex items-center gap-1 text-[12px] font-semibold text-slate-500 hover:text-slate-700"
            >
              <Sliders size={13} className="text-slate-400" />
              <span>Preferences</span>
            </button>
            <div className="w-[1px] h-4 bg-slate-200"></div>
            <button className="p-1 text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={15} />
            </button>
          </div>
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-12 px-6 py-2.5 border-b border-[#eef1f6] bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none shrink-0">
          <div className="col-span-5">Title</div>
          <div className="col-span-4">Comments</div>
          <div className="col-span-2">Time Reported</div>
          <div className="col-span-1 flex justify-end pr-1">
            <Settings size={13} className="text-slate-400 cursor-pointer hover:text-slate-600" />
          </div>
        </div>

        {/* Subheader Table Today date navigator */}
        <div className="px-6 py-3 border-b border-[#eef1f6] bg-white flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-bold text-[#0f172a] capitalize">{getDateLabel()}</span>
            
            <div className="flex items-center gap-1 border border-slate-200 rounded-md p-[2px] bg-slate-50">
              <button 
                onClick={handlePrevDay}
                className="p-0.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded transition-all"
                title="Previous Day"
              >
                <ChevronLeft size={13} />
              </button>
              <button 
                onClick={handleResetToday}
                className="p-0.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded transition-all"
                title="Reset to Today"
              >
                <CalendarIcon size={12} className="text-slate-400" />
              </button>
              <button 
                onClick={handleNextDay}
                className="p-0.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded transition-all"
                title="Next Day"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[12px] font-semibold text-slate-500">
            <div>
              <span className="text-slate-400 mr-1.5 font-medium">Time reported</span>
              <span className="text-[#2563eb] font-bold">Σ {totalHours}h</span>
            </div>
            <div>
              <span className="text-slate-400 mr-1.5 font-medium">Workday</span>
              <span className="text-slate-700 font-bold">{workdayTarget}h</span>
            </div>
          </div>
        </div>

        {/* Content Body / Log List or Empty state */}
        <div className="flex-1 overflow-y-auto">
          {dailyLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 select-none">
              {/* Document with green clock icon */}
              <div className="relative w-36 h-36 mb-4 flex items-center justify-center">
                <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="28" y="18" width="44" height="60" rx="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                  <path d="M60 18 L72 30 L60 30 Z" fill="#cbd5e1" />
                  <line x1="36" y1="36" x2="52" y2="36" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="36" y1="46" x2="64" y2="46" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="36" y1="56" x2="64" y2="56" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="36" y1="66" x2="56" y2="66" stroke="#cbd5e1" strokeWidth="2" />
                  <circle cx="68" cy="68" r="14" fill="#10b981" />
                  <path d="M68 60 V68 H74" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <p className="text-[13px] text-slate-400 font-medium mb-3">
                No time logged for this day.
              </p>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 text-[13px] font-bold text-[#2563eb] hover:text-[#1d4ed8] hover:underline"
              >
                <span>+ Log Time</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#eef1f6]">
              {dailyLogs.map((log) => (
                <div key={log.id} className="grid grid-cols-12 px-6 py-3 items-center hover:bg-slate-50 transition-colors text-[13px]">
                  <div className="col-span-5 font-semibold text-[#0f172a]">{log.title}</div>
                  <div className="col-span-4 text-slate-500 truncate">{log.comment || "-"}</div>
                  <div className="col-span-2 font-bold text-[#2563eb]">{log.time}h</div>
                  <div className="col-span-1 flex justify-end pr-1 gap-2">
                    <button 
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-red-500 hover:text-red-700 font-semibold text-xs transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="px-6 py-3 bg-slate-50/20">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8]"
                >
                  <Plus size={14} />
                  <span>Log more time</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preferences Side panel */}
        {showPrefPanel && (
          <div className="absolute top-12 right-0 bottom-0 w-64 bg-white border-l border-slate-200 shadow-xl p-5 z-40 text-xs text-slate-600 flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-800">Target Settings</span>
              <button onClick={() => setShowPrefPanel(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            {/* Target hours */}
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Workday hours target</span>
              <div className="grid grid-cols-3 gap-1">
                {[6, 8, 10].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => setWorkdayTarget(hours)}
                    className={`py-1.5 rounded-lg border text-[10px] font-bold ${
                      workdayTarget === hours ? "bg-slate-100 border-slate-300 text-slate-800" : "border-slate-200 text-slate-500"
                    }`}
                  >
                    {hours} Hours
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Log Time Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-[9999] animate-fade-in">
            <div className="bg-white border border-[#eef1f6] rounded-xl p-6 w-[400px] max-w-full shadow-2xl text-left">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800">Log Time for {activeDate.toLocaleDateString([], { month: "short", day: "numeric" })}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleLogSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Task Title / Item</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={logTitle}
                    onChange={(e) => setLogTitle(e.target.value)}
                    placeholder=""
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-[#2563eb] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Comments</label>
                  <input
                    type="text"
                    value={logComment}
                    onChange={(e) => setLogComment(e.target.value)}
                    placeholder=""
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-[#2563eb] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Time Reported (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    required
                    value={logTime}
                    onChange={(e) => setLogTime(e.target.value)}
                    placeholder=""
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-[#2563eb] outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-xs font-semibold hover:bg-[#1d4ed8]"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DoubleSidebarLayout>
  );
}

// Help resolve chevron down
const ChevronDown = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    width={props.size || 15} 
    height={props.size || 15} 
    stroke="currentColor" 
    strokeWidth="2.5" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={props.className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
