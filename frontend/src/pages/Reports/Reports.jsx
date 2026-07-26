import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

// Mock data for top performing members
const topPerformers = [
  {
    id: "tp-1",
    name: "Sarah Jenkins",
    role: "Lead UI Designer",
    tasksDone: 142,
    score: 95,
    load: "Low",
    status: "High Performance",
    statusBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSrkbKamuBW3btcBS0x2OY-8VPSNa-CZR2De1kGt_mWiijcgKvhjVI-JtMptZ1HbcvFGDYBoe3MaqJs_k3SGYhLP5nPMybl-A0Jws1aiDYu_3l1bpd-xfJ5dveMq8-De7da1C44mF02LYkpmJym9S5oErg5uU193dbvTsrDMYgp3jjYqca0o9XXMCcGCN3qYsm4dMQtVjmf_zWE5IDj6BQ1Nd_cP6iJ7jK7WaXr7eLaAJCP3MtdSlRV5a5Fad4EiW832ooz1SlkFQ"
  },
  {
    id: "tp-2",
    name: "Marcus Thorne",
    role: "Backend Engineer",
    tasksDone: 128,
    score: 92,
    load: "Medium",
    status: "High Performance",
    statusBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbPqIgzUkRwtIdNG1R29HJH2HeI-6sfy-XfeHCrbnajiXzp2EoqkmsR63YCtYrfTkYmLVKdtu2UAG2pJX_xsiGs14Uw_v40EOI5wnMC-zUjUFxM2JEKxs1LHB0UXwtkmPyVwDz5uR94z54KByQjtLSNDQjQstHMCOS-Ng5MNQ7N3u_fStiuomy4tnaCTA21Ikuu1zfjZA4t_Yx3KLTOSapy31XD5tFIwuYal_B8uIM4gZ118CQ3Gr0hqKvWrQgGfZ378211N9p7KU"
  },
  {
    id: "tp-3",
    name: "Elena Rodriguez",
    role: "Data Analyst",
    tasksDone: 115,
    score: 88,
    load: "Optimal",
    status: "On Target",
    statusBg: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD71_WId36rvfuPNoxKGJ-w-ieAFxLTHrKxJRxjd12MGRASKQsnGJXo3Kxcp-XK7kd0koMgUjDTMN1xEabBUKaLRGfzYB62aNGccvgt76GWi5ySyYH0bjhxtRj_j5BQkQ-tXgDecssf0nKafomlsYkJkvps5jobV94oPFs9D4q_1TkQnWj-YS1nQ60zxIBr9TZPKhSE6o9m04VJkWVQw4-jPJTaTYOBDc5tQ4B7DMbgcIzt0gJNpZ51Z43qbGnhgLBujLS4vpPA5oA"
  },
  {
    id: "tp-4",
    name: "David Chen",
    role: "Project Manager",
    tasksDone: 98,
    score: 84,
    load: "High",
    status: "Heavily Loaded",
    statusBg: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrhE-ZqgaG_64e86a02XXPN33-XTyj3nV9V4oamzoyuyk71bmQPxRV0VK_ZjqcvvM7Jz0cdeJiYTapaeLCMvB1SLn1FxEoIJYjMIREeIKnmNTGY2VgTywMQP0mAZfokf-K0qRmtoMQVwbB314xEr4i85pOlR_toVhAoLtzXHyyMeyCQ_kr4F-8FpXaoulr4K0l8IerG7dFZ-TG0_lzk0TcKqFHcOlwderpXj9GWQ-gSrc7bqyOkODKYoHka4WLlcKeOp251FwUMtc"
  }
];

