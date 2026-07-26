import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { dashboardApi } from "../../lib/api";

export default function Reports() {
  const { token } = useAuth();
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [timePeriod, setTimePeriod] = useState("Last 30 Days");
  
  // Analytics State
  const [overview, setOverview] = useState(null);
  const [taskAnalytics, setTaskAnalytics] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const loadReportData = async () => {
    setIsLoading(true);
    try {
      const overviewData = await dashboardApi.overview(token);
      setOverview(overviewData);

      const taskData = await dashboardApi.tasks(token);
      setTaskAnalytics(taskData);

      const response = await fetch("http://localhost:5000/api/dashboard/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await response.json();
      setUserAnalytics(userData.data?.users);

    } catch (err) {
      console.error("Failed to load reports datasets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadReportData();
    }
  }, [token]);

  const handleSyncData = async () => {
    setIsSyncing(true);
    await loadReportData();
    setIsSyncing(false);
    showToast("Data synced successfully with master repositories! 🚀");
  };

  const handleExportCSV = () => {
    const list = userAnalytics?.mostActiveUsers || [];
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,Email,Role,Tasks Completed\n";
    list.forEach((p) => {
      csvContent += `"${p.first_name} ${p.last_name || ""}","${p.email}","${p.role_name}",${p.completed_count}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ProjectHub_Performance_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV report generated and download started! 📁");
  };

  const handlePrintPDF = () => {
    window.print();
  };

  // Values for team productivity: Velocity, Quality, Collaboration, Reliability, Communication
  const productivityStats = [85, 98, 75, 90, 80];
  const getPentagonPoints = (r) => {
    const cx = 100;
    const cy = 100;
    const angles = [-90, -18, 54, 126, 198];
    return angles
      .map((a) => {
        const rad = (a * Math.PI) / 180;
        return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`;
      })
      .join(" ");
  };

  const getProductivityPoints = () => {
    const cx = 100;
    const cy = 100;
    const angles = [-90, -18, 54, 126, 198];
    return angles
      .map((a, i) => {
        const r = (productivityStats[i] / 100) * 65;
        const rad = (a * Math.PI) / 180;
        return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`;
      })
      .join(" ");
  };

  const performers = userAnalytics?.mostActiveUsers || [];

  return (
    <div className="flex min-h-screen overflow-hidden bg-surface-sunken dark:bg-inverse-surface text-on-surface w-full">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative">
        <Header />

        {toastMessage && (
          <div className="absolute top-20 right-8 bg-inverse-surface text-surface-main dark:bg-surface-main dark:text-on-surface px-lg py-sm rounded-xl shadow-lg flex items-center gap-sm z-[999] border border-outline-variant/30 animate-fade-in font-body-sm text-[13px]">
            <span className="material-symbols-outlined text-emerald-500 font-bold">check_circle</span>
            {toastMessage}
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar p-margin-desktop space-y-xl bg-surface-sunken dark:bg-surface-dim">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface dark:text-surface-main font-bold">
                Reports & Analytics
              </h2>
              <p className="font-body-md text-on-surface-variant dark:text-surface-variant mt-xs">
                Real-time enterprise performance metrics and resource utilization.
              </p>
            </div>

            <div className="flex items-center gap-sm select-none">
              <button
                onClick={handlePrintPDF}
                className="flex items-center gap-xs px-md py-sm bg-white border border-border-subtle rounded-lg font-button-text hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                PDF
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-xs px-md py-sm bg-white border border-border-subtle rounded-lg font-button-text hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">description</span>
                CSV
              </button>
              <button
                onClick={handleSyncData}
                disabled={isSyncing}
                className="flex items-center gap-xs px-md py-sm bg-primary text-white rounded-lg font-button-text hover:brightness-110 shadow-sm active:scale-95 transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className={`material-symbols-outlined text-[18px] ${isSyncing ? "animate-spin" : ""}`}>
                  sync
                </span>
                {isSyncing ? "Syncing..." : "Sync Data"}
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-body-lg">Loading reports and graphs...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
                <div className="lg:col-span-8 bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle/70 dark:border-outline-variant/30 shadow-sm flex flex-col justify-between min-h-[340px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main">
                        Tasks Completed Over Time
                      </h3>
                      <p className="font-body-sm text-on-surface-variant dark:text-surface-variant mt-0.5">
                        Progress metrics tracking development throughput
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 relative flex items-end justify-between mt-lg h-48">
                    <svg className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <line x1="0" y1="20" x2="100" y2="20" stroke="var(--color-outline-variant)" strokeWidth="0.25" strokeDasharray="3" opacity="0.4" />
                      <line x1="0" y1="40" x2="100" y2="40" stroke="var(--color-outline-variant)" strokeWidth="0.25" strokeDasharray="3" opacity="0.4" />
                      <line x1="0" y1="60" x2="100" y2="60" stroke="var(--color-outline-variant)" strokeWidth="0.25" strokeDasharray="3" opacity="0.4" />
                      <line x1="0" y1="80" x2="100" y2="80" stroke="var(--color-outline-variant)" strokeWidth="0.25" strokeDasharray="3" opacity="0.4" />
                      <line x1="0" y1="99" x2="100" y2="99" stroke="var(--color-outline-variant)" strokeWidth="0.5" opacity="0.6" />

                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      
                      <g opacity="0.85">
                        <rect x="5.5" y="60" width="4" height="40" rx="1.5" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="0.5" />
                        <rect x="18" y="45" width="4" height="55" rx="1.5" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="0.5" />
                        <rect x="30.5" y="50" width="4" height="50" rx="1.5" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="0.5" />
                        <rect x="43" y="32" width="4" height="68" rx="1.5" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="0.5" />
                        <rect x="55.5" y="40" width="4" height="60" rx="1.5" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="0.5" />
                        <rect x="68" y="25" width="4" height="75" rx="1.5" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="0.5" />
                        <rect x="80.5" y="30" width="4" height="70" rx="1.5" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="0.5" />
                        <rect x="93" y="15" width="4" height="85" rx="1.5" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="0.5" />
                      </g>

                      <path d="M 7.5 60 L 20 45 L 32.5 50 L 45 32 L 57.5 40 L 70 25 L 82.5 30 L 95 15 L 95 99 L 7.5 99 Z" fill="url(#areaGrad)" />
                      <path d="M 7.5 60 L 20 45 L 32.5 50 L 45 32 L 57.5 40 L 70 25 L 82.5 30 L 95 15" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      
                      <circle cx="7.5" cy="60" r="2.5" fill="var(--color-primary)" stroke="white" strokeWidth="1" />
                      <circle cx="20" cy="45" r="2.5" fill="var(--color-primary)" stroke="white" strokeWidth="1" />
                      <circle cx="32.5" cy="50" r="2.5" fill="var(--color-primary)" stroke="white" strokeWidth="1" />
                      <circle cx="45" cy="32" r="2.5" fill="var(--color-primary)" stroke="white" strokeWidth="1" />
                      <circle cx="57.5" cy="40" r="2.5" fill="var(--color-primary)" stroke="white" strokeWidth="1" />
                      <circle cx="70" cy="25" r="2.5" fill="var(--color-primary)" stroke="white" strokeWidth="1" />
                      <circle cx="82.5" cy="30" r="2.5" fill="var(--color-primary)" stroke="white" strokeWidth="1" />
                      <circle cx="95" cy="15" r="2.5" fill="var(--color-primary)" stroke="white" strokeWidth="1" />
                    </svg>
                  </div>

                  <div className="w-full flex justify-between px-md pt-md border-t border-border-subtle select-none text-[10px] font-label-md text-outline">
                    <div className="w-1/4 text-center">WEEK 1</div>
                    <div className="w-1/4 text-center">WEEK 2</div>
                    <div className="w-1/4 text-center">WEEK 3</div>
                    <div className="w-1/4 text-center">WEEK 4</div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle/70 dark:border-outline-variant/30 shadow-sm flex flex-col justify-between min-h-[340px]">
                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main">
                      Resource Allocation
                    </h3>
                    <p className="font-body-sm text-on-surface-variant dark:text-surface-variant mt-0.5">
                      Percentage distribution of employee load
                    </p>
                  </div>

                  <div className="flex items-center justify-center my-lg relative">
                    <svg className="w-36 h-36 transform -rotate-90 overflow-visible" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="45" fill="transparent" stroke="var(--color-primary)" strokeWidth="16" strokeDasharray="127.23 282.74" strokeDashoffset="0" />
                      <circle cx="60" cy="60" r="45" fill="transparent" stroke="var(--color-tertiary)" strokeWidth="16" strokeDasharray="79.17 282.74" strokeDashoffset="-127.23" />
                      <circle cx="60" cy="60" r="45" fill="transparent" stroke="var(--color-primary-fixed-dim)" strokeWidth="16" strokeDasharray="76.34 282.74" strokeDashoffset="-206.4" />
                    </svg>

                    <div className="absolute inset-0 flex flex-col justify-center items-center select-none text-center">
                      <span className="font-headline-lg text-[22px] font-bold text-on-surface dark:text-surface-main leading-none">
                        84%
                      </span>
                      <span className="font-body-sm text-[10px] text-on-surface-variant dark:text-surface-variant font-medium mt-0.5">
                        Utility
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-sm select-none border-t border-border-subtle pt-md text-[11px] font-body-sm">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-xs text-on-surface-variant">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
                        <span>Dev</span>
                      </div>
                      <span className="font-bold text-on-surface dark:text-surface-main mt-0.5">45%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-xs text-on-surface-variant">
                        <span className="w-2.5 h-2.5 rounded-full bg-tertiary shrink-0"></span>
                        <span>Design</span>
                      </div>
                      <span className="font-bold text-on-surface dark:text-surface-main mt-0.5">28%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-xs text-on-surface-variant">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim shrink-0"></span>
                        <span>Mgt</span>
                      </div>
                      <span className="font-bold text-on-surface dark:text-surface-main mt-0.5">27%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
                <div className="lg:col-span-5 bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle/70 dark:border-outline-variant/30 shadow-sm flex flex-col justify-between min-h-[340px]">
                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main">
                      Team Productivity
                    </h3>
                    <p className="font-body-sm text-on-surface-variant dark:text-surface-variant mt-0.5">
                      Multi-trait efficiency matrix mapping
                    </p>
                  </div>

                  <div className="flex items-center justify-center my-md">
                    <svg className="w-40 h-40 overflow-visible" viewBox="0 0 200 200">
                      <polygon points={getPentagonPoints(65)} fill="none" stroke="var(--color-outline-variant)" strokeWidth="0.5" opacity="0.5" />
                      <polygon points={getPentagonPoints(52)} fill="none" stroke="var(--color-outline-variant)" strokeWidth="0.5" opacity="0.3" />
                      <polygon points={getPentagonPoints(39)} fill="none" stroke="var(--color-outline-variant)" strokeWidth="0.5" opacity="0.3" />
                      <polygon points={getPentagonPoints(26)} fill="none" stroke="var(--color-outline-variant)" strokeWidth="0.5" opacity="0.3" />
                      <polygon points={getPentagonPoints(13)} fill="none" stroke="var(--color-outline-variant)" strokeWidth="0.5" opacity="0.2" />

                      {[-90, -18, 54, 126, 198].map((a, idx) => {
                        const rad = (a * Math.PI) / 180;
                        return (
                          <line
                            key={idx}
                            x1="100"
                            y1="100"
                            x2={100 + 65 * Math.cos(rad)}
                            y2={100 + 65 * Math.sin(rad)}
                            stroke="var(--color-outline-variant)"
                            strokeWidth="0.5"
                            opacity="0.4"
                          />
                        );
                      })}

                      <polygon points={getProductivityPoints()} fill="var(--color-primary)" fillOpacity="0.2" stroke="var(--color-primary)" strokeWidth="1.5" />
                      
                      <text x="100" y="24" textAnchor="middle" className="text-[7.5px] font-label-md font-bold fill-on-surface dark:fill-surface-main">VEL</text>
                      <text x="174" y="80" textAnchor="start" className="text-[7.5px] font-label-md font-bold fill-on-surface dark:fill-surface-main">QLY</text>
                      <text x="146" y="156" textAnchor="start" className="text-[7.5px] font-label-md font-bold fill-on-surface dark:fill-surface-main">COL</text>
                      <text x="54" y="156" textAnchor="end" className="text-[7.5px] font-label-md font-bold fill-on-surface dark:fill-surface-main">REL</text>
                      <text x="26" y="80" textAnchor="end" className="text-[7.5px] font-label-md font-bold fill-on-surface dark:fill-surface-main">COM</text>
                    </svg>
                  </div>

                  <div className="flex gap-md justify-center border-t border-border-subtle pt-md select-none text-[11px] font-label-md">
                    <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full border border-primary/20">
                      Velocity: 12.4
                    </span>
                    <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full border border-secondary/20">
                      Quality: 98%
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-surface-main dark:bg-inverse-surface p-lg rounded-xl border border-border-subtle/70 dark:border-outline-variant/30 shadow-sm flex flex-col justify-between min-h-[340px]">
                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main">
                      Monthly Project ROI
                    </h3>
                    <p className="font-body-sm text-on-surface-variant dark:text-surface-variant mt-0.5">
                      Investment returns relative to expenditures
                    </p>
                  </div>

                  <div className="grid grid-cols-12 gap-md items-center my-md">
                    <div className="col-span-8 flex items-end justify-between h-36 px-md relative select-none">
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                        <div className="w-full border-t border-dashed border-outline-variant"></div>
                        <div className="w-full border-t border-dashed border-outline-variant"></div>
                        <div className="w-full border-t border-dashed border-outline-variant"></div>
                        <div className="w-full border-b border-solid border-outline-variant"></div>
                      </div>

                      <div className="flex flex-col items-center w-full gap-sm h-full justify-end z-10">
                        <div className="w-5 bg-surface-container hover:bg-primary-fixed-dim rounded-t-sm h-[40%]" title="$120k"></div>
                        <span className="text-[9px] font-label-md text-outline">JAN</span>
                      </div>
                      <div className="flex flex-col items-center w-full gap-sm h-full justify-end z-10">
                        <div className="w-5 bg-surface-container hover:bg-primary-fixed-dim rounded-t-sm h-[55%]" title="$165k"></div>
                        <span className="text-[9px] font-label-md text-outline">FEB</span>
                      </div>
                      <div className="flex flex-col items-center w-full gap-sm h-full justify-end z-10">
                        <div className="w-5 bg-surface-container hover:bg-primary-fixed-dim rounded-t-sm h-[50%]" title="$150k"></div>
                        <span className="text-[9px] font-label-md text-outline">MAR</span>
                      </div>
                      <div className="flex flex-col items-center w-full gap-sm h-full justify-end z-10">
                        <div className="w-5 bg-primary hover:brightness-110 rounded-t-sm h-[80%]" title="$240k"></div>
                        <span className="text-[9px] font-label-md text-outline font-bold text-primary">APR</span>
                      </div>
                      <div className="flex flex-col items-center w-full gap-sm h-full justify-end z-10">
                        <div className="w-5 bg-surface-container hover:bg-primary-fixed-dim rounded-t-sm h-[70%]" title="$210k"></div>
                        <span className="text-[9px] font-label-md text-outline">MAY</span>
                      </div>
                      <div className="flex flex-col items-center w-full gap-sm h-full justify-end z-10">
                        <div className="w-5 bg-surface-container hover:bg-primary-fixed-dim rounded-t-sm h-[65%]" title="$195k"></div>
                        <span className="text-[9px] font-label-md text-outline">JUN</span>
                      </div>
                      <div className="flex flex-col items-center w-full gap-sm h-full justify-end z-10">
                        <div className="w-5 bg-surface-container hover:bg-primary-fixed-dim rounded-t-sm h-[60%]" title="$180k"></div>
                        <span className="text-[9px] font-label-md text-outline">JUL</span>
                      </div>
                    </div>

                    <div className="col-span-4 flex flex-col gap-sm justify-center border-l border-border-subtle pl-md select-none text-left">
                      <div>
                        <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          +12.5% vs Last Mo
                        </span>
                      </div>
                      <div>
                        <p className="text-[11px] font-body-sm text-on-surface-variant">Total Revenue</p>
                        <h4 className="text-headline-md font-bold text-on-surface leading-tight">$240.5k</h4>
                      </div>
                      <div>
                        <p className="text-[11px] font-body-sm text-on-surface-variant">Expended</p>
                        <p className="text-body-md font-semibold text-on-surface">$45.2k</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border-subtle pt-md text-[11px] font-body-sm text-on-surface-variant text-center">
                    ROI efficiency yields positive margins across active milestones.
                  </div>
                </div>
              </div>

              <div className="bg-surface-main dark:bg-inverse-surface rounded-xl border border-border-subtle/70 dark:border-outline-variant/30 shadow-sm flex flex-col overflow-hidden">
                <div className="p-lg border-b border-border-subtle flex items-center justify-between">
                  <div className="text-left">
                    <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main">
                      Top Performing Team Members
                    </h3>
                    <p className="font-body-sm text-on-surface-variant mt-0.5">
                      High contributors based on task output and velocity scores
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[640px]">
                    <thead>
                      <tr className="border-b border-border-subtle text-[10px] font-label-md text-outline select-none">
                        <th className="py-sm px-lg uppercase">Member</th>
                        <th className="py-sm px-lg uppercase text-center">Tasks Done</th>
                        <th className="py-sm px-lg uppercase">Productivity Score</th>
                        <th className="py-sm px-lg uppercase text-center">Current Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle font-body-sm text-on-surface dark:text-surface-variant">
                      {performers.map((performer, idx) => {
                        const fullName = `${performer.first_name} ${performer.last_name || ""}`;
                        const score = Math.max(95 - idx * 4, 75);
                        return (
                          <tr key={performer.user_id} className="hover:bg-surface-container-lowest/50 transition-colors">
                            <td className="py-md px-lg">
                              <div className="flex items-center gap-sm">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                                  {fullName.split(" ").map(n => n[0]).join("").toUpperCase()}
                                </div>
                                <div className="text-left">
                                  <p className="font-bold text-on-surface dark:text-surface-main leading-snug">{fullName}</p>
                                  <p className="text-[11px] text-on-surface-variant leading-none mt-0.5">{performer.role_name}</p>
                                </div>
                              </div>
                            </td>

                            <td className="py-md px-lg text-center font-bold text-on-surface dark:text-surface-main select-none">
                              {performer.completed_count}
                            </td>

                            <td className="py-md px-lg select-none w-64">
                              <div className="flex items-center gap-sm">
                                <div className="flex-1 bg-surface-container rounded-full h-2 overflow-hidden">
                                  <div className="bg-primary h-full rounded-full" style={{ width: `${score}%` }}></div>
                                </div>
                                <span className="font-bold text-[12px] min-w-[28px] text-right text-on-surface dark:text-surface-main">
                                  {score}%
                                </span>
                              </div>
                            </td>

                            <td className="py-md px-lg text-center font-medium select-none">
                              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                                High Output
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {performers.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center py-4 text-on-surface-variant">No user completion analytics calculated yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
