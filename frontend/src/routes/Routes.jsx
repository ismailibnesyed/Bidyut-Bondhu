import { useContext } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Root from "../layout/Root.jsx";
import DashboardLayout from "../layout/DashboardLayout.jsx";
import { AuthContext } from "../context/AuthProvider.jsx";
import PrivateRoutes from "./PrivateRoutes.jsx";
import AdminProtected from "./AdminProtected.jsx";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Services from "../pages/Services.jsx";
import Login from "../pages/Login.jsx";
import SignUp from "../pages/SignUp.jsx";
import UserPage from "../pages/UserPage.jsx";
import Schedules from "../pages/Schedules.jsx";
import Profile from "../pages/Profile.jsx";
import ReportComplaint from "../pages/ReportComplaint.jsx";
import Complaints from "../pages/Complaints.jsx";
import AreaInfo from "../pages/AreaInfo.jsx";
import Areas from "../pages/Areas.jsx";
import AreaForm from "../pages/AreaForm.jsx";
import Users from "../pages/Users.jsx";
import Help from "../pages/Help.jsx";
import Settings from "../pages/Settings.jsx";
import Legal from "../pages/Legal.jsx";
import NotFound from "../pages/NotFound.jsx";

// The support wrapper is kept with the route configuration.
// eslint-disable-next-line react-refresh/only-export-components
function SupportLayout() {
  const { authUser } = useContext(AuthContext);
  return authUser ? <DashboardLayout /> : <Root />;
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/services",
        element: <Services />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/privacy-policy",
        element: <Legal />
      },
      {
        path: "/terms",
        element: <Legal terms />
      },
      {
        path: "/billing",
        element: <Navigate to="/help" replace />
      },
      {
        path: "*",
        element: <NotFound />
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  {
    element: <SupportLayout />,
    children: [
      {
        path: "/help",
        element: <Help />
      },
      {
        path: "/contact",
        element: <Navigate to="/help" replace />
      },
    ],
  },
  {
    element: <PrivateRoutes><Outlet /></PrivateRoutes>,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <UserPage />
          },
          {
            path: "/profile",
            element: <Profile />
          },
          {
            path: "/outage-info",
            element: <Schedules />
          },
          {
            path: "/complaint/create",
            element: <ReportComplaint />
          },
          {
            path: "/complaints",
            element: <Complaints />
          },
          {
            path: "/area-info",
            element: <AreaInfo />
          },
          {
            path: "/settings",
            element: <Settings />
          },
          {
            element: <AdminProtected><Outlet /></AdminProtected>,
            children: [
              {
                path: "/admin",
                element: <Navigate to="/dashboard" replace />,
              },
              { 
                path: "/admin/areas",
                element: <Areas /> 
              },
              { 
                path: "/admin/areas/create",
                element: <AreaForm /> 
              },
              {
                path: "/admin/areas/:postalCode/edit",
                element: <AreaForm />,
              },
              { path: "/admin/users", element: <Users /> },
              {
                path: "/admin/technicians",
                element: <Users techniciansOnly />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;