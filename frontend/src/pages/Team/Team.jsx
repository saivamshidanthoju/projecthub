import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

// Curated avatar lists from existing codebase resources
const avatars = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD71_WId36rvfuPNoxKGJ-w-ieAFxLTHrKxJRxjd12MGRASKQsnGJXo3Kxcp-XK7kd0koMgUjDTMN1xEabBUKaLRGfzYB62aNGccvgt76GWi5ySyYH0bjhxtRj_j5BQkQ-tXgDecssf0nKafomlsYkJkvps5jobV94oPFs9D4q_1TkQnWj-YS1nQ60zxIBr9TZPKhSE6o9m04VJkWVQw4-jPJTaTYOBDc5tQ4B7DMbgcIzt0gJNpZ51Z43qbGnhgLBujLS4vpPA5oA", // Sarah Chen
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAbPqIgzUkRwtIdNG1R29HJH2HeI-6sfy-XfeHCrbnajiXzp2EoqkmsR63YCtYrfTkYmLVKdtu2UAG2pJX_xsiGs14Uw_v40EOI5wnMC-zUjUFxM2JEKxs1LHB0UXwtkmPyVwDz5uR94z54KByQjtLSNDQjQstHMCOS-Ng5MNQ7N3u_fStiuomy4tnaCTA21Ikuu1zfjZA4t_Yx3KLTOSapy31XD5tFIwuYal_B8uIM4gZ118CQ3Gr0hqKvWrQgGfZ378211N9p7KU", // Marcus Thorne
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCSrkbKamuBW3btcBS0x2OY-8VPSNa-CZR2De1kGt_mWiijcgKvhjVI-JtMptZ1HbcvFGDYBoe3MaqJs_k3SGYhLP5nPMybl-A0Jws1aiDYu_3l1bpd-xfJ5dveMq8-De7da1C44mF02LYkpmJym9S5oErg5uU193dbvTsrDMYgp3jjYqca0o9XXMCcGCN3qYsm4dMQtVjmf_zWE5IDj6BQ1Nd_cP6iJ7jK7WaXr7eLaAJCP3MtdSlRV5a5Fad4EiW832ooz1SlkFQ", // Elena Rodriguez
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDUat5_p3l9_yN33nXkr2pdpHSZ0PqrjN_xaVhcqJzaXaIHMaCEjUfBlfL3hdZkhjraIFXom0Jz2QNUCORVitN7cS03UfwgKPK5rlHrJfUBTlFgqwjod9I8WcvGiLND2yiWikd4rTDPz5izaW3AITyrK2BdZ-ooVISnnaBi3AmFHBgrq_UaYlmIhOIRyMz5N8QNFUidlLX9JldmH7fyjizUeZhJBYjoIk_bL30tAuoly3NlLDjHcPujzERaq1bdnLHKVyMbw9ncs5s", // James Wilson
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCgj5wZ-voOKiP6pJgwUtyekehWkhfKkLzvQewUyadf38WXRqimzJLv5lUoTb0NiRy4vUXRwl68d-7SQGvutojuc6X9WopstI5UOuw-fq1LIJ5Ejy2jsyjxcALYjOFLbZZE8MARMsLBJEUlgB825GRRlb4a9gQn4Kyw554nOujTW5eBCaN_G79PB2eOR4WrbeejIyJL6-GKMnY1T2I8lv-o27JXNkapk1Jl3DNTPEI1-2gmEYHzJjHMzQUny0yIDHATaWUpKMT-G-Q", // Alex Kim
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDsUUnw7i5i_7tG1_vXMF19zFx0LjNOFoA_KDxw87IxRnb7YvkmIsIflyqZpBbtEvMy7td3IqzkMWD5YFqD1iziKhR-7vZbHDDeUu1w5q9W51Ny7IsiFKbtIZryEEkf9MJu6SaHhysovbvEgMOhZ9Es_Edehu82b-wvZdfFeZP_UVWiz1SFr5-an6haTDZD_nqvPT3xoAszW5gmJowGUPX3aV0hdhsX2sN-pfKPItcnP_n_rweW3kt5zYVDCc5oQMfUlqKbJ-qaqOA", // Sophia Patel
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBrhE-ZqgaG_64e86a02XXPN33-XTyj3nV9V4oamzoyuyk71bmQPxRV0VK_ZjqcvvM7Jz0cdeJiYTapaeLCMvB1SLn1FxEoIJYjMIREeIKnmNTGY2VgTywMQP0mAZfokf-K0qRmtoMQVwbB314xEr4i85pOlR_toVhAoLtzXHyyMeyCQ_kr4F-8FpXaoulr4K0l8IerG7dFZ-TG0_lzk0TcKqFHcOlwderpXj9GWQ-gSrc7bqyOkODKYoHka4WLlcKeOp251FwUMtc", // Oliver Graham
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDkVWjTpt7wMxq0VjkEqp5lJcQMKBvD8tA5uMnoCTSLhIyAdKjacgT1tcZ1Bf2ALGwK3oP0YMOJr6Ll2Y1Xm6pgw_FtSIt6zUWR2eYkxu-893M8BRsxXa6SycblkyoN89IgFBNGaVx6YrALHgulGZc9FE33tcGCroNkih5QKurDBcvz5-qPpwTaeTsZEJLYWQ8ZrXy_SvtSO6JJvftc9LO67sfedXZNsvUidBsmfKPsyKbabX4qdObedRHZ4PU9VlMCusEXOSpDalE",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBXQ_R98Ch3pJQIwb3rwoyEqkf8WiNd7J-S5p5AaPRp_woLcbw4VD8ybLmwTnv1_DrSGZ6mMwQlhgCev8vbWSt6-yM1t42boFnUGCkjLnPnRLrDt0WvGPUsX9IhzBbPmrYW9iKDIRaLVww1ra2VH6y2X5d5wOnwpJ1sooaKDtZ-HltfIxslVoQ7mkJLqBuibCZR5UNSKoAgCj0qZVh_ec8HOeN5ffofLNjJa2JnIgAwF2Zv7RYDWOOAJbZdr0jTjnzYCDn9TRLKIr8",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBQSl2kZtSW6fxj4rZ8F1QxUvewMBcKaHNskqkHy4uyVvSAvCqZRFxQESuzO2X6zaYo7XvLjhd5qUsd05ds4zxXyvqO7jjmptUvgMOlu9ybCTvonSAXO8paeE0Sc-bT95ol2ZDuzUWLtf0KAAtd_3kLanxU3N39WXREQG1SVlpVOAW5vOXDHt-bxu4hJA7ofh4YN0M_q1fBqxsfdJPNhUwGhM-jHt56MkUK0N_DSssZt0uQ4v6ZVc6xV0hPjVL1YE0xsRjOUF0mAMo",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCsPphZiLHGb4H_XlnYKzRbWy17z7tZnkJhZ9qERWRbHL0tmXPUAwZhEyvmfb25utdvN5Gmd3o2bu3uoDqeG3ThCfx8GoveIFIZ1DpkSfCWrOOm1r6-UtU1Cx_Zh8UGWoALHfOLg7EJECljBJATYf3pZIgXC3NeFOEx9xH6w7ZLejeu_CsCVpsTI5uFT9iAb5vL6FAYCPOXcOVixVEjWCn6t7iMCsPMFceJtKtLFMiEHP7C_bOAqCvBHT4iV61pe9FUPHq6XkUgGc8"
];

