import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoubleSidebarLayout from "../../layouts/DoubleSidebarLayout";
import { useAuth } from "../../context/AuthContext";
import { myWorkApi } from "../../lib/api";
import { 
  Maximize2, 
  Calendar as CalendarIcon, 
  User, 
  ChevronDown, 
  Sliders, 
  MoreHorizontal, 
  Plus, 
  Inbox,
  X,
  Trash2
} from "lucide-react";

export default function MyWork() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Week");
  
  // Custom tasks for columns from DB
  const [columnItems, setColumnItems] = useState({
    inbox: [],
    today: [],
    tomorrow: [],
    upcoming: []
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch items from database on load
  useEffect(() => {
    const fetchItems = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const data = await myWorkApi.list(token);
        setColumnItems(data);
      } catch (err) {
        console.error("Failed to fetch My Work items:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [token]);

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetColumn, setTargetColumn] = useState("today");
  const [taskTitle, setTaskTitle] = useState("");
  const [editingCardId, setEditingCardId] = useState(null);

  // Preferences controls
  const [showPrefPanel, setShowPrefPanel] = useState(false);
  const [filterUser, setFilterUser] = useState("All Work");

  // Helper to get date info matching screenshots
  const getColumn4Name = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const handleAddItem = (columnKey) => {
    setTargetColumn(columnKey);
    setTaskTitle("");
    setEditingCardId(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (columnKey, card, e) => {
    e.stopPropagation();
    setTargetColumn(columnKey);
    setTaskTitle(card.title);
    setEditingCardId(card.id);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !token) return;

    try {
      if (editingCardId) {
        // Edit mode
        const updatedItem = await myWorkApi.update(token, editingCardId, {
          title: taskTitle,
          column_key: targetColumn,
          assigned_user: filterUser === "All Work" ? "Me" : filterUser
        });

        const updatedList = columnItems[targetColumn].map(item => 
          item.id === editingCardId ? updatedItem : item
        );
        setColumnItems({
          ...columnItems,
          [targetColumn]: updatedList
        });
      } else {
        // Create mode
        const newItem = await myWorkApi.create(token, {
          title: taskTitle,
          column_key: targetColumn,
          assigned_user: filterUser === "All Work" ? "Me" : filterUser
        });

        setColumnItems({
          ...columnItems,
          [targetColumn]: [...columnItems[targetColumn], newItem]
        });
      }
      setIsModalOpen(false);
      setTaskTitle("");
      setEditingCardId(null);
    } catch (err) {
      console.error("Failed to save work item:", err);
    }
  };

  const handleDeleteItem = async (columnKey, id, e) => {
    if (e) e.stopPropagation();
    if (!token) return;
    if (confirm("Delete this work item?")) {
      try {
        await myWorkApi.remove(token, id);
        const updatedList = columnItems[columnKey].filter(item => item.id !== id);
        setColumnItems({
          ...columnItems,
          [columnKey]: updatedList
        });
        if (editingCardId === id) {
          setIsModalOpen(false);
        }
      } catch (err) {
        console.error("Failed to delete work item:", err);
      }
    }
  };

  const toggleSidebarFullScreen = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  return (
    <DoubleSidebarLayout>
      <div className="flex flex-col h-full w-full bg-white relative text-left">
        {/* Header matching Image 5 */}
        <header className="flex items-center h-12 px-6 border-b border-[#eef1f6] shrink-0 select-none justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-[14px] font-bold text-[#0f172a]">My Work</h1>
            
            {/* Tabs */}
            <div className="flex items-center gap-4 h-12">
              {["Week"].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[13px] font-semibold h-full px-1 border-b-2 transition-all ${
                    activeTab === tab 
                      ? "text-[#2563eb] border-[#2563eb]" 
                      : "text-slate-500 border-transparent hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleAddItem("inbox")} 
                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-[#2563eb]"
                title="Add Work to Inbox"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </header>

        {/* Toolbar matching Image 5 */}
        <div className="flex items-center justify-between px-4 md:px-6 py-2 border-b border-[#eef1f6] bg-slate-50/40 select-none shrink-0 overflow-x-auto no-scrollbar whitespace-nowrap">
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={toggleSidebarFullScreen}
              className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors"
              title="Full screen workspace"
            >
              <Maximize2 size={14} />
            </button>
            <button onClick={() => navigate("/calendar")} className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100" title="Calendar list view">
              <CalendarIcon size={14} className="text-slate-400" />
            </button>
            
            <div className="w-[1px] h-4 bg-slate-200"></div>

            {/* View for Filter dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-2 py-1 text-slate-500 hover:text-slate-700 rounded hover:bg-slate-100 text-[12px] font-medium transition-colors">
                <User size={13} className="text-slate-400" />
                <span>View: {filterUser}</span>
                <ChevronDown size={11} className="text-slate-400" />
              </button>
              <div className="absolute left-0 mt-1 hidden group-hover:block w-32 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-xs text-left">
                <button onClick={() => setFilterUser("All Work")} className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-600 block">All Work</button>
                <button onClick={() => setFilterUser("Me")} className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-600 block">Assigned to Me</button>
                <button onClick={() => setFilterUser("Shared")} className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-600 block">Shared Tasks</button>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Columns Container */}
        <div className="flex-1 overflow-x-auto flex select-none p-6 gap-6 bg-white custom-scrollbar-horizontal">
          
          {/* Column 1: Inbox */}
          <div className="w-[280px] shrink-0 flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-[13px] font-bold text-slate-700">Inbox</h3>
              <button onClick={() => handleAddItem("inbox")} className="text-slate-400 hover:text-[#2563eb]"><Plus size={14} /></button>
            </div>
            <div className="flex-1 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-start overflow-y-auto">
              {columnItems.inbox.length === 0 ? (
                <span className="text-[12px] text-slate-400 font-medium my-auto text-center w-full">No items found</span>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  {columnItems.inbox.map(item => (
                    <div 
                      key={item.id} 
                      onClick={(e) => handleEditItem("inbox", item, e)}
                      className="bg-white border border-[#eef1f6] p-3 rounded-lg shadow-sm flex items-center justify-between hover:border-slate-300 cursor-pointer"
                    >
                      <span className="text-[12px] text-[#0f172a] font-semibold">{item.title}</span>
                      <button onClick={(e) => handleDeleteItem("inbox", item.id, e)} className="text-slate-400 hover:text-red-500 text-xs px-1">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Today */}
          <div className="w-[280px] shrink-0 flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-[13px] font-bold text-slate-700">Today</h3>
              <button onClick={() => handleAddItem("today")} className="text-slate-400 hover:text-[#2563eb]"><Plus size={14} /></button>
            </div>
            <div className="flex-1 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-start overflow-y-auto">
              {columnItems.today.length === 0 ? (
                <span className="text-[12px] text-slate-400 font-medium my-auto text-center w-full">No work planned for this date</span>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  {columnItems.today.map(item => (
                    <div 
                      key={item.id} 
                      onClick={(e) => handleEditItem("today", item, e)}
                      className="bg-white border border-[#eef1f6] p-3 rounded-lg shadow-sm flex items-center justify-between hover:border-slate-300 cursor-pointer"
                    >
                      <span className="text-[12px] text-[#0f172a] font-semibold">{item.title}</span>
                      <button onClick={(e) => handleDeleteItem("today", item.id, e)} className="text-slate-400 hover:text-red-500 text-xs px-1">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Tomorrow */}
          <div className="w-[280px] shrink-0 flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-[13px] font-bold text-slate-700">Tomorrow</h3>
              <button onClick={() => handleAddItem("tomorrow")} className="text-slate-400 hover:text-[#2563eb]"><Plus size={14} /></button>
            </div>
            <div className="flex-1 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between overflow-y-auto min-h-[300px]">
              {columnItems.tomorrow.length === 0 ? (
                <span className="text-[12px] text-slate-400 font-medium my-auto text-center w-full">No work planned for this date</span>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  {columnItems.tomorrow.map(item => (
                    <div 
                      key={item.id} 
                      onClick={(e) => handleEditItem("tomorrow", item, e)}
                      className="bg-white border border-[#eef1f6] p-3 rounded-lg shadow-sm flex items-center justify-between hover:border-slate-300 cursor-pointer"
                    >
                      <span className="text-[12px] text-[#0f172a] font-semibold">{item.title}</span>
                      <button onClick={(e) => handleDeleteItem("tomorrow", item.id, e)} className="text-slate-400 hover:text-red-500 text-xs px-1">×</button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Plus Outline Box matching Image 5 */}
              <div className="mt-auto pt-4 flex justify-center shrink-0">
                <button 
                  onClick={() => handleAddItem("tomorrow")}
                  className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Column 4: Wednesday, Jul 29 */}
          <div className="w-[280px] shrink-0 flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-[13px] font-bold text-slate-700">{getColumn4Name()}</h3>
              <button onClick={() => handleAddItem("upcoming")} className="text-slate-400 hover:text-[#2563eb]"><Plus size={14} /></button>
            </div>
            <div className="flex-1 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-start overflow-y-auto">
              {columnItems.upcoming.length === 0 ? (
                <span className="text-[12px] text-slate-400 font-medium my-auto text-center w-full">No work planned for this date</span>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  {columnItems.upcoming.map(item => (
                    <div 
                      key={item.id} 
                      onClick={(e) => handleEditItem("upcoming", item, e)}
                      className="bg-white border border-[#eef1f6] p-3 rounded-lg shadow-sm flex items-center justify-between hover:border-slate-300 cursor-pointer"
                    >
                      <span className="text-[12px] text-[#0f172a] font-semibold">{item.title}</span>
                      <button onClick={(e) => handleDeleteItem("upcoming", item.id, e)} className="text-slate-400 hover:text-red-500 text-xs px-1">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preferences Side panel */}
        {showPrefPanel && (
          <div className="absolute top-12 right-0 bottom-0 w-64 bg-white border-l border-slate-200 shadow-xl p-5 z-40 text-xs text-slate-600 flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-800">Workspace Settings</span>
              <button onClick={() => setShowPrefPanel(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            
            <button 
              onClick={async () => {
                if (confirm("Reset all board columns?")) {
                  try {
                    const deletePromises = [];
                    Object.keys(columnItems).forEach(col => {
                      columnItems[col].forEach(item => {
                        deletePromises.push(myWorkApi.remove(token, item.id));
                      });
                    });
                    await Promise.all(deletePromises);
                    setColumnItems({ inbox: [], today: [], tomorrow: [], upcoming: [] });
                    alert("Work columns reset successfully.");
                  } catch (err) {
                    console.error("Failed to reset columns:", err);
                  }
                }
              }}
              className="w-full py-2 bg-red-50 text-red-600 rounded-lg font-bold border border-red-200 text-center"
            >
              Reset Columns
            </button>
          </div>
        )}

        {/* Modal to add/edit work items */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-[9999] animate-fade-in">
            <div className="bg-white border border-[#eef1f6] rounded-xl p-6 w-[400px] max-w-full shadow-2xl text-left">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800">
                  {editingCardId ? "Edit Work Item" : `Add Work Item to ${targetColumn}`}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Item Title</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder=""
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-[#2563eb] outline-none"
                  />
                </div>

                <div className="flex justify-between items-center mt-2 gap-2">
                  {editingCardId && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteItem(targetColumn, editingCardId, e)}
                      className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 flex items-center gap-1"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  )}
                  
                  <div className="flex gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-xs font-semibold hover:bg-[#1d4ed8]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DoubleSidebarLayout>
  );
}
