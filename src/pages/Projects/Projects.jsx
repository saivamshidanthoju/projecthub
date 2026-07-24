import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const initialProjects = [
  {
    id: "proj-1",
    name: "Quantum API Gateway",
    department: "Architecture & DevOps",
    status: "In Progress",
    statusColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30",
    dotColor: "bg-blue-500",
    progress: 68,
    icon: "terminal",
    iconBg: "bg-primary-fixed-dim text-primary",
    team: [
      { avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbPqIgzUkRwtIdNG1R29HJH2HeI-6sfy-XfeHCrbnajiXzp2EoqkmsR63YCtYrfTkYmLVKdtu2UAG2pJX_xsiGs14Uw_v40EOI5wnMC-zUjUFxM2JEKxs1LHB0UXwtkmPyVwDz5uR94z54KByQjtLSNDQjQstHMCOS-Ng5MNQ7N3u_fStiuomy4tnaCTA21Ikuu1zfjZA4t_Yx3KLTOSapy31XD5tFIwuYal_B8uIM4gZ118CQ3Gr0hqKvWrQgGfZ378211N9p7KU", alt: "Designer profile." },
      { avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUat5_p3l9_yN33nXkr2pdpHSZ0PqrjN_xaVhcqJzaXaIHMaCEjUfBlfL3hdZkhjraIFXom0Jz2QNUCORVitN7cS03UfwgKPK5rlHrJfUBTlFgqwjod9I8WcvGiLND2yiWikd4rTDPz5izaW3AITyrK2BdZ-ooVISnnaBi3AmFHBgrq_UaYlmIhOIRyMz5N8QNFUidlLX9JldmH7fyjizUeZhJBYjoIk_bL30tAuoly3NlLDjHcPujzERaq1bdnLHKVyMbw9ncs5s", alt: "Engineer profile." },
      { avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgj5wZ-voOKiP6pJgwUtyekehWkhfKkLzvQewUyadf38WXRqimzJLv5lUoTb0NiRy4vUXRwl68d-7SQGvutojuc6X9WopstI5UOuw-fq1LIJ5Ejy2jsyjxcALYjOFLbZZE8MARMsLBJEUlgB825GRRlb4a9gQn4Kyw554nOujTW5eBCaN_G79PB2eOR4WrbeejIyJL6-GKMnY1T2I8lv-o27JXNkapk1Jl3DNTPEI1-2gmEYHzJjHMzQUny0yIDHATaWUpKMT-G-Q", alt: "Manager profile." }
    ],
    teamCount: 5
  },
  {
    id: "proj-2",
    name: "Global Payroll Sync",
    department: "FinTech Services",
    status: "Completed",
    statusColor: "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-800/30",
    dotColor: "bg-green-500",
    progress: 100,
    icon: "verified",
    iconBg: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
    team: [
      { avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsUUnw7i5i_7tG1_vXMF19zFx0LjNOFoA_KDxw87IxRnb7YvkmIsIflyqZpBbtEvMy7td3IqzkMWD5YFqD1iziKhR-7vZbHDDeUu1w5q9W51Ny7IsiFKbtIZryEEkf9MJu6SaHhysovbvEgMOhZ9Es_Edehu82b-wvZdfFeZP_UVWiz1SFr5-an6haTDZD_nqvPT3xoAszW5gmJowGUPX3aV0hdhsX2sN-pfKPItcnP_n_rweW3kt5zYVDCc5oQMfUlqKbJ-qaqOA", alt: "Senior dev." },
      { avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrhE-ZqgaG_64e86a02XXPN33-XTyj3nV9V4oamzoyuyk71bmQPxRV0VK_ZjqcvvM7Jz0cdeJiYTapaeLCMvB1SLn1FxEoIJYjMIREeIKnmNTGY2VgTywMQP0mAZfokf-K0qRmtoMQVwbB314xEr4i85pOlR_toVhAoLtzXHyyMeyCQ_kr4F-8FpXaoulr4K0l8IerG7dFZ-TG0_lzk0TcKqFHcOlwderpXj9GWQ-gSrc7bqyOkODKYoHka4WLlcKeOp251FwUMtc", alt: "Executive profile." }
    ],
    teamCount: 2
  },
  {
    id: "proj-3",
    name: "Mobile App V3.2",
    department: "Product Design",
    status: "Delayed",
    statusColor: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800/30",
    dotColor: "bg-orange-500",
    progress: 42,
    icon: "warning",
    iconBg: "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400",
    team: [
      { avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUyaJkr7SHRV8yjdiddsVpk06Lk4HTQsjMIIuQsDijRweZGImU8TQyo0jhw2tAJ5NabUfERw-_VeNvTzMIPpKNEhMSkhgGNouFmHnatDpddRfCuau7KxQn0NDEXaYcl8IigrQbZquFGJ69_eH0MX4TC8t0-Dru1U1ZVtbid6DJ5Xr0J5H2mxfTZnAsks1ToT5mvxQ-AzEYmOxnWskhVZctrf-mqv87XeyeLEOOI7OYVzAnHveA9kI1eRAnhF2FenxXeBJ-3GGxrs8", alt: "Employee profile." },
      { avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0ZMC4bLPBY5sHk513LerfSXmsQJ1yddWsCNBQnvnBcG132jnM5JYLmKRWPJ4jXHgv26EGvHtDi_hA8EAq8XG2wRThnrvvkgHAR2_eNSLn2TMTa-SY_Qad1x24rOyO6hVZD-JYFYAMWpMBR2MGSy18yCIvjlmR7jlEJOmIGEiIIG8HE0D6IzrwiLsatsC2SQpM85WgJofgPoP7CLCmVf1S1U84UZYvR7x76wPpXOIaFppRmeH0V8ngINnhWgwKWsE7x2xQyvASgKw", alt: "Dev profile." },
      { avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAq19h2Nu2kZ1pdqR_OD5c-1TFWCk3GmMr7Sbh5FEXLs6qqjoibMFFaEELIzXC32AA3nSVsAKesUBWUfdhYiDJgx2OZ4DyzdS1_vChC98MvBCemrRdP6ptMK-Z_RWnYKqL3zPWYDWRuiDu5oLpuIAW79gvp0Raf-o-XOPSFb7ATICVrlH5DdMPETmzN-vumuHIUA1yZFmEi8aFbabO2kTZtbAmWYJG4SN8RBcMgvNyOR-eOOP-2OHp9HkAAt7SbNNfU-jG40ipWPk", alt: "Specialist profile." }
    ],
    teamCount: 3
  },
  {
    id: "proj-4",
    name: "AI Content Generator",
    department: "Machine Learning",
    status: "In Progress",
    statusColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30",
    dotColor: "bg-blue-500",
    progress: 15,
    icon: "analytics",
    iconBg: "bg-primary-container text-white",
    team: [
      { avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrgOGox-8RV_ptsWcAv4RsB9UvqvVaGU8yZB9d5HIGRmKJ9FLJlTj5HT87t-NAeh2Uk7f1uX2s9GrnSSxiG18i92qwzrrRzt3wk6hteIi_kwak4pnQQLhiy71J9cMJ77YbekxBZRtiEkC9JpEI_yDU1hbZNsx46ICKpxa0y5lf-Daig3mLRHN6U9tuLYOb5_OKCgJ-4alGJgEH0H-D_ZwNyHuPs2KiAdYPReIBgB6fRu_EiKwByA49YpaXxmkJMpdudFeaEyidYa0", alt: "Scientist profile." }
    ],
    teamCount: 2
  }
];

export default function Projects() {
  const [projects, setProjects] = useState(initialProjects);
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states for creating project
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjDept, setNewProjDept] = useState("");
  const [newProjProgress, setNewProjProgress] = useState(0);
  const [newProjStatus, setNewProjStatus] = useState("In Progress");

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleEdit = (proj) => {
    const nextName = prompt("Edit Project Name:", proj.name);
    if (nextName !== null && nextName.trim() !== "") {
      setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, name: nextName } : p));
    }
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    const statusConfig = {
      "In Progress": {
        bg: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30",
        dot: "bg-blue-500",
        icon: "terminal",
        iconBg: "bg-primary-fixed-dim text-primary"
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
      }
    };

    const cfg = statusConfig[newProjStatus];

    const newProject = {
      id: `proj-${Date.now()}`,
      name: newProjName,
      department: newProjDept || "General Operations",
      status: newProjStatus,
      statusColor: cfg.bg,
      dotColor: cfg.dot,
      progress: parseInt(newProjProgress) || 0,
      icon: cfg.icon,
      iconBg: cfg.iconBg,
      team: [
        { avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhWu7pf7Sg0mF1V6vNZwDKTyfP0KV__-dOdcKEqS7WZURnF0ws8PSeZ3Ay2_Jz8-0cmYqSyrfo2WQuwO1VvCpl1TYiZi0Sc0lrVrQJyxIw1YEpj1LXc7TBICjwt9rcOtY7JSzFjxrLrYzzKiPtt7MyGR4YUYS1gyM5geYn6Aj0U-tEsiID7A0mA3j4VRc7NPMvZkM-d8f1inRtHLl9AvQA-U5Z5nYnGLPqAY13xKRJ8mEFDfkPDi0vNOg6S9UX-CaYAqgtKji7qTM", alt: "User Avatar." }
      ],
      teamCount: 1
    };

    setProjects(prev => [...prev, newProject]);
    setNewProjName("");
    setNewProjDept("");
    setNewProjProgress(0);
    setNewProjStatus("In Progress");
    setIsModalOpen(false);
  };

  const filteredProjects = projects.filter(p => {
    if (filterStatus === "All") return true;
    return p.status === filterStatus;
  });

  return (
    <div className="bg-surface-sunken dark:bg-inverse-surface text-on-surface w-full min-h-screen overflow-x-hidden flex">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header Component */}
        <Header />

        {/* Content Area */}
        <div className="p-margin-desktop flex flex-col gap-lg max-w-[1440px] mx-auto w-full bg-surface-sunken dark:bg-surface-dim">
          {/* Page Header & Actions */}
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
              <div className="relative">
                <select
                  className="flex items-center gap-sm px-md h-10 border border-border-subtle dark:border-outline-variant rounded-lg bg-surface-main dark:bg-inverse-surface text-on-surface-variant dark:text-surface-variant outline-none hover:bg-surface-container-low transition-all cursor-pointer font-button-text text-button-text"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
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

          {/* Dashboard Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            <div className="bg-surface-main dark:bg-inverse-surface p-md border border-border-subtle dark:border-outline-variant rounded-xl shadow-sm">
              <p className="text-label-md font-label-md text-on-surface-variant dark:text-surface-variant mb-xs uppercase tracking-wider text-[10px]">
                Total Projects
              </p>
              <div className="flex items-end justify-between">
                <span className="text-headline-md font-headline-md text-on-surface dark:text-surface-main">
                  {projects.length}
                </span>
                <span className="text-primary dark:text-inverse-primary text-xs font-medium bg-surface-container-low dark:bg-on-surface-variant/30 px-2 py-0.5 rounded-full select-none">
                  +12%
                </span>
              </div>
            </div>

            <div className="bg-surface-main dark:bg-inverse-surface p-md border border-border-subtle dark:border-outline-variant rounded-xl shadow-sm">
              <p className="text-label-md font-label-md text-on-surface-variant dark:text-surface-variant mb-xs uppercase tracking-wider text-[10px]">
                Completed
              </p>
              <div className="flex items-end justify-between">
                <span className="text-headline-md font-headline-md text-on-surface dark:text-surface-main">
                  {projects.filter(p => p.status === "Completed").length}
                </span>
                <span className="text-green-600 dark:text-green-400 text-xs font-medium bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full select-none">
                  Record
                </span>
              </div>
            </div>

            <div className="bg-surface-main dark:bg-inverse-surface p-md border border-border-subtle dark:border-outline-variant rounded-xl shadow-sm">
              <p className="text-label-md font-label-md text-on-surface-variant dark:text-surface-variant mb-xs uppercase tracking-wider text-[10px]">
                Team Efficiency
              </p>
              <div className="flex items-end justify-between">
                <span className="text-headline-md font-headline-md text-on-surface dark:text-surface-main">
                  94%
                </span>
                <div className="flex -space-x-2 select-none">
                  <div className="w-6 h-6 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-blue-100"></div>
                  <div className="w-6 h-6 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-blue-200"></div>
                </div>
              </div>
            </div>

            <div className="bg-surface-main dark:bg-inverse-surface p-md border border-border-subtle dark:border-outline-variant rounded-xl shadow-sm border-l-4 border-l-primary">
              <p className="text-label-md font-label-md text-on-surface-variant dark:text-surface-variant mb-xs uppercase tracking-wider text-[10px]">
                Next Deadline
              </p>
              <div className="flex items-end justify-between">
                <span className="text-headline-md font-headline-md text-primary dark:text-inverse-primary">
                  02d 14h
                </span>
                <span className="material-symbols-outlined text-primary dark:text-inverse-primary select-none">
                  timer
                </span>
              </div>
            </div>
          </div>

          {/* Data Table Section */}
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
                  {filteredProjects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-surface-container-lowest dark:hover:bg-on-surface-variant/20 transition-colors group">
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-md">
                          <div className={`w-10 h-10 rounded-lg ${proj.iconBg} flex items-center justify-center shrink-0`}>
                            <span className="material-symbols-outlined">{proj.icon}</span>
                          </div>
                          <div>
                            <Link to="/project-details" className="font-title-md text-title-md text-text-heading dark:text-surface-main font-bold hover:text-primary dark:hover:text-inverse-primary transition-colors">
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
                  
                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-lg py-12 text-center text-on-surface-variant dark:text-surface-variant">
                        No projects match the selected status filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-lg py-md bg-surface-sunken dark:bg-inverse-surface border-t border-border-subtle dark:border-outline-variant flex items-center justify-between select-none">
              <span className="text-body-sm text-on-surface-variant dark:text-surface-variant">
                Showing 1 to {filteredProjects.length} of {filteredProjects.length} projects
              </span>
              <div className="flex items-center gap-sm">
                <button
                  className="p-2 border border-border-subtle dark:border-outline-variant rounded-lg bg-surface-main dark:bg-inverse-surface text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/50 disabled:opacity-50 cursor-pointer"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-white font-label-md text-label-md font-bold">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/50 font-label-md text-label-md cursor-pointer">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/50 font-label-md text-label-md cursor-pointer">
                  3
                </button>
                <button className="p-2 border border-border-subtle dark:border-outline-variant rounded-lg bg-surface-main dark:bg-inverse-surface text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/50 cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bento Content Below (Additional Insights) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {/* Activity Feed Card */}
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
                  <div className="w-8 h-8 rounded-full bg-primary-fixed-dim dark:bg-on-primary-fixed-variant flex items-center justify-center shrink-0 text-primary dark:text-inverse-primary select-none">
                    <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  </div>
                  <div>
                    <p className="text-body-md text-text-heading dark:text-surface-main">
                      <span className="font-semibold">Sarah Jenkins</span> uploaded 4 new assets to{" "}
                      <span className="text-primary dark:text-inverse-primary font-medium">Mobile App V3.2</span>
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
                      <span className="text-primary dark:text-inverse-primary font-medium">Global Payroll Sync</span>
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
                      <span className="text-primary dark:text-inverse-primary font-medium">Quantum API Gateway</span>
                    </p>
                    <p className="text-body-sm text-on-surface-variant dark:text-surface-variant">Oct 12, 2023</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Workload Card */}
            <div className="bg-surface-main dark:bg-inverse-surface p-lg border border-border-subtle dark:border-outline-variant rounded-xl shadow-sm flex flex-col">
              <h3 className="font-title-md text-title-md text-on-surface dark:text-surface-main font-bold mb-lg select-none">
                Workload Distribution
              </h3>
              
              <div className="space-y-md flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-body-md text-on-surface dark:text-surface-main">Engineering</span>
                  <span className="font-label-md text-label-md bg-surface-container-high dark:bg-on-surface-variant text-on-surface-variant dark:text-surface-main px-2 py-0.5 rounded font-bold">
                    42%
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-sunken dark:bg-on-surface-variant/30 rounded-full overflow-hidden">
                  <div className="h-full bg-primary dark:bg-inverse-primary rounded-full transition-all duration-1000" style={{ width: "42%" }}></div>
                </div>

                <div className="flex items-center justify-between pt-base">
                  <span className="text-body-md text-on-surface dark:text-surface-main">Product Design</span>
                  <span className="font-label-md text-label-md bg-surface-container-high dark:bg-on-surface-variant text-on-surface-variant dark:text-surface-main px-2 py-0.5 rounded font-bold">
                    28%
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-sunken dark:bg-on-surface-variant/30 rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary-container dark:bg-tertiary rounded-full transition-all duration-1000" style={{ width: "28%" }}></div>
                </div>

                <div className="flex items-center justify-between pt-base">
                  <span className="text-body-md text-on-surface dark:text-surface-main">Marketing</span>
                  <span className="font-label-md text-label-md bg-surface-container-high dark:bg-on-surface-variant text-on-surface-variant dark:text-surface-main px-2 py-0.5 rounded font-bold">
                    15%
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-sunken dark:bg-on-surface-variant/30 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary dark:bg-secondary-fixed-dim rounded-full transition-all duration-1000" style={{ width: "15%" }}></div>
                </div>

                <div className="flex items-center justify-between pt-base">
                  <span className="text-body-md text-on-surface dark:text-surface-main">Quality Assurance</span>
                  <span className="font-label-md text-label-md bg-surface-container-high dark:bg-on-surface-variant text-on-surface-variant dark:text-surface-main px-2 py-0.5 rounded font-bold">
                    15%
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-sunken dark:bg-on-surface-variant/30 rounded-full overflow-hidden">
                  <div className="h-full bg-surface-tint dark:bg-on-primary-fixed-variant rounded-full transition-all duration-1000" style={{ width: "15%" }}></div>
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
      </main>

      {/* Modal Dialog for Creating Project */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-md">
          <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant w-full max-w-[448px] rounded-2xl p-lg shadow-xl animate-fade-in text-left">
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
                  className="w-full h-11 px-md bg-surface-sunken dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface dark:text-surface-main"
                  placeholder="e.g. Nexus CRM Redesign"
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
                  className="w-full h-11 px-md bg-surface-sunken dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface dark:text-surface-main"
                  placeholder="e.g. Frontend Development"
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
                    className="w-full h-11 px-md bg-surface-sunken dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-on-surface dark:text-surface-main"
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
                    className="w-full h-11 px-md bg-surface-sunken dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-on-surface dark:text-surface-main cursor-pointer"
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
                className="w-full h-12 bg-primary text-white font-button-text text-button-text rounded-xl shadow-md hover:bg-surface-tint active:scale-[0.98] transition-all flex items-center justify-center gap-xs cursor-pointer"
              >
                <span className="material-symbols-outlined">add</span> Create Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
