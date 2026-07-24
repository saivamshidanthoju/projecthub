import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const initialComments = [
  {
    id: "c-1",
    author: "Alex Chen",
    role: "Engineering Lead",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAK6Oy0TuyX-beKCJs3HbLVZZ_r7pX6BPLQjwJM1botzflahsFX4XWKDNJ895EAU0aTLUMOHMMG3ntqcJUH-X9TzvSpCJfaQ8_RKWyfGKoh7p7HUKI4mQKskISZ9IJyxlGEhyM6WahZ3d6iztMYAqHI5Tx6td8xHxUncvMAf_ZFPWf9bhjdibE_XSorBGUWlc5GbhHwqbstrv31LHbYoM6Yzj4zKDu2z3uUtAkp_NnTNkGyGNgtoDADQ_cVBwzUgwWs4YIDkzJyV9U",
    time: "2h ago",
    content: "Just uploaded the updated API schema for the ledger module. Sarah, please review the security endpoints when you have a moment."
  },
  {
    id: "c-2",
    author: "Sarah Jenkins",
    role: "UX Director",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrn7t0HN7PhrbdeaJZ_UjjvNFk2PsP60uu1diOExqNg4cOIaoB-6x6mhyexOMqoRbDxmwyf2TxWVO8f0Wt-UDm8i1dsFbWKlfY3RqhB_idSHiMwa_W-Hgp3Pm2e8_5SYMnrlLR7GjL-2oJByVf-dftXtKHed4p9_VsxGm1toYeYOHHhuK8tNiJdWTp9uU1nDBnE6SlkpJgoaj9hTrlI_vsGWD1UTUs0Bo1i3HUrIQv_h7WiNjwGeLpA-dR0PUpBg3ImZf-XNuF5CE",
    time: "45m ago",
    content: "On it! Will finalize the UX flows by EOD too."
  }
];

const initialTasks = [
  { id: "t-1", title: "API Schema Core Ledger", status: "Completed", assignee: "Alex Chen", priority: "High" },
  { id: "t-2", title: "Endpoint Telemetry Logging", status: "In Progress", assignee: "Alex Chen", priority: "Medium" },
  { id: "t-3", title: "Rate Limiter Configuration", status: "Review", assignee: "Marcus Thorne", priority: "High" },
  { id: "t-4", title: "DDoS rate throttling rules", status: "To Do", assignee: "Elena Rodriguez", priority: "Low" }
];