const initialMembers = [
  {
    id: "member-1",
    name: "Sarah Chen",
    email: "sarah.chen@phub.io",
    role: "Lead Designer",
    badge: "LEAD DESIGNER",
    badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/30",
    department: "Product Design",
    location: "London, UK",
    status: "Active",
    avatar: avatars[0]
  },
  {
    id: "member-2",
    name: "Marcus Thorne",
    email: "marcus.thorne@phub.io",
    role: "Sr. Developer",
    badge: "SR. DEVELOPER",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30",
    department: "Engineering",
    location: "Berlin, DE",
    status: "Active",
    avatar: avatars[1]
  },
  {
    id: "member-3",
    name: "Elena Rodriguez",
    email: "elena.rodriguez@phub.io",
    role: "Product Owner",
    badge: "PRODUCT OWNER",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30",
    department: "Product",
    location: "Madrid, ES",
    status: "Active",
    avatar: avatars[2]
  },
  {
    id: "member-4",
    name: "James Wilson",
    email: "james.wilson@phub.io",
    role: "Marketing Lead",
    badge: "MARKETING LEAD",
    badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30",
    department: "Growth",
    location: "New York, US",
    status: "Active",
    avatar: avatars[3]
  },
  {
    id: "member-5",
    name: "Alex Kim",
    email: "alex.kim@phub.io",
    role: "QA Engineer",
    badge: "QA ENGINEER",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30",
    department: "Engineering",
    location: "Seoul, KR",
    status: "Active",
    avatar: avatars[4]
  },
  {
    id: "member-6",
    name: "Sophia Patel",
    email: "sophia.patel@phub.io",
    role: "HR Manager",
    badge: "HR MANAGER",
    badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30",
    department: "Operations",
    location: "Mumbai, IN",
    status: "Offline",
    avatar: avatars[5]
  },
  {
    id: "member-7",
    name: "Oliver Graham",
    email: "oliver.graham@phub.io",
    role: "UI Designer",
    badge: "UI DESIGNER",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30",
    department: "Product Design",
    location: "Toronto, CA",
    status: "Active",
    avatar: avatars[6]
  }
];