export default function Reports() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [timePeriod, setTimePeriod] = useState("Last 30 Days");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast("Data synced successfully with master repositories! 🚀");
    }, 1200);
  };

  const handleExportCSV = () => {
    // Generate simple CSV client-side
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,Role,Tasks Done,Productivity Score,Load,Status\n";
    topPerformers.forEach((p) => {
      csvContent += `"${p.name}","${p.role}",${p.tasksDone},${p.score}%,"${p.load}","${p.status}"\n`;
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

  // SVG Radar pentagon coordinates calculation
  // Center is (100, 100), radius is 65. Pentagonal angles: -90, -18, 54, 126, 198
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

  // Values for team productivity: Velocity, Quality, Collaboration, Reliability, Communication
  // Max scale is 100
  const productivityStats = [85, 98, 75, 90, 80];
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

  return (
    <div className="flex min-h-screen overflow-hidden bg-surface-sunken dark:bg-inverse-surface text-on-surface w-full">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden relative">
        <Header />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute top-20 right-8 bg-inverse-surface text-surface-main dark:bg-surface-main dark:text-on-surface px-lg py-sm rounded-xl shadow-lg flex items-center gap-sm z-[999] border border-outline-variant/30 animate-fade-in font-body-sm text-[13px]">
            <span className="material-symbols-outlined text-emerald-500 font-bold">check_circle</span>
            {toastMessage}
          </div>
        )}

        {/* Reports Content Viewport */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-margin-desktop space-y-xl bg-surface-sunken dark:bg-surface-dim">
          
          {/* Title bar */}
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
                className="flex items-center gap-xs px-md py-sm bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-lg font-button-text text-button-text text-on-surface dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/20 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                PDF
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-xs px-md py-sm bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-lg font-button-text text-button-text text-on-surface dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/20 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">description</span>
                CSV
              </button>
              <button
                onClick={handleSyncData}
                disabled={isSyncing}
                className="flex items-center gap-xs px-md py-sm bg-primary text-white rounded-lg font-button-text text-button-text hover:brightness-110 shadow-sm active:scale-95 transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className={`material-symbols-outlined text-[18px] ${isSyncing ? "animate-spin" : ""}`}>
                  sync
                </span>
                {isSyncing ? "Syncing..." : "Sync Data"}
              </button>
            </div>
          </div>

          {/* Grid row 1: Line/Area Chart & Donut Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
            
            {/* Col 1: Tasks Completed Over Time */}
            <div className="lg:col-span-8 bg-surface-main dark:bg-inverse-surface p-lg rounded-2xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col justify-between min-h-[340px]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main">
                    Tasks Completed Over Time
                  </h3>
                  <p className="font-body-sm text-on-surface-variant dark:text-surface-variant mt-0.5">
                    Progress metrics tracking development throughput
                  </p>
                </div>
                <select
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="bg-surface-sunken dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-sm px-3 py-1 outline-none text-on-surface-variant dark:text-surface-variant cursor-pointer"
                >
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>This Year</option>
                </select>
              </div>

              {/* Bar and Line chart composite SVG */}
              <div className="flex-1 relative flex items-end justify-between mt-lg h-48">
                {/* Custom Responsive SVG layout */}
                <svg className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="var(--color-outline-variant)" strokeWidth="0.25" strokeDasharray="3" opacity="0.4" />
                  <line x1="0" y1="40" x2="100" y2="40" stroke="var(--color-outline-variant)" strokeWidth="0.25" strokeDasharray="3" opacity="0.4" />
                  <line x1="0" y1="60" x2="100" y2="60" stroke="var(--color-outline-variant)" strokeWidth="0.25" strokeDasharray="3" opacity="0.4" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="var(--color-outline-variant)" strokeWidth="0.25" strokeDasharray="3" opacity="0.4" />
                  <line x1="0" y1="99" x2="100" y2="99" stroke="var(--color-outline-variant)" strokeWidth="0.5" opacity="0.6" />

                  {/* Filled Gradient Area */}
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Chart Bars (8 total) */}
                  <g opacity="0.85">
                    {/* Bar 1 */}
                    <rect x="5.5" y="60" width="4" height="40" rx="1.5" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="0.5" />
                    {/* Bar 2 */}
                    <rect x="18" y="45" width="4" height="55" rx="1.5" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="0.5" />
                    {/* Bar 3 */}
                    <rect x="30.5" y="50" width="4" height="50" rx="1.5" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="0.5" />
                    {/* Bar 4 */}
                    <rect x="43" y="32" width="4" height="68" rx="1.5" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="0.5" />
                    {/* Bar 5 */}
                    <rect x="55.5" y="40" width="4" height="60" rx="1.5" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="0.5" />
                    {/* Bar 6 */}
                    <rect x="68" y="25" width="4" height="75" rx="1.5" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="0.5" />
                    {/* Bar 7 */}
                    <rect x="80.5" y="30" width="4" height="70" rx="1.5" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="0.5" />
                    {/* Bar 8 */}
                    <rect x="93" y="15" width="4" height="85" rx="1.5" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="0.5" />
                  </g>

                  {/* Filled Area beneath line */}
                  <path d="M 7.5 60 L 20 45 L 32.5 50 L 45 32 L 57.5 40 L 70 25 L 82.5 30 L 95 15 L 95 99 L 7.5 99 Z" fill="url(#areaGrad)" />
                  
                  {/* Tracing Line Chart */}
                  <path d="M 7.5 60 L 20 45 L 32.5 50 L 45 32 L 57.5 40 L 70 25 L 82.5 30 L 95 15" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Indicator Dots */}
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

              {/* Bottom X-axis Labels */}
              <div className="w-full flex justify-between px-md pt-md border-t border-border-subtle dark:border-outline-variant select-none text-[10px] font-label-md text-outline">
                <div className="w-1/4 text-center">WEEK 1</div>
                <div className="w-1/4 text-center">WEEK 2</div>
                <div className="w-1/4 text-center">WEEK 3</div>
                <div className="w-1/4 text-center">WEEK 4</div>
              </div>
            </div>

            {/* Col 2: Resource Allocation Donut */}
            <div className="lg:col-span-4 bg-surface-main dark:bg-inverse-surface p-lg rounded-2xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col justify-between min-h-[340px]">
              <div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main">
                  Resource Allocation
                </h3>
                <p className="font-body-sm text-on-surface-variant dark:text-surface-variant mt-0.5">
                  Percentage distribution of employee load
                </p>
              </div>

              {/* SVG Donut */}
              <div className="flex items-center justify-center my-lg relative">
                <svg className="w-36 h-36 transform -rotate-90 overflow-visible" viewBox="0 0 120 120">
                  {/* Segment 1: Dev 45% (Blue)
                      Circumference = 2 * PI * r = 2 * 3.14159 * 45 = 282.74
                      Dash = 282.74 * 0.45 = 127.23
                      Offset = 0
                  */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="transparent"
                    stroke="var(--color-primary)"
                    strokeWidth="16"
                    strokeDasharray="127.23 282.74"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: Design 28% (Purple)
                      Dash = 282.74 * 0.28 = 79.17
                      Offset = -127.23
                  */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="transparent"
                    stroke="var(--color-tertiary)"
                    strokeWidth="16"
                    strokeDasharray="79.17 282.74"
                    strokeDashoffset="-127.23"
                  />
                  {/* Segment 3: Management 27% (Light Blue)
                      Dash = 282.74 * 0.27 = 76.34
                      Offset = -(127.23 + 79.17) = -206.40
                  */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="transparent"
                    stroke="var(--color-primary-fixed-dim)"
                    strokeWidth="16"
                    strokeDasharray="76.34 282.74"
                    strokeDashoffset="-206.4"
                  />
                </svg>

                {/* Inner Text overlay */}
                <div className="absolute inset-0 flex flex-col justify-center items-center select-none text-center">
                  <span className="font-headline-lg text-[22px] font-bold text-on-surface dark:text-surface-main leading-none">
                    84%
                  </span>
                  <span className="font-body-sm text-[10px] text-on-surface-variant dark:text-surface-variant font-medium mt-0.5">
                    Utility
                  </span>
                </div>
              </div>

              {/* Legends list */}
              <div className="grid grid-cols-3 gap-sm select-none border-t border-border-subtle dark:border-outline-variant pt-md text-[11px] font-body-sm">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-xs text-on-surface-variant dark:text-surface-variant">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
                    <span>Dev</span>
                  </div>
                  <span className="font-bold text-on-surface dark:text-surface-main mt-0.5">45%</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-xs text-on-surface-variant dark:text-surface-variant">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary shrink-0"></span>
                    <span>Design</span>
                  </div>
                  <span className="font-bold text-on-surface dark:text-surface-main mt-0.5">28%</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-xs text-on-surface-variant dark:text-surface-variant">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim shrink-0"></span>
                    <span>Mgt</span>
                  </div>
                  <span className="font-bold text-on-surface dark:text-surface-main mt-0.5">27%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid row 2: Radar Chart & ROI Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
            
            {/* Col 1: Team Productivity Radar Chart */}
            <div className="lg:col-span-5 bg-surface-main dark:bg-inverse-surface p-lg rounded-2xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col justify-between min-h-[340px]">
              <div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main">
                  Team Productivity
                </h3>
                <p className="font-body-sm text-on-surface-variant dark:text-surface-variant mt-0.5">
                  Multi-trait efficiency matrix mapping
                </p>
              </div>

              {/* SVG Radar */}
              <div className="flex items-center justify-center my-md">
                <svg className="w-40 h-40 overflow-visible" viewBox="0 0 200 200">
                  {/* Pentagonal grid concentric outlines */}
                  <polygon points={getPentagonPoints(65)} fill="none" stroke="var(--color-outline-variant)" strokeWidth="0.5" opacity="0.5" />
                  <polygon points={getPentagonPoints(52)} fill="none" stroke="var(--color-outline-variant)" strokeWidth="0.5" opacity="0.3" />
                  <polygon points={getPentagonPoints(39)} fill="none" stroke="var(--color-outline-variant)" strokeWidth="0.5" opacity="0.3" />
                  <polygon points={getPentagonPoints(26)} fill="none" stroke="var(--color-outline-variant)" strokeWidth="0.5" opacity="0.3" />
                  <polygon points={getPentagonPoints(13)} fill="none" stroke="var(--color-outline-variant)" strokeWidth="0.5" opacity="0.2" />

                  {/* Axes lines from center */}
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

                  {/* Data Shaded Area Polygon */}
                  <polygon
                    points={getProductivityPoints()}
                    fill="var(--color-primary)"
                    fillOpacity="0.2"
                    stroke="var(--color-primary)"
                    strokeWidth="1.5"
                  />
                  
                  {/* Outer Axis Labels */}
                  <text x="100" y="24" textAnchor="middle" className="text-[7.5px] font-label-md font-bold fill-on-surface dark:fill-surface-main">VEL</text>
                  <text x="174" y="80" textAnchor="start" className="text-[7.5px] font-label-md font-bold fill-on-surface dark:fill-surface-main">QLY</text>
                  <text x="146" y="156" textAnchor="start" className="text-[7.5px] font-label-md font-bold fill-on-surface dark:fill-surface-main">COL</text>
                  <text x="54" y="156" textAnchor="end" className="text-[7.5px] font-label-md font-bold fill-on-surface dark:fill-surface-main">REL</text>
                  <text x="26" y="80" textAnchor="end" className="text-[7.5px] font-label-md font-bold fill-on-surface dark:fill-surface-main">COM</text>
                </svg>
              </div>

              {/* Lower KPIs */}
              <div className="flex gap-md justify-center border-t border-border-subtle dark:border-outline-variant pt-md select-none text-[11px] font-label-md">
                <span className="bg-primary-container text-on-primary-container dark:bg-on-surface-variant dark:text-surface-main px-3 py-1 rounded-full border border-primary/20">
                  Velocity: 12.4
                </span>
                <span className="bg-secondary-container text-on-secondary-container dark:bg-secondary dark:text-white px-3 py-1 rounded-full border border-secondary/20">
                  Quality: 98%
                </span>
              </div>
            </div>

            {/* Col 2: Monthly Project ROI Bar Chart */}
            <div className="lg:col-span-7 bg-surface-main dark:bg-inverse-surface p-lg rounded-2xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col justify-between min-h-[340px]">
              <div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main">
                  Monthly Project ROI
                </h3>
                <p className="font-body-sm text-on-surface-variant dark:text-surface-variant mt-0.5">
                  Simulated investment returns relative to expenditures
                </p>
              </div>

              <div className="grid grid-cols-12 gap-md items-center my-md">
                {/* 7 Vertical Bar Columns */}
                <div className="col-span-8 flex items-end justify-between h-36 px-md relative select-none">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                    <div className="w-full border-t border-dashed border-outline-variant"></div>
                    <div className="w-full border-t border-dashed border-outline-variant"></div>
                    <div className="w-full border-t border-dashed border-outline-variant"></div>
                    <div className="w-full border-b border-solid border-outline-variant"></div>
                  </div>

                  {/* Bar columns */}
                  <div className="flex flex-col items-center w-full gap-sm h-full justify-end z-10">
                    <div className="w-5 bg-surface-container hover:bg-primary-fixed-dim rounded-t-sm h-[40%] transition-colors duration-200" title="$120k"></div>
                    <span className="text-[9px] font-label-md text-outline">JAN</span>
                  </div>
                  <div className="flex flex-col items-center w-full gap-sm h-full justify-end z-10">
                    <div className="w-5 bg-surface-container hover:bg-primary-fixed-dim rounded-t-sm h-[55%] transition-colors duration-200" title="$165k"></div>
                    <span className="text-[9px] font-label-md text-outline">FEB</span>
                  </div>
                  <div className="flex flex-col items-center w-full gap-sm h-full justify-end z-10">
                    <div className="w-5 bg-surface-container hover:bg-primary-fixed-dim rounded-t-sm h-[50%] transition-colors duration-200" title="$150k"></div>
                    <span className="text-[9px] font-label-md text-outline">MAR</span>
                  </div>
                  <div className="flex flex-col items-center w-full gap-sm h-full justify-end z-10">
                    <div className="w-5 bg-primary hover:brightness-110 rounded-t-sm h-[80%] transition-colors duration-200" title="$240k"></div>
                    <span className="text-[9px] font-label-md text-outline font-bold text-primary">APR</span>
                  </div>
                  <div className="flex flex-col items-center w-full gap-sm h-full justify-end z-10">
                    <div className="w-5 bg-surface-container hover:bg-primary-fixed-dim rounded-t-sm h-[70%] transition-colors duration-200" title="$210k"></div>
                    <span className="text-[9px] font-label-md text-outline">MAY</span>
                  </div>
                  <div className="flex flex-col items-center w-full gap-sm h-full justify-end z-10">
                    <div className="w-5 bg-surface-container hover:bg-primary-fixed-dim rounded-t-sm h-[65%] transition-colors duration-200" title="$195k"></div>
                    <span className="text-[9px] font-label-md text-outline">JUN</span>
                  </div>
                  <div className="flex flex-col items-center w-full gap-sm h-full justify-end z-10">
                    <div className="w-5 bg-surface-container hover:bg-primary-fixed-dim rounded-t-sm h-[60%] transition-colors duration-200" title="$180k"></div>
                    <span className="text-[9px] font-label-md text-outline">JUL</span>
                  </div>
                </div>

                {/* Right Summary data metadata */}
                <div className="col-span-4 flex flex-col gap-sm justify-center border-l border-border-subtle dark:border-outline-variant pl-md select-none">
                  <div>
                    <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
                      +12.5% vs Last Mo
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] font-body-sm text-on-surface-variant dark:text-surface-variant">Total Revenue</p>
                    <h4 className="text-headline-md font-bold text-on-surface dark:text-surface-main leading-tight">$240.5k</h4>
                  </div>
                  <div>
                    <p className="text-[11px] font-body-sm text-on-surface-variant dark:text-surface-variant">Expended</p>
                    <p className="text-body-md font-semibold text-on-surface dark:text-surface-main">$45.2k</p>
                  </div>
                </div>
              </div>

              {/* Bottom label */}
              <div className="border-t border-border-subtle dark:border-outline-variant pt-md text-[11px] font-body-sm text-on-surface-variant dark:text-surface-variant text-center">
                ROI efficiency yields positive margins across active milestones.
              </div>
            </div>
          </div>

          {/* Bottom Table Card: Top Performing Members */}
          <div className="bg-surface-main dark:bg-inverse-surface rounded-2xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col overflow-hidden">
            <div className="p-lg border-b border-border-subtle dark:border-outline-variant flex items-center justify-between">
              <div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main">
                  Top Performing Team Members
                </h3>
                <p className="font-body-sm text-on-surface-variant dark:text-surface-variant mt-0.5">
                  High contributors based on task output and velocity scores
                </p>
              </div>
              <div className="flex items-center gap-sm text-[11px] font-body-sm text-on-surface-variant dark:text-surface-variant select-none">
                <span>Updated 12m ago</span>
                <button
                  onClick={() => alert("Configure parameters of target performance score matrix...")}
                  className="material-symbols-outlined hover:bg-surface-container dark:hover:bg-on-surface-variant/20 rounded-full p-1 text-[20px] cursor-pointer"
                >
                  more_vert
                </button>
              </div>
            </div>

            {/* Table layout */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-border-subtle dark:border-outline-variant text-[10px] font-label-md text-outline select-none">
                    <th className="py-sm px-lg uppercase">Member</th>
                    <th className="py-sm px-lg uppercase text-center">Tasks Done</th>
                    <th className="py-sm px-lg uppercase">Productivity Score</th>
                    <th className="py-sm px-lg uppercase text-center">Current Load</th>
                    <th className="py-sm px-lg uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle dark:divide-outline-variant font-body-sm text-on-surface dark:text-surface-variant">
                  {topPerformers.map((performer) => (
                    <tr key={performer.id} className="hover:bg-surface-container-lowest/50 dark:hover:bg-on-surface-variant/10 transition-colors">
                      {/* Name Card */}
                      <td className="py-md px-lg">
                        <div className="flex items-center gap-sm">
                          <img
                            className="w-10 h-10 rounded-full object-cover border border-border-subtle dark:border-outline-variant"
                            alt={`${performer.name} avatar.`}
                            src={performer.avatar}
                          />
                          <div>
                            <p className="font-bold text-on-surface dark:text-surface-main leading-snug">{performer.name}</p>
                            <p className="text-[11px] text-on-surface-variant dark:text-surface-variant leading-none mt-0.5">{performer.role}</p>
                          </div>
                        </div>
                      </td>

                      {/* Tasks Done */}
                      <td className="py-md px-lg text-center font-bold text-on-surface dark:text-surface-main select-none">
                        {performer.tasksDone}
                      </td>

                      {/* Productivity score progress bar */}
                      <td className="py-md px-lg select-none w-64">
                        <div className="flex items-center gap-sm">
                          <div className="flex-1 bg-surface-container dark:bg-on-surface-variant/20 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-primary dark:bg-inverse-primary h-full rounded-full transition-all duration-700"
                              style={{ width: `${performer.score}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-[12px] min-w-[28px] text-right text-on-surface dark:text-surface-main">
                            {performer.score}%
                          </span>
                        </div>
                      </td>

                      {/* Current Load */}
                      <td className="py-md px-lg text-center font-medium select-none">
                        {performer.load}
                      </td>

                      {/* Status Badges */}
                      <td className="py-md px-lg select-none">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${performer.statusBg}`}>
                          {performer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
