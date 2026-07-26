# ProjectHub Application Audit Report

This report presents a comprehensive audit of the ProjectHub local application. It evaluates the frontend (React + Vite + TailwindCSS), backend (Node + Express + PG Pool), database schemas, authentication, and frontend-backend integration.

---

## Executive Summary

- **Frontend Core Style & UI:** ✓ **Excellent.** Modern, visually impressive, responsive dashboard layouts, clean typography (Inter/Manrope), and professional design.
- **Frontend State Integration:** ⚠ **Major Issue.** All major feature modules (`Dashboard`, `Projects`, `Tasks`, `Calendar`, `Team`, `Reports`, `ProjectDetails`) operate in a simulated local state. The frontend uses `frontend/src/lib/api.js` as an interception layer that falls back to `localStorage` or hardcoded mock lists.
- **Backend Service Implementation:** ✓ **Good Foundation.** The backend has controllers, repositories, and routes for auth, projects, tasks, comments, activity logs, and notifications.
- **Database Schema & Constraints:** ✗ **Critical Blockers.** The schema (`backend/sql/schema.sql`) lacks table definitions for core tables: `organizations`, `users`, and `roles`. These must be defined and seeded for backend API execution to succeed.
- **Calendar & Team Modules:** ✗ **Incomplete.** No backend models, routes, or database schemas exist for Calendar events or Team member list management.

---

## Core Modules & Page Status

| Module / Page | Status | Frontend Status | Backend API Status | Database Status |
| :--- | :---: | :--- | :--- | :--- |
| **Authentication** | ⚠ | Logic exists in UI; connects via context. | API routes (`/login`, `/register`, `/me`) are complete. | ✗ **Broken.** Missing `users` and `organizations` tables. |
| **Dashboard** | ⚠ | UI complete but uses 100% hardcoded metrics/charts. | Overview, Project, and Task analytics API routes exist. | ✓ DB-queries exist in repo but fail due to missing schema. |
| **Projects** | ⚠ | UI complete; CRUD operates in local state / `localStorage`. | API endpoints exist for listing, creating, and updating. | ✓ DB-queries exist in repo but fail due to missing schema. |
| **Tasks** | ⚠ | UI Kanban board drag-and-drop operates in local state. | API endpoints exist for Kanban CRUD and status changes. | ✓ DB-queries exist in repo but fail due to missing schema. |
| **Calendar** | ✗ | UI hardcoded to Oct 2024. Event adding is transient client-side. | ✗ **Broken.** No APIs exist for calendar event CRUD. | ✗ **Broken.** No `calendar_events` table exists. |
| **Team** | ⚠ | UI lists 42 mock users. Invitations and roles are dummy. | ✗ **Broken.** No endpoint to list/invite organization members. | ✗ **Broken.** Missing `users` table fields and seeds. |
| **Reports** | ⚠ | UI displays mock charts and exports mock CSV files. | ✗ **Broken.** No dedicated reports endpoints exist. | ✗ **Broken.** Requires backend-calculated metric endpoints. |
| **Notifications** | ✗ | Static red dot on header; clicking does not load notifications. | API endpoints (`/notifications`, `/read-all`) are complete. | ✓ DB-queries exist in repo but fail due to missing schema. |
| **Profile** | ✗ | Header dropdown shows user name/email. No page route. | `/auth/me` fetches profile data. | ✗ **Broken.** Missing `users` schema. |
| **Settings** | ✗ | ✗ **Missing.** No UI layout or route exists. | ✗ **Missing.** No settings API route exists. | ✗ **Missing.** No settings database table exists. |

---

## Detailed Audit Results

### 1. Database & Schema Audit

The `schema.sql` file creates constraints referencing tables that do not exist in the database.

- **Missing Tables:**
  - `organizations`: Required by projects, tasks, comments, activities, notifications, attachments.
  - `users`: Required by projects (creator/updater), tasks (assignee/creator), comments (author), activity logs, notifications, attachments.
  - `roles`: Not defined anywhere, though referred to by numeric indices (1 = Admin, 2 = Manager, 3 = Member).
  - `calendar_events`: Needed to persist calendar event entries.
- **Foreign Key Inconsistencies:**
  - If a user registers, they submit a numeric `organization_id` hashed from their slug on the client. Since `organizations` has no record matching this ID, database insertion throws a foreign key constraint violation.

### 2. Frontend-Backend Network Integration Audit

The frontend leverages `frontend/src/lib/api.js` which abstracts network requests. However, all handlers have a try-catch pattern:
```javascript
try {
  const response = await apiRequest("/projects", ...);
  return response.data;
} catch {
  // Silent fallback to writing to localStorage mock lists
}
```
If the backend is not reachable or returns a 500/404, the application continues to run in "local workspace mode." This masks integration bugs and creates a false sense of database persistence.

### 3. Button & Action Audit

