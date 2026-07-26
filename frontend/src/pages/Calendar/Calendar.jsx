import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function Calendar() {
  const [viewTab, setViewTab] = useState("Month");
  const [selectedMonth, setSelectedMonth] = useState("October 2024");

  // Modal State for Add Event
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("2024-10-09");
  const [eventTime, setEventTime] = useState("14:00");
  const [eventColor, setEventColor] = useState("blue");
  const [eventDescription, setEventDescription] = useState("");

  // Event list in calendar grid
  const [events, setEvents] = useState([
    { id: "e-1", date: "2024-10-01", title: "Q4 Planning Meeting", color: "blue" },
    { id: "e-2", date: "2024-10-07", title: "Project Kickoff", color: "green" },
    { id: "e-3", date: "2024-10-09", title: "Client Presentation", color: "blue" },
    { id: "e-4", date: "2024-10-09", title: "Team Lunch", color: "yellow" },
    { id: "e-5", date: "2024-10-14", title: "Deadline: Phase 1", color: "red" }
  ]);

  // Upcoming events sidebar state
  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: "ue-1",
      time: "Today, 2:00 PM",
      title: "Board Meeting Prep",
      description: "Discuss Q4 revenue targets and resource allocation for Project Titan.",
      styleClass: "border-primary",
      avatars: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD71_WId36rvfuPNoxKGJ-w-ieAFxLTHrKxJRxjd12MGRASKQsnGJXo3Kxcp-XK7kd0koMgUjDTMN1xEabBUKaLRGfzYB62aNGccvgt76GWi5ySyYH0bjhxtRj_j5BQkQ-tXgDecssf0nKafomlsYkJkvps5jobV94oPFs9D4q_1TkQnWj-YS1nQ60zxIBr9TZPKhSE6o9m04VJkWVQw4-jPJTaTYOBDc5tQ4B7DMbgcIzt0gJNpZ51Z43qbGnhgLBujLS4vpPA5oA",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAbPqIgzUkRwtIdNG1R29HJH2HeI-6sfy-XfeHCrbnajiXzp2EoqkmsR63YCtYrfTkYmLVKdtu2UAG2pJX_xsiGs14Uw_v40EOI5wnMC-zUjUFxM2JEKxs1LHB0UXwtkmPyVwDz5uR94z54KByQjtLSNDQjQstHMCOS-Ng5MNQ7N3u_fStiuomy4tnaCTA21Ikuu1zfjZA4t_Yx3KLTOSapy31XD5tFIwuYal_B8uIM4gZ118CQ3Gr0hqKvWrQgGfZ378211N9p7KU",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCSrkbKamuBW3btcBS0x2OY-8VPSNa-CZR2De1kGt_mWiijcgKvhjVI-JtMptZ1HbcvFGDYBoe3MaqJs_k3SGYhLP5nPMybl-A0Jws1aiDYu_3l1bpd-xfJ5dveMq8-De7da1C44mF02LYkpmJym9S5oErg5uU193dbvTsrDMYgp3jjYqca0o9XXMCcGCN3qYsm4dMQtVjmf_zWE5IDj6BQ1Nd_cP6iJ7jK7WaXr7eLaAJCP3MtdSlRV5a5Fad4EiW832ooz1SlkFQ"
      ],
      extraCount: 3
    },
    {
      id: "ue-2",
      time: "Tomorrow, 10:00 AM",
      title: "Critical: API Downtime",
      description: "Scheduled maintenance for core infrastructure. High priority impact.",
      styleClass: "border-error text-error dark:text-red-400",
      avatars: [],
      extraCount: 0
    },
    {
      id: "ue-3",
      time: "Oct 12, 4:30 PM",
      title: "Design Handoff",
      description: "Reviewing the new mobile assets with the development team.",
      styleClass: "border-amber-500",
      avatars: [],
      extraCount: 0
    }
  ]);



  const handleAddEventSubmit = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    // Add to grid events
    const newGridEvent = {
      id: `e-${Date.now()}`,
      date: eventDate,
      title: eventTitle,
      color: eventColor
    };
    setEvents((prev) => [...prev, newGridEvent]);

    // Add to upcoming events list
    const timeFormatted = `${eventDate.split("-")[2]} Oct, ${eventTime}`;
    const newUpcomingEvent = {
      id: `ue-${Date.now()}`,
      time: timeFormatted,
      title: eventTitle,
      description: eventDescription || "No description provided.",
      styleClass: eventColor === "red" ? "border-error text-error dark:text-red-400" : eventColor === "yellow" ? "border-amber-500" : "border-primary",
      avatars: [],
      extraCount: 0
    };
    setUpcomingEvents((prev) => [newUpcomingEvent, ...prev]);

    // Reset Form and close modal
    setEventTitle("");
    setEventDescription("");
    setIsAddEventOpen(false);
  };

  // Availability mock data
  const teamAvailability = [
    {
      name: "Alex Rivera",
      role: "Senior Engineer",
      load: 85,
      status: "Active",
      statusColor: "bg-emerald-500",
      barColor: "bg-primary",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxj80x9RWxJQ4AzWlur52xcsE0i1HBIkNBt4Osn-cTVudkAiC-DX4pu1v0rN5QJ1eKqF3b8IoEsWBDbz3rzT3SNja8oN5EwrD8etLB_dag8b4y4DxDN88A4ikjV454h5OHs8HrVWsKf3GgMzxiZdkTwi5kOSstKGfq1Apv-CR1L-lBYRnr9JyQxubE_W98i0pb3ck4aUEDR0uYEHmQblScFwllnsiLCXmj4vPMCqbiPnonaS6mpaKDeX5RLl5gNYhEy6U8uJY8I4U"
    },
    {
      name: "Sarah Chen",
      role: "Design Lead",
      load: 100,
      status: "Busy",
      statusColor: "bg-amber-500",
      barColor: "bg-red-600",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD71_WId36rvfuPNoxKGJ-w-ieAFxLTHrKxJRxjd12MGRASKQsnGJXo3Kxcp-XK7kd0koMgUjDTMN1xEabBUKaLRGfzYB62aNGccvgt76GWi5ySyYH0bjhxtRj_j5BQkQ-tXgDecssf0nKafomlsYkJkvps5jobV94oPFs9D4q_1TkQnWj-YS1nQ60zxIBr9TZPKhSE6o9m04VJkWVQw4-jPJTaTYOBDc5tQ4B7DMbgcIzt0gJNpZ51Z43qbGnhgLBujLS4vpPA5oA"
    },
    {
      name: "James Wilson",
      role: "Product Manager",
      load: 0,
      status: "Offline",
      statusColor: "bg-slate-300",
      barColor: "bg-slate-200 dark:bg-on-surface-variant/20",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUat5_p3l9_yN33nXkr2pdpHSZ0PqrjN_xaVhcqJzaXaIHMaCEjUfBlfL3hdZkhjraIFXom0Jz2QNUCORVitN7cS03UfwgKPK5rlHrJfUBTlFgqwjod9I8WcvGiLND2yiWikd4rTDPz5izaW3AITyrK2BdZ-ooVISnnaBi3AmFHBgrq_UaYlmIhOIRyMz5N8QNFUidlLX9JldmH7fyjizUeZhJBYjoIk_bL30tAuoly3NlLDjHcPujzERaq1bdnLHKVyMbw9ncs5s"
    }
  ];

  // Calendar dates mock grid (October 2024 showing SUN, MON, TUE, WED columns)
  const calendarGrid = [
    // Week 1
    [
      { day: "29", isCurrentMonth: false, dateStr: "2024-09-29" },
      { day: "30", isCurrentMonth: false, dateStr: "2024-09-30" },
      { day: "1", isCurrentMonth: true, dateStr: "2024-10-01" },
      { day: "2", isCurrentMonth: true, dateStr: "2024-10-02" }
    ],
    // Week 2
    [
      { day: "6", isCurrentMonth: true, dateStr: "2024-10-06" },
      { day: "7", isCurrentMonth: true, dateStr: "2024-10-07" },
      { day: "8", isCurrentMonth: true, dateStr: "2024-10-08" },
      { day: "9", isCurrentMonth: true, dateStr: "2024-10-09", isToday: true }
    ],
    // Week 3
    [
      { day: "13", isCurrentMonth: true, dateStr: "2024-10-13" },
      { day: "14", isCurrentMonth: true, dateStr: "2024-10-14" },
      { day: "15", isCurrentMonth: true, dateStr: "2024-10-15" },
      { day: "16", isCurrentMonth: true, dateStr: "2024-10-16" }
    ],
    // Week 4
    [
      { day: "20", isCurrentMonth: true, dateStr: "2024-10-20" },
      { day: "21", isCurrentMonth: true, dateStr: "2024-10-21" },
      { day: "22", isCurrentMonth: true, dateStr: "2024-10-22" },
      { day: "23", isCurrentMonth: true, dateStr: "2024-10-23" }
    ],
    // Week 5
    [
      { day: "27", isCurrentMonth: true, dateStr: "2024-10-27" },
      { day: "28", isCurrentMonth: true, dateStr: "2024-10-28" },
      { day: "29", isCurrentMonth: true, dateStr: "2024-10-29" },
      { day: "30", isCurrentMonth: true, dateStr: "2024-10-30" }
    ]
  ];

  return (
    <div className="flex min-h-screen overflow-hidden bg-surface-sunken dark:bg-inverse-surface text-on-surface w-full">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        
        {/* Custom Header matching the screenshot */}
        <Header />

        {/* Content Area Viewport: Three-column layout */}
        <div className="flex-1 flex overflow-hidden bg-surface-sunken dark:bg-surface-dim">
          
          {/* Column 1: Team Availability */}
          <aside className="w-80 shrink-0 border-r border-border-subtle dark:border-outline-variant flex flex-col p-lg bg-surface-main dark:bg-inverse-surface overflow-y-auto custom-scrollbar select-none">
            <div className="flex items-center gap-sm text-on-surface dark:text-surface-main font-bold mb-lg border-b border-border-subtle dark:border-outline-variant pb-md">
              <span className="material-symbols-outlined text-primary text-[20px]">groups</span>
              <h3 className="font-title-md text-title-md">Team Availability</h3>
            </div>

            <div className="space-y-md">
              {teamAvailability.map((member, idx) => (
                <div
                  key={idx}
                  className="p-md rounded-2xl border border-border-subtle dark:border-outline-variant bg-surface-sunken dark:bg-inverse-surface/40 flex flex-col gap-sm hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-sm">
                      <img
                        className="w-10 h-10 rounded-full object-cover border border-border-subtle dark:border-outline-variant"
                        alt={`${member.name} headshot.`}
                        src={member.avatar}
                      />
                      <div className="text-left">
                        <p className="font-bold text-sm text-on-surface dark:text-surface-main leading-tight">{member.name}</p>
                        <p className="text-[10px] text-on-surface-variant dark:text-surface-variant leading-none mt-0.5">{member.role}</p>
                      </div>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${member.statusColor}`}></span>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[9px] font-label-md text-outline uppercase tracking-wider mb-1">
                      <span>Load</span>
                      <span className="font-bold">{member.load}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container dark:bg-on-surface-variant/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${member.barColor}`}
                        style={{ width: `${member.load}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => alert("Launching Full availability roster panel...")}
                className="w-full py-sm border border-dashed border-border-subtle dark:border-outline-variant rounded-xl text-center font-label-md text-[11px] text-on-surface-variant dark:text-surface-variant hover:border-primary dark:hover:border-inverse-primary hover:text-primary dark:hover:text-inverse-primary transition-colors cursor-pointer"
              >
                + View all members
              </button>
            </div>
          </aside>

          {/* Column 2: Calendar Main Grid */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between px-lg py-md border-b border-border-subtle dark:border-outline-variant bg-surface-main dark:bg-inverse-surface shrink-0 select-none">
              <div className="flex items-center gap-md">
                <button
                  onClick={() => alert("Reverting to current day details...")}
                  className="px-md h-9 border border-border-subtle dark:border-outline-variant rounded-lg font-button-text text-button-text text-on-surface dark:text-surface-variant hover:bg-surface-container dark:hover:bg-on-surface-variant/20 transition-all cursor-pointer"
                >
                  Today
                </button>
                <div className="flex items-center gap-xs">
                  <button className="material-symbols-outlined text-[20px] text-on-surface-variant p-1 rounded-full hover:bg-surface-container dark:hover:bg-on-surface-variant/20 cursor-pointer">
                    chevron_left
                  </button>
                  <button className="material-symbols-outlined text-[20px] text-on-surface-variant p-1 rounded-full hover:bg-surface-container dark:hover:bg-on-surface-variant/20 cursor-pointer">
                    chevron_right
                  </button>
                </div>
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface dark:text-surface-main">
                  {selectedMonth}
                </h2>
              </div>

              {/* View Switches & Action Buttons */}
              <div className="flex items-center gap-md">
                <div className="flex border border-border-subtle dark:border-outline-variant rounded-lg p-0.5 bg-surface-sunken dark:bg-inverse-surface">
                  {["Day", "Week", "Month", "Year"].map((tab) => {
                    const isSelected = viewTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setViewTab(tab)}
                        className={`px-sm py-1 rounded-md text-body-sm font-semibold transition-all ${
                          isSelected
                            ? "bg-surface-main text-primary dark:bg-on-surface-variant dark:text-surface-main shadow-sm"
                            : "text-on-surface-variant dark:text-surface-variant hover:text-on-surface"
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-sm">
                  <button
                    onClick={() => alert("Opening calendar filters matrix...")}
                    className="flex items-center gap-xs px-md h-9 border border-border-subtle dark:border-outline-variant rounded-lg font-button-text text-button-text text-on-surface dark:text-surface-variant hover:bg-surface-container dark:hover:bg-on-surface-variant/20 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">filter_alt</span>
                    Filter
                  </button>
                  <button
                    onClick={() => alert("Simulating export of calendar schedules...")}
                    className="flex items-center gap-xs px-md h-9 border border-border-subtle dark:border-outline-variant rounded-lg font-button-text text-button-text text-on-surface dark:text-surface-variant hover:bg-surface-container dark:hover:bg-on-surface-variant/20 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Table Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface-main dark:bg-inverse-surface flex flex-col">
              {/* Day Headers (4 Columns to match screenshot) */}
              <div className="grid grid-cols-4 border-b border-border-subtle dark:border-outline-variant py-sm text-[10px] font-label-md text-outline select-none text-center bg-surface-sunken dark:bg-inverse-surface/60">
                <div>SUN</div>
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
              </div>

              {/* Grid cells */}
              <div className="flex-1 grid grid-cols-4 divide-x divide-y divide-border-subtle dark:divide-outline-variant min-h-[480px]">
                {calendarGrid.map((week, weekIdx) =>
                  week.map((cell, cellIdx) => {
                    const dayEvents = events.filter((e) => e.date === cell.dateStr);
                    
                    return (
                      <div
                        key={`${weekIdx}-${cellIdx}`}
                        className={`p-sm flex flex-col gap-sm text-left min-h-[100px] transition-colors relative hover:bg-surface-sunken/40 dark:hover:bg-on-surface-variant/10 ${
                          !cell.isCurrentMonth
                            ? "text-outline/40 dark:text-surface-variant/30 bg-surface-sunken/10"
                            : "text-on-surface dark:text-surface-main font-semibold"
                        }`}
                      >
                        {/* Day number cell top */}
                        <div className="flex items-center justify-between select-none">
                          <span className={`text-[12px] ${!cell.isCurrentMonth ? "opacity-40" : ""}`}>
                            {cell.day}
                          </span>
                          
                          {/* TODAY indicator badge */}
                          {cell.isToday && (
                            <span className="bg-primary text-white text-[9px] font-label-md px-2 py-0.5 rounded-md uppercase tracking-wider font-bold">
                              Today
                            </span>
                          )}
                        </div>

                        {/* Cell Events list */}
                        <div className="flex-1 flex flex-col gap-xs overflow-hidden select-none">
                          {dayEvents.map((evt) => {
                            let colorClasses = "bg-primary-container text-white border-primary";
                            if (evt.color === "green") {
                              colorClasses = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30";
                            } else if (evt.color === "yellow") {
                              colorClasses = "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30";
                            } else if (evt.color === "red") {
                              colorClasses = "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800/30";
                            } else if (evt.color === "blue") {
                              colorClasses = "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30";
                            }

                            return (
                              <div
                                key={evt.id}
                                className={`text-[10px] py-1 px-sm rounded-lg truncate text-left border ${colorClasses} hover:brightness-95 cursor-pointer font-medium`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert(`Event details: ${evt.title} on ${evt.date}`);
                                }}
                              >
                                {evt.title}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Upcoming Events & Mini Widgets */}
          <aside className="w-80 shrink-0 border-l border-border-subtle dark:border-outline-variant flex flex-col p-lg bg-surface-main dark:bg-inverse-surface overflow-y-auto custom-scrollbar select-none relative">
            <div className="flex items-center justify-between mb-lg border-b border-border-subtle dark:border-outline-variant pb-md">
              <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main">
                Upcoming Events
              </h3>
              <button
                onClick={() => alert("Launching upcoming events calendar roster...")}
                className="text-primary dark:text-inverse-primary text-[11px] font-semibold hover:underline"
              >
                See All
              </button>
            </div>

            {/* Events List */}
            <div className="space-y-md mb-lg">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className={`p-md rounded-2xl border-l-[3px] border bg-surface-sunken dark:bg-inverse-surface/40 border-border-subtle dark:border-outline-variant flex flex-col gap-xs ${evt.styleClass}`}
                >
                  <span className="text-[10px] font-label-md text-outline tracking-wider font-semibold">
                    {evt.time}
                  </span>
                  <h4 className="font-bold text-sm text-on-surface dark:text-surface-main leading-tight">
                    {evt.title}
                  </h4>
                  <p className="font-body-sm text-[11px] text-on-surface-variant dark:text-surface-variant leading-normal">
                    {evt.description}
                  </p>

                  {/* Avatars Stack */}
                  {evt.avatars.length > 0 && (
                    <div className="flex -space-x-2 mt-2 items-center">
                      {evt.avatars.map((av, idx) => (
                        <img
                          key={idx}
                          className="w-6 h-6 rounded-full border border-white dark:border-inverse-surface object-cover"
                          alt="Attendee avatar stack."
                          src={av}
                        />
                      ))}
                      {evt.extraCount > 0 && (
                        <div className="w-6 h-6 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center border border-white dark:border-inverse-surface">
                          +{evt.extraCount}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mini Calendar Widget for November 2024 */}
            <div className="border border-border-subtle dark:border-outline-variant rounded-2xl p-md bg-surface-sunken dark:bg-inverse-surface/30 mb-lg">
              <div className="flex items-center justify-between mb-sm">
                <span className="font-title-md text-sm font-bold text-on-surface dark:text-surface-main">
                  November 2024
                </span>
                <div className="flex items-center gap-xs">
                  <button className="material-symbols-outlined text-[16px] text-on-surface-variant p-0.5 rounded-full hover:bg-surface-container dark:hover:bg-on-surface-variant/20 cursor-pointer">
                    chevron_left
                  </button>
                  <button className="material-symbols-outlined text-[16px] text-on-surface-variant p-0.5 rounded-full hover:bg-surface-container dark:hover:bg-on-surface-variant/20 cursor-pointer">
                    chevron_right
                  </button>
                </div>
              </div>

              {/* S M T W T F S header */}
              <div className="grid grid-cols-7 text-center text-[9px] font-label-md text-outline mb-2">
                <span>S</span>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 text-center text-[10px] font-body-sm font-medium text-on-surface dark:text-surface-variant gap-y-1">
                {/* Grayed previous dates */}
                <span className="opacity-30">27</span>
                <span className="opacity-30">28</span>
                <span className="opacity-30">29</span>
                <span className="opacity-30">30</span>
                <span className="opacity-30">31</span>
                {/* November dates */}
                <span>1</span>
                <span>2</span>
                
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                {/* 7th highlighted with blue box */}
                <span className="w-5 h-5 flex items-center justify-center border border-primary text-primary font-bold rounded mx-auto select-none">
                  7
                </span>
                <span>8</span>
                <span>9</span>
              </div>
            </div>

            {/* Pro Tip Card */}
            <div className="border border-border-subtle dark:border-outline-variant bg-surface-container-low dark:bg-on-surface-variant/20 rounded-2xl p-md flex gap-sm text-left">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                lightbulb
              </span>
              <div>
                <h5 className="text-[11px] font-bold text-primary dark:text-inverse-primary select-none uppercase tracking-wide">
                  Pro Tip
                </h5>
                <p className="font-body-sm text-[11px] text-on-surface-variant dark:text-surface-variant leading-normal mt-0.5">
                  Drag and drop events to quickly reschedule tasks. Hover over a task badge to see more details.
                </p>
              </div>
            </div>

            {/* Floating Action Button (FAB) at the bottom right */}
            <button
              onClick={() => setIsAddEventOpen(true)}
              className="absolute bottom-4 right-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:brightness-110 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer z-20"
            >
              <span className="material-symbols-outlined text-[24px]">add</span>
            </button>
          </aside>
        </div>
      </main>

      {/* Add Calendar Event Modal */}
      {isAddEventOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-md">
          <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-2xl max-w-md w-full p-lg shadow-xl animate-fade-in text-left">
            <div className="flex justify-between items-center border-b border-border-subtle dark:border-outline-variant pb-md">
              <h3 className="font-title-lg text-title-lg font-bold text-on-surface dark:text-surface-main flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">event_note</span>
                Schedule New Event
              </h3>
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="material-symbols-outlined text-outline hover:text-on-surface cursor-pointer rounded-full p-1"
              >
                close
              </button>
            </div>

            <form onSubmit={handleAddEventSubmit} className="space-y-md mt-md">
              <div>
                <label className="block text-body-sm font-semibold text-on-surface-variant dark:text-surface-variant mb-1">
                  Event Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Q4 Executive Sync"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full border border-border-subtle dark:border-outline-variant rounded-xl px-md py-sm bg-surface-sunken dark:bg-inverse-surface text-body-md outline-none focus:border-primary text-on-surface dark:text-surface-main"
                />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="block text-body-sm font-semibold text-on-surface-variant dark:text-surface-variant mb-1">
                    Date
                  </label>
                  <input
                    required
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full border border-border-subtle dark:border-outline-variant rounded-xl px-md py-sm bg-surface-sunken dark:bg-inverse-surface text-body-sm outline-none focus:border-primary text-on-surface dark:text-surface-main"
                  />
                </div>

                <div>
                  <label className="block text-body-sm font-semibold text-on-surface-variant dark:text-surface-variant mb-1">
                    Start Time
                  </label>
                  <input
                    required
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full border border-border-subtle dark:border-outline-variant rounded-xl px-md py-sm bg-surface-sunken dark:bg-inverse-surface text-body-sm outline-none focus:border-primary text-on-surface dark:text-surface-main"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="block text-body-sm font-semibold text-on-surface-variant dark:text-surface-variant mb-1">
                    Color Indicator
                  </label>
                  <select
                    value={eventColor}
                    onChange={(e) => setEventColor(e.target.value)}
                    className="w-full border border-border-subtle dark:border-outline-variant rounded-xl px-md h-10 bg-surface-sunken dark:bg-inverse-surface text-body-sm outline-none text-on-surface dark:text-surface-main"
                  >
                    <option value="blue">Blue (Meeting/Sync)</option>
                    <option value="green">Green (Milestone/Kickoff)</option>
                    <option value="yellow">Yellow (Social/Lunch)</option>
                    <option value="red">Red (Critical/Deadline)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-body-sm font-semibold text-on-surface-variant dark:text-surface-variant mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Discuss agenda milestones and project status update details..."
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full border border-border-subtle dark:border-outline-variant rounded-xl px-md py-sm bg-surface-sunken dark:bg-inverse-surface text-body-md outline-none focus:border-primary text-on-surface dark:text-surface-main"
                ></textarea>
              </div>

              <div className="flex gap-md justify-end pt-md border-t border-border-subtle dark:border-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-lg h-10 border border-border-subtle dark:border-outline-variant rounded-xl hover:bg-surface-container dark:hover:bg-on-surface-variant/20 font-button-text text-button-text text-on-surface dark:text-surface-variant cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-lg h-10 bg-primary text-white rounded-xl hover:brightness-110 shadow-md font-button-text text-button-text cursor-pointer"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
