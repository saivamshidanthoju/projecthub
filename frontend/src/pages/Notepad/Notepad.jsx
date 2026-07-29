import React, { useState, useEffect } from "react";
import DoubleSidebarLayout from "../../layouts/DoubleSidebarLayout";
import { useAuth } from "../../context/AuthContext";
import { notesApi } from "../../lib/api";
import { Sliders, FileText, Sparkles, Plus, Trash2, X, Maximize2, Save, Undo, Type } from "lucide-react";

export default function Notepad() {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState("plain");

  // Notepad Preferences
  const [showPrefPanel, setShowPrefPanel] = useState(false);
  const [fontFamily, setFontFamily] = useState("font-sans"); // font-sans | font-mono | font-serif
  const [fontSize, setFontSize] = useState("text-[13px]"); // text-[12px] | text-[13px] | text-[16px]
  const [theme, setTheme] = useState("theme-default"); // theme-default | theme-sepia | theme-dark

  // Search query
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all notes on load
  const fetchNotes = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await notesApi.list(token);
      setNotes(data);
    } catch (err) {
      console.error("Failed to load notes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [token]);

  // Sync quick adds or changes
  useEffect(() => {
    const syncNotes = () => {
      fetchNotes();
    };
    window.addEventListener("notes-updated", syncNotes);
    return () => window.removeEventListener("notes-updated", syncNotes);
  }, [token]);

  const handleSelectNote = (note) => {
    setSelectedNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content || "");
    setNoteType(note.type);
  };

  const handleCreateNote = async (type) => {
    if (!token) return;
    try {
      const newNote = await notesApi.create(token, {
        title: type === "rich" ? "Untitled Rich Note" : "Untitled Plain Note",
        content: "",
        type: type,
      });

      setNotes(prev => [newNote, ...prev]);
      handleSelectNote(newNote);
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  };

  // Real-time auto save using useEffect + debounce below,
  // we just keep local text state updated immediately
  const handleContentChange = (content) => {
    setNoteContent(content);
  };

  const handleTitleChange = (title) => {
    setNoteTitle(title);
  };

  // Debounced auto-save effect
  useEffect(() => {
    if (!selectedNoteId || !token) return;

    const currentNote = notes.find(n => n.id === selectedNoteId);
    if (!currentNote) return;
    if (currentNote.title === noteTitle && currentNote.content === noteContent) return;

    const timer = setTimeout(async () => {
      try {
        const updated = await notesApi.update(token, selectedNoteId, {
          title: noteTitle,
          content: noteContent,
          type: noteType
        });
        setNotes(prev => prev.map(n => n.id === selectedNoteId ? updated : n));
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [noteTitle, noteContent, selectedNoteId, token]);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!token) return;
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await notesApi.remove(token, id);
        setNotes(prev => prev.filter(n => n.id !== id));
        if (selectedNoteId === id) {
          setSelectedNoteId(null);
          setNoteTitle("");
          setNoteContent("");
        }
      } catch (err) {
        console.error("Failed to delete note:", err);
      }
    }
  };

  const toggleSidebarFullScreen = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  const filteredNotes = notes.filter(n => 
    (n.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (n.content || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  // Class configurations based on preferences
  const getThemeClass = () => {
    if (theme === "theme-sepia") return "bg-[#faf6eb] text-[#433422]";
    if (theme === "theme-dark") return "bg-[#1e293b] text-[#f8fafc]";
    return "bg-white text-[#0f172a]";
  };

  const getInputThemeClass = () => {
    if (theme === "theme-sepia") return "bg-transparent text-[#433422] border-[#e4dec9]";
    if (theme === "theme-dark") return "bg-transparent text-[#f8fafc] border-slate-700";
    return "bg-transparent text-[#0f172a] border-slate-100";
  };

  return (
    <DoubleSidebarLayout>
      <div className="flex flex-col h-full w-full bg-white relative text-left">
        
        {/* Header */}
        <header className="flex items-center justify-between h-12 px-6 border-b border-[#eef1f6] shrink-0 select-none">
          <div className="flex items-center gap-4">
            <h1 className="text-[14px] font-bold text-[#0f172a]">Notepad</h1>
            <button 
              onClick={toggleSidebarFullScreen}
              className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100"
              title="Full screen workspace"
            >
              <Maximize2 size={13} />
            </button>
          </div>
          
          <button 
            onClick={() => setShowPrefPanel(!showPrefPanel)}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500 hover:text-slate-700 transition-colors"
          >
            <Sliders size={13} className="text-slate-400" />
            <span>Preferences</span>
          </button>
        </header>

        {/* Layout split view: notes sidebar + large canvas */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Notes list sidebar panel */}
          <div className="w-60 border-r border-[#eef1f6] flex flex-col shrink-0 bg-slate-50/50">
            <div className="p-3 border-b border-[#eef1f6] flex flex-col gap-2">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:border-[#2563eb] outline-none"
              />
              
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                <button 
                  onClick={() => handleCreateNote("plain")}
                  className="flex items-center justify-center gap-1 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-[10px] font-semibold"
                >
                  <Plus size={11} />
                  <span>Plain note</span>
                </button>
                <button 
                  onClick={() => handleCreateNote("rich")}
                  className="flex items-center justify-center gap-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-semibold"
                >
                  <Sparkles size={11} />
                  <span>Rich note</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleSelectNote(note)}
                  className={`p-2.5 rounded-lg text-left cursor-pointer transition-colors group flex flex-col justify-between gap-1.5 relative ${
                    selectedNoteId === note.id 
                      ? "bg-white shadow-sm border border-slate-200/60" 
                      : "hover:bg-slate-100/70"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        note.type === "rich" ? "bg-purple-100 text-purple-700" : "bg-slate-200 text-slate-700"
                      }`}>
                        {note.type === "rich" ? "Rich" : "Plain"}
                      </span>
                      <button 
                        onClick={(e) => handleDelete(note.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-0.5"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <h4 className="text-[12px] font-semibold text-slate-800 truncate mt-1">{note.title || "Untitled"}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{note.content || "Empty content..."}</p>
                  </div>
                  <div className="text-[9px] text-slate-400 font-medium self-end">{note.createdAt}</div>
                </div>
              ))}

              {filteredNotes.length === 0 && (
                <div className="py-12 text-center text-[11px] text-slate-400 font-medium">No notes saved</div>
              )}
            </div>
          </div>

          {/* Note Canvas panel */}
          <div className={`flex-1 flex flex-col overflow-hidden transition-colors duration-150 ${getThemeClass()}`}>
            {selectedNoteId ? (
              <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Note Title"
                  className={`w-full text-base font-bold outline-none border-b pb-2 mb-4 tracking-tight ${getInputThemeClass()}`}
                />
                
                {/* Rich formatting tools if rich text mode */}
                {noteType === "rich" && (
                  <div className="flex items-center gap-1 mb-3 pb-2 border-b border-slate-100 text-slate-400 select-none">
                    <button onClick={() => alert("Bold format applied.")} className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-700 text-xs font-bold">B</button>
                    <button onClick={() => alert("Italics format applied.")} className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-700 text-xs italic">I</button>
                    <button onClick={() => alert("Underline format applied.")} className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-700 text-xs underline">U</button>
                    <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
                    <button onClick={() => alert("Bullet list format.")} className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-700 text-xs">• List</button>
                  </div>
                )}

                <textarea
                  value={noteContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Start writing..."
                  className={`flex-1 w-full outline-none resize-none leading-relaxed bg-transparent ${fontFamily} ${fontSize}`}
                />
              </div>
            ) : (
              // Empty State matching Image 2
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none bg-white">
                <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
                  <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="22" y="14" width="56" height="72" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                    <rect x="26" y="10" width="52" height="80" rx="8" fill="#f59e0b" />
                    <rect x="26" y="10" width="8" height="80" fill="#d97706" opacity="0.4" />
                    <rect x="36" y="10" width="42" height="80" rx="4" fill="white" />
                    <line x1="42" y1="22" x2="72" y2="22" stroke="#e2e8f0" strokeWidth="1.5" />
                    <line x1="42" y1="32" x2="72" y2="32" stroke="#e2e8f0" strokeWidth="1.5" />
                    <line x1="42" y1="42" x2="72" y2="42" stroke="#e2e8f0" strokeWidth="1.5" />
                    <line x1="42" y1="52" x2="72" y2="52" stroke="#e2e8f0" strokeWidth="1.5" />
                    <line x1="42" y1="62" x2="72" y2="62" stroke="#e2e8f0" strokeWidth="1.5" />
                    <line x1="42" y1="72" x2="72" y2="72" stroke="#e2e8f0" strokeWidth="1.5" />
                    <line x1="42" y1="80" x2="72" y2="80" stroke="#e2e8f0" strokeWidth="1.5" />
                    <rect x="31" y="18" width="5" height="3" rx="1.5" fill="#94a3b8" />
                    <rect x="31" y="28" width="5" height="3" rx="1.5" fill="#94a3b8" />
                    <rect x="31" y="38" width="5" height="3" rx="1.5" fill="#94a3b8" />
                    <rect x="31" y="48" width="5" height="3" rx="1.5" fill="#94a3b8" />
                    <rect x="31" y="58" width="5" height="3" rx="1.5" fill="#94a3b8" />
                    <rect x="31" y="68" width="5" height="3" rx="1.5" fill="#94a3b8" />
                    <rect x="31" y="78" width="5" height="3" rx="1.5" fill="#94a3b8" />
                  </svg>
                </div>

                <p className="max-w-[420px] text-[13px] text-slate-500 font-medium leading-relaxed mb-6">
                  You can create a note with simple text or rich text format for your endless ideas. Record, plan, execute!
                </p>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleCreateNote("plain")}
                    className="flex items-center justify-center gap-2 text-[13px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] hover:underline"
                  >
                    <FileText size={15} className="text-[#2563eb]" />
                    <span>New Plain Text Note</span>
                  </button>
                  <button 
                    onClick={() => handleCreateNote("rich")}
                    className="flex items-center justify-center gap-2 text-[13px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] hover:underline"
                  >
                    <Sparkles size={15} className="text-[#2563eb]" />
                    <span>New Rich Text Note</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preferences Side-panel Modal */}
        {showPrefPanel && (
          <div className="absolute top-12 right-0 bottom-0 w-64 bg-white border-l border-slate-200 shadow-xl p-5 z-40 text-xs text-slate-600 flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-800">Editor Settings</span>
              <button onClick={() => setShowPrefPanel(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            {/* Fonts */}
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Font Family</span>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { label: "Sans", val: "font-sans" },
                  { label: "Serif", val: "font-serif" },
                  { label: "Mono", val: "font-mono" }
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setFontFamily(item.val)}
                    className={`py-1.5 rounded-lg border text-[10px] font-bold ${
                      fontFamily === item.val ? "bg-slate-100 border-slate-300 text-slate-800" : "border-slate-200 text-slate-500"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Font Size</span>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { label: "Small", val: "text-[12px]" },
                  { label: "Medium", val: "text-[13px]" },
                  { label: "Large", val: "text-[16px]" }
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setFontSize(item.val)}
                    className={`py-1.5 rounded-lg border text-[10px] font-bold ${
                      fontSize === item.val ? "bg-slate-100 border-slate-300 text-slate-800" : "border-slate-200 text-slate-500"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme selection */}
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Canvas Theme</span>
              <div className="flex flex-col gap-1.5">
                {[
                  { name: "Default White", val: "theme-default" },
                  { name: "Warm Sepia", val: "theme-sepia" },
                  { name: "Midnight Slate", val: "theme-dark" }
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setTheme(item.val)}
                    className={`w-full py-1.5 px-3 rounded-lg border text-left font-bold text-[10px] capitalize transition-all ${
                      theme === item.val ? "bg-slate-100 border-slate-300 text-slate-800" : "border-slate-200 text-slate-500"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DoubleSidebarLayout>
  );
}
