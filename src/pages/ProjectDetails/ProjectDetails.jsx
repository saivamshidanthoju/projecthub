import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const initialMilestones = [
  {
    id: "m-1",
    title: "Requirement Analysis",
    date: "Sep 15, 2023",
    status: "Completed",
    statusBg: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-800/30",
    desc: "Establish core functional constraints, API contracts, and tenant separation requirements."
  },
  {
    id: "m-2",
    title: "Gateway Architecture Core",
    date: "Oct 05, 2023",
    status: "Completed",
    statusBg: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-800/30",
    desc: "Build telemetry middleware, JWT signature validation, and routing engine prototype."
  },
  {
    id: "m-3",
    title: "Performance & Security Audit",
    date: "Oct 28, 2023",
    status: "In Progress",
    statusBg: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30",
    desc: "Load test routing throughput (target 50k req/sec) and verify endpoint isolation guards."
  },
  {
    id: "m-4",
    title: "Multi-Region Cloud Deployment",
    date: "Nov 20, 2023",
    status: "Pending",
    statusBg: "bg-surface-sunken text-on-surface-variant dark:bg-inverse-surface dark:text-surface-variant border border-border-subtle dark:border-outline-variant",
    desc: "Deploy highly-available clusters to AWS, GCP, and Cloudflare Edge nodes."
  }
];

