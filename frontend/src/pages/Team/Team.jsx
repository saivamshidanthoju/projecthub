import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DoubleSidebarLayout from "../../layouts/DoubleSidebarLayout";
import { useAuth } from "../../context/AuthContext";
import { teamApi } from "../../lib/api";

function mapMemberFromBackend(member) {
  const roleNameMap = {
    1: "Administrator",
    2: "Project Manager",
    3: "Team Member"
  };

  const badgeColorMap = {
    1: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/30",
    2: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30",
    3: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30"
  };

  const fullName = `${member.first_name || ""} ${member.last_name || ""}`.trim() || member.email;
  const roleName = roleNameMap[member.role_id] || "Team Member";

  return {
    id: member.user_id || member.id,
    name: fullName,
    email: member.email,
    role: roleName,
    badge: roleName.toUpperCase(),
    badgeColor: badgeColorMap[member.role_id] || badgeColorMap[3],
    department: member.role_id === 1 ? "Operations" : member.role_id === 2 ? "Product" : "Engineering",
    location: "Global",
    status: member.is_active ? "Active" : "Offline",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD71_WId36rvfuPNoxKGJ-w-ieAFxLTHrKxJRxjd12MGRASKQsnGJXo3Kxcp-XK7kd0koMgUjDTMN1xEabBUKaLRGfzYB62aNGccvgt76GWi5ySyYH0bjhxtRj_j5BQkQ-tXgDecssf0nKafomlsYkJkvps5jobV94oPFs9D4q_1TkQnWj-YS1nQ60zxIBr9TZPKhSE6o9m04VJkWVQw4-jPJTaTYOBDc5tQ4B7DMbgcIzt0gJNpZ51Z43qbGnhgLBujLS4vpPA5oA"
  };
}

