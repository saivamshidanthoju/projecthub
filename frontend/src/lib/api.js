import { ROLES } from "./rbac";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const SESSION_STORAGE_KEY = "projecthub.session";

const USERS_KEY = "projecthub.demo.users";
const PROJECTS_KEY = "projecthub.demo.projects";
const TASKS_KEY = "projecthub.demo.tasks";
const ATTACHMENTS_KEY = "projecthub.demo.attachments";

class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function readStore(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createId(prefix) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts.shift() || "ProjectHub";
  const lastName = parts.join(" ") || "User";

  return { firstName, lastName };
}

export function organizationIdFromSlug(slug) {
  const value = String(slug || "projecthub").trim();
  const numeric = Number(value);

  if (Number.isInteger(numeric) && numeric > 0) {
    return numeric;
  }

  return Array.from(value).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 9000 + 1;
}

function normalizeUser(user, fallback = {}) {
  const fullName = user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
  const fallbackName = fallback.name || fallback.fullName || "ProjectHub User";
  const resolvedName = fullName || fallbackName;
  const { firstName, lastName } = splitName(resolvedName);

  return {
    user_id: user?.user_id ?? user?.id ?? fallback.user_id ?? Date.now(),
    organization_id: Number(user?.organization_id ?? fallback.organization_id ?? 1),
    organization_slug: user?.organization_slug ?? fallback.organization_slug ?? "projecthub",
    role_id: Number(user?.role_id ?? fallback.role_id ?? ROLES.MEMBER),
    first_name: user?.first_name ?? firstName,
    last_name: user?.last_name ?? lastName,
    email: user?.email ?? fallback.email ?? "user@projecthub.test",
    avatar: user?.avatar ?? fallback.avatar ?? "",
  };
}

function createDemoToken(user) {
  const payload = {
    sub: user.user_id,
    organization_id: user.organization_id,
    role_id: user.role_id,
    demo: true,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };

  return `demo.${btoa(JSON.stringify(payload))}.token`;
}

const DEMO_USERS = [
  {
    user_id: 1,
    organization_id: 1,
    organization_slug: "projecthub",
    role_id: ROLES.ADMIN,
    first_name: "Alex",
    last_name: "Rivera",
    email: "admin@projecthub.test",
    password: "password123",
  },
  {
    user_id: 2,
    organization_id: 1,
    organization_slug: "projecthub",
    role_id: ROLES.MANAGER,
    first_name: "Sarah",
    last_name: "Chen",
    email: "manager@projecthub.test",
    password: "password123",
  },
  {
    user_id: 3,
    organization_id: 1,
    organization_slug: "projecthub",
    role_id: ROLES.MEMBER,
    first_name: "Maya",
    last_name: "Patel",
    email: "member@projecthub.test",
    password: "password123",
  },
];

const DEFAULT_PROJECTS = [
  {
    project_id: 1,
    organization_id: 1,
    project_name: "Quantum API Gateway",
    department: "Architecture & DevOps",
    description: "Enterprise API gateway migration with tenant-aware routing and audit logging.",
    status: "IN_PROGRESS",
    progress: 68,
    created_at: "2026-07-15T10:00:00.000Z",
  },
  {
    project_id: 2,
    organization_id: 1,
    project_name: "Global Payroll Sync",
    department: "FinTech Services",
    description: "Compliance-first payroll synchronization across multi-region subsidiaries.",
    status: "COMPLETED",
    progress: 100,
    created_at: "2026-07-10T09:15:00.000Z",
  },
  {
    project_id: 3,
    organization_id: 1,
    project_name: "Mobile App V3.2",
    department: "Product Design",
    description: "Mobile release train focused on offline task capture and asset review.",
    status: "ACTIVE",
    progress: 42,
    created_at: "2026-07-18T08:30:00.000Z",
  },
  {
    project_id: 4,
    organization_id: 1,
    project_name: "AI Content Generator",
    department: "Machine Learning",
    description: "Internal generation assistant for release notes, reports, and briefs.",
    status: "IN_PROGRESS",
    progress: 15,
    created_at: "2026-07-20T14:00:00.000Z",
  },
];

const DEFAULT_TASKS = [
  {
    task_id: 1,
    project_id: 1,
    organization_id: 1,
    title: "User Interview Analysis",
    description: "Consolidate findings from the Q3 user experience survey into a master report.",
    status: "TODO",
    priority: "MEDIUM",
    progress: 0,
    due_date: "2026-08-05T00:00:00.000Z",
  },
  {
    task_id: 2,
    project_id: 1,
    organization_id: 1,
    title: "Navigation Polish",
    description: "Refine sidebar and topbar transitions for better performance on mobile views.",
    status: "TODO",
    priority: "HIGH",
    progress: 0,
    due_date: "2026-08-02T00:00:00.000Z",
  },
  {
    task_id: 3,
    project_id: 1,
    organization_id: 1,
    title: "API Endpoint Integration",
    description: "Connect the task service to the Kanban components and persist status updates.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    progress: 65,
    due_date: "2026-08-09T00:00:00.000Z",
  },
  {
    task_id: 4,
    project_id: 1,
    organization_id: 1,
    title: "Unit Test Coverage",
    description: "Verify all new utility functions have coverage for success and failure paths.",
    status: "IN_REVIEW",
    priority: "MEDIUM",
    progress: 90,
    due_date: "2026-08-10T00:00:00.000Z",
  },
];

