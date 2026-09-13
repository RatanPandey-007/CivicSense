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
import MasterSettings from "./pages/master/Settings";
import LiveMap from "./pages/master/LiveMap";
import AiIntelligence from "./pages/master/AiIntelligence";
import CityAnalytics from "./pages/master/CityAnalytics";
import ActivityStream from "./pages/master/ActivityStream";

import MunicipalLayout from "./layouts/MunicipalLayout";
import MunicipalDashboard from "./pages/municipal/Dashboard";
import MunicipalIssues from "./pages/municipal/AssignedIssues";
import ResolutionAction from "./pages/municipal/ResolutionAction";
import MunicipalSettings from "./pages/municipal/Settings";

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
          <Route path="map" element={<LiveMap />} />
          <Route path="ai" element={<AiIntelligence />} />
          <Route path="analytics" element={<CityAnalytics />} />
          <Route path="activity" element={<ActivityStream />} />
          <Route path="issues" element={<MasterIssues />} />
          <Route path="issues/:id" element={<IssueDetails />} />
          <Route path="users" element={<MasterUsers />} />
          <Route path="municipalities" element={<MunicipalAdmins />} />
          <Route path="blogs" element={<MasterBlogs />} />
          <Route path="settings" element={<MasterSettings />} />
        </Route>

        {/* Municipal Admin Routes */}
        <Route path="/municipal" element={<MunicipalLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<MunicipalDashboard />} />
          <Route path="issues" element={<MunicipalIssues />} />
          <Route path="issues/:id" element={<ResolutionAction />} />
          <Route path="settings" element={<MunicipalSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