export default function Team() {
  const { token, user } = useAuth();
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("Any Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Team Member");
  const [inviteLocation, setInviteLocation] = useState("San Francisco, US");

  const departments = ["Engineering", "Product", "Operations"];

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await teamApi.list(token);
        setMembers(data.map(mapMemberFromBackend));
      } catch (err) {
        console.error("Failed to load team directory:", err);
      }
    };

    if (token) {
      fetchTeam();
    }
  }, [token]);

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const parts = inviteName.trim().split(/\s+/);
    const first_name = parts.shift() || "";
    const last_name = parts.join(" ") || "";

    let role_id = 3;
    if (inviteRole.includes("Admin") || inviteRole.includes("Administrator")) role_id = 1;
    else if (inviteRole.includes("Manager") || inviteRole.includes("Lead")) role_id = 2;

    try {
      const payload = {
        first_name,
        last_name,
        email: inviteEmail,
        role_id
      };

      const created = await teamApi.invite(token, payload);
      setMembers((prev) => [mapMemberFromBackend(created), ...prev]);
      
      setInviteName("");
      setInviteEmail("");
      setIsInviteOpen(false);
    } catch (err) {
      alert(err.message || "Failed to invite colleague.");
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (Number(memberId) === Number(user?.user_id)) {
      alert("You cannot remove yourself from the directory.");
      return;
    }

    if (confirm("Are you sure you want to remove this team member from the organization?")) {
      try {
        await teamApi.remove(token, memberId);
        setMembers((prev) => prev.filter((m) => String(m.id) !== String(memberId)));
      } catch (err) {
        alert(err.message || "Failed to delete team member.");
      }
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      selectedDept === "All Departments" || member.department === selectedDept;

    const matchesStatus =
      selectedStatus === "Any Status" || member.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages.map((page) => (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`w-9 h-9 rounded-lg font-button-text text-button-text flex items-center justify-center transition-all cursor-pointer ${
          currentPage === page
            ? "bg-primary text-white"
            : "text-on-surface hover:bg-surface-container-high dark:hover:bg-on-surface-variant/30"
        }`}
      >
        {page}
      </button>
    ));
  };

  return (
    <DoubleSidebarLayout>
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 text-left">

        <div className="flex-1 overflow-y-auto custom-scrollbar p-margin-desktop space-y-xl bg-surface-sunken dark:bg-surface-dim">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface dark:text-surface-main font-bold">
                Team Directory
              </h2>
              <p className="font-body-md text-on-surface-variant dark:text-surface-variant mt-xs">
                Manage and collaborate with {members.length} team members.
              </p>
            </div>
            
            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-sm px-lg py-sm bg-primary text-white rounded-lg hover:brightness-110 shadow-sm active:scale-95 transition-all font-button-text text-button-text cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Invite Member
            </button>
          </div>

          <div className="bg-surface-main dark:bg-inverse-surface p-md rounded-2xl border border-border-subtle dark:border-outline-variant shadow-sm flex flex-col md:flex-row gap-md items-center justify-between">
            <div className="relative flex items-center bg-surface-sunken dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant px-sm py-sm rounded-xl w-full md:flex-1">
              <span className="material-symbols-outlined text-outline text-[20px] ml-xs">
                search
              </span>
              <input
                className="bg-transparent border-none focus:ring-0 text-body-md w-full ml-sm outline-none text-on-surface dark:text-surface-main pl-1"
                placeholder="Search by name, email or role..."
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            
            <div className="flex gap-md w-full md:w-auto">
              <select
                className="flex-1 md:flex-initial h-11 px-md bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl text-body-sm text-on-surface-variant dark:text-surface-variant outline-none cursor-pointer hover:bg-surface-container-low transition-colors"
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option>All Departments</option>
                {departments.map((dept) => (
                  <option key={dept}>{dept}</option>
                ))}
              </select>

              <select
                className="flex-1 md:flex-initial h-11 px-md bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-xl text-body-sm text-on-surface-variant dark:text-surface-variant outline-none cursor-pointer hover:bg-surface-container-low transition-colors"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option>Any Status</option>
                <option value="Active">Active</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-lg">
            {currentMembers.map((member) => (
              <div
                key={member.id}
                className="bg-surface-main dark:bg-inverse-surface rounded-2xl border border-border-subtle dark:border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col p-lg text-center items-center relative group"
              >
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="absolute top-3 right-3 text-error p-1 rounded hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Remove Colleague"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>

                <div className="relative w-20 h-20 mb-md mt-sm">
                  <img
                    className="w-full h-full rounded-full object-cover border border-border-subtle dark:border-outline-variant"
                    alt={member.name}
                    src={member.avatar}
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-inverse-surface ${
                      member.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  ></span>
                </div>

                <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main leading-tight pr-6">
                  {member.name}
                </h3>
                
                <span className={`mt-2 font-label-md text-[10px] uppercase tracking-wider px-3 py-1 rounded-full select-none ${member.badgeColor}`}>
                  {member.badge}
                </span>

                <p className="font-body-sm text-[12px] text-on-surface-variant dark:text-surface-variant mt-md">
                  {member.department} • {member.location}
                </p>

                <div className="w-full grid grid-cols-2 gap-sm mt-lg">
                  <a
                    href={`mailto:${member.email}`}
                    className="h-10 border border-border-subtle dark:border-outline-variant rounded-xl flex items-center justify-center text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </a>
                  <button
                    onClick={() => alert(`Opening active messaging interface with ${member.name}`)}
                    className="h-10 border border-border-subtle dark:border-outline-variant rounded-xl flex items-center justify-center text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/20 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">forum</span>
                  </button>
                </div>
              </div>
            ))}

            {currentPage === 1 && (
              <button
                onClick={() => setIsInviteOpen(true)}
                className="rounded-2xl border-2 border-dashed border-border-subtle dark:border-outline-variant hover:border-primary bg-transparent p-lg flex flex-col justify-center items-center text-center group cursor-pointer transition-colors min-h-[260px]"
              >
                <div className="w-12 h-12 rounded-full bg-primary-fixed-dim/30 dark:bg-on-surface-variant/20 text-primary flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">add</span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main group-hover:text-primary transition-colors">
                  Add New Member
                </h3>
                <p className="font-body-sm text-[12px] text-on-surface-variant mt-sm">
                  Invite a colleague to the workspace
                </p>
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-md border-t border-border-subtle dark:border-outline-variant pt-lg select-none">
            <span className="font-body-sm text-on-surface-variant">
              Showing {filteredMembers.length > 0 ? startIndex + 1 : 0}-
              {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of{" "}
              {filteredMembers.length} members
            </span>
            
            <div className="flex items-center gap-xs">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 border border-border-subtle rounded-lg flex items-center justify-center text-on-surface-variant disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              
              <div className="flex items-center gap-xs">
                {renderPaginationButtons()}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-9 h-9 border border-border-subtle rounded-lg flex items-center justify-center text-on-surface-variant disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isInviteOpen && (
        <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-md shrink-0">
          <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant w-full max-w-[448px] rounded-xl p-lg shadow-xl animate-fade-in text-left">
            <div className="flex justify-between items-center border-b border-border-subtle dark:border-outline-variant/30 pb-md">
              <h3 className="font-title-lg text-title-lg font-bold text-on-surface dark:text-surface-main flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">person_add</span>
                Invite New Colleague
              </h3>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="material-symbols-outlined text-outline hover:text-on-surface cursor-pointer rounded-full p-1"
              >
                close
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-md mt-md">
              <div>
                <label className="block text-body-sm font-semibold text-on-surface-variant mb-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder=""
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full border border-border-subtle rounded-lg px-md py-sm bg-surface text-body-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface"
                />
              </div>

              <div>
                <label className="block text-body-sm font-semibold text-on-surface-variant mb-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  placeholder=""
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full border border-border-subtle rounded-lg px-md py-sm bg-surface text-body-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="block text-body-sm font-semibold text-on-surface-variant mb-1">
                    Role Title
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full border border-border-subtle rounded-lg px-md h-10 bg-surface text-body-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface cursor-pointer"
                  >
                    <option value="Team Member">Team Member</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-body-sm font-semibold text-on-surface-variant mb-1">
                    Department
                  </label>
                  <select
                    className="w-full border border-border-subtle rounded-lg px-md h-10 bg-surface text-body-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface cursor-pointer"
                    value={selectedDept === "All Departments" ? "Engineering" : selectedDept}
                    disabled
                  >
                    <option>Engineering</option>
                    <option>Product</option>
                    <option>Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-body-sm font-semibold text-on-surface-variant mb-1">
                  Location (City, Country)
                </label>
                <input
                  required
                  type="text"
                  value={inviteLocation}
                  onChange={(e) => setInviteLocation(e.target.value)}
                  className="w-full border border-border-subtle rounded-lg px-md py-sm bg-surface text-body-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-on-surface"
                />
              </div>

              <div className="flex gap-md justify-end pt-md border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-lg h-10 border border-border-subtle rounded-lg hover:bg-surface-container font-button-text text-button-text text-on-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-lg h-10 bg-primary text-white rounded-lg hover:brightness-110 shadow-md font-button-text text-button-text cursor-pointer font-bold"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DoubleSidebarLayout>
  );
}