const DEFAULT_ATTACHMENTS = [
  {
    attachment_id: 1,
    organization_id: 1,
    project_id: 1,
    uploaded_by: 1,
    original_name: "API Security Checklist.pdf",
    stored_name: "api-security-checklist.pdf",
    mime_type: "application/pdf",
    file_size: 245760,
    storage_path: "demo/api-security-checklist.pdf",
    created_at: "2026-07-22T10:30:00.000Z",
  },
  {
    attachment_id: 2,
    organization_id: 1,
    project_id: 1,
    uploaded_by: 2,
    original_name: "Architecture Diagram.png",
    stored_name: "architecture-diagram.png",
    mime_type: "image/png",
    file_size: 512000,
    storage_path: "demo/architecture-diagram.png",
    created_at: "2026-07-23T12:00:00.000Z",
  },
];

function ensureDemoUsers() {
  const users = readStore(USERS_KEY, null);

  if (Array.isArray(users) && users.length > 0) {
    return users;
  }

  writeStore(USERS_KEY, DEMO_USERS);
  return DEMO_USERS;
}

function ensureProjects() {
  const projects = readStore(PROJECTS_KEY, null);

  if (Array.isArray(projects)) {
    return projects;
  }

  writeStore(PROJECTS_KEY, DEFAULT_PROJECTS);
  return DEFAULT_PROJECTS;
}

function ensureTasks() {
  const tasks = readStore(TASKS_KEY, null);

  if (Array.isArray(tasks)) {
    return tasks;
  }

  writeStore(TASKS_KEY, DEFAULT_TASKS);
  return DEFAULT_TASKS;
}

function ensureAttachments() {
  const attachments = readStore(ATTACHMENTS_KEY, null);

  if (Array.isArray(attachments)) {
    return attachments;
  }

  writeStore(ATTACHMENTS_KEY, DEFAULT_ATTACHMENTS);
  return DEFAULT_ATTACHMENTS;
}

async function apiRequest(path, { method = "GET", token, body, formData } = {}) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!formData) {
    headers["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: formData || (body ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new ApiError("Backend is not reachable. Using local workspace mode.", 0);
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : await response.blob();

  if (!response.ok || payload?.success === false) {
    throw new ApiError(payload?.message || `Request failed with status ${response.status}`, response.status);
  }

  return payload;
}

function makeSession(user, token, source) {
  const normalizedUser = normalizeUser(user);

  return {
    token: token || createDemoToken(normalizedUser),
    user: normalizedUser,
    source,
  };
}

function findDemoUser(email, password) {
  return ensureDemoUsers().find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
  );
}

export const authApi = {
  async login({ email, password, orgSlug }) {
    let apiError;

    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      return makeSession(
        {
          ...response.user,
          organization_slug: orgSlug || "projecthub",
        },
        response.token,
        "api"
      );
    } catch (error) {
      apiError = error;
    }

    const demoUser = findDemoUser(email, password);

    if (!demoUser) {
      throw new Error(apiError?.status === 401 ? apiError.message : "Invalid email or password.");
    }

    return makeSession(
      {
        ...demoUser,
        organization_id: organizationIdFromSlug(orgSlug || demoUser.organization_slug),
        organization_slug: orgSlug || demoUser.organization_slug,
      },
      null,
      "local"
    );
  },

  async register({ companyName, orgSlug, fullName, email, password, roleId = ROLES.ADMIN }) {
    const { firstName, lastName } = splitName(fullName);
    const organizationId = organizationIdFromSlug(orgSlug);
    const body = {
      company_name: companyName,
      organization_slug: orgSlug,
      organization_id: organizationId,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      role_id: roleId,
    };

    try {
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body,
      });

      if (response.token) {
        return makeSession(
          { ...response.user, ...response.data, organization_slug: orgSlug },
          response.token,
          "api"
        );
      }

      return await this.login({ email, password, orgSlug });
    } catch {
      const users = ensureDemoUsers();
      const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());

      if (existingUser) {
        throw new Error("Email already registered.");
      }

      const user = {
        user_id: Date.now(),
        organization_id: organizationId,
        organization_slug: orgSlug,
        role_id: roleId,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      };

      writeStore(USERS_KEY, [...users, user]);
      return makeSession(user, null, "local");
    }
  },

  async me(token) {
    const response = await apiRequest("/auth/me", { token });
    return normalizeUser(response.user || response.data);
  },
};