export default function ProjectDetails() {
  const [milestones, setMilestones] = useState(initialMilestones);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock project metadata
  const project = {
    name: "Quantum API Gateway",
    code: "PJ-ALPHA",
    department: "Architecture & DevOps",
    health: "Healthy",
    healthBg: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-800/30",
    priority: "Critical",
    priorityBg: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-800/30",
    status: "In Progress",
    statusBg: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30",
    progress: 68,
    description: "Quantum API Gateway is a central high-speed routing fabric designed to manage, protect, and throttle client communication across multi-tenant clusters. The gateway integrates telemetry middleware, caching configurations, global JWT validation rules, and automated DDoS rate-limiting guards.",
    budget: { spent: 42800, total: 60000 },
    stats: {
      openTasks: 5,
      completedTasks: 18,
      velocity: 94
    },
    team: [
      { name: "Alex Rivera", role: "Lead Architect", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUat5_p3l9_yN33nXkr2pdpHSZ0PqrjN_xaVhcqJzaXaIHMaCEjUfBlfL3hdZkhjraIFXom0Jz2QNUCORVitN7cS03UfwgKPK5rlHrJfUBTlFgqwjod9I8WcvGiLND2yiWikd4rTDPz5izaW3AITyrK2BdZ-ooVISnnaBi3AmFHBgrq_UaYlmIhOIRyMz5N8QNFUidlLX9JldmH7fyjizUeZhJBYjoIk_bL30tAuoly3NlLDjHcPujzERaq1bdnLHKVyMbw9ncs5s" },
      { name: "Sarah Jenkins", role: "DevOps Engineer", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgj5wZ-voOKiP6pJgwUtyekehWkhfKkLzvQewUyadf38WXRqimzJLv5lUoTb0NiRy4vUXRwl68d-7SQGvutojuc6X9WopstI5UOuw-fq1LIJ5Ejy2jsyjxcALYjOFLbZZE8MARMsLBJEUlgB825GRRlb4a9gQn4Kyw554nOujTW5eBCaN_G79PB2eOR4WrbeejIyJL6-GKMnY1T2I8lv-o27JXNkapk1Jl3DNTPEI1-2gmEYHzJjHMzQUny0yIDHATaWUpKMT-G-Q" },
      { name: "David Chen", role: "Security Auditor", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbPqIgzUkRwtIdNG1R29HJH2HeI-6sfy-XfeHCrbnajiXzp2EoqkmsR63YCtYrfTkYmLVKdtu2UAG2pJX_xsiGs14Uw_v40EOI5wnMC-zUjUFxM2JEKxs1LHB0UXwtkmPyVwDz5uR94z54KByQjtLSNDQjQstHMCOS-Ng5MNQ7N3u_fStiuomy4tnaCTA21Ikuu1zfjZA4t_Yx3KLTOSapy31XD5tFIwuYal_B8uIM4gZ118CQ3Gr0hqKvWrQgGfZ378211N9p7KU" }
    ],
    resources: [
      { name: "API Gateway Specifications", size: "2.4 MB", type: "PDF Document", icon: "picture_as_pdf" },
      { name: "Architecture Diagram Layout", size: "12.8 MB", type: "SVG Schema", icon: "schema" },
      { name: "Rate Limiting Configuration", size: "14 KB", type: "JSON Script", icon: "settings_ethernet" }
    ]
  };

  const handleMilestoneToggle = (id) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === "Completed" ? "Pending" : m.status === "Pending" ? "In Progress" : "Completed";
        const bgMap = {
          "Completed": "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-800/30",
          "In Progress": "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30",
          "Pending": "bg-surface-sunken text-on-surface-variant dark:bg-inverse-surface dark:text-surface-variant border border-border-subtle dark:border-outline-variant"
        };
        return { ...m, status: nextStatus, statusBg: bgMap[nextStatus] };
      }
      return m;
    }));
  };

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
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-xs text-label-md font-label-md text-on-surface-variant dark:text-surface-variant mb-sm select-none">
            <Link className="hover:text-primary dark:hover:text-inverse-primary transition-colors" to="/dashboard">
              Dashboard
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link className="hover:text-primary dark:hover:text-inverse-primary transition-colors" to="/projects">
              Projects
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-on-surface dark:text-surface-main font-semibold">{project.name}</span>
          </nav>

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-md border-b border-border-subtle dark:border-outline-variant pb-lg">
            <div>
              <div className="flex flex-wrap items-center gap-sm mb-xs select-none">
                <span className="font-label-md text-label-md px-md py-0.5 rounded bg-primary-fixed-dim text-primary dark:bg-on-primary-fixed-variant dark:text-inverse-primary font-bold">
                  {project.code}
                </span>
                <span className={`px-sm py-0.5 rounded-full text-body-sm font-semibold ${project.healthBg}`}>
                  Health: {project.health}
                </span>
                <span className={`px-sm py-0.5 rounded-full text-body-sm font-semibold ${project.priorityBg}`}>
                  Priority: {project.priority}
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-text-heading dark:text-surface-main">
                {project.name}
              </h2>
              <p className="text-on-surface-variant dark:text-surface-variant font-body-md mt-1">
                Managed by <span className="font-semibold text-on-surface dark:text-surface-main">{project.department}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-sm">
              <Link 
                to="/tasks"
                className="flex items-center gap-xs px-md py-sm bg-primary text-white rounded-lg font-button-text text-button-text hover:brightness-110 active:scale-95 shadow-md transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">check_box</span> View Tasks Board
              </Link>
              <button 
                onClick={() => alert("Project details successfully shared to Slack channel.")}
                className="flex items-center gap-xs px-md py-sm bg-white dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant text-on-surface-variant dark:text-surface-variant rounded-lg font-button-text text-button-text hover:bg-surface-container-low transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">share</span> Share
              </button>
            </div>
          </div>

          {/* Project Details Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            
            {/* Left Grid: Overview, Timeline, Resources */}
            <div className="lg:col-span-2 flex flex-col gap-lg">
              
              {/* Tab Navigation */}
              <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-xs flex gap-xs select-none shadow-sm">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 py-sm text-center rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                    activeTab === "overview"
                      ? "bg-primary text-white font-bold"
                      : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/40"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("milestones")}
                  className={`flex-1 py-sm text-center rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                    activeTab === "milestones"
                      ? "bg-primary text-white font-bold"
                      : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/40"
                  }`}
                >
                  Milestones ({milestones.length})
                </button>
                <button
                  onClick={() => setActiveTab("resources")}
                  className={`flex-1 py-sm text-center rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                    activeTab === "resources"
                      ? "bg-primary text-white font-bold"
                      : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/40"
                  }`}
                >
                  Files & Docs ({project.resources.length})
                </button>
              </div>

              {/* Tab: Overview */}
              {activeTab === "overview" && (
                <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm space-y-lg">
                  <div>
                    <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main mb-md font-bold">
                      Project Description
                    </h3>
                    <p className="font-body-lg text-body-lg text-text-body dark:text-surface-variant leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="border-t border-border-subtle dark:border-outline-variant pt-lg">
                    <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main mb-md font-bold select-none">
                      Progress Context
                    </h3>
                    <div className="flex items-center gap-md">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-body-md text-on-surface-variant dark:text-surface-variant">Completion rate</span>
                          <span className="font-headline-md text-headline-md text-primary dark:text-inverse-primary">{project.progress}%</span>
                        </div>
                        <div className="w-full h-3 bg-surface-sunken dark:bg-on-surface-variant/30 rounded-full overflow-hidden">
                          <div className="h-full bg-primary dark:bg-inverse-primary rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border-subtle dark:border-outline-variant pt-lg">
                    <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main mb-md font-bold select-none">
                      Key Objective
                    </h3>
                    <ul className="space-y-sm font-body-md text-body-md text-text-body dark:text-surface-variant">
                      <li className="flex items-start gap-sm">
                        <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">check_circle</span>
                        Deploy dynamic CORS rules, certificate headers, and SSL binding configurations.
                      </li>
                      <li className="flex items-start gap-sm">
                        <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">check_circle</span>
                        Support token rotation protocols and rate throttling by consumer IP address.
                      </li>
                      <li className="flex items-start gap-sm">
                        <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">check_circle</span>
                        Reduce proxy overhead latency below 4 milliseconds on edge nodes.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab: Milestones */}
              {activeTab === "milestones" && (
                <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm space-y-lg">
                  <div className="flex justify-between items-center select-none">
                    <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main font-bold">
                      Development Milestones
                    </h3>
                    <span className="text-body-sm text-on-surface-variant dark:text-surface-variant italic">
                      Click status tags to cycle state
                    </span>
                  </div>
                  
                  <div className="relative border-l-2 border-border-subtle dark:border-outline-variant ml-4 pl-lg space-y-xl py-xs">
                    {milestones.map((m) => (
                      <div key={m.id} className="relative">
                        {/* Dot indicator */}
                        <div className={`absolute -left-[35px] top-1.5 w-4 h-4 rounded-full border-2 border-surface-main dark:border-inverse-surface shadow-sm ${
                          m.status === "Completed" ? "bg-green-500" : m.status === "In Progress" ? "bg-blue-500" : "bg-outline-variant"
                        }`}></div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-xs mb-sm">
                          <div>
                            <h4 className="font-title-md text-title-md text-text-heading dark:text-surface-main font-bold">
                              {m.title}
                            </h4>
                            <span className="text-body-sm text-on-surface-variant dark:text-surface-variant font-medium">
                              {m.date}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleMilestoneToggle(m.id)}
                            className={`px-sm py-1 rounded-full font-label-md text-label-md font-semibold select-none cursor-pointer self-start sm:self-center transition-all hover:scale-105 ${m.statusBg}`}
                          >
                            {m.status}
                          </button>
                        </div>
                        
                        <p className="font-body-md text-body-md text-text-body dark:text-surface-variant">
                          {m.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Resources */}
              {activeTab === "resources" && (
                <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm space-y-lg">
                  <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main font-bold select-none">
                    Attached Files & Specs
                  </h3>
                  
                  <div className="divide-y divide-border-subtle dark:divide-outline-variant">
                    {project.resources.map((res, index) => (
                      <div key={index} className="flex items-center justify-between py-md first:pt-0 last:pb-0">
                        <div className="flex items-center gap-md">
                          <div className="w-10 h-10 rounded-lg bg-surface-sunken dark:bg-on-surface-variant/20 flex items-center justify-center text-primary dark:text-inverse-primary select-none">
                            <span className="material-symbols-outlined">{res.icon}</span>
                          </div>
                          <div>
                            <p className="font-title-md text-title-md text-text-heading dark:text-surface-main font-semibold hover:text-primary dark:hover:text-inverse-primary transition-colors cursor-pointer">
                              {res.name}
                            </p>
                            <p className="text-body-sm text-on-surface-variant dark:text-surface-variant">
                              {res.type} • {res.size}
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => alert(`Downloading ${res.name}...`)}
                          className="p-2 border border-border-subtle dark:border-outline-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/40 rounded-lg text-on-surface-variant dark:text-surface-variant transition-all cursor-pointer bg-white dark:bg-inverse-surface"
                        >
                          <span className="material-symbols-outlined text-[18px]">download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Grid: Metrics, Budget, Active Team */}
            <div className="flex flex-col gap-lg">
              
              {/* Stats Metrics Card */}
              <div className="bg-surface-main dark:bg-inverse-surface p-lg border border-border-subtle dark:border-outline-variant rounded-xl shadow-sm space-y-lg">
                <h3 className="font-title-md text-title-md text-on-surface dark:text-surface-main font-bold select-none border-b border-border-subtle dark:border-outline-variant pb-md">
                  Velocity & Metrics
                </h3>
                
                <div className="grid grid-cols-2 gap-md">
                  <div className="bg-surface-sunken dark:bg-on-surface-variant/20 p-md rounded-lg text-center select-none">
                    <span className="text-body-sm text-on-surface-variant dark:text-surface-variant uppercase tracking-wider block mb-1">
                      Completed
                    </span>
                    <span className="text-headline-md font-headline-md text-green-600 dark:text-green-400">
                      {project.stats.completedTasks}
                    </span>
                    <span className="text-xs text-on-surface-variant dark:text-surface-variant block mt-0.5">Tasks</span>
                  </div>
                  
                  <div className="bg-surface-sunken dark:bg-on-surface-variant/20 p-md rounded-lg text-center select-none">
                    <span className="text-body-sm text-on-surface-variant dark:text-surface-variant uppercase tracking-wider block mb-1">
                      Open Tasks
                    </span>
                    <span className="text-headline-md font-headline-md text-primary dark:text-inverse-primary">
                      {project.stats.openTasks}
                    </span>
                    <span className="text-xs text-on-surface-variant dark:text-surface-variant block mt-0.5">Remaining</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-xs">
                  <span className="text-body-md text-on-surface-variant dark:text-surface-variant select-none">Sprint Velocity</span>
                  <span className="font-headline-md text-headline-md text-primary dark:text-inverse-primary">{project.stats.velocity}%</span>
                </div>
                <div className="w-full h-2 bg-surface-sunken dark:bg-on-surface-variant/30 rounded-full overflow-hidden">
                  <div className="h-full bg-primary dark:bg-inverse-primary rounded-full transition-all duration-1000" style={{ width: `${project.stats.velocity}%` }}></div>
                </div>
              </div>

              {/* Budget Allocation Card */}
              <div className="bg-surface-main dark:bg-inverse-surface p-lg border border-border-subtle dark:border-outline-variant rounded-xl shadow-sm space-y-md">
                <h3 className="font-title-md text-title-md text-on-surface dark:text-surface-main font-bold select-none border-b border-border-subtle dark:border-outline-variant pb-md">
                  Budget Tracking
                </h3>
                
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-body-sm text-on-surface-variant dark:text-surface-variant block mb-0.5 select-none">
                      Spent to Date
                    </span>
                    <span className="text-headline-md font-headline-md text-on-surface dark:text-surface-main">
                      ${project.budget.spent.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-body-sm text-on-surface-variant dark:text-surface-variant block mb-0.5 select-none">
                      Total Allocation
                    </span>
                    <span className="text-title-md text-title-md text-on-surface-variant dark:text-surface-variant font-bold">
                      ${project.budget.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-surface-sunken dark:bg-on-surface-variant/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary dark:bg-inverse-primary rounded-full" 
                    style={{ width: `${(project.budget.spent / project.budget.total) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-body-sm text-on-surface-variant dark:text-surface-variant select-none">
                  <span>{((project.budget.spent / project.budget.total) * 100).toFixed(0)}% Utilized</span>
                  <span>${(project.budget.total - project.budget.spent).toLocaleString()} Remaining</span>
                </div>
              </div>

              {/* Active Team list */}
              <div className="bg-surface-main dark:bg-inverse-surface p-lg border border-border-subtle dark:border-outline-variant rounded-xl shadow-sm space-y-md">
                <h3 className="font-title-md text-title-md text-on-surface dark:text-surface-main font-bold select-none border-b border-border-subtle dark:border-outline-variant pb-md">
                  Active Team Members
                </h3>
                
                <div className="space-y-md">
                  {project.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-md">
                      <img
                        className="w-10 h-10 rounded-full object-cover border border-border-subtle dark:border-outline-variant"
                        alt={member.name}
                        src={member.avatar}
                      />
                      <div>
                        <p className="font-title-md text-title-md text-text-heading dark:text-surface-main font-semibold">
                          {member.name}
                        </p>
                        <p className="text-body-sm text-on-surface-variant dark:text-surface-variant">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
