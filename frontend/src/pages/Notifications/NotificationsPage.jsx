import React, { useState, useEffect } from "react";
import DoubleSidebarLayout from "../../layouts/DoubleSidebarLayout";
import { useAuth } from "../../context/AuthContext";
import { notificationsApi } from "../../lib/api";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await notificationsApi.list(token);
        setNotifications(data || []);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [token]);

  return (
    <DoubleSidebarLayout>
      <div className="flex flex-col h-full w-full bg-white">
        {/* Header matching Image 1 */}
        <header className="flex items-center h-12 px-6 border-b border-[#eef1f6] shrink-0 select-none">
          <div className="flex items-center gap-8">
            <h1 className="text-[14px] font-bold text-[#0f172a]">Notifications</h1>
            
            {/* Tabs */}
            <div className="flex items-center h-12">
              <button className="text-[13px] font-semibold text-[#2563eb] border-b-2 border-[#2563eb] h-full px-2 mt-[2px]">
                All notifications
              </button>
            </div>
          </div>
        </header>

        {/* Content area with empty state */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 select-none">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center">
              {/* Custom Yellow/Orange Bell with Red "0" Badge */}
              <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
                {/* SVG for a beautiful gradient bell matching screenshot */}
                <svg className="w-20 h-20 drop-shadow-[0_4px_12px_rgba(251,191,36,0.15)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="bellGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fcd34d" />
                      <stop offset="60%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2C10.89 2 10 2.89 10 4V4.26C7.12 5.05 5 7.62 5 10.75V15.75L3 17.75V18.75H21V17.75L19 15.75V10.75C19 7.62 16.88 5.05 14 4.26V4C14 2.89 13.11 2 12 2Z" fill="url(#bellGradient)" />
                  <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z" fill="#f59e0b" />
                </svg>
                
                {/* Red Circular Badge containing "0" */}
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                  0
                </div>
              </div>
              
              {/* Message text */}
              <p className="text-[13px] text-slate-500 font-medium">
                You have no notifications
              </p>
            </div>
          ) : (
            <div className="w-full max-w-2xl divide-y divide-slate-100">
              {notifications.map((n) => (
                <div key={n.id} className="py-3 px-4 hover:bg-slate-50 flex items-start justify-between rounded-lg transition-colors">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{n.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(n.created_at || n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DoubleSidebarLayout>
  );
}
