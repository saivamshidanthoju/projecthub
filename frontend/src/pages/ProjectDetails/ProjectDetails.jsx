import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { projectsApi, tasksApi, commentsApi, attachmentsApi } from "../../lib/api";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { token, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("Overview");
  const [project, setProject] = useState(null);
  const [tasksList, setTasksList] = useState([]);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [chatTaskId, setChatTaskId] = useState(null);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Automatically scroll chat container to bottom when comments update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  // Load project details, tasks, and attachments
  useEffect(() => {
    const loadProjectData = async () => {
      setIsLoading(true);
      try {
        const id = projectId || 1;
        // 1. Fetch Project Details
        const projData = await projectsApi.get(token, id);
        setProject(projData);

        // 2. Fetch Tasks
        const tasks = await tasksApi.list(token, { projectId: id });
        setTasksList(tasks);

        // 3. Fetch Attachments
        const files = await attachmentsApi.listProject(token, id);
        setAttachments(files);

        // Determine or create a task to house the project workspace chat
        let chatTask = tasks.find(t => t.title === "Project Workspace Chat");
        if (!chatTask) {
          if (tasks.length > 0) {
            chatTask = tasks[0];
          } else {
            // Create a default task for workspace comments to attach to
            chatTask = await tasksApi.create(token, {
              project_id: id,
              title: "Project Workspace Chat",
              description: "System generated task for project-wide collaboration.",
              status: "TODO",
              priority: "LOW"
            }, user);
            setTasksList(prev => [...prev, chatTask]);
          }
        }
        setChatTaskId(chatTask.task_id || chatTask.id);
        
        // 4. Fetch Comments for the selected chat task
        const chatComments = await commentsApi.list(token, chatTask.task_id || chatTask.id);
        setComments(chatComments);

      } catch (err) {
        console.error("Failed to load project details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (token && projectId) {
      loadProjectData();
    }
  }, [token, projectId]);

  // Fetch comments periodically or on tab activation
  useEffect(() => {
    if (token && chatTaskId && activeTab === "Overview") {
      commentsApi.list(token, chatTaskId)
        .then(setComments)
        .catch(console.error);
    }
  }, [token, chatTaskId, activeTab]);

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !chatTaskId) return;

    try {
      const created = await commentsApi.create(token, chatTaskId, newComment);
      
      // Load comments fresh from the backend to ensure full object mapping with author name
      const freshComments = await commentsApi.list(token, chatTaskId);
      setComments(freshComments);
      setNewComment("");
    } catch (err) {
      alert(err.message || "Failed to post comment.");
    }
  };

  const handleInviteMember = () => {
    const email = prompt("Enter email address of team member to invite:");
    if (email) {
      alert(`Invitation sent to ${email}`);
    }
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !project) return;

    try {
      const uploaded = await attachmentsApi.uploadProject(token, project.project_id || project.id, file, user);
      setAttachments(prev => [uploaded, ...prev]);
    } catch (err) {
      alert(err.message || "Failed to upload file.");
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (confirm("Are you sure you want to delete this attachment?")) {
      try {
        await attachmentsApi.remove(token, attachmentId, user);
        setAttachments(prev => prev.filter(att => att.attachment_id !== attachmentId));
      } catch (err) {
        alert(err.message || "Failed to delete attachment.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface-sunken dark:bg-inverse-surface text-on-surface w-full min-h-screen flex items-center justify-center">
        <p className="font-body-lg">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-surface-sunken dark:bg-inverse-surface text-on-surface w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-headline-md text-error">Project not found</p>
          <Link to="/projects" className="mt-md text-primary hover:underline block">Back to Projects</Link>
        </div>
      </div>
    );
  }

  // Derive status details
  const statusDisplay = project.status === "ACTIVE" || project.status === "IN_PROGRESS" ? "On Track" : project.status === "COMPLETED" ? "Completed" : "Delayed";
  const statusColor = project.status === "COMPLETED" ? "bg-green-500" : project.status === "DELAYED" ? "bg-orange-500" : "bg-blue-500";

  return (
    <div className="bg-surface-sunken dark:bg-inverse-surface text-on-surface w-full min-h-screen overflow-x-hidden flex">
      <Sidebar />

      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Header />

        <div className="p-margin-desktop flex flex-col gap-lg max-w-[1440px] mx-auto w-full bg-surface-sunken dark:bg-surface-dim">
          <nav className="flex items-center gap-xs text-label-md font-label-md text-on-surface-variant dark:text-surface-variant mb-sm select-none">
            <Link className="hover:text-primary dark:hover:text-inverse-primary transition-colors" to="/dashboard">
              Dashboard
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link className="hover:text-primary dark:hover:text-inverse-primary transition-colors" to="/projects">
              Projects
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-on-surface dark:text-surface-main font-semibold">{project.project_name}</span>
          </nav>

          <div className="mb-lg border-b border-border-subtle dark:border-outline-variant">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-md pb-md">
              <nav className="flex flex-wrap gap-x-lg gap-y-sm select-none">
                {["Overview", "Tasks", "Team", "Timeline", "Attachments"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-md font-button-text text-button-text border-b-2 transition-all cursor-pointer ${
                      activeTab === tab
                        ? "border-primary text-primary dark:border-inverse-primary dark:text-inverse-primary font-bold"
                        : "border-transparent text-on-surface-variant dark:text-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>

              <div className="flex items-center gap-sm self-start lg:self-center select-none">
                <span className="px-md py-xs bg-tertiary/10 text-tertiary rounded-full font-label-md text-[10px] border border-tertiary/20">
                  ACTIVE PHASE: DEV
                </span>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-surface-main bg-blue-100 flex items-center justify-center text-[10px] font-bold text-primary">PH</div>
                </div>
              </div>
            </div>
          </div>

          {activeTab === "Overview" && (
            <div className="bento-grid grid grid-cols-12 gap-gutter">
              <div className="col-span-12 lg:col-span-8 bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm">
                <div className="flex justify-between items-start mb-md">
                  <h3 className="font-headline-md text-headline-md text-text-heading dark:text-surface-main font-bold">
                    Project Description
                  </h3>
                </div>
                <p className="font-body-lg text-body-lg text-text-body dark:text-surface-variant leading-relaxed mb-lg">
                  {project.description || "No description provided for this project. Update project details to add one."}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg pt-md border-t border-border-subtle dark:border-outline-variant select-none">
                  <div>
                    <p className="font-label-md text-on-surface-variant dark:text-surface-variant uppercase mb-xs text-[10px]">
                      Timeline
                    </p>
                    <div className="flex items-center gap-xs text-text-heading dark:text-surface-main font-title-md">
                      <span className="material-symbols-outlined text-[18px]">event</span>
                      Active Project Lifecycle
                    </div>
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface-variant dark:text-surface-variant uppercase mb-xs text-[10px]">
                      Status
                    </p>
                    <div className="flex items-center gap-xs">
                      <span className={`w-3 h-3 ${statusColor} rounded-full`}></span>
                      <span className="text-text-heading dark:text-surface-main font-title-md">{statusDisplay}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg select-none">
                <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm flex-1">
                  <div className="flex justify-between items-center mb-sm">
                    <p className="font-label-md text-on-surface-variant dark:text-surface-variant uppercase text-[10px]">
                      Project Progress
                    </p>
                    <span className="material-symbols-outlined text-green-500">favorite</span>
                  </div>
                  <h4 className="font-display-lg text-headline-lg text-green-600 dark:text-green-400 font-bold mb-xs">
                    {project.progress || 0}%
                  </h4>
                  <p className="font-body-sm text-on-surface-variant dark:text-surface-variant">
                    Overall project development completion
                  </p>
                  <div className="w-full bg-surface-container dark:bg-on-surface-variant/30 rounded-full h-1.5 mt-md overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: `${project.progress || 0}%` }}></div>
                  </div>
                </div>

                <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm flex-1">
                  <p className="font-label-md text-on-surface-variant dark:text-surface-variant uppercase text-[10px] mb-sm">
                    Budget vs Actual
                  </p>
                  <div className="flex items-baseline gap-xs">
                    <h4 className="font-title-lg text-text-heading dark:text-surface-main font-bold text-2xl">
                      $142,500
                    </h4>
                    <span className="text-on-surface-variant dark:text-surface-variant font-body-sm">
                      / $200k
                    </span>
                  </div>
                  <div className="w-full bg-surface-container dark:bg-on-surface-variant/30 rounded-full h-1.5 mt-md overflow-hidden">
                    <div className="bg-primary dark:bg-inverse-primary h-full w-[71%]"></div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5 bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm">
                <div className="flex justify-between items-center mb-lg select-none">
                  <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main font-bold">
                    Project Team
                  </h3>
                </div>
                
                <div className="space-y-md">
                  <div className="flex items-center justify-between p-sm hover:bg-surface-container-low dark:hover:bg-on-surface-variant/20 rounded-lg transition-colors cursor-pointer border border-transparent">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold">U</div>
                      <div>
                        <p className="font-title-md text-sm text-text-heading dark:text-surface-main font-bold">Project Members</p>
                        <p className="font-body-sm text-on-surface-variant dark:text-surface-variant text-[11px]">Organization Boundary Access</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleInviteMember}
                    className="w-full py-md border-2 border-dashed border-border-subtle dark:border-outline-variant rounded-xl text-on-surface-variant dark:text-surface-variant font-button-text text-button-text flex items-center justify-center gap-sm hover:border-primary hover:text-primary dark:hover:border-inverse-primary transition-all cursor-pointer bg-white dark:bg-inverse-surface select-none"
                  >
                    <span className="material-symbols-outlined">person_add</span>
                    Invite Member
                  </button>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-7 bg-surface-main dark:bg-inverse-surface border border-border-subtle/70 dark:border-outline-variant/30 rounded-xl p-lg shadow-sm flex flex-col h-[400px] text-left">
                <div className="flex items-center gap-sm mb-lg border-b border-border-subtle/50 dark:border-outline-variant/30 pb-md select-none">
                  <span className="material-symbols-outlined text-primary dark:text-inverse-primary">chat_bubble</span>
                  <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main font-bold">
                    Collaboration Chat
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto pr-sm custom-scrollbar space-y-md mb-lg">
                  {comments.map((comment) => {
                    const authorName = comment.first_name ? `${comment.first_name} ${comment.last_name || ""}` : "Team Member";
                    const initials = authorName.split(" ").map(n => n[0]).join("").toUpperCase();
                    return (
                      <div key={comment.comment_id || comment.id} className="flex gap-md items-start">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/10 flex items-center justify-center text-[10px] font-bold shrink-0 select-none">
                          {initials}
                        </div>
                        <div className="flex-1 bg-surface-sunken dark:bg-on-surface-variant/10 p-md rounded-lg border border-border-subtle/50">
                          <div className="flex justify-between items-center mb-1 select-none">
                            <span className="font-title-md text-xs text-text-heading dark:text-surface-main font-bold">
                              {authorName}
                            </span>
                            <span className="text-[9px] font-medium text-on-surface-variant/80">
                              {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="font-body-md text-sm text-on-surface-variant dark:text-surface-variant mt-0.5 whitespace-pre-wrap leading-relaxed">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendComment} className="flex items-end gap-md">
                  <div className="flex-1 bg-surface-sunken dark:bg-inverse-surface border border-border-subtle/70 dark:border-outline-variant/30 rounded-lg p-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all flex flex-col gap-xs">
                    <textarea
                      className="w-full bg-transparent border-none focus:ring-0 text-sm text-on-surface dark:text-surface-main resize-none h-16 placeholder:text-on-surface-variant/50 outline-none pl-2 pt-1"
                      placeholder="Type your message..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendComment(e);
                        }
                      }}
                      required
                    ></textarea>
                    
                    <div className="flex items-center justify-between mt-xs border-t border-border-subtle/40 dark:border-outline-variant/20 pt-sm px-xs select-none">
                      <div className="flex gap-sm">
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          className="material-symbols-outlined text-on-surface-variant/70 hover:text-primary dark:hover:text-inverse-primary transition-colors text-[20px] cursor-pointer"
                          title="Attach workspace file"
                        >
                          attach_file
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          onChange={handleUploadFile}
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="bg-primary text-white w-7 h-7 flex items-center justify-center rounded-md active:scale-95 hover:brightness-105 transition-transform cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] font-bold">send</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "Tasks" && (
            <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
              <div className="flex justify-between items-center select-none">
                <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main font-bold">
                  Open Tasks for {project.project_name}
                </h3>
                <Link to="/tasks" className="text-primary dark:text-inverse-primary font-button-text text-button-text hover:underline font-bold">
                  View Full Kanban Board →
                </Link>
              </div>
              
              <div className="divide-y divide-border-subtle dark:divide-outline-variant">
                {tasksList.filter(t => t.title !== "Project Workspace Chat").map((t) => (
                  <div key={t.task_id || t.id} className="flex items-center justify-between py-md first:pt-0 last:pb-0">
                    <div>
                      <p className="font-title-md text-title-md text-text-heading dark:text-surface-main font-semibold">
                        {t.title}
                      </p>
                      <p className="text-body-sm text-on-surface-variant dark:text-surface-variant">
                        Priority: <span className="font-semibold">{t.priority}</span>
                      </p>
                    </div>
                    <span className="px-sm py-1 rounded-full font-label-md text-label-md font-semibold select-none bg-blue-50 text-blue-700 border border-blue-200">
                      {t.status}
                    </span>
                  </div>
                ))}
                {tasksList.filter(t => t.title !== "Project Workspace Chat").length === 0 && (
                  <p className="text-on-surface-variant text-center py-4">No tasks found for this project.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "Team" && (
            <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
              <div className="flex justify-between items-center select-none">
                <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main font-bold">
                  Active Project Roster
                </h3>
              </div>
              <p className="text-on-surface-variant text-center py-4">To manage team members and allocate roles, navigate to the Team Management section.</p>
            </div>
          )}

          {activeTab === "Timeline" && (
            <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm space-y-lg select-none">
              <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main font-bold">
                Project Milestone Schedule
              </h3>
              <div className="relative border-l-2 border-border-subtle dark:border-outline-variant/30 ml-4 pl-lg space-y-xl py-xs">
                <div className="relative">
                  <div className="absolute -left-[35px] top-1.5 w-4 h-4 rounded-full border-2 border-surface-main bg-blue-500"></div>
                  <h4 className="font-title-md text-title-md text-text-heading dark:text-surface-main font-bold">Project Launch</h4>
                  <span className="text-body-sm text-on-surface-variant dark:text-surface-variant block mb-sm">Created At {new Date(project.created_at).toLocaleDateString()}</span>
                  <p className="font-body-md text-body-md text-text-body dark:text-surface-variant">Project initialization and repository boundaries initialized.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Attachments" && (
            <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
              <div className="flex justify-between items-center select-none">
                <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main font-bold">
                  Project Documentation & Assets
                </h3>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-xs px-md py-sm bg-primary text-white rounded-lg font-button-text hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow"
                >
                  <span className="material-symbols-outlined text-[18px]">upload</span> Upload File
                </button>
              </div>
              
              <div className="divide-y divide-border-subtle dark:divide-outline-variant">
                {attachments.map((res) => {
                  const sizeKB = (res.file_size / 1024).toFixed(1);
                  return (
                    <div key={res.attachment_id || res.id} className="flex items-center justify-between py-md first:pt-0 last:pb-0">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-lg bg-surface-sunken dark:bg-on-surface-variant/20 flex items-center justify-center text-primary select-none">
                          <span className="material-symbols-outlined">description</span>
                        </div>
                        <div>
                          <p className="font-title-md text-title-md text-text-heading dark:text-surface-main font-semibold hover:text-primary transition-colors cursor-pointer">
                            {res.original_name}
                          </p>
                          <p className="text-body-sm text-on-surface-variant">
                            {res.mime_type} • {sizeKB} KB
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-sm">
                        <button
                          onClick={() => alert("Downloading is supported via direct file paths.")}
                          className="p-2 border border-border-subtle hover:bg-surface-container-low rounded-lg text-on-surface-variant transition-all cursor-pointer bg-white"
                        >
                          <span className="material-symbols-outlined text-[18px]">download</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAttachment(res.attachment_id)}
                          className="p-2 border border-error hover:bg-red-50 rounded-lg text-error transition-all cursor-pointer bg-white"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
                {attachments.length === 0 && (
                  <p className="text-on-surface-variant text-center py-4">No documentation uploaded yet.</p>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
