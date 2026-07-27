import React, { useState, useEffect } from "react";
import DoubleSidebarLayout from "../../layouts/DoubleSidebarLayout";
import { useAuth } from "../../context/AuthContext";
import { tasksApi } from "../../lib/api";
import { 
  Maximize2, 
  Search, 
  Sliders, 
  ChevronDown, 
  MoreHorizontal, 
  Settings, 
  User, 
  Layout, 
  Filter, 
  ArrowUpDown, 
  Plus, 
  Inbox,
  X,
  CheckSquare,
  Square,
  FileText
} from "lucide-react";

export default function MyTasks() {
  const { token } = useAuth();
  
  // Tasks list loaded from database + localStorage sync
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Visual config state
  const [viewLayout, setViewLayout] = useState("table"); // table | kanban
  const [activeTab, setActiveTab] = useState("Action Required"); // Action Required | Assigned To Me | High Priority
  const [rowPadding, setRowPadding] = useState("py-3"); // py-1.5 (compact) | py-3.5 (comfortable)
  
  // Filters and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | TODO | IN_PROGRESS | DONE
  const [sortBy, setSortBy] = useState("title"); // title | priority | schedule
  const [sortOrder, setSortOrder] = useState("asc"); // asc | desc
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Modals / forms
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPrefPanel, setShowPrefPanel] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("MEDIUM");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  const fetchTasks = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Pull tasks from DB
      const data = await tasksApi.list(token);
      
      // Pull tasks from localStorage (quick add tasks)
      const localSaved = localStorage.getItem("projecthub.tasks");
      const localTasks = localSaved ? JSON.parse(localSaved) : [];
      
      // Merge
      const allTasks = [...localTasks, ...(data || []).filter(t => t.title !== "Project Workspace Chat")];
      
      // Deduplicate by ID
      const seen = new Set();
      const uniqueTasks = allTasks.filter(item => {
        const id = item.id || item.task_id;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });

      setTasks(uniqueTasks);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  // Sync quick adds from sidebar
  useEffect(() => {
    const handleSync = () => {
      fetchTasks();
    };
    window.addEventListener("task-added", handleSync);
    return () => window.removeEventListener("task-added", handleSync);
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const payload = {
        project_id: 1, // Default project link
        title: newTaskTitle,
        description: newTaskDesc || "Created from My Tasks checklist",
        status: "TODO",
        priority: newTaskPriority,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      if (token) {
        // Save to DB
        await tasksApi.create(token, payload);
      } else {
        // Fallback to local
        const localSaved = localStorage.getItem("projecthub.tasks") || "[]";
        const localTasks = JSON.parse(localSaved);
        localTasks.push({ id: Date.now(), ...payload });
        localStorage.setItem("projecthub.tasks", JSON.stringify(localTasks));
      }

      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskPriority("MEDIUM");
      setShowAddForm(false);
      fetchTasks();
    } catch (err) {
      alert("Failed to create task: " + err.message);
    }
  };

  // Toggle checkbox state (updates status between TODO and DONE)
  const handleToggleComplete = async (task) => {
    const isDone = task.status === "DONE" || task.status === "completed";
    const nextStatus = isDone ? "TODO" : "DONE";

    // Optimistic local update
    setTasks(prev => prev.map(t => {
      const tid = t.id || t.task_id;
      const targetid = task.id || task.task_id;
      if (tid === targetid) {
        return { ...t, status: nextStatus };
      }
      return t;
    }));

    try {
      // Update local storage tasks if local
      const localSaved = localStorage.getItem("projecthub.tasks");
      if (localSaved) {
        let localTasks = JSON.parse(localSaved);
        const targetid = task.id || task.task_id;
        const existsLocal = localTasks.find(t => t.id === targetid);
        if (existsLocal) {
          localTasks = localTasks.map(t => t.id === targetid ? { ...t, status: nextStatus } : t);
          localStorage.setItem("projecthub.tasks", JSON.stringify(localTasks));
          return;
        }
      }

      // Otherwise update backend
      const tid = task.id || task.task_id;
      await tasksApi.update(token, tid, { status: nextStatus });
    } catch (err) {
      console.error("Failed to update status on DB:", err);
    }
  };

  const handleDeleteTask = async (task) => {
    if (confirm("Delete this task?")) {
      try {
        const targetid = task.id || task.task_id;
        
        // Remove from local storage first
        const localSaved = localStorage.getItem("projecthub.tasks");
        if (localSaved) {
          const localTasks = JSON.parse(localSaved);
          const existsLocal = localTasks.find(t => t.id === targetid);
          if (existsLocal) {
            const filtered = localTasks.filter(t => t.id !== targetid);
            localStorage.setItem("projecthub.tasks", JSON.stringify(filtered));
            fetchTasks();
            return;
          }
        }

        // Remove from API
        await tasksApi.remove(token, targetid);
        fetchTasks();
      } catch (err) {
        alert("Failed to delete task: " + err.message);
      }
    }
  };

  const toggleSidebarFullScreen = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  // Sort and filter computation
  const getFilteredTasks = () => {
    let result = [...tasks];

    // Filter by tab
    if (activeTab === "High Priority") {
      result = result.filter(t => t.priority === "HIGH" || t.priority === "CRITICAL");
    }

    // Filter by status dropdown
    if (statusFilter !== "ALL") {
      result = result.filter(t => {
        const st = String(t.status).toUpperCase();
        if (statusFilter === "DONE") return st === "DONE" || st === "COMPLETED";
        if (statusFilter === "TODO") return st === "TODO" || st === "PENDING";
        if (statusFilter === "IN_PROGRESS") return st === "IN_PROGRESS" || st === "IN-PROGRESS";
        return st === statusFilter;
      });
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      result = result.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortBy] || "";
      let valB = b[sortBy] || "";
      
      if (sortBy === "priority") {
        const pMap = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
        valA = pMap[a.priority] || 0;
        valB = pMap[b.priority] || 0;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  };

  const filteredTasks = getFilteredTasks();

  return (
    <DoubleSidebarLayout>
      <div className="flex flex-col h-full w-full bg-white relative text-left">
        
        {/* Header matching Image 4 */}
        <header className="flex items-center h-12 px-6 border-b border-[#eef1f6] shrink-0 select-none justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-[14px] font-bold text-[#0f172a]">My Tasks</h1>
            
            {/* Tabs */}
            <div className="flex items-center gap-4 h-12">
              {["Action Required", "Assigned To Me", "High Priority"].map((tab) => (
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
            
            <div className="w-[1px] h-4 bg-slate-200"></div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowAddForm(true)}
                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-[#2563eb]"
                title="Create Task"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
              <button onClick={() => alert("Tasks inbox updated.")} className="p-1 hover:bg-slate-100 rounded text-slate-500" title="Inbox">
                <Inbox size={15} />
              </button>
            </div>
          </div>
        </header>

        {/* Toolbar matching Image 4 */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-[#eef1f6] bg-slate-50/40 select-none shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebarFullScreen}
              className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100"
              title="Full screen workspace"
            >
              <Maximize2 size={14} />
            </button>
            
            {/* View Layout Toggle */}
            <button 
              onClick={() => setViewLayout(viewLayout === "table" ? "kanban" : "table")}
              className={`p-1 rounded hover:bg-slate-100 transition-colors ${viewLayout === "kanban" ? "text-[#2563eb]" : "text-slate-400"}`}
              title="Toggle Layout (Table / Kanban)"
            >
              <Layout size={14} />
            </button>

            <button 
              onClick={() => setShowSearchInput(!showSearchInput)}
              className={`p-1 rounded hover:bg-slate-100 transition-colors ${showSearchInput ? "text-[#2563eb]" : "text-slate-400"}`}
              title="Search Filter"
            >
              <Search size={14} />
            </button>
            <div className="w-[1px] h-4 bg-slate-200"></div>
            
            {/* Spacing buttons */}
            <button 
              onClick={() => setRowPadding("py-1.5")}
              className={`flex flex-col justify-center items-center gap-[2px] p-1 rounded hover:bg-slate-100 ${rowPadding === "py-1.5" ? "bg-slate-200/50" : ""}`}
              title="Compact spacing"
            >
              <span className="w-3.5 h-[1.5px] bg-slate-500"></span>
              <span className="w-3.5 h-[1.5px] bg-slate-500"></span>
            </button>
            
            <button 
              onClick={() => setRowPadding("py-3.5")}
              className={`flex flex-col justify-center items-center gap-[2px] p-1 rounded hover:bg-slate-100 ${rowPadding === "py-3.5" ? "bg-slate-200/50" : ""}`}
              title="Comfortable spacing"
            >
              <span className="w-2.5 h-[1.5px] bg-slate-500"></span>
              <span className="w-3.5 h-[1.5px] bg-slate-500"></span>
            </button>
            
            <div className="w-[1px] h-4 bg-slate-200"></div>

            <button 
              onClick={() => alert("Select view for filtering team tasks.")}
              className="flex items-center gap-1 px-2 py-1 text-slate-500 hover:text-slate-700 rounded hover:bg-slate-100 text-[12px] font-medium transition-colors"
            >
              <User size={13} className="text-slate-400" />
              <span>View for</span>
              <ChevronDown size={11} className="text-slate-400" />
            </button>

            {/* Status Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-600 rounded text-[12px] font-semibold hover:bg-slate-200 transition-colors">
                <span className={`w-2 h-2 rounded-full ${
                  statusFilter === "ALL" ? "bg-slate-400" :
                  statusFilter === "TODO" ? "bg-blue-400" :
                  statusFilter === "IN_PROGRESS" ? "bg-purple-400" : "bg-emerald-500"
                }`}></span>
                <span>Status: {statusFilter}</span>
                <ChevronDown size={11} className="text-slate-400" />
              </button>
              
              <div className="absolute left-0 mt-1 hidden group-hover:block w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-xs text-left">
                <button onClick={() => setStatusFilter("ALL")} className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-600 block">All Statuses</button>
                <button onClick={() => setStatusFilter("TODO")} className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-600 block">To Do</button>
                <button onClick={() => setStatusFilter("IN_PROGRESS")} className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-600 block">In Progress</button>
                <button onClick={() => setStatusFilter("DONE")} className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-600 block">Completed</button>
              </div>
            </div>
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
            
            {/* Toggle Sort Order */}
            <button 
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-1 text-slate-400 hover:text-slate-600"
              title="Sort Direction"
            >
              <ArrowUpDown size={14} />
            </button>
            <button onClick={() => alert("Apply custom grouping and filters.")} className="p-1 text-slate-400 hover:text-slate-600" title="Filter options">
              <Filter size={14} />
            </button>
            <button className="p-1 text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={15} />
            </button>
          </div>
        </div>

        {/* Search inline bar */}
        {showSearchInput && (
          <div className="px-6 py-2 bg-slate-50 border-b border-[#eef1f6] shrink-0">
            <input
              type="text"
              placeholder="Type to filter task title or desc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-sm px-3 py-1 border border-slate-200 rounded-lg text-xs bg-white focus:border-[#2563eb] outline-none"
            />
          </div>
        )}

        {/* Content Body Layouts */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {viewLayout === "table" ? (
            // 1. Table Checklist layout (Image 4 style)
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 px-6 py-2.5 border-b border-[#eef1f6] bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none shrink-0">
                <div className="col-span-1 flex items-center justify-start">
                  <input type="checkbox" className="rounded border-slate-300 text-[#2563eb] w-3.5 h-3.5 cursor-pointer" />
                </div>
                <div className="col-span-4">Title</div>
                <div className="col-span-2">Action Required</div>
                <div className="col-span-2">Schedule</div>
                <div className="col-span-2">Priority</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1 flex justify-end pr-1">
                  <Settings size={13} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>
              </div>

              {/* Rows */}
              <div className="flex-1 overflow-y-auto">
                {filteredTasks.length === 0 ? (
                  <div className="px-6 py-8 text-left">
                    <span className="text-[13px] text-slate-400 font-medium">No tasks yet</span>
                  </div>
                ) : (
                  <div className="divide-y divide-[#eef1f6]">
                    {filteredTasks.map((task) => {
                      const isCompleted = task.status === "DONE" || task.status === "completed";
                      const scheduleLabel = task.due_date 
                        ? new Date(task.due_date).toLocaleDateString([], { month: "short", day: "numeric" }) 
                        : "No schedule";
                        
                      return (
                        <div key={task.id || task.task_id} className={`grid grid-cols-12 px-6 ${rowPadding} items-center hover:bg-slate-50 transition-colors text-[13px]`}>
                          <div className="col-span-1 flex items-center">
                            <button 
                              onClick={() => handleToggleComplete(task)}
                              className="text-slate-400 hover:text-[#2563eb] transition-colors"
                            >
                              {isCompleted ? (
                                <CheckSquare size={16} className="text-[#2563eb]" />
                              ) : (
                                <Square size={16} />
                              )}
                            </button>
                          </div>
                          
                          <div className={`col-span-4 font-semibold text-[#0f172a] ${isCompleted ? "line-through text-slate-400 font-normal" : ""}`}>
                            {task.title}
                          </div>
                          
                          <div className="col-span-2 text-slate-500">
                            {task.priority === "HIGH" || task.priority === "CRITICAL" ? "Yes" : "No"}
                          </div>
                          
                          <div className="col-span-2 text-slate-500">{scheduleLabel}</div>
                          
                          <div className="col-span-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              task.priority === "CRITICAL" ? "bg-red-100 text-red-700" :
                              task.priority === "HIGH" ? "bg-orange-100 text-orange-700" :
                              task.priority === "MEDIUM" ? "bg-blue-100 text-blue-700" :
                              "bg-slate-100 text-slate-700"
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          
                          <div className="col-span-1 text-slate-500 font-semibold uppercase text-[10px]">
                            {task.status || "TODO"}
                          </div>
                          
                          <div className="col-span-1 flex justify-end pr-1 gap-2">
                            <button 
                              onClick={() => handleDeleteTask(task)}
                              className="text-red-500 hover:text-red-700 font-semibold text-xs transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // 2. Kanban Board layout (Kanban style columns)
            <div className="flex-1 overflow-x-auto p-6 bg-slate-50/40">
              <div className="flex gap-6 h-full min-h-[450px]">
                {["TODO", "IN_PROGRESS", "DONE"].map((colId) => {
                  const colTitle = colId === "TODO" ? "To Do" : colId === "IN_PROGRESS" ? "In Progress" : "Completed";
                  const colTasks = filteredTasks.filter(t => {
                    const st = String(t.status).toUpperCase();
                    if (colId === "DONE") return st === "DONE" || st === "COMPLETED";
                    if (colId === "TODO") return st === "TODO" || st === "PENDING" || !t.status;
                    return st === colId;
                  });

                  return (
                    <div key={colId} className="w-[300px] shrink-0 flex flex-col gap-3">
                      <div className="flex items-center justify-between px-1 shrink-0">
                        <span className="text-[13px] font-bold text-slate-700">{colTitle}</span>
                        <span className="bg-slate-200/80 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500">{colTasks.length}</span>
                      </div>
                      
                      <div className="flex-1 bg-slate-100/50 rounded-xl border border-slate-200/60 p-3 flex flex-col gap-3 overflow-y-auto">
                        {colTasks.map(t => (
                          <div key={t.id || t.task_id} className="bg-white border border-[#eef1f6] p-3 rounded-lg shadow-sm flex flex-col gap-2 relative group text-left">
                            <div className="flex justify-between items-start">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                t.priority === "CRITICAL" ? "bg-red-100 text-red-700" :
                                t.priority === "HIGH" ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600"
                              }`}>
                                {t.priority}
                              </span>
                              
                              <button 
                                onClick={() => handleDeleteTask(t)}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 text-xs px-1 absolute top-2 right-2"
                              >
                                ×
                              </button>
                            </div>
                            
                            <h4 className={`text-xs font-semibold text-slate-800 ${t.status === "DONE" ? "line-through text-slate-400" : ""}`}>
                              {t.title}
                            </h4>
                            {t.description && <p className="text-[10px] text-slate-400 line-clamp-2">{t.description}</p>}
                            
                            <div className="flex justify-between items-center mt-1 border-t border-slate-50 pt-2 text-[9px] text-slate-400 font-medium">
                              <span>{t.due_date ? new Date(t.due_date).toLocaleDateString([], { month: "short", day: "numeric" }) : ""}</span>
                              
                              <button 
                                onClick={() => handleToggleComplete(t)}
                                className="text-[#2563eb] hover:underline"
                              >
                                {t.status === "DONE" ? "Reopen" : "Complete"}
                              </button>
                            </div>
                          </div>
                        ))}

                        {colTasks.length === 0 && (
                          <div className="my-auto text-center text-[10px] text-slate-400 font-medium">Drop tasks here</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Preferences Side panel */}
        {showPrefPanel && (
          <div className="absolute top-12 right-0 bottom-0 w-64 bg-white border-l border-slate-200 shadow-xl p-5 z-40 text-xs text-slate-600 flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-800">Task Preferences</span>
              <button onClick={() => setShowPrefPanel(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            {/* Sort options */}
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Sort List By</span>
              <div className="flex flex-col gap-1.5">
                {[
                  { name: "Task Title", val: "title" },
                  { name: "Priority Rank", val: "priority" },
                  { name: "Due Date / Schedule", val: "schedule" }
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setSortBy(item.val)}
                    className={`w-full py-1.5 px-3 rounded-lg border text-left font-bold text-[10px] ${
                      sortBy === item.val ? "bg-slate-100 border-slate-300 text-slate-800" : "border-slate-200 text-slate-500"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Add Form Modal */}
        {showAddForm && (
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white border border-[#eef1f6] rounded-xl p-5 w-full max-w-sm shadow-xl text-left">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800">Add New Task</h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="flex flex-col gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="E.g. Review backend API routes"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-[#2563eb] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Description</label>
                  <input
                    type="text"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="E.g. Align routing schemas for task updates"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-[#2563eb] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-[#2563eb] outline-none bg-white cursor-pointer"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-xs font-semibold hover:bg-[#1d4ed8]"
                  >
                    Create Task
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
