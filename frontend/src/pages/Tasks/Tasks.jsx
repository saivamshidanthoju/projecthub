import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const initialTasks = [
  {
    id: "task-1",
    column: "todo",
    tag: "Research",
    tagBg: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    title: "User Interview Analysis",
    description: "Consolidate findings from the Q3 user experience survey into a master report.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkVWjTpt7wMxq0VjkEqp5lJcQMKBvD8tA5uMnoCTSLhIyAdKjacgT1tcZ1Bf2ALGwK3oP0YMOJr6Ll2Y1Xm6pgw_FtSIt6zUWR2eYkxu-893M8BRsxXa6SycblkyoN89IgFBNGaVx6YrALHgulGZc9FE33tcGCroNkih5QKurDBcvz5-qPpwTaeTsZEJLYWQ8ZrXy_SvtSO6JJvftc9LO67sfedXZNsvUidBsmfKPsyKbabX4qdObedRHZ4PU9VlMCusEXOSpDalE",
    avatarAlt: "Close up portrait of a young male software developer.",
    meta: { type: "date", label: "Oct 24", icon: "calendar_today" }
  },
  {
    id: "task-2",
    column: "todo",
    tag: "Design",
    tagBg: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
    title: "Nav Navigation Polish",
    description: "Refine the sidebar and topbar transitions for better performance on mobile views.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXQ_R98Ch3pJQIwb3rwoyEqkf8WiNd7J-S5p5AaPRp_woLcbw4VD8ybLmwTnv1_DrSGZ6mMwQlhgCev8vbWSt6-yM1t42boFnUGCkjLnPnRLrDt0WvGPUsX9IhzBbPmrYW9iKDIRaLVww1ra2VH6y2X5d5wOnwpJ1sooaKDtZ-HltfIxslVoQ7mkJLqBuibCZR5UNSKoAgCj0qZVh_ec8HOeN5ffofLNjJa2JnIgAwF2Zv7RYDWOOAJbZdr0jTjnzYCDn9TRLKIr8",
    avatarAlt: "A professional creative director.",
    meta: { type: "warning", label: "Urgent", icon: "warning" }
  },
  {
    id: "task-3",
    column: "in-progress",
    tag: "Dev",
    tagBg: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
    title: "API Endpoint Integration",
    description: "Connecting the new task service to the frontend Kanban components.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQSl2kZtSW6fxj4rZ8F1QxUvewMBcKaHNskqkHy4uyVvSAvCqZRFxQESuzO2X6zaYo7XvLjhd5qUsd05ds4zxXyvqO7jjmptUvgMOlu9ybCTvonSAXO8paeE0Sc-bT95ol2ZDuzUWLtf0KAAtd_3kLanxU3N39WXREQG1SVlpVOAW5vOXDHt-bxu4hJA7ofh4YN0M_q1fBqxsfdJPNhUwGhM-jHt56MkUK0N_DSssZt0uQ4v6ZVc6xV0hPjVL1YE0xsRjOUF0mAMo",
    avatarAlt: "Senior developer profile.",
    progress: 65,
    meta: { type: "comments", label: "12", icon: "forum" }
  },
  {
    id: "task-4",
    column: "review",
    tag: "QA",
    tagBg: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
    title: "Unit Test Coverage",
    description: "Verify all new utility functions have at least 90% test coverage.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsPphZiLHGb4H_XlnYKzRbWy17z7tZnkJhZ9qERWRbHL0tmXPUAwZhEyvmfb25utdvN5Gmd3o2bu3uoDqeG3ThCfx8GoveIFIZ1DpkSfCWrOOm1r6-UtU1Cx_Zh8UGWoALHfOLg7EJECljBJATYf3pZIgXC3NeFOEx9xH6w7ZLejeu_CsCVpsTI5uFT9iAb5vL6FAYCPOXcOVixVEjWCn6t7iMCsPMFceJtKtLFMiEHP7C_bOAqCvBHT4iV61pe9FUPHq6XkUgGc8",
    avatarAlt: "QA Engineer profile.",
    meta: { type: "attachments", label: "3", icon: "attach_file" }
  }
];

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggingId, setDraggingId] = useState(null);
  const [draggedOverCol, setDraggedOverCol] = useState(null);

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskTag, setNewTaskTag] = useState("Dev");
  const [newTaskCol, setNewTaskCol] = useState("todo");

  // Drag and Drop simulation handlers
  const handleDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDraggedOverCol(null);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (draggedOverCol !== colId) {
      setDraggedOverCol(colId);
    }
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    if (!draggingId) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === draggingId ? { ...t, column: colId } : t))
    );
    handleDragEnd();
  };

  // Create new task handler
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const tagsMap = {
      Research: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
      Design: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
      Dev: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
      QA: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
    };

    const task = {
      id: `task-${Date.now()}`,
      column: newTaskCol,
      tag: newTaskTag,
      tagBg: tagsMap[newTaskTag],
      title: newTaskTitle,
      description: newTaskDesc,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxj80x9RWxJQ4AzWlur52xcsE0i1HBIkNBt4Osn-cTVudkAiC-DX4pu1v0rN5QJ1eKqF3b8IoEsWBDbz3rzT3SNja8oN5EwrD8etLB_dag8b4y4DxDN88A4ikjV454h5OHs8HrVWsKf3GgMzxiZdkTwi5kOSstKGfq1Apv-CR1L-lBYRnr9JyQxubE_W98i0pb3ck4aUEDR0uYEHmQblScFwllnsiLCXmj4vPMCqbiPnonaS6mpaKDeX5RLl5gNYhEy6U8uJY8I4U",
      avatarAlt: "Alex Rivera avatar.",
      meta: { type: "date", label: "Today", icon: "calendar_today" }
    };

    setTasks((prev) => [...prev, task]);
    
    // Clear inputs and close
    setNewTaskTitle("");
    setNewTaskDesc("");
    setNewTaskTag("Dev");
    setNewTaskCol("todo");
    setIsModalOpen(false);
  };

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "completed", title: "Completed" }
  ];

  return (
    <div className="bg-surface-sunken dark:bg-inverse-surface text-on-surface w-full min-h-screen overflow-x-hidden flex">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header Component */}
        <Header />

        {/* Kanban Board Container */}
        <div className="p-margin-desktop flex-1 flex flex-col bg-surface-sunken dark:bg-surface-dim">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-xs text-label-md font-label-md text-on-surface-variant dark:text-surface-variant mb-sm select-none">
            <Link className="hover:text-primary dark:hover:text-inverse-primary transition-colors" to="/dashboard">
              Dashboard
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="hover:text-primary dark:hover:text-inverse-primary transition-colors cursor-pointer">
              Projects
            </span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="hover:text-primary dark:hover:text-inverse-primary transition-colors cursor-pointer">
              Project Alpha
            </span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-on-surface dark:text-surface-main font-semibold">Tasks</span>
          </nav>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-text-heading dark:text-surface-main">
                Tasks Kanban Board
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant">
                Manage and track project progress across the team.
              </p>
            </div>
            <div className="flex items-center gap-sm">
              <button className="flex items-center gap-xs px-md py-sm bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-lg font-button-text text-button-text text-on-surface dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/50 transition-all cursor-pointer">
                <span className="material-symbols-outlined">filter_list</span> Filter
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-xs px-md py-sm bg-primary text-white rounded-lg font-button-text text-button-text hover:bg-surface-tint active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined">add</span> Create Task
              </button>
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="flex-1 overflow-x-auto hide-scrollbar -mx-margin-desktop px-margin-desktop">
            <div className="flex gap-lg h-full min-h-[600px] pb-lg">
              {columns.map((col) => {
                const colTasks = tasks.filter((t) => t.column === col.id);
                const isOver = draggedOverCol === col.id;
                
                return (
                  <div 
                    key={col.id} 
                    className="flex flex-col gap-md w-[320px] md:w-[350px] shrink-0"
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDrop={(e) => handleDrop(e, col.id)}
                  >
                    <div className="flex items-center justify-between px-xs select-none">
                      <div className="flex items-center gap-sm">
                        <span className="font-title-md text-title-md text-text-heading dark:text-surface-main font-semibold">
                          {col.title}
                        </span>
                        <span className="bg-surface-container-highest dark:bg-on-surface-variant text-on-surface-variant dark:text-surface-main px-sm py-xs rounded-full font-label-md text-[10px] font-bold">
                          {colTasks.length}
                        </span>
                      </div>
                      <button className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary cursor-pointer">
                        <span className="material-symbols-outlined">more_horiz</span>
                      </button>
                    </div>

                    <div 
                      className={`flex-1 flex flex-col gap-md rounded-xl p-xs border-2 transition-colors duration-200 ${
                        isOver
                          ? "bg-slate-100 dark:bg-slate-900/40 border-dashed border-primary/50"
                          : col.id === "in-progress"
                          ? "bg-surface-container/30 dark:bg-inverse-surface/10 border-dashed border-outline-variant/50"
                          : "bg-surface-sunken/50 dark:bg-inverse-surface/5 border-transparent"
                      }`}
                    >
                      {colTasks.length > 0 ? (
                        colTasks.map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onDragEnd={handleDragEnd}
                            className={`task-card bg-surface-main dark:bg-inverse-surface p-md rounded-xl border border-border-subtle dark:border-outline-variant shadow-sm hover:shadow-md transition-shadow active:cursor-grabbing select-none ${
                              task.id === "task-3" ? "ring-2 ring-primary/20" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start mb-sm">
                              <span className={`font-label-md text-[10px] px-sm py-xs rounded-full uppercase tracking-wider font-semibold ${task.tagBg}`}>
                                {task.tag}
                              </span>
                              <span className="material-symbols-outlined text-outline dark:text-surface-variant cursor-grab select-none">
                                drag_indicator
                              </span>
                            </div>
                            
                            <h4 className="font-title-md text-title-md text-text-heading dark:text-surface-main font-bold mb-xs">
                              {task.title}
                            </h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-surface-variant mb-md">
                              {task.description}
                            </p>

                            {task.progress !== undefined && (
                              <div className="mb-md">
                                <div className="flex justify-between mb-1">
                                  <span className="text-label-md font-label-md text-on-surface-variant dark:text-surface-variant">Progress</span>
                                  <span className="text-label-md font-label-md text-primary dark:text-inverse-primary font-bold">{task.progress}%</span>
                                </div>
                                <div className="w-full bg-surface-container dark:bg-on-surface-variant/30 rounded-full h-1">
                                  <div className="bg-primary dark:bg-inverse-primary h-1 rounded-full" style={{ width: `${task.progress}%` }}></div>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-surface-container-highest overflow-hidden">
                                  <img 
                                    className="w-full h-full object-cover" 
                                    alt={task.avatarAlt} 
                                    src={task.avatar} 
                                  />
                                </div>
                              </div>
                              
                              <div className={`flex items-center gap-xs ${task.meta.type === "warning" ? "text-error dark:text-red-400 font-bold" : "text-on-surface-variant dark:text-surface-variant"}`}>
                                <span className="material-symbols-outlined text-base">{task.meta.icon}</span>
                                <span className="font-label-md text-label-md">{task.meta.label}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-xl px-md text-center border-2 border-dashed border-outline-variant/60 dark:border-outline-variant/20 rounded-xl opacity-60">
                          <span className="material-symbols-outlined text-4xl text-outline dark:text-surface-variant mb-sm select-none">
                            task_alt
                          </span>
                          <p className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant">
                            Drop tasks here to complete them
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center z-50 md:hidden active:scale-90 transition-transform cursor-pointer"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Modal / Dialog for Creating Task */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-md">
          <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant w-full max-w-[448px] rounded-2xl p-lg shadow-xl animate-fade-in text-left">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="font-headline-md text-headline-md text-text-heading dark:text-surface-main font-bold">
                Create New Task
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/50 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="space-y-md">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant" htmlFor="task_title">
                  Task Title
                </label>
                <input
                  id="task_title"
                  className="w-full h-11 px-md bg-surface-sunken dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface dark:text-surface-main"
                  placeholder="e.g. Write user testing protocols"
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant" htmlFor="task_desc">
                  Description
                </label>
                <textarea
                  id="task_desc"
                  rows="3"
                  className="w-full p-md bg-surface-sunken dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface dark:text-surface-main resize-none"
                  placeholder="Summarize the core requirements of this task..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant" htmlFor="task_tag">
                    Tag / Stage
                  </label>
                  <select
                    id="task_tag"
                    className="w-full h-11 px-md bg-surface-sunken dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface dark:text-surface-main cursor-pointer"
                    value={newTaskTag}
                    onChange={(e) => setNewTaskTag(e.target.value)}
                  >
                    <option value="Research">Research</option>
                    <option value="Design">Design</option>
                    <option value="Dev">Dev</option>
                    <option value="QA">QA</option>
                  </select>
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant" htmlFor="task_col">
                    Column
                  </label>
                  <select
                    id="task_col"
                    className="w-full h-11 px-md bg-surface-sunken dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface dark:text-surface-main cursor-pointer"
                    value={newTaskCol}
                    onChange={(e) => setNewTaskCol(e.target.value)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-primary text-white font-button-text text-button-text rounded-xl shadow-md hover:bg-surface-tint active:scale-[0.98] transition-all flex items-center justify-center gap-xs cursor-pointer"
              >
                <span className="material-symbols-outlined">add</span> Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
