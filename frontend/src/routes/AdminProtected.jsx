import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider.jsx";

const AdminProtected = ({ children }) => {
  const { authUser } = useContext(AuthContext);

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  if (authUser.role !== "librarian") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminProtected;
