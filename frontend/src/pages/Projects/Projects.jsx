import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DoubleSidebarLayout from "../../layouts/DoubleSidebarLayout";
import { useAuth } from "../../context/AuthContext";
import { projectsApi } from "../../lib/api";

function mapProjectFromBackend(proj) {
  const statusMap = {
    ACTIVE: "In Progress",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    DELAYED: "Delayed",
    ARCHIVED: "Archived"
  };

  const status = statusMap[proj.status] || "In Progress";
  
  const statusColorConfig = {
    "In Progress": {
      bg: "bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400 border border-slate-200 dark:border-slate-800/30",
      dot: "bg-slate-400",
      icon: "terminal",
      iconBg: "bg-slate-100 text-slate-600"
    },
    "Completed": {
      bg: "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-800/30",
      dot: "bg-green-500",
      icon: "verified",
      iconBg: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
    },
    "Delayed": {
      bg: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800/30",
      dot: "bg-orange-500",
      icon: "warning",
      iconBg: "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400"
    },
    "Archived": {
      bg: "bg-gray-50 text-gray-700 dark:bg-gray-950/40 dark:text-gray-400 border border-gray-200 dark:border-gray-800/30",
      dot: "bg-gray-500",
      icon: "archive",
      iconBg: "bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-400"
    }
  };

  const cfg = statusColorConfig[status] || statusColorConfig["In Progress"];

  return {
    id: proj.project_id || proj.id,
    name: proj.project_name || proj.name,
    department: proj.department || "General Operations",
    description: proj.description || "",
    status: status,
    statusColor: cfg.bg,
    dotColor: cfg.dot,
    progress: proj.progress || 0,
    icon: cfg.icon,
    iconBg: cfg.iconBg,
    team: [
      { avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbPqIgzUkRwtIdNG1R29HJH2HeI-6sfy-XfeHCrbnajiXzp2EoqkmsR63YCtYrfTkYmLVKdtu2UAG2pJX_xsiGs14Uw_v40EOI5wnMC-zUjUFxM2JEKxs1LHB0UXwtkmPyVwDz5uR94z54KByQjtLSNDQjQstHMCOS-Ng5MNQ7N3u_fStiuomy4tnaCTA21Ikuu1zfjZA4t_Yx3KLTOSapy31XD5tFIwuYal_B8uIM4gZ118CQ3Gr0hqKvWrQgGfZ378211N9p7KU", alt: "User profile." }
    ],
    teamCount: 1
  };
}

export default function Projects() {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  // Modal states for creating project
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjDept, setNewProjDept] = useState("");
  const [newProjProgress, setNewProjProgress] = useState(0);
  const [newProjStatus, setNewProjStatus] = useState("In Progress");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsApi.list(token);
        setProjects(data.map(mapProjectFromBackend));
      } catch (err) {
        console.error("Failed to fetch projects from backend:", err);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await projectsApi.remove(token, id);
        setProjects((prev) => prev.filter((p) => String(p.id) !== String(id)));
      } catch (err) {
        alert(err.message || "Failed to delete project.");
      }
    }
  };

  const handleEdit = async (proj) => {
    const nextName = prompt("Edit Project Name:", proj.name);
    if (nextName !== null && nextName.trim() !== "") {
      try {
        const payload = {
          project_name: nextName,
          department: proj.department,
          status: proj.status === "In Progress" ? "ACTIVE" : proj.status === "Completed" ? "COMPLETED" : "DELAYED",
          progress: proj.progress
        };
        const updated = await projectsApi.update(token, proj.id, payload);
        setProjects((prev) =>
          prev.map((p) => (String(p.id) === String(proj.id) ? mapProjectFromBackend(updated) : p))
        );
      } catch (err) {
        alert(err.message || "Failed to update project.");
      }
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    try {
      const payload = {
        project_name: newProjName,
        department: newProjDept || "General Operations",
        description: "",
        status: newProjStatus === "In Progress" ? "ACTIVE" : newProjStatus === "Completed" ? "COMPLETED" : "DELAYED",
        progress: parseInt(newProjProgress, 10) || 0
      };

      const created = await projectsApi.create(token, payload, user);
      setProjects((prev) => [mapProjectFromBackend(created), ...prev]);

      setNewProjName("");
      setNewProjDept("");
      setNewProjProgress(0);
      setNewProjStatus("In Progress");
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || "Failed to create project.");
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = filterStatus === "All" || p.status === filterStatus;
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.department.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DoubleSidebarLayout>
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 text-left">
        <div className="flex flex-col gap-lg max-w-[1440px] mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-text-heading dark:text-surface-main">
                Active Projects
              </h2>
              <p className="text-on-surface-variant dark:text-surface-variant font-body-md mt-base">
                Manage and track your ongoing enterprise initiatives.
              </p>
            </div>
            
            <div className="flex items-center gap-sm">
              <input
                type="text"
                placeholder="Search projects..."
                className="px-md h-10 border border-border-subtle dark:border-outline-variant rounded-lg bg-surface-main dark:bg-inverse-surface text-on-surface outline-none text-body-sm"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <div className="relative">
                <select
                  className="flex items-center gap-sm px-md h-10 border border-border-subtle dark:border-outline-variant rounded-lg bg-surface-main dark:bg-inverse-surface text-on-surface-variant dark:text-surface-variant outline-none hover:bg-surface-container-low transition-all cursor-pointer font-button-text text-button-text"
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-sm px-lg h-10 bg-primary text-white rounded-lg hover:brightness-110 shadow-md transition-all duration-200 active:scale-95 font-button-text text-button-text cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                New Project
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            <div className="bg-surface-main dark:bg-inverse-surface p-md border border-border-subtle dark:border-outline-variant rounded-xl shadow-sm">
              <p className="text-label-md font-label-md text-on-surface-variant dark:text-surface-variant mb-xs uppercase tracking-wider text-[10px]">
                Total Projects
              </p>
              <div className="flex items-end justify-between">
                <span className="text-[20px] font-bold text-slate-700">
                  {projects.length}
                </span>
              </div>
            </div>

            <div className="bg-surface-main dark:bg-inverse-surface p-md border border-border-subtle dark:border-outline-variant rounded-xl shadow-sm">
              <p className="text-label-md font-label-md text-on-surface-variant dark:text-surface-variant mb-xs uppercase tracking-wider text-[10px]">
                Completed
              </p>
              <div className="flex items-end justify-between">
                <span className="text-[20px] font-bold text-slate-700">
                  {projects.filter((p) => p.status === "Completed").length}
                </span>
              </div>
            </div>

            <div className="bg-surface-main dark:bg-inverse-surface p-md border border-border-subtle dark:border-outline-variant rounded-xl shadow-sm">
              <p className="text-label-md font-label-md text-on-surface-variant dark:text-surface-variant mb-xs uppercase tracking-wider text-[10px]">
                Team Efficiency
              </p>
              <div className="flex items-end justify-between">
                <span className="text-[20px] font-bold text-slate-700">
                  94%
                </span>
                <div className="flex -space-x-2 select-none">
                  <div className="w-6 h-6 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-slate-100"></div>
                  <div className="w-6 h-6 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-slate-200"></div>
                </div>
              </div>
            </div>

            <div className="bg-surface-main dark:bg-inverse-surface p-md border border-border-subtle dark:border-outline-variant rounded-xl shadow-sm">
              <p className="text-label-md font-label-md text-on-surface-variant dark:text-surface-variant mb-xs uppercase tracking-wider text-[10px]">
                Next Deadline
              </p>
              <div className="flex items-end justify-between">
                <span className="text-[20px] font-bold text-slate-700">
                  02d 14h
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-sunken dark:bg-inverse-surface border-b border-border-subtle dark:border-outline-variant select-none">
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant dark:text-surface-variant uppercase tracking-wider">
                      Project Name
                    </th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant dark:text-surface-variant uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant dark:text-surface-variant uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant dark:text-surface-variant uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant dark:text-surface-variant uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle dark:divide-outline-variant">
                  {paginatedProjects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-surface-container-lowest dark:hover:bg-on-surface-variant/20 transition-colors group">
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-md">
                          <div className={`w-10 h-10 rounded-lg ${proj.iconBg} flex items-center justify-center shrink-0`}>
                            <span className="material-symbols-outlined">{proj.icon}</span>
                          </div>
                          <div>
                            <Link to={`/project-details/${proj.id}`} className="font-title-md text-title-md text-text-heading dark:text-surface-main font-bold hover:text-primary dark:hover:text-inverse-primary transition-colors">
                              {proj.name}
                            </Link>
                            <p className="text-body-sm text-on-surface-variant dark:text-surface-variant">
                              {proj.department}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-md">
                        <span className={`inline-flex items-center gap-xs px-sm py-1 rounded-full font-label-md text-label-md font-semibold ${proj.statusColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${proj.dotColor}`}></span>
                          {proj.status}
                        </span>
                      </td>
                      <td className="px-lg py-md">
                        <div className="flex -space-x-2 select-none">
                          {proj.team.map((t, idx) => (
                            <img
                              key={idx}
                              className="w-8 h-8 rounded-full border-2 border-surface-main dark:border-inverse-surface object-cover"
                              alt={t.alt}
                              src={t.avatar}
                            />
                          ))}
                          {proj.teamCount > proj.team.length && (
                            <div className="w-8 h-8 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-surface-container-high dark:bg-on-surface-variant flex items-center justify-center text-[10px] font-bold text-on-surface dark:text-surface-main">
                              +{proj.teamCount - proj.team.length}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-lg py-md">
                        <div className="w-full max-w-[160px]">
                          <div className="flex items-center justify-between mb-1 select-none">
                            <span className="text-body-sm font-medium text-on-surface dark:text-surface-main">
                              {proj.progress}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-surface-sunken dark:bg-on-surface-variant/30 rounded-full overflow-hidden">
                            <div
                              className="progress-fill h-full bg-primary dark:bg-inverse-primary"
                              style={{ width: `${proj.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-md text-right">
                        <div className="flex items-center justify-end gap-sm">
                          <button
                            onClick={() => handleEdit(proj)}
                            className="p-2 rounded-lg text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/50 transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(proj.id)}
                            className="p-2 rounded-lg text-error hover:bg-error-container/30 transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {paginatedProjects.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-lg py-12 text-center text-on-surface-variant dark:text-surface-variant">
                        No projects match the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-lg py-md bg-surface-sunken dark:bg-inverse-surface border-t border-border-subtle dark:border-outline-variant flex items-center justify-between select-none">
              <span className="text-body-sm text-on-surface-variant dark:text-surface-variant">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProjects.length)} of {filteredProjects.length} projects
              </span>
              <div className="flex items-center gap-sm">
                <button
                  className="p-2 border border-border-subtle dark:border-outline-variant rounded-lg bg-surface-main dark:bg-inverse-surface text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/50 disabled:opacity-50 cursor-pointer"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded-lg font-label-md text-label-md font-bold cursor-pointer ${
                      currentPage === idx + 1
                        ? "bg-primary text-white"
                        : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  className="p-2 border border-border-subtle dark:border-outline-variant rounded-lg bg-surface-main dark:bg-inverse-surface text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/50 disabled:opacity-50 cursor-pointer"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            <div className="lg:col-span-2 bg-surface-main dark:bg-inverse-surface p-lg border border-border-subtle dark:border-outline-variant rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-lg select-none">
                <h3 className="font-title-md text-title-md text-on-surface dark:text-surface-main font-bold">
                  Recent Activity
                </h3>
                <button className="text-primary dark:text-inverse-primary font-button-text text-button-text hover:underline cursor-pointer">
                  View All
                </button>
              </div>
              
              <div className="space-y-lg">
                <div className="flex gap-md">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-400 select-none">
                    <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  </div>
                  <div>
                    <p className="text-body-md text-text-heading dark:text-surface-main">
                      <span className="font-semibold">Sarah Jenkins</span> uploaded 4 new assets to{" "}
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">Mobile App V3.2</span>
                    </p>
                    <p className="text-body-sm text-on-surface-variant dark:text-surface-variant">2 hours ago</p>
                  </div>
                </div>

                <div className="flex gap-md">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center shrink-0 text-green-700 dark:text-green-400 select-none">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  </div>
                  <div>
                    <p className="text-body-md text-text-heading dark:text-surface-main">
                      <span className="font-semibold">Project Milestone</span> achieved: Beta Release of{" "}
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">Global Payroll Sync</span>
                    </p>
                    <p className="text-body-sm text-on-surface-variant dark:text-surface-variant">
                      Yesterday at 4:30 PM
                    </p>
                  </div>
                </div>

                <div className="flex gap-md">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/20 flex items-center justify-center shrink-0 text-orange-700 dark:text-orange-400 select-none">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                  </div>
                  <div>
                    <p className="text-body-md text-text-heading dark:text-surface-main">
                      <span className="font-semibold">System Alert:</span> Budget overrun detected on{" "}
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">Quantum API Gateway</span>
                    </p>
                    <p className="text-body-sm text-on-surface-variant dark:text-surface-variant">Oct 12, 2023</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-main dark:bg-inverse-surface p-lg border border-border-subtle dark:border-outline-variant rounded-xl shadow-sm flex flex-col">
              <h3 className="font-title-md text-title-md text-on-surface dark:text-surface-main font-bold mb-lg select-none">
                Workload Distribution
              </h3>
              
              <div className="space-y-md flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-body-md text-on-surface dark:text-surface-main">Engineering</span>
                  <span className="text-slate-500 bg-slate-100 text-[10px] font-bold px-2 py-0.5 rounded">
                    42%
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-sunken dark:bg-on-surface-variant/30 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-500 rounded-full transition-all duration-1000" style={{ width: "42%" }}></div>
                </div>

                <div className="flex items-center justify-between pt-base">
                  <span className="text-body-md text-on-surface dark:text-surface-main">Product Design</span>
                  <span className="text-slate-500 bg-slate-100 text-[10px] font-bold px-2 py-0.5 rounded">
                    28%
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-sunken dark:bg-on-surface-variant/30 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full transition-all duration-1000" style={{ width: "28%" }}></div>
                </div>

                <div className="flex items-center justify-between pt-base">
                  <span className="text-body-md text-on-surface dark:text-surface-main">Marketing</span>
                  <span className="text-slate-500 bg-slate-100 text-[10px] font-bold px-2 py-0.5 rounded">
                    15%
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-sunken dark:bg-on-surface-variant/30 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-300 rounded-full transition-all duration-1000" style={{ width: "15%" }}></div>
                </div>

                <div className="flex items-center justify-between pt-base">
                  <span className="text-body-md text-on-surface dark:text-surface-main">Quality Assurance</span>
                  <span className="text-slate-500 bg-slate-100 text-[10px] font-bold px-2 py-0.5 rounded">
                    15%
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-sunken dark:bg-on-surface-variant/30 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full transition-all duration-1000" style={{ width: "15%" }}></div>
                </div>
              </div>
              
              <button 
                onClick={() => alert("Optimizing workload distribution across teams...")}
                className="mt-lg w-full py-sm border border-border-subtle dark:border-outline-variant rounded-lg text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/50 transition-all font-button-text text-button-text cursor-pointer bg-white dark:bg-inverse-surface"
              >
                Optimize Team
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-md shrink-0 animate-fade-in">
          <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant w-full max-w-[448px] rounded-xl p-lg shadow-xl text-left">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="font-headline-md text-headline-md text-text-heading dark:text-surface-main font-bold">
                Create New Project
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/50 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="space-y-md">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant" htmlFor="proj_name">
                  Project Name
                </label>
                <input
                  id="proj_name"
                  className="w-full h-11 px-md bg-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface dark:text-surface-main"
                  placeholder=""
                  type="text"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant" htmlFor="proj_dept">
                  Department / Tech Area
                </label>
                <input
                  id="proj_dept"
                  className="w-full h-11 px-md bg-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface dark:text-surface-main"
                  placeholder=""
                  type="text"
                  value={newProjDept}
                  onChange={(e) => setNewProjDept(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant" htmlFor="proj_progress">
                    Initial Progress (%)
                  </label>
                  <input
                    id="proj_progress"
                    className="w-full h-11 px-md bg-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface dark:text-surface-main"
                    type="number"
                    min="0"
                    max="100"
                    value={newProjProgress}
                    onChange={(e) => setNewProjProgress(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant dark:text-surface-variant" htmlFor="proj_status">
                    Status
                  </label>
                  <select
                    id="proj_status"
                    className="w-full h-11 px-md bg-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-on-surface dark:text-surface-main cursor-pointer"
                    value={newProjStatus}
                    onChange={(e) => setNewProjStatus(e.target.value)}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-primary text-white font-button-text text-button-text rounded-lg shadow-md hover:bg-surface-tint active:scale-[0.98] transition-all flex items-center justify-center gap-xs cursor-pointer"
              >
                <span className="material-symbols-outlined">add</span> Create Project
              </button>
            </form>
          </div>
        </div>
      )}
    </DoubleSidebarLayout>
  );
}