export default function ProjectDetails() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [comments, setComments] = useState(initialComments);
  const [tasksList, setTasksList] = useState(initialTasks);
  const [newComment, setNewComment] = useState("");
  const chatEndRef = useRef(null);

  // Automatically scroll chat container to bottom when comments update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: `c-${Date.now()}`,
      author: "Elena Rodriguez",
      role: "Admin Access",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSrkbKamuBW3btcBS0x2OY-8VPSNa-CZR2De1kGt_mWiijcgKvhjVI-JtMptZ1HbcvFGDYBoe3MaqJs_k3SGYhLP5nPMybl-A0Jws1aiDYu_3l1bpd-xfJ5dveMq8-De7da1C44mF02LYkpmJym9S5oErg5uU193dbvTsrDMYgp3jjYqca0o9XXMCcGCN3qYsm4dMQtVjmf_zWE5IDj6BQ1Nd_cP6iJ7jK7WaXr7eLaAJCP3MtdSlRV5a5Fad4EiW832ooz1SlkFQ",
      time: "Just now",
      content: newComment
    };

    setComments(prev => [...prev, newCommentObj]);
    setNewComment("");
  };

  const handleInviteMember = () => {
    const email = prompt("Enter email address of team member to invite:");
    if (email) {
      alert(`Invitation sent to ${email}`);
    }
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
            <span className="text-on-surface dark:text-surface-main font-semibold">Project Alpha</span>
          </nav>

          {/* Context & Tabs */}
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
                  <img className="w-8 h-8 rounded-full border-2 border-surface-main dark:border-inverse-surface" alt="Team 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvuaZ9Uhw3tI9byN1cNTHLIsNvgIuNpx2KcicV1Mp7ppjhyRr5mM7TGpN52UIeBEmkROCxnzop-Hxr-XYiUXT88KstjIDSHNqNRtAZU7TPkAhh6uMb3SgUMBNZHJEf9z39DzJZJ5uaLVbvBUlJz3i7RL-m2qHQoMRfmDSEw_4nwm9KMrGaeetfLRlhct99Dc42M_flVKbzLPT5v4E7_FBei5NJ7CoDnJnaKdjUHUCQlu32V1SZyzV1JO6i0utpvP0t0L3JU_Qbls4" />
                  <img className="w-8 h-8 rounded-full border-2 border-surface-main dark:border-inverse-surface" alt="Team 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJmQmxZKV2DGW2-t4c4D7ijt3_fNrhAfJjXptVfMqLmUKeZ31sexWrgoEm4JGS_uMTTPZVorKzUUL3IA5hP5U4l7pO9Sa3V5hIvPdI1mDj_Ez-SfLfn2siSRMA55i10W160CsQgAx9z1Yi8n36uPLGiRntsOuGqKM-bxxz9noxkDW7n1AOTP5fUdf2Oj_XSwlYXRbgh2_qyBSJZWrL-UpVqke7DKJZfhV5pq2P5SqBL9wPvj_y4_IvQyMC7Umhyz5ow4kVCSawYX0" />
                  <img className="w-8 h-8 rounded-full border-2 border-surface-main dark:border-inverse-surface" alt="Team 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1zcwEixYPG3drEoOFHodQq7IpJA7oqyHL1QSNWq1yrXoRiWk8td0hYvR4F7FVnT-5KfWPemZOasj4K80BnZKJqMgp97A6zUOdk95ZFZOywmZEE4NJqz0Apk40HZitb4H2MzEGEjGAhrB1q9Nhug5jumuUpd0qymS0c0EpQRDZGgAcuOLZTeV3M7Py_2MIiuLYzQZSzgINZl_upPGvdoDRCtlsqL_ltSgIBv96UMl37spuOxPSG5kDZS2gMCj_C5B6rmFaCpQBGaY" />
                  <div className="w-8 h-8 rounded-full bg-surface-container-high dark:bg-on-surface-variant border-2 border-surface-main dark:border-inverse-surface flex items-center justify-center text-[10px] font-bold text-on-surface-variant dark:text-surface-main">+8</div>
                </div>
              </div>
            </div>
          </div>

          {/* Overview Tab Content */}
          {activeTab === "Overview" && (
            <div className="bento-grid">
              
              {/* Project Description */}
              <div className="col-span-12 lg:col-span-8 bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm">
                <div className="flex justify-between items-start mb-md">
                  <h3 className="font-headline-md text-headline-md text-text-heading dark:text-surface-main font-bold">
                    Project Description
                  </h3>
                  <button 
                    onClick={() => alert("Description edits locked for Phase DEV.")}
                    className="text-primary dark:text-inverse-primary hover:bg-primary-container/10 p-xs rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
                <p className="font-body-lg text-body-lg text-text-body dark:text-surface-variant leading-relaxed mb-lg">
                  The "Project Alpha" initiative focuses on architecting a next-generation distributed ledger system for real-time inventory reconciliation across global supply chains. Our primary objective is to reduce latency in transactional verification by 40% while maintaining enterprise-grade security protocols. This project involves cross-functional collaboration between Core Engineering, Security, and Logistics Ops.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg pt-md border-t border-border-subtle dark:border-outline-variant select-none">
                  <div>
                    <p className="font-label-md text-on-surface-variant dark:text-surface-variant uppercase mb-xs text-[10px]">
                      Timeline
                    </p>
                    <div className="flex items-center gap-xs text-text-heading dark:text-surface-main font-title-md">
                      <span className="material-symbols-outlined text-[18px]">event</span>
                      Oct 12, 2023 - Mar 20, 2024
                    </div>
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface-variant dark:text-surface-variant uppercase mb-xs text-[10px]">
                      Status
                    </p>
                    <div className="flex items-center gap-xs">
                      <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-text-heading dark:text-surface-main font-title-md">On Track</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health & Budget KPIs */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg select-none">
                <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm flex-1">
                  <div className="flex justify-between items-center mb-sm">
                    <p className="font-label-md text-on-surface-variant dark:text-surface-variant uppercase text-[10px]">
                      Project Health
                    </p>
                    <span className="material-symbols-outlined text-green-500">favorite</span>
                  </div>
                  <h4 className="font-display-lg text-headline-lg text-green-600 dark:text-green-400 font-bold mb-xs">
                    94%
                  </h4>
                  <p className="font-body-sm text-on-surface-variant dark:text-surface-variant">
                    4% increase from last milestone
                  </p>
                  <div className="w-full bg-surface-container dark:bg-on-surface-variant/30 rounded-full h-1.5 mt-md overflow-hidden">
                    <div className="bg-green-500 h-full w-[94%]"></div>
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
                  
                  <div className="flex items-center gap-lg mt-md">
                    <div className="flex items-center gap-xs">
                      <div className="w-2 h-2 rounded-full bg-primary dark:bg-inverse-primary"></div>
                      <span className="font-label-md text-[10px] text-on-surface-variant dark:text-surface-variant font-bold">SPENT (71%)</span>
                    </div>
                    <div className="flex items-center gap-xs">
                      <div className="w-2 h-2 rounded-full bg-surface-container-high dark:bg-on-surface-variant"></div>
                      <span className="font-label-md text-[10px] text-on-surface-variant dark:text-surface-variant font-bold">REMAINING</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Chart */}
              <div className="col-span-12 bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm">
                <div className="flex justify-between items-center mb-xl select-none">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-text-heading dark:text-surface-main font-bold">
                      Phase Progress
                    </h3>
                    <p className="font-body-sm text-on-surface-variant dark:text-surface-variant">
                      Aggregated task completion by development phase
                    </p>
                  </div>
                  <select className="bg-surface-sunken dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-lg text-body-sm focus:ring-primary focus:border-primary text-on-surface dark:text-surface-main cursor-pointer px-md py-sm">
                    <option>Last 30 Days</option>
                    <option>Quarter to Date</option>
                  </select>
                </div>
                
                {/* Mock Timeline Chart */}
                <div className="relative h-48 w-full flex items-end justify-between gap-base px-lg select-none">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    <div className="border-t border-dashed border-border-subtle dark:border-outline-variant/30 w-full h-[1px]"></div>
                    <div className="border-t border-dashed border-border-subtle dark:border-outline-variant/30 w-full h-[1px]"></div>
                    <div className="border-t border-dashed border-border-subtle dark:border-outline-variant/30 w-full h-[1px]"></div>
                    <div className="border-t border-dashed border-border-subtle dark:border-outline-variant/30 w-full h-[1px]"></div>
                  </div>

                  <div className="flex flex-col items-center gap-sm z-10 w-full">
                    <div className="bg-primary/20 dark:bg-inverse-primary/20 w-16 rounded-t-lg relative group transition-all duration-300 hover:bg-primary/40 dark:hover:bg-inverse-primary/40 cursor-pointer" style={{ height: "40px" }}>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface dark:bg-surface-main text-on-primary-container dark:text-on-surface px-sm py-xs rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 font-bold">
                        Planning: 25%
                      </div>
                    </div>
                    <span className="font-label-md text-[10px] text-on-surface-variant dark:text-surface-variant">PLANNING</span>
                  </div>

                  <div className="flex flex-col items-center gap-sm z-10 w-full">
                    <div className="bg-primary/40 dark:bg-inverse-primary/40 w-16 rounded-t-lg relative group transition-all duration-300 hover:bg-primary/60 dark:hover:bg-inverse-primary/60 cursor-pointer" style={{ height: "120px" }}>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface dark:bg-surface-main text-on-primary-container dark:text-on-surface px-sm py-xs rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 font-bold">
                        Design: 65%
                      </div>
                    </div>
                    <span className="font-label-md text-[10px] text-on-surface-variant dark:text-surface-variant">DESIGN</span>
                  </div>

                  <div className="flex flex-col items-center gap-sm z-10 w-full">
                    <div className="bg-primary dark:bg-inverse-primary w-16 rounded-t-lg relative group transition-all duration-300 hover:brightness-110 cursor-pointer" style={{ height: "160px" }}>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface dark:bg-surface-main text-on-primary-container dark:text-on-surface px-sm py-xs rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 font-bold">
                        Development: 90%
                      </div>
                    </div>
                    <span className="font-label-md text-[10px] text-primary dark:text-inverse-primary font-bold">DEV</span>
                  </div>

                  <div className="flex flex-col items-center gap-sm z-10 w-full">
                    <div className="bg-primary/10 dark:bg-inverse-primary/10 w-16 rounded-t-lg relative group transition-all duration-300 hover:bg-primary/20 dark:hover:bg-inverse-primary/20 cursor-pointer" style={{ height: "20px" }}>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface dark:bg-surface-main text-on-primary-container dark:text-on-surface px-sm py-xs rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 font-bold">
                        QA: 5%
                      </div>
                    </div>
                    <span className="font-label-md text-[10px] text-on-surface-variant dark:text-surface-variant">QA</span>
                  </div>

                  <div className="flex flex-col items-center gap-sm z-10 w-full">
                    <div className="bg-primary/5 dark:bg-inverse-primary/5 w-16 rounded-t-lg" style={{ height: "5px" }}></div>
                    <span className="font-label-md text-[10px] text-on-surface-variant dark:text-surface-variant">LAUNCH</span>
                  </div>
                </div>
              </div>

              {/* Team Members List */}
              <div className="col-span-12 lg:col-span-5 bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm">
                <div className="flex justify-between items-center mb-lg select-none">
                  <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main font-bold">
                    Project Team
                  </h3>
                  <button className="text-primary dark:text-inverse-primary font-button-text text-button-text hover:underline cursor-pointer">
                    Manage All
                  </button>
                </div>
                
                <div className="space-y-md">
                  <div className="flex items-center justify-between p-sm hover:bg-surface-container-low dark:hover:bg-on-surface-variant/20 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-border-subtle dark:hover:border-outline-variant">
                    <div className="flex items-center gap-md">
                      <img className="w-10 h-10 rounded-lg object-cover" alt="Alex Chen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK6Oy0TuyX-beKCJs3HbLVZZ_r7pX6BPLQjwJM1botzflahsFX4XWKDNJ895EAU0aTLUMOHMMG3ntqcJUH-X9TzvSpCJfaQ8_RKWyfGKoh7p7HUKI4mQKskISZ9IJyxlGEhyM6WahZ3d6iztMYAqHI5Tx6td8xHxUncvMAf_ZFPWf9bhjdibE_XSorBGUWlc5GbhHwqbstrv31LHbYoM6Yzj4zKDu2z3uUtAkp_NnTNkGyGNgtoDADQ_cVBwzUgwWs4YIDkzJyV9U" />
                      <div>
                        <p className="font-title-md text-sm text-text-heading dark:text-surface-main font-bold">Alex Chen</p>
                        <p className="font-body-sm text-on-surface-variant dark:text-surface-variant text-[11px]">Engineering Lead</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant cursor-pointer">more_vert</span>
                  </div>

                  <div className="flex items-center justify-between p-sm hover:bg-surface-container-low dark:hover:bg-on-surface-variant/20 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-border-subtle dark:hover:border-outline-variant">
                    <div className="flex items-center gap-md">
                      <img className="w-10 h-10 rounded-lg object-cover" alt="Sarah Jenkins" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrezlauh-69up1qBXXw7nge8K0E_cBtbqHx4sVrVz9VOQhW92AvFIvnamri6iUrGtp4yuLPZ6S5oOmmo27zFr0YinCynGIOZ_AP2PvWxdydyrshGOv_SbqEEdMJs6ySbEV8Fu9uKhrO2WyutW_JJN-ep2jZmQ51VyZWy16sAZVwWtzKGPxNrSPE-yvUMyGKQoXOgRNmmiK-zD0n5p05lEDgzkcu5E9mLJ3a1s5P1jECAuCdvbudVoAk66ODoi1BfQyEy8cCr6k1qQ" />
                      <div>
                        <p className="font-title-md text-sm text-text-heading dark:text-surface-main font-bold">Sarah Jenkins</p>
                        <p className="font-body-sm text-on-surface-variant dark:text-surface-variant text-[11px]">UX Director</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant cursor-pointer">more_vert</span>
                  </div>

                  <div className="flex items-center justify-between p-sm hover:bg-surface-container-low dark:hover:bg-on-surface-variant/20 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-border-subtle dark:hover:border-outline-variant">
                    <div className="flex items-center gap-md">
                      <img className="w-10 h-10 rounded-lg object-cover" alt="Marcus Thorne" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ_Fg5rm6QMTxPHs6EvzMlCDBQtBUX0A8CnAhPafWEgX2z9Q-cq0xkCfoY45W-5T3AfROUs3Rko1RTtVPPsrhzQuJBV3NgcaCWS3uU5Krh16Nfnj4TyxSgOZUL8Wyn4StJc7_H3RAupeZ_l6UKme_vAZEe0dUd92uZpziWcZApIRSsLZbyr05MIVH-HdI8eehG-Hzq76H-oQR1nU5yavanvYiHILaz00xTVF2GtpEYpB5RaGr4hSeLbezBEZd2YeBN0ScOtxH_Cm4" />
                      <div>
                        <p className="font-title-md text-sm text-text-heading dark:text-surface-main font-bold">Marcus Thorne</p>
                        <p className="font-body-sm text-on-surface-variant dark:text-surface-variant text-[11px]">Data Architect</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant cursor-pointer">more_vert</span>
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

              {/* Collaboration Chat Panel */}
              <div className="col-span-12 lg:col-span-7 bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm flex flex-col h-[400px]">
                <div className="flex items-center gap-sm mb-lg border-b border-border-subtle dark:border-outline-variant pb-md select-none">
                  <span className="material-symbols-outlined text-primary dark:text-inverse-primary">chat_bubble</span>
                  <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main font-bold">
                    Collaboration
                  </h3>
                </div>

                {/* Comment Feed Container */}
                <div className="flex-1 overflow-y-auto pr-sm custom-scrollbar space-y-lg mb-lg">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-md">
                      <img
                        className="w-8 h-8 rounded-full object-cover border border-border-subtle dark:border-outline-variant"
                        alt={comment.author}
                        src={comment.avatar}
                      />
                      <div className="bg-surface-sunken dark:bg-on-surface-variant/20 p-md rounded-xl rounded-tl-none border border-border-subtle dark:border-outline-variant flex-1">
                        <div className="flex justify-between items-center mb-xs select-none">
                          <span className="font-title-md text-sm text-text-heading dark:text-surface-main font-bold">
                            {comment.author}
                          </span>
                          <span className="text-[10px] text-on-surface-variant dark:text-surface-variant">
                            {comment.time}
                          </span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Send Chat Field */}
                <form onSubmit={handleSendComment} className="flex items-end gap-md">
                  <div className="flex-1 bg-surface-sunken dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-sm focus-within:border-primary dark:focus-within:border-inverse-primary transition-colors flex flex-col gap-xs">
                    <textarea
                      className="w-full bg-transparent border-none focus:ring-0 text-body-md text-on-surface dark:text-surface-main resize-none h-20 placeholder:text-on-surface-variant/50 outline-none"
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
                    
                    <div className="flex items-center justify-between mt-xs border-t border-border-subtle dark:border-outline-variant/30 pt-xs px-xs select-none">
                      <div className="flex gap-sm">
                        <button type="button" className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors text-[20px] cursor-pointer">
                          attach_file
                        </button>
                        <button type="button" className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors text-[20px] cursor-pointer">
                          alternate_email
                        </button>
                        <button type="button" className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors text-[20px] cursor-pointer">
                          mood
                        </button>
                      </div>
                      
                      <button
                        type="submit"
                        className="bg-primary text-white p-xs rounded-lg active:scale-95 transition-transform cursor-pointer"
                      >
                        <span className="material-symbols-outlined">send</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* Tasks Tab Content */}
          {activeTab === "Tasks" && (
            <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
              <div className="flex justify-between items-center select-none">
                <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main font-bold">
                  Open Tasks for Project Alpha
                </h3>
                <Link to="/tasks" className="text-primary dark:text-inverse-primary font-button-text text-button-text hover:underline font-bold">
                  View Full Kanban Board →
                </Link>
              </div>
              
              <div className="divide-y divide-border-subtle dark:divide-outline-variant">
                {tasksList.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-md first:pt-0 last:pb-0">
                    <div>
                      <p className="font-title-md text-title-md text-text-heading dark:text-surface-main font-semibold">
                        {t.title}
                      </p>
                      <p className="text-body-sm text-on-surface-variant dark:text-surface-variant">
                        Assigned to {t.assignee} • Priority: <span className="font-semibold">{t.priority}</span>
                      </p>
                    </div>
                    <span className={`px-sm py-1 rounded-full font-label-md text-label-md font-semibold select-none ${
                      t.status === "Completed" 
                        ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-800/30"
                        : t.status === "In Progress"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30"
                        : t.status === "Review"
                        ? "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/30"
                        : "bg-surface-sunken text-on-surface-variant dark:bg-inverse-surface dark:text-surface-variant border border-border-subtle dark:border-outline-variant"
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Tab Content */}
          {activeTab === "Team" && (
            <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
              <div className="flex justify-between items-center select-none">
                <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main font-bold">
                  Active Project Roster
                </h3>
                <button
                  onClick={handleInviteMember}
                  className="flex items-center gap-xs px-md py-sm bg-primary text-white rounded-lg font-button-text text-button-text hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow"
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span> Invite Member
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md select-none">
                {project.team.map((member, index) => (
                  <div key={index} className="flex items-center gap-md p-md bg-surface-sunken dark:bg-on-surface-variant/20 border border-border-subtle dark:border-outline-variant rounded-xl">
                    <img className="w-12 h-12 rounded-full object-cover border-2 border-surface-main dark:border-inverse-surface" alt={member.name} src={member.avatar} />
                    <div>
                      <p className="font-title-md text-title-md text-text-heading dark:text-surface-main font-bold">
                        {member.name}
                      </p>
                      <p className="text-body-md text-on-surface-variant dark:text-surface-variant">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Tab Content */}
          {activeTab === "Timeline" && (
            <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm space-y-lg select-none">
              <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main font-bold">
                Project Milestone Schedule
              </h3>
              
              <div className="relative border-l-2 border-border-subtle dark:border-outline-variant/30 ml-4 pl-lg space-y-xl py-xs">
                <div className="relative">
                  <div className="absolute -left-[35px] top-1.5 w-4 h-4 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-green-500"></div>
                  <h4 className="font-title-md text-title-md text-text-heading dark:text-surface-main font-bold">Planning Phase Completion</h4>
                  <span className="text-body-sm text-on-surface-variant dark:text-surface-variant block mb-sm">Oct 20, 2023</span>
                  <p className="font-body-md text-body-md text-text-body dark:text-surface-variant">Gather system latency constraints and map physical nodes layout.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[35px] top-1.5 w-4 h-4 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-green-500"></div>
                  <h4 className="font-title-md text-title-md text-text-heading dark:text-surface-main font-bold">Design Sign-off</h4>
                  <span className="text-body-sm text-on-surface-variant dark:text-surface-variant block mb-sm">Nov 15, 2023</span>
                  <p className="font-body-md text-body-md text-text-body dark:text-surface-variant">Finalize distributed ledger verification protocol wireframes.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[35px] top-1.5 w-4 h-4 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-blue-500"></div>
                  <h4 className="font-title-md text-title-md text-text-heading dark:text-surface-main font-bold">Core Ledger Implementation</h4>
                  <span className="text-body-sm text-on-surface-variant dark:text-surface-variant block mb-sm">Jan 10, 2024 (In Progress)</span>
                  <p className="font-body-md text-body-md text-text-body dark:text-surface-variant">Implement telemetry middle-tier integrations and JWT access routines.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[35px] top-1.5 w-4 h-4 rounded-full border-2 border-surface-main dark:border-inverse-surface bg-outline-variant"></div>
                  <h4 className="font-title-md text-title-md text-text-heading dark:text-surface-main font-bold">Security Audit & Launch</h4>
                  <span className="text-body-sm text-on-surface-variant dark:text-surface-variant block mb-sm">Mar 20, 2024</span>
                  <p className="font-body-md text-body-md text-text-body dark:text-surface-variant">Run vulnerability assessment sweeps and deploy to region servers.</p>
                </div>
              </div>
            </div>
          )}

          {/* Attachments Tab Content */}
          {activeTab === "Attachments" && (
            <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
              <h3 className="font-title-lg text-title-lg text-text-heading dark:text-surface-main font-bold select-none">
                Project Documentation & Assets
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
      </main>

      {/* Floating Insights Action Button */}
      <button 
        onClick={() => alert("Loading dynamic insights panel for Project Alpha...")}
        className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 group cursor-pointer"
      >
        <span className="material-symbols-outlined text-[24px]">bolt</span>
        <span className="absolute right-16 bg-inverse-surface text-on-primary-container px-md py-sm rounded-lg font-button-text whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-xs font-bold shadow-md">
          Project Insights
        </span>
      </button>
    </div>
  );
}
