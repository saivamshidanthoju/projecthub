import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { tasksApi, projectsApi } from "../../lib/api";

const COLUMN_MAP = {
  todo: "TODO",
  "in-progress": "IN_PROGRESS",
  review: "IN_REVIEW",
  completed: "DONE"
};

const STATUS_MAP = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  IN_REVIEW: "review",
  DONE: "completed"
};

function mapTaskFromBackend(task) {
  const priorityBgMap = {
    LOW: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 border border-teal-200 dark:border-teal-800/30",
    MEDIUM: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30",
    HIGH: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30",
    CRITICAL: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800/30"
  };

  const dueLabel = task.due_date ? new Date(task.due_date).toLocaleDateString([], { month: "short", day: "numeric" }) : "No date";

  return {
    id: task.task_id || task.id,
    project_id: task.project_id,
    column: STATUS_MAP[task.status] || "todo",
    tag: task.priority || "MEDIUM",
    tagBg: priorityBgMap[task.priority] || priorityBgMap.MEDIUM,
    title: task.title,
    description: task.description || "",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxj80x9RWxJQ4AzWlur52xcsE0i1HBIkNBt4Osn-cTVudkAiC-DX4pu1v0rN5QJ1eKqF3b8IoEsWBDbz3rzT3SNja8oN5EwrD8etLB_dag8b4y4DxDN88A4ikjV454h5OHs8HrVWsKf3GgMzxiZdkTwi5kOSstKGfq1Apv-CR1L-lBYRnr9JyQxubE_W98i0pb3ck4aUEDR0uYEHmQblScFwllnsiLCXmj4vPMCqbiPnonaS6mpaKDeX5RLl5gNYhEy6U8uJY8I4U",
    avatarAlt: "User avatar.",
    meta: { type: "date", label: dueLabel, icon: "calendar_today" }
  };
}

