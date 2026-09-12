import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";

import MasterLayout from "./layouts/MasterLayout";
import MasterDashboard from "./pages/master/Dashboard";
import MasterIssues from "./pages/master/Issues";
import IssueDetails from "./pages/master/IssueDetails";
import MasterUsers from "./pages/master/Users";
import MunicipalAdmins from "./pages/master/MunicipalAdmins";
import MasterBlogs from "./pages/master/Blogs";

import MunicipalLayout from "./layouts/MunicipalLayout";
import MunicipalDashboard from "./pages/municipal/Dashboard";
import MunicipalIssues from "./pages/municipal/AssignedIssues";
import ResolutionAction from "./pages/municipal/ResolutionAction";

// Placeholder for future dashboards
const PlaceholderDashboard = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-screen bg-background text-foreground animate-fade-in">
    <div className="text-center space-y-4">
      <h1 className="text-3xl font-display font-bold tracking-tight">
        {title}
      </h1>
      <p className="text-muted-foreground">This module is under development.</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Master Admin Routes */}
        <Route path="/master" element={<MasterLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<MasterDashboard />} />
          <Route path="issues" element={<MasterIssues />} />
          <Route path="issues/:id" element={<IssueDetails />} />
          <Route path="users" element={<MasterUsers />} />
          <Route path="municipalities" element={<MunicipalAdmins />} />
          <Route path="blogs" element={<MasterBlogs />} />
          <Route
            path="settings"
            element={<PlaceholderDashboard title="Master Settings" />}
          />
        </Route>

        {/* Municipal Admin Routes */}
        <Route path="/municipal" element={<MunicipalLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<MunicipalDashboard />} />
          <Route path="issues" element={<MunicipalIssues />} />
          <Route path="issues/:id" element={<ResolutionAction />} />
          <Route
            path="settings"
            element={<PlaceholderDashboard title="Municipal Settings" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
