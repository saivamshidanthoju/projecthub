import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ROLES } from "./lib/rbac";
import Landing from "./pages/Landing/Landing";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Tasks from "./pages/Tasks/Tasks";
import Projects from "./pages/Projects/Projects";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import Team from "./pages/Team/Team";
import Reports from "./pages/Reports/Reports";
import Calendar from "./pages/Calendar/Calendar";

const ALL_WORKSPACE_ROLES = [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER];

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={ALL_WORKSPACE_ROLES}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute roles={ALL_WORKSPACE_ROLES}>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute roles={ALL_WORKSPACE_ROLES}>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project-details"
            element={
              <ProtectedRoute roles={ALL_WORKSPACE_ROLES}>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project-details/:projectId"
            element={
              <ProtectedRoute roles={ALL_WORKSPACE_ROLES}>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute roles={ALL_WORKSPACE_ROLES}>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.MANAGER]}>
                <Team />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.MANAGER]}>
                <Reports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
