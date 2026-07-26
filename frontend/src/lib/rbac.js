export const ROLES = {
  ADMIN: 1,
  MANAGER: 2,
  MEMBER: 3,
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.MANAGER]: "Manager",
  [ROLES.MEMBER]: "Member",
};

const PERMISSIONS = {
  viewDashboard: [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER],
  viewWorkspace: [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER],
  viewReports: [ROLES.ADMIN, ROLES.MANAGER],
  manageProjects: [ROLES.ADMIN, ROLES.MANAGER],
  deleteProjects: [ROLES.ADMIN],
  manageTasks: [ROLES.ADMIN, ROLES.MANAGER],
  deleteTasks: [ROLES.ADMIN],
  manageTeam: [ROLES.ADMIN, ROLES.MANAGER],
  uploadFiles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER],
  deleteAnyFile: [ROLES.ADMIN],
};

export function getRoleId(user) {
  return Number(user?.role_id ?? user?.roleId ?? ROLES.MEMBER);
}

export function getRoleLabel(user) {
  return ROLE_LABELS[getRoleId(user)] ?? "Member";
}

export function can(user, permission) {
  return PERMISSIONS[permission]?.includes(getRoleId(user)) ?? false;
}

export function isAllowedRole(user, allowedRoles) {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  return allowedRoles.includes(getRoleId(user));
}
