import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider.jsx";
import { Navigate } from "react-router-dom";
const PrivateRoutes = ({
  children
}) => {
  const {
    authUser,
    loading,
    authError,
    fetchUser
  } = useContext(AuthContext);
  if (loading) return <p>Loading.........</p>;
  if (authError && !authUser) {
    return <RequestState error={authError} reload={() => fetchUser()} />;
  }
  if (!authUser) return <Navigate to="/login" replace />;
  return children;
};
export default PrivateRoutes;
function RequestState({
  loading,
  error,
  reload
}) {
  if (loading) {
    return <div className="pc-empty" role="status">
        Loading your information…
      </div>;
  }
  if (error) {
    return <div className="pc-error" role="alert">
        <p>{error}</p>
        {reload && <button className="pc-button secondary" onClick={reload}>
            Try again
          </button>}
      </div>;
  }
  return null;
}