| Page | Button / Action | Intended Action | Current Status |
| :--- | :--- | :--- | :--- |
| **Login** | Register / Login | Authenticate against API | ⚠ Partially Working (Fails at DB due to missing tables) |
| **Header** | User Dropdown Sign Out | Discard session, redirect to login | ✓ **Working** (Clears localStorage / sessionStorage) |
| **Header** | Notification Bell | Open unread notification panel | ✗ **Broken** (No dropdown, static badge only) |
| **Dashboard**| Filter / Charts | Change metrics timeline | ✗ **Broken** (Mock layout, charts don't update) |
| **Projects** | New Project Button | Open project configuration modal | ✓ **Working** (UI only, saves to localStorage) |
| **Projects** | Save / Edit Project | Rename/Update project metadata | ✓ **Working** (UI only, saves to localStorage) |
| **Projects** | Delete Project | Remove project from view | ✓ **Working** (UI only, deletes in localStorage) |
| **Tasks** | Create Task Button | Append task to Kanban board | ✓ **Working** (UI only, saves to localStorage) |
| **Tasks** | Drag and Drop Cards | Move task cards across lanes | ✓ **Working** (UI only, shifts lane status in state) |
| **Calendar** | Month Prev / Next | Move calendar grid month | ⚠ Partially Working (Changes month header text; grid is static) |
| **Calendar** | Today Button | Set active month to current | ✗ **Broken** (Does not align grid/header to current date) |
| **Calendar** | Create Event Modal | Submit new event to calendar | ⚠ Partially Working (Appends to client state only) |
| **Calendar** | Event Edit / Delete | Update/Remove calendar event | ✗ **Broken** (No UI modals or handlers present) |
| **Team** | Invite Member | Send organization invite | ✗ **Broken** (Shows a client-side prompt and mock alert) |
| **Team** | Edit / Delete Member | Modify member roles or remove | ⚠ Partially Working (Local client-side simulation only) |
| **Reports** | Sync Data | Synchronize metrics | ✗ **Broken** (Fakes integration with a `setTimeout` spinner) |
| **Reports** | Export CSV | Download table as CSV | ✓ **Working** (Generates client-side mock CSV download) |
| **Reports** | Print PDF | Print current page layout | ✓ **Working** (Triggers native browser window print) |

---

## Missing Features & Technical Debt List

### Frontend Issues:
1. **No API fetch triggers:** The pages never call the `api.js` endpoints on mount. There are no `useEffect` blocks fetching projects, tasks, comments, activities, or team members.
2. **Missing Profile Page:** No settings or user profile form is accessible in the UI.
3. **Hardcoded Uploads:** File attachments in project details upload to local data-URLs instead of calling the backend multipart upload router.

### Backend Issues:
1. **Empty Controllers & Utilities:** `healthController.js` and other minor controller templates are left completely empty.
2. **No Calendaring API:** Need endpoints to Create, Read, Update, and Delete events, scoped by `organization_id`.
3. **No Team/Users API:** Need endpoints to list all users in the same organization, update roles, and invite/create new users.

---

## Recommended Priority List

1. **Phase 1: Database Setup & Schema Fixes**
   - Create definitions for `organizations`, `roles`, and `users`.
   - Update `backend/sql/schema.sql` to include these tables.
   - Setup a database migration/seeding script to populate default organizations (e.g. `projecthub`), roles (1 = Admin, 2 = Manager, 3 = Member), and demo users.
2. **Phase 2: Authentication & Org Isolation**
   - Verify register and login flows write to PostgreSQL.
   - Update registration to automatically create an organization if the slug does not exist, or ensure it is seeded properly.
3. **Phase 3: Project & Task Integration**
   - Rewrite frontend `Projects.jsx` and `ProjectDetails.jsx` to fetch data from `projectsApi` and write to PostgreSQL.
   - Rewrite frontend `Tasks.jsx` to fetch from `tasksApi` and update task status via backend requests.
4. **Phase 4: Team Module Realization**
   - Build backend `/api/team` (or `/api/users`) endpoints to list, create (invite), update, and delete users under the logged-in organization.
   - Update `Team.jsx` to consume these endpoints.
5. **Phase 5: Calendar Module Realization**
   - Create `calendar_events` table.
   - Build backend `/api/calendar` endpoints.
   - Integrate `Calendar.jsx` so months generate dynamically based on actual dates and load events from the database.
6. **Phase 6: Dashboard & Reports Integration**
   - Connect `Dashboard.jsx` to backend overview and analytics endpoints.
   - Connect `Reports.jsx` to fetch aggregated metrics for user performance.
7. **Phase 7: Notifications & Final verification**
   - Connect the header notification bell to list notifications from the backend and support marking them as read.
   - Clean up all localStorage mock fallbacks in `api.js` to ensure the application throws proper network errors when offline.
