import { ROLES } from "./rbac";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const SESSION_STORAGE_KEY = "projecthub.session";

class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
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
  } catch (err) {
    throw new ApiError("Backend is not reachable. Ensure the Express server is running locally.", 0);
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
    token: token || "",
    user: normalizedUser,
    source,
  };
}

export const authApi = {
  async login({ email, password, orgSlug }) {
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
  },

  async me(token) {
    const response = await apiRequest("/auth/me", { token });
    return normalizeUser(response.user || response.data);
  },
};

export const projectsApi = {
  async list(token) {
    const response = await apiRequest("/projects?limit=100", { token });
    return response.data || [];
  },

  async get(token, id) {
    const response = await apiRequest(`/projects/${id}`, { token });
    return response.data;
  },

  async create(token, payload, user) {
    const response = await apiRequest("/projects", {
      method: "POST",
      token,
      body: payload,
    });
    return response.data;
  },

  async update(token, id, payload) {
    const response = await apiRequest(`/projects/${id}`, {
      method: "PUT",
      token,
      body: payload,
    });
    return response.data;
  },

  async remove(token, id) {
    await apiRequest(`/projects/${id}`, { method: "DELETE", token });
  },
};

export const tasksApi = {
  async list(token, filters = {}) {
    let url = "/tasks?limit=100";
    if (filters.projectId) {
      url += `&project=${filters.projectId}`;
    }
    const response = await apiRequest(url, { token });
    return response.data || [];
  },

  async get(token, id) {
    const response = await apiRequest(`/tasks/${id}`, { token });
    return response.data;
  },

  async create(token, payload, user) {
    const response = await apiRequest("/tasks", {
      method: "POST",
      token,
      body: payload,
    });
    return response.data;
  },

  async update(token, id, payload) {
    const response = await apiRequest(`/tasks/${id}`, {
      method: "PUT",
      token,
      body: payload,
    });
    return response.data;
  },

  async remove(token, id) {
    await apiRequest(`/tasks/${id}`, { method: "DELETE", token });
  },
};

export const commentsApi = {
  async list(token, taskId) {
    const response = await apiRequest(`/tasks/${taskId}/comments`, { token });
    return response.data || [];
  },

  async create(token, taskId, commentText) {
    const response = await apiRequest(`/tasks/${taskId}/comments`, {
      method: "POST",
      token,
      body: { comment: commentText },
    });
    return response.data;
  },

  async remove(token, commentId) {
    await apiRequest(`/comments/${commentId}`, { method: "DELETE", token });
  },
};

export const attachmentsApi = {
  async listProject(token, projectId) {
    const response = await apiRequest(`/projects/${projectId}/attachments?limit=100`, { token });
    return response.data || [];
  },

  async uploadProject(token, projectId, file, user) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiRequest(`/projects/${projectId}/attachments`, {
      method: "POST",
      token,
      formData,
    });
    return response.data;
  },

  async remove(token, attachmentId, currentUser) {
    await apiRequest(`/attachments/${attachmentId}`, { method: "DELETE", token });
  },
};

export const calendarApi = {
  async listEvents(token) {
    const response = await apiRequest("/calendar/events", { token });
    return response.data || [];
  },

  async createEvent(token, payload) {
    const response = await apiRequest("/calendar/events", {
      method: "POST",
      token,
      body: payload,
    });
    return response.data;
  },

  async updateEvent(token, id, payload) {
    const response = await apiRequest(`/calendar/events/${id}`, {
      method: "PUT",
      token,
      body: payload,
    });
    return response.data;
  },

  async deleteEvent(token, id) {
    await apiRequest(`/calendar/events/${id}`, { method: "DELETE", token });
  },
};

export const teamApi = {
  async list(token) {
    const response = await apiRequest("/team", { token });
    return response.data || [];
  },

  async invite(token, payload) {
    const response = await apiRequest("/team", {
      method: "POST",
      token,
      body: payload,
    });
    return response.data;
  },

  async update(token, id, payload) {
    const response = await apiRequest(`/team/${id}`, {
      method: "PUT",
      token,
      body: payload,
    });
    return response.data;
  },

  async remove(token, id) {
    await apiRequest(`/team/${id}`, { method: "DELETE", token });
  },
};

export const dashboardApi = {
  async overview(token) {
    const response = await apiRequest("/dashboard/overview", { token });
    return response.data?.overview || {};
  },

  async projects(token) {
    const response = await apiRequest("/dashboard/projects", { token });
    return response.data?.projects || {};
  },

  async tasks(token) {
    const response = await apiRequest("/dashboard/tasks", { token });
    return response.data?.tasks || {};
  },

  async activity(token) {
    const response = await apiRequest("/dashboard/activity", { token });
    return response.data?.activity || {};
  },
};