// Generate additional 35 members to reach 42 total
const departments = ["Engineering", "Product Design", "Product", "Growth", "Operations"];
const locationsByDept = {
  Engineering: ["Seoul, KR", "Berlin, DE", "San Francisco, US", "Bangalore, IN"],
  "Product Design": ["London, UK", "Toronto, CA", "Stockholm, SE"],
  Product: ["Madrid, ES", "New York, US", "Amsterdam, NL"],
  Growth: ["New York, US", "Paris, FR", "Singapore, SG"],
  Operations: ["Mumbai, IN", "Sydney, AU", "Tokyo, JP"]
};
const rolesByDept = {
  Engineering: ["Frontend Engineer", "Backend Developer", "DevOps Engineer", "QA Automation Analyst", "Fullstack Developer"],
  "Product Design": ["UX Researcher", "Brand Designer", "Product Designer", "Illustrator"],
  Product: ["Technical Product Manager", "Product Manager", "Business Analyst"],
  Growth: ["Growth Marketer", "SEO Specialist", "Content Writer", "Sales Account Executive"],
  Operations: ["HR Specialist", "Finance Director", "Office Manager", "IT Specialist"]
};
const names = [
  "Emily Watson", "David Chen", "Lucas Muller", "Ami Sato", "Julian Vane", 
  "Chloe Dupont", "Ryan Patel", "Liam O'Connor", "Nina Ivanova", "Omar Farooq",
  "Isabella Ricci", "Siddharth Sharma", "Emma Larsen", "Gabriel Silva", "Hannah Abas",
  "Yusuf Demir", "Sofia Alvarez", "Mateo Kovacic", "Charlotte Green", "Kenji Takahashi",
  "Aria Jenkins", "Zoe Carter", "Nathan Wong", "Fatima Al-Sayed", "William Brown",
  "Elena Petrova", "Alex Rivera", "Mia Andersson", "Min-Ji Park", "Jack Taylor",
  "Sophie Martin", "Arjun Mehta", "Laura Dubois", "Thomas Wright", "Rachel Lee"
];

for (let i = 0; i < 35; i++) {
  const name = names[i % names.length];
  const email = `${name.toLowerCase().replace(/[^a-z]/g, "")}.${i + 8}@phub.io`;
  const department = departments[i % departments.length];
  const locations = locationsByDept[department];
  const location = locations[i % locations.length];
  const roles = rolesByDept[department];
  const role = roles[i % roles.length];
  const status = i % 5 === 0 ? "Offline" : "Active";
  const avatar = avatars[(i + 7) % avatars.length];
  
  let badgeColor = "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30";
  if (role.includes("Lead") || role.includes("Manager") || role.includes("Director")) {
    badgeColor = "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/30";
  } else if (role.includes("Design") || role.includes("UX")) {
    badgeColor = "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30";
  } else if (role.includes("Marketer") || role.includes("Specialist")) {
    badgeColor = "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30";
  }

  initialMembers.push({
    id: `member-${i + 8}`,
    name,
    email,
    role,
    badge: role.toUpperCase(),
    badgeColor,
    department,
    location,
    status,
    avatar
  });
}

