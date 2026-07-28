import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DoubleSidebarLayout from "../../layouts/DoubleSidebarLayout";
import { useAuth } from "../../context/AuthContext";
import { calendarApi, teamApi, tasksApi } from "../../lib/api";

export default function Calendar() {
  const { token, user } = useAuth();
  
  const [viewTab, setViewTab] = useState("Month");
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // API loaded states
  const [events, setEvents] = useState([]);
  const [teamAvailability, setTeamAvailability] = useState([]);
  
  // Modal State for Add Event
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState(new Date().toISOString().split("T")[0]);
  const [eventTime, setEventTime] = useState("12:00");
  const [eventColor, setEventColor] = useState("rose");
  const [eventDescription, setEventDescription] = useState("");

  // Modal State for View / Delete Event
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Load calendar events, team users, and tasks
  const loadData = async () => {
    try {
      // 1. Fetch Calendar Events
      const dbEvents = await calendarApi.listEvents(token);
      setEvents(dbEvents);

      // 2. Fetch Users & Tasks to compute dynamic workloads
      const members = await teamApi.list(token);
      const tasks = await tasksApi.list(token);

      const computedAvailability = members.map(m => {
        const activeTasks = tasks.filter(t => t.assigned_to === m.user_id && t.status !== "DONE");
        const load = Math.min(activeTasks.length * 25, 100);
        
        let status = "Offline";
        let statusColor = "bg-slate-300";
        let barColor = "bg-slate-200 dark:bg-on-surface-variant/20";

        if (m.is_active) {
          status = load > 75 ? "Busy" : "Active";
          statusColor = load > 75 ? "bg-amber-500" : "bg-emerald-500";
          barColor = load > 75 ? "bg-red-600" : "bg-primary";
        }

        const fullName = `${m.first_name || ""} ${m.last_name || ""}`.trim() || m.email;

        return {
          name: fullName,
          role: m.role_id === 1 ? "Admin" : m.role_id === 2 ? "Manager" : "Member",
          load,
          status,
          statusColor,
          barColor,
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD71_WId36rvfuPNoxKGJ-w-ieAFxLTHrKxJRxjd12MGRASKQsnGJXo3Kxcp-XK7kd0koMgUjDTMN1xEabBUKaLRGfzYB62aNGccvgt76GWi5ySyYH0bjhxtRj_j5BQkQ-tXgDecssf0nKafomlsYkJkvps5jobV94oPFs9D4q_1TkQnWj-YS1nQ60zxIBr9TZPKhSE6o9m04VJkWVQw4-jPJTaTYOBDc5tQ4B7DMbgcIzt0gJNpZ51Z43qbGnhgLBujLS4vpPA5oA"
        };
      });

      setTeamAvailability(computedAvailability);

    } catch (err) {
      console.error("Failed to load calendar page datasets:", err);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  // Calendar Navigation
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Add event handler
  const handleAddEventSubmit = async (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    try {
      const payload = {
        title: eventTitle,
        description: eventDescription,
        event_date: eventDate,
        event_time: eventTime,
        color: eventColor
      };

      const created = await calendarApi.createEvent(token, payload);
      setEvents(prev => [...prev, created]);

      // Reset form
      setEventTitle("");
      setEventDescription("");
      setEventColor("rose");
      setIsAddEventOpen(false);
    } catch (err) {
      alert(err.message || "Failed to create calendar event.");
    }
  };

  // Delete event handler
  const handleDeleteEvent = async (eventId) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await calendarApi.deleteEvent(token, eventId);
        setEvents(prev => prev.filter(e => (e.event_id || e.id) !== eventId));
        setSelectedEvent(null);
      } catch (err) {
        alert(err.message || "Failed to delete event.");
      }
    }
  };

  // Generate Month Grid Days (7 columns)
  const getGridDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    const cells = [];

    // Trailing days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthTotalDays - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({ day, isCurrentMonth: false, dateStr });
    }

    // Days of current month
    const todayStr = new Date().toISOString().split("T")[0];
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isToday = dateStr === todayStr;
      cells.push({ day, isCurrentMonth: true, dateStr, isToday });
    }

    // Leading days of next month to complete 42 cells (6 weeks of 7 days)
    const remainingCells = 42 - cells.length;
    for (let day = 1; day <= remainingCells; day++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({ day, isCurrentMonth: false, dateStr });
    }

    // Group cells into arrays of 7 days (weeks)
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }

    return weeks;
  };

  const selectedMonthLabel = currentDate.toLocaleString("default", { month: "long", year: "numeric" });
  const calendarGrid = getGridDays();

  // Upcoming events: filter events scheduled from today onwards
  const todayStr = new Date().toISOString().split("T")[0];
  const upcomingEventsList = events
    .filter(e => e.event_date.split("T")[0] >= todayStr)
    .slice(0, 5);

  return (
    <DoubleSidebarLayout>
      <div className="flex-1 flex overflow-hidden bg-slate-50/30 text-left">
          
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
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                        {member.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </div>
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

              {teamAvailability.length === 0 && (
                <p className="text-on-surface-variant text-center py-4 text-xs">No active roster records.</p>
              )}
            </div>
          </aside>

          {/* Column 2: Calendar Main Grid */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between px-lg py-md border-b border-border-subtle dark:border-outline-variant bg-surface-main dark:bg-inverse-surface shrink-0 select-none">
              <div className="flex items-center gap-md">
                <button
                  onClick={handleToday}
                  className="px-md h-9 border border-border-subtle dark:border-outline-variant rounded-lg font-button-text text-button-text text-on-surface dark:text-surface-variant hover:bg-surface-container dark:hover:bg-on-surface-variant/20 transition-all cursor-pointer bg-white"
                >
                  Today
                </button>
                <div className="flex items-center gap-xs">
                  <button onClick={handlePrevMonth} className="material-symbols-outlined text-[20px] text-on-surface-variant p-1 rounded-full hover:bg-surface-container dark:hover:bg-on-surface-variant/20 cursor-pointer">
                    chevron_left
                  </button>
                  <button onClick={handleNextMonth} className="material-symbols-outlined text-[20px] text-on-surface-variant p-1 rounded-full hover:bg-surface-container dark:hover:bg-on-surface-variant/20 cursor-pointer">
                    chevron_right
                  </button>
                </div>
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface dark:text-surface-main">
                  {selectedMonthLabel}
                </h2>
              </div>

              <div className="flex items-center gap-md">
                <button
                  onClick={() => setIsAddEventOpen(true)}
                  className="flex items-center gap-xs px-md h-9 bg-primary text-white rounded-lg font-button-text text-button-text hover:brightness-110 cursor-pointer shadow"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Create Event
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface-main dark:bg-inverse-surface flex flex-col">
              {/* Day Headers (7 Columns for complete schedule) */}
              <div className="grid grid-cols-7 border-b border-border-subtle dark:border-outline-variant py-sm text-[10px] font-label-md text-outline select-none text-center bg-surface-sunken dark:bg-inverse-surface/60">
                <div>SUN</div>
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div>FRI</div>
                <div>SAT</div>
              </div>

              {/* Grid cells */}
              <div className="flex-1 grid grid-cols-7 divide-x divide-y divide-border-subtle dark:divide-outline-variant min-h-[480px]">
                {calendarGrid.map((week, weekIdx) =>
                  week.map((cell, cellIdx) => {
                    const dayEvents = events.filter((e) => {
                      const eDate = e.event_date.split("T")[0];
                      return eDate === cell.dateStr;
                    });
                    
                    return (
                      <div
                        key={`${weekIdx}-${cellIdx}`}
                        className={`p-sm flex flex-col gap-sm text-left min-h-[100px] transition-colors relative hover:bg-surface-sunken/40 dark:hover:bg-on-surface-variant/10 ${
                          !cell.isCurrentMonth
                            ? "text-outline/40 dark:text-surface-variant/30 bg-surface-sunken/10"
                            : "text-on-surface dark:text-surface-main font-semibold"
                        }`}
                      >
                        <div className="flex items-center justify-between select-none">
                          <span className={`text-[12px] ${!cell.isCurrentMonth ? "opacity-40" : ""}`}>
                            {cell.day}
                          </span>
                          
                          {cell.isToday && (
                            <span className="bg-primary text-white text-[9px] font-label-md px-1 py-0.5 rounded-md uppercase tracking-wider font-bold">
                              Today
                            </span>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col gap-xs overflow-hidden select-none">
                          {dayEvents.map((evt) => {
                            let colorClasses = "bg-rose-50 text-rose-700 border-rose-200";
                            if (evt.color === "green") {
                              colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
                            } else if (evt.color === "yellow") {
                              colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
                            } else if (evt.color === "red") {
                              colorClasses = "bg-red-50 text-red-700 border-red-200";
                            }

                            return (
                              <div
                                key={evt.event_id || evt.id}
                                className={`text-[10px] py-0.5 px-sm rounded truncate text-left border ${colorClasses} hover:brightness-95 cursor-pointer font-medium`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(evt);
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
            </div>

            <div className="space-y-md mb-lg">
              {upcomingEventsList.map((evt) => {
                const colorBorder = evt.color === "red" ? "border-l-error" : evt.color === "green" ? "border-l-green-500" : "border-l-primary";
                return (
                  <div
                    key={evt.event_id || evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className={`p-md rounded-xl border border-l-4 bg-surface-sunken dark:bg-inverse-surface/40 border-border-subtle dark:border-outline-variant flex flex-col gap-xs cursor-pointer hover:shadow-sm ${colorBorder}`}
                  >
                    <span className="text-[10px] font-label-md text-outline tracking-wider font-semibold">
                      {new Date(evt.event_date).toLocaleDateString()} {evt.event_time ? `@ ${evt.event_time}` : ""}
                    </span>
                    <h4 className="font-bold text-sm text-on-surface dark:text-surface-main leading-tight">
                      {evt.title}
                    </h4>
                    <p className="font-body-sm text-[11px] text-on-surface-variant dark:text-surface-variant leading-normal">
                      {evt.description || "No description provided."}
                    </p>
                  </div>
                );
              })}
              {upcomingEventsList.length === 0 && (
                <p className="text-on-surface-variant text-center py-4 text-xs">No upcoming events scheduled.</p>
              )}
            </div>
          </aside>
        </div>

      {/* Add Event Modal */}
      {isAddEventOpen && (
        <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-md shrink-0 animate-fade-in">
          <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant w-full max-w-[448px] rounded-xl p-lg shadow-xl text-left">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface dark:text-surface-main">Create Calendar Event</h3>
              <button onClick={() => setIsAddEventOpen(false)} className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddEventSubmit} className="space-y-md">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant">Event Title</label>
                <input
                  className="w-full h-11 px-md bg-surface border border-border-subtle rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder=""
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant">Description</label>
                <textarea
                  className="w-full p-md bg-surface border border-border-subtle rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                  placeholder="Details about the meeting or event..."
                  rows="3"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant">Date</label>
                  <input
                    className="w-full h-11 px-md bg-surface border border-border-subtle rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant">Time</label>
                  <input
                    className="w-full h-11 px-md bg-surface border border-border-subtle rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface-variant">Label Color</label>
                <select
                  className="w-full h-11 px-md bg-surface border border-border-subtle rounded-lg text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
                  value={eventColor}
                  onChange={(e) => setEventColor(e.target.value)}
                >
                  <option value="rose">Rose (Planning)</option>
                  <option value="green">Green (Kickoff / Sync)</option>
                  <option value="yellow">Yellow (Alert / Action Required)</option>
                  <option value="red">Red (Critical / Deadline)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-primary text-white font-button-text rounded-lg shadow hover:bg-surface-tint active:scale-[0.98] transition-all flex items-center justify-center gap-xs cursor-pointer"
              >
                <span className="material-symbols-outlined">check</span> Save Event
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-md shrink-0 animate-fade-in">
          <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant w-full max-w-[400px] rounded-xl p-lg shadow-xl text-left">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-headline-md text-headline-md font-bold text-text-heading dark:text-surface-main">{selectedEvent.title}</h3>
              <button onClick={() => setSelectedEvent(null)} className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-sm text-sm mb-lg">
              <p className="text-on-surface-variant dark:text-surface-variant">
                <span className="font-semibold text-on-surface dark:text-surface-main">Date:</span> {new Date(selectedEvent.event_date).toLocaleDateString()}
              </p>
              {selectedEvent.event_time && (
                <p className="text-on-surface-variant dark:text-surface-variant">
                  <span className="font-semibold text-on-surface dark:text-surface-main">Time:</span> {selectedEvent.event_time}
                </p>
              )}
              <p className="text-on-surface-variant dark:text-surface-variant">
                <span className="font-semibold text-on-surface dark:text-surface-main">Category:</span> <span className="capitalize">{selectedEvent.color} label</span>
              </p>
              <p className="text-on-surface-variant dark:text-surface-variant leading-relaxed">
                <span className="font-semibold text-on-surface dark:text-surface-main block mb-xs">Description:</span>
                {selectedEvent.description || "No description provided."}
              </p>
            </div>

            <button
              onClick={() => handleDeleteEvent(selectedEvent.event_id || selectedEvent.id)}
              className="w-full h-10 border border-error text-error hover:bg-red-50 active:scale-[0.98] transition-all rounded-lg font-button-text flex items-center justify-center gap-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span> Delete Event
            </button>
          </div>
        </div>
      )}

    </DoubleSidebarLayout>
  );
}
