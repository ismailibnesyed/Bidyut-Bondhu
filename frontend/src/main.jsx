import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import router from "./routes/Routes.jsx";

import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthProvider";

document.documentElement.classList.toggle("pc-compact", localStorage.getItem("pc_compact") === "true");
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
    <Toaster position="top-right" />
  </AuthProvider>
);
