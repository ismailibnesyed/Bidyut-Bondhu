import { useContext, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  FaBars, FaBolt, FaHouse, FaCalendarDays, FaClipboardList,
  FaLocationDot, FaHeadset, FaUser, FaGear, FaUsers, FaWrench,
  FaPlus, FaArrowRightFromBracket, FaMagnifyingGlass, FaXmark,
} from "react-icons/fa6";
import { AuthContext } from "../context/AuthProvider.jsx";

const DashboardLayout = () => {
  const { authUser, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const isAdmin = authUser.role === "admin";
  const isTechnician = authUser.role === "technician";
  const fullName = [authUser.firstname, authUser.lastname].filter(Boolean).join(" ").trim();
  const displayName = fullName || authUser.username || "User";
  const nameParts = displayName.split(/\s+/);
  let initials = displayName.slice(0, 2).toUpperCase();
  if (nameParts.length > 1) {
    initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  }

  let complaintTitle = "My Complaints";
  if (isAdmin) {
    complaintTitle = "Complaints";
  } else if (isTechnician) {
    complaintTitle = "Assigned Complaints";
  }

  const closeMenu = () => {
    setOpen(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();
  };

  return (
    <div className={`pc-dashboard ${isAdmin ? "admin" : ""}`}>
      {/* Close the mobile sidebar by clicking outside it. */}
      {open && (
        <button className="pc-sidebar-overlay" onClick={closeMenu} aria-label="Close navigation" />
      )}

      {/* Sidebar */}
      <aside className={`pc-sidebar ${open ? "open" : ""}`}>
        <Link to="/" className="pc-brand">
          <FaBolt />
          <span>
            PowerCare
            <small>Load Shedding Management System</small>
          </span>
        </Link>

        <button className="pc-mobile-close" onClick={closeMenu} aria-label="Close navigation">
          <FaXmark />
        </button>

        <nav aria-label="Dashboard navigation">
          <NavLink to="/dashboard" end onClick={closeMenu}>
            <FaHouse /><span>Dashboard</span>
          </NavLink>

          {!isAdmin && !isTechnician && (
            <NavLink to="/complaint/create" end onClick={closeMenu}>
              <FaPlus /><span>Report Complaint</span>
            </NavLink>
          )}

          <NavLink to="/outage-info" end onClick={closeMenu}>
            <FaCalendarDays /><span>Load Shedding</span>
          </NavLink>
          <NavLink to="/complaints" end onClick={closeMenu}>
            <FaClipboardList /><span>{complaintTitle}</span>
          </NavLink>

          {/* Admin menu */}
          {isAdmin && (
            <>
              <NavLink to="/admin/areas" end onClick={closeMenu}>
                <FaLocationDot /><span>Manage Areas</span>
              </NavLink>
              <NavLink to="/admin/areas/create" end onClick={closeMenu}>
                <FaPlus /><span>Create Area</span>
              </NavLink>
              <NavLink to="/admin/users" end onClick={closeMenu}>
                <FaUsers /><span>Users &amp; Staff</span>
              </NavLink>
              <NavLink to="/admin/technicians" end onClick={closeMenu}>
                <FaWrench /><span>Technicians</span>
              </NavLink>
            </>
          )}

          {!isAdmin && (
            <NavLink to="/area-info" end onClick={closeMenu}>
              <FaLocationDot /><span>My Area Info</span>
            </NavLink>
          )}

          <NavLink to="/help" end onClick={closeMenu}>
            <FaHeadset /><span>Help &amp; Support</span>
          </NavLink>
          <NavLink to="/profile" end onClick={closeMenu}>
            <FaUser /><span>Profile</span>
          </NavLink>
          <NavLink to="/settings" end onClick={closeMenu}>
            <FaGear /><span>Settings</span>
          </NavLink>
        </nav>

        <div className="pc-sidebar-bottom">
          <p>Together for<br />a Brighter Tomorrow</p>
          <small>&copy; {new Date().getFullYear()} PowerCare</small>
        </div>
      </aside>

      <div className="pc-workspace">
        {/* Search, profile and logout */}
        <header className="pc-topbar">
          <button
            className="pc-menu"
            onClick={() => setOpen(!open)}
            aria-label="Open navigation"
            aria-expanded={open}
          >
            <FaBars />
          </button>

          <form className="pc-search" onSubmit={handleSearch}>
            <FaMagnifyingGlass />
            <input
              aria-label="Search schedules by area or postal code"
              placeholder="Search area, postal code or schedule..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            <button type="submit" disabled className="cursor-not-allowed opacity-50">Search</button>
          </form>

          <Link className="pc-account cursor-pointer" to="/profile">
            <span className="pc-avatar">{initials}</span>
            <span>Hi, {displayName}</span>
          </Link>

          <button className="pc-icon-button cursor-pointer" onClick={logout} aria-label="Log out" title="Log out">
            <FaArrowRightFromBracket />
          </button>
        </header>

        {/* The selected page appears here. */}
        <main className="pc-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