export default function Tasks() {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [draggingId, setDraggingId] = useState(null);
  const [draggedOverCol, setDraggedOverCol] = useState(null);

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("MEDIUM");
  const [newTaskCol, setNewTaskCol] = useState("todo");

  // Load projects and tasks on mount
  useEffect(() => {
    const initData = async () => {
      try {
        // 1. Fetch projects
        let projects = await projectsApi.list(token);
        if (projects.length === 0) {
          // If no projects exist in database, auto-create a default project
          const defaultProject = await projectsApi.create(token, {
            project_name: "General Initiative",
            department: "Operations",
            description: "Default workspace project for general tasks.",
            status: "ACTIVE"
          }, user);
          projects = [defaultProject];
        }
        setProjectsList(projects);
        setSelectedProjectId(projects[0].project_id || projects[0].id);

        // 2. Fetch tasks
        const tasksData = await tasksApi.list(token);
        // Exclude the project-wide collaboration chats to keep Kanban tidy
        setTasks((tasksData || []).filter(t => t.title !== "Project Workspace Chat").map(mapTaskFromBackend));
      } catch (err) {
        console.error("Failed to load Kanban board data:", err);
      }
    };

    if (token) {
      initData();
    }
  }, [token]);

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

  const handleDrop = async (e, colId) => {
    e.preventDefault();
    if (!draggingId) return;

    // Shift local visual state immediately for smoothness
    setTasks((prev) =>
      prev.map((t) => (String(t.id) === String(draggingId) ? { ...t, column: colId } : t))
    );

    // Persist to PostgreSQL database
    try {
      const backendStatus = COLUMN_MAP[colId];
      await tasksApi.update(token, draggingId, {
        status: backendStatus
      });
    } catch (err) {
      console.error("Failed to persist task column drop update:", err);
      // Reload lists to sync correct database state if it fails
      const tasksData = await tasksApi.list(token);
      setTasks(tasksData.filter(t => t.title !== "Project Workspace Chat").map(mapTaskFromBackend));
    }

    handleDragEnd();
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await tasksApi.remove(token, taskId);
        setTasks(prev => prev.filter(t => String(t.id) !== String(taskId)));
      } catch (err) {
        alert(err.message || "Failed to delete task.");
      }
    }
  };

  // Create new task handler
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedProjectId) return;

    try {
      const payload = {
        project_id: parseInt(selectedProjectId, 10),
        title: newTaskTitle,
        description: newTaskDesc,
        status: COLUMN_MAP[newTaskCol] || "TODO",
        priority: newTaskPriority,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Default 7 days from now
      };

      const created = await tasksApi.create(token, payload, user);
      setTasks((prev) => [...prev, mapTaskFromBackend(created)]);

      // Clear inputs and close
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskPriority("MEDIUM");
      setNewTaskCol("todo");
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || "Failed to create task.");
    }
  };

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "completed", title: "Completed" }
  ];

  return (
    <div className="bg-surface-sunken dark:bg-inverse-surface text-on-surface w-full min-h-screen overflow-x-hidden flex">
      <Sidebar />

      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Header />

        <div className="p-margin-desktop flex-1 flex flex-col bg-surface-sunken dark:bg-surface-dim">
          <nav className="flex items-center gap-xs text-label-md font-label-md text-on-surface-variant dark:text-surface-variant mb-sm select-none">
            <Link className="hover:text-primary dark:hover:text-inverse-primary transition-colors" to="/dashboard">
              Dashboard
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-on-surface dark:text-surface-main font-semibold">Tasks</span>
          </nav>

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
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-xs px-md py-sm bg-primary text-white rounded-lg font-button-text text-button-text hover:bg-surface-tint active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined">add</span> Create Task
              </button>
            </div>
          </div>

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
                            className="task-card bg-surface-main dark:bg-inverse-surface p-md rounded-xl border border-border-subtle dark:border-outline-variant shadow-sm hover:shadow-md transition-shadow active:cursor-grabbing select-none relative group"
                          >
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="absolute top-2 right-2 text-error opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1 rounded hover:bg-red-50"
                              title="Delete Task"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>

                            <div className="flex justify-between items-start mb-sm">
                              <span className={`font-label-md text-[10px] px-sm py-xs rounded-full uppercase tracking-wider font-semibold ${task.tagBg}`}>
                                {task.tag}
                              </span>
                              <span className="material-symbols-outlined text-outline dark:text-surface-variant cursor-grab select-none">
                                drag_indicator
                              </span>
                            </div>
                            
                            <h4 className="font-title-md text-title-md text-text-heading dark:text-surface-main font-bold mb-xs pr-6">
                              {task.title}
                            </h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-surface-variant mb-md">
                              {task.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full border-2 border-surface-main bg-primary flex items-center justify-center text-[8px] font-bold text-white">
                                  TM
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-xs text-on-surface-variant dark:text-surface-variant">
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
                            Drop tasks here
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

      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center z-50 md:hidden active:scale-90 transition-transform cursor-pointer"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-md shrink-0 animate-fade-in">
          <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant w-full max-w-[448px] rounded-xl p-lg shadow-xl text-left">
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
                <label className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant" htmlFor="task_project">
                  Select Project
                </label>
                <select
                  id="task_project"
                  className="w-full h-11 px-md bg-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-on-surface dark:text-surface-main cursor-pointer"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  required
                >
                  {projectsList.map(p => (
                    <option key={p.project_id || p.id} value={p.project_id || p.id}>
                      {p.project_name || p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant" htmlFor="task_title">
                  Task Title
                </label>
                <input
                  id="task_title"
                  className="w-full h-11 px-md bg-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface dark:text-surface-main"
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
                  className="w-full p-md bg-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface dark:text-surface-main resize-none"
                  placeholder="Summarize the core requirements of this task..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="task_priority">
                    Priority
                  </label>
                  <select
                    id="task_priority"
                    className="w-full h-11 px-md bg-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-on-surface dark:text-surface-main cursor-pointer"
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="task_col">
                    Column
                  </label>
                  <select
                    id="task_col"
                    className="w-full h-11 px-md bg-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-on-surface dark:text-surface-main cursor-pointer"
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
                className="w-full h-12 bg-primary text-white font-button-text text-button-text rounded-lg shadow-md hover:bg-surface-tint active:scale-[0.98] transition-all flex items-center justify-center gap-xs cursor-pointer"
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