export default function Team() {
  const [members, setMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("Any Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Frontend Engineer");
  const [inviteDept, setInviteDept] = useState("Engineering");
  const [inviteLocation, setInviteLocation] = useState("London, UK");

  // Filters logic
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

  // Pagination calculations (8 per page)
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  
  // Adjusted for showing index correctly
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    let badgeColor = "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30";
    if (inviteRole.includes("Lead") || inviteRole.includes("Manager") || inviteRole.includes("Director")) {
      badgeColor = "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/30";
    }

    const newMember = {
      id: `member-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      badge: inviteRole.toUpperCase(),
      badgeColor,
      department: inviteDept,
      location: inviteLocation,
      status: "Active",
      avatar: avatars[members.length % avatars.length]
    };

    setMembers((prev) => [newMember, ...prev]);
    setInviteName("");
    setInviteEmail("");
    setIsInviteOpen(false);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const pages = [];
    const maxVisible = 4;
    
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages.map((page, idx) => {
      if (page === "...") {
        return (
          <span key={`dots-${idx}`} className="px-3 py-2 text-on-surface-variant dark:text-surface-variant font-medium select-none">
            ...
          </span>
        );
      }
      const isActive = currentPage === page;
      return (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`w-9 h-9 rounded-lg font-button-text text-button-text flex items-center justify-center transition-all ${
            isActive
              ? "bg-primary text-white"
              : "text-on-surface hover:bg-surface-container-high dark:hover:bg-on-surface-variant/30 dark:text-surface-main"
          }`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-surface-sunken dark:bg-inverse-surface text-on-surface w-full">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        {/* Custom Header matching the screenshot */}
        <Header />

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-margin-desktop space-y-xl bg-surface-sunken dark:bg-surface-dim">
          
          {/* Main Title and Action */}
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

          {/* Filter Container */}
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

          {/* Members Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-lg">
            {currentMembers.map((member) => (
              <div
                key={member.id}
                className="bg-surface-main dark:bg-inverse-surface rounded-2xl border border-border-subtle dark:border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col p-lg text-center items-center relative"
              >
                {/* Avatar with Status indicator dot */}
                <div className="relative w-20 h-20 mb-md mt-sm">
                  <img
                    className="w-full h-full rounded-full object-cover border border-border-subtle dark:border-outline-variant"
                    alt={`${member.name} headshot.`}
                    src={member.avatar}
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-inverse-surface ${
                      member.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  ></span>
                </div>

                <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main leading-tight">
                  {member.name}
                </h3>
                
                <span className={`mt-2 font-label-md text-[10px] uppercase tracking-wider px-3 py-1 rounded-full select-none ${member.badgeColor}`}>
                  {member.badge}
                </span>

                <p className="font-body-sm text-[12px] text-on-surface-variant dark:text-surface-variant mt-md">
                  {member.department} • {member.location}
                </p>

                {/* Card Action buttons (bottom) */}
                <div className="w-full grid grid-cols-2 gap-sm mt-lg">
                  <a
                    href={`mailto:${member.email}`}
                    className="h-10 border border-border-subtle dark:border-outline-variant rounded-xl flex items-center justify-center text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </a>
                  <button
                    onClick={() => alert(`Opening active messaging interface with ${member.name} (${member.email})`)}
                    className="h-10 border border-border-subtle dark:border-outline-variant rounded-xl flex items-center justify-center text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-on-surface-variant/20 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">forum</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Dotted Invitation Card (displays at index 8 slot, i.e., when on page 1 and results are full, or optionally fits grid) */}
            {currentPage === 1 && (
              <button
                onClick={() => setIsInviteOpen(true)}
                className="rounded-2xl border-2 border-dashed border-border-subtle dark:border-outline-variant hover:border-primary dark:hover:border-inverse-primary bg-transparent p-lg flex flex-col justify-center items-center text-center group cursor-pointer transition-colors min-h-[260px]"
              >
                <div className="w-12 h-12 rounded-full bg-primary-fixed-dim/30 dark:bg-on-surface-variant/20 text-primary dark:text-inverse-primary flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">add</span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface dark:text-surface-main group-hover:text-primary dark:group-hover:text-inverse-primary transition-colors">
                  Add New Member
                </h3>
                <p className="font-body-sm text-[12px] text-on-surface-variant dark:text-surface-variant mt-sm">
                  Invite a colleague to the workspace
                </p>
              </button>
            )}
          </div>

          {/* Footer & Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-md border-t border-border-subtle dark:border-outline-variant pt-lg select-none">
            <span className="font-body-sm text-on-surface-variant dark:text-surface-variant">
              Showing {filteredMembers.length > 0 ? startIndex + 1 : 0}-
              {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of{" "}
              {filteredMembers.length} members
            </span>
            
            <div className="flex items-center gap-xs">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 border border-border-subtle dark:border-outline-variant rounded-lg flex items-center justify-center text-on-surface-variant dark:text-surface-variant disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container dark:hover:bg-on-surface-variant/30 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              
              <div className="flex items-center gap-xs">
                {renderPaginationButtons()}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-9 h-9 border border-border-subtle dark:border-outline-variant rounded-lg flex items-center justify-center text-on-surface-variant dark:text-surface-variant disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container dark:hover:bg-on-surface-variant/30 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Invite Member Modal overlay */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-md">
          <div className="bg-surface-main dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant rounded-2xl max-w-md w-full p-lg shadow-xl animate-fade-in text-left">
            <div className="flex justify-between items-center border-b border-border-subtle dark:border-outline-variant pb-md">
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
                <label className="block text-body-sm font-semibold text-on-surface-variant dark:text-surface-variant mb-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Liam Neeson"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full border border-border-subtle dark:border-outline-variant rounded-xl px-md py-sm bg-surface-sunken dark:bg-inverse-surface text-body-md outline-none focus:border-primary text-on-surface dark:text-surface-main"
                />
              </div>

              <div>
                <label className="block text-body-sm font-semibold text-on-surface-variant dark:text-surface-variant mb-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  placeholder="e.g. liam@phub.io"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full border border-border-subtle dark:border-outline-variant rounded-xl px-md py-sm bg-surface-sunken dark:bg-inverse-surface text-body-md outline-none focus:border-primary text-on-surface dark:text-surface-main"
                />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="block text-body-sm font-semibold text-on-surface-variant dark:text-surface-variant mb-1">
                    Role Title
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full border border-border-subtle dark:border-outline-variant rounded-xl px-md h-10 bg-surface-sunken dark:bg-inverse-surface text-body-sm outline-none text-on-surface dark:text-surface-main"
                  >
                    <option>Frontend Engineer</option>
                    <option>Backend Developer</option>
                    <option>DevOps Engineer</option>
                    <option>Product Designer</option>
                    <option>Product Manager</option>
                    <option>HR Specialist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-body-sm font-semibold text-on-surface-variant dark:text-surface-variant mb-1">
                    Department
                  </label>
                  <select
                    value={inviteDept}
                    onChange={(e) => setInviteDept(e.target.value)}
                    className="w-full border border-border-subtle dark:border-outline-variant rounded-xl px-md h-10 bg-surface-sunken dark:bg-inverse-surface text-body-sm outline-none text-on-surface dark:text-surface-main"
                  >
                    {departments.map((dept) => (
                      <option key={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-body-sm font-semibold text-on-surface-variant dark:text-surface-variant mb-1">
                  Location (City, Country)
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. San Francisco, US"
                  value={inviteLocation}
                  onChange={(e) => setInviteLocation(e.target.value)}
                  className="w-full border border-border-subtle dark:border-outline-variant rounded-xl px-md py-sm bg-surface-sunken dark:bg-inverse-surface text-body-md outline-none focus:border-primary text-on-surface dark:text-surface-main"
                />
              </div>

              <div className="flex gap-md justify-end pt-md border-t border-border-subtle dark:border-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-lg h-10 border border-border-subtle dark:border-outline-variant rounded-xl hover:bg-surface-container dark:hover:bg-on-surface-variant/20 font-button-text text-button-text text-on-surface dark:text-surface-variant cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-lg h-10 bg-primary text-white rounded-xl hover:brightness-110 shadow-md font-button-text text-button-text cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