export const projectsApi = {
  async list(token) {
    try {
      const response = await apiRequest("/projects?limit=100", { token });
      return response.data || [];
    } catch {
      return ensureProjects();
    }
  },

  async create(token, payload, user) {
    try {
      const response = await apiRequest("/projects", {
        method: "POST",
        token,
        body: payload,
      });
      return response.data;
    } catch {
      const projects = ensureProjects();
      const project = {
        project_id: Date.now(),
        organization_id: user?.organization_id || 1,
        project_name: payload.project_name,
        department: payload.department || "General Operations",
        description: payload.description || "",
        status: payload.status || "ACTIVE",
        progress: payload.progress ?? 0,
        created_at: new Date().toISOString(),
      };

      writeStore(PROJECTS_KEY, [project, ...projects]);
      return project;
    }
  },

  async update(token, id, payload) {
    try {
      const response = await apiRequest(`/projects/${id}`, {
        method: "PUT",
        token,
        body: payload,
      });
      return response.data;
    } catch {
      const projects = ensureProjects();
      const updatedProjects = projects.map((project) =>
        String(project.project_id ?? project.id) === String(id)
          ? {
              ...project,
              project_name: payload.project_name ?? project.project_name ?? project.name,
              description: payload.description ?? project.description,
              status: payload.status ?? project.status,
              updated_at: new Date().toISOString(),
            }
          : project
      );
      const updated = updatedProjects.find((project) => String(project.project_id ?? project.id) === String(id));

      writeStore(PROJECTS_KEY, updatedProjects);
      return updated;
    }
  },

  async remove(token, id) {
    try {
      await apiRequest(`/projects/${id}`, { method: "DELETE", token });
    } catch {
      const projects = ensureProjects().filter((project) => String(project.project_id ?? project.id) !== String(id));
      writeStore(PROJECTS_KEY, projects);
    }
  },
};

export const tasksApi = {
  async list(token) {
    try {
      const response = await apiRequest("/tasks?limit=100", { token });
      return response.data || [];
    } catch {
      return ensureTasks();
    }
  },

  async create(token, payload, user) {
    try {
      const response = await apiRequest("/tasks", {
        method: "POST",
        token,
        body: payload,
      });
      return response.data;
    } catch {
      const tasks = ensureTasks();
      const task = {
        task_id: Date.now(),
        organization_id: user?.organization_id || 1,
        project_id: payload.project_id || 1,
        title: payload.title,
        description: payload.description || "",
        status: payload.status || "TODO",
        priority: payload.priority || "MEDIUM",
        progress: payload.status === "DONE" ? 100 : 0,
        due_date: payload.due_date || null,
        created_at: new Date().toISOString(),
      };

      writeStore(TASKS_KEY, [...tasks, task]);
      return task;
    }
  },

  async update(token, id, payload) {
    try {
      const response = await apiRequest(`/tasks/${id}`, {
        method: "PUT",
        token,
        body: payload,
      });
      return response.data;
    } catch {
      const tasks = ensureTasks();
      const updatedTasks = tasks.map((task) =>
        String(task.task_id ?? task.id) === String(id)
          ? {
              ...task,
              ...payload,
              updated_at: new Date().toISOString(),
            }
          : task
      );
      const updated = updatedTasks.find((task) => String(task.task_id ?? task.id) === String(id));

      writeStore(TASKS_KEY, updatedTasks);
      return updated;
    }
  },

  async remove(token, id) {
    try {
      await apiRequest(`/tasks/${id}`, { method: "DELETE", token });
    } catch {
      const tasks = ensureTasks().filter((task) => String(task.task_id ?? task.id) !== String(id));
      writeStore(TASKS_KEY, tasks);
    }
  },
};

function fileToDataUrl(file) {
  return new Promise((resolve) => {
    if (!file || file.size > 1024 * 1024 || typeof FileReader === "undefined") {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || "");
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

export const attachmentsApi = {
  async listProject(token, projectId) {
    try {
      const response = await apiRequest(`/projects/${projectId}/attachments?limit=100`, { token });
      return response.data || [];
    } catch {
      return ensureAttachments().filter(
        (attachment) => String(attachment.project_id) === String(projectId)
      );
    }
  },

  async uploadProject(token, projectId, file, user) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiRequest(`/projects/${projectId}/attachments`, {
        method: "POST",
        token,
        formData,
      });
      return response.data;
    } catch {
      const attachments = ensureAttachments();
      const attachment = {
        attachment_id: createId("attachment"),
        organization_id: user?.organization_id || 1,
        project_id: projectId,
        uploaded_by: user?.user_id || 1,
        original_name: file.name,
        stored_name: `${Date.now()}-${file.name}`,
        mime_type: file.type || "application/octet-stream",
        file_size: file.size,
        storage_path: "local-browser-storage",
        data_url: await fileToDataUrl(file),
        created_at: new Date().toISOString(),
      };

      writeStore(ATTACHMENTS_KEY, [attachment, ...attachments]);
      return attachment;
    }
  },

  async remove(token, attachmentId, currentUser) {
    try {
      await apiRequest(`/attachments/${attachmentId}`, { method: "DELETE", token });
    } catch {
      const attachments = ensureAttachments();
      const nextAttachments = attachments.filter((attachment) => {
        const isTarget = String(attachment.attachment_id) === String(attachmentId);
        const canDelete = currentUser?.role_id === ROLES.ADMIN || attachment.uploaded_by === currentUser?.user_id;
        return !(isTarget && canDelete);
      });

      writeStore(ATTACHMENTS_KEY, nextAttachments);
    }
  },
};
