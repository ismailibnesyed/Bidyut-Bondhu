import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaBolt, FaChevronDown, FaXmark } from "react-icons/fa6";
import { AuthContext } from "../context/AuthProvider.jsx";

const Navbar = () => {
  const { authUser, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const fullName = [authUser?.firstname, authUser?.lastname].filter(Boolean).join(" ").trim();
  const displayName = fullName || authUser?.username || "User";
  const nameParts = displayName.split(/\s+/);
  let initials = displayName.slice(0, 2).toUpperCase();
  if (nameParts.length > 1) {
    initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  }

  const closeAccountMenu = (event) => {
    event.currentTarget.closest("details").open = false;
  };

  const handleLogout = (event) => {
    closeAccountMenu(event);
    setOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-16">
      {/* Brand and mobile menu button */}
      <div className="navbar-start">
        <Link to="/" className="pc-brand">
          <FaBolt />
          <span>
            PowerCare
            <small>Load Shedding Management System</small>
          </span>
        </Link>

        <button
          className="btn btn-ghost lg:hidden ml-3 cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Navigation"
          aria-expanded={open}
        >
          {open ? <FaXmark /> : <FaBars />}
        </button>
      </div>

      {/* Desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/services">Services</NavLink></li>
          <li><NavLink to="/outage-info">Outage Schedule</NavLink></li>
          <li><NavLink to="/help">Help</NavLink></li>
        </ul>
      </div>

      {/* Show account menu when logged in, otherwise Login and Sign Up. */}
      <div className="navbar-end">
        {authUser ? (
          <details className="dropdown dropdown-end">
            <summary className="btn cursor-pointer list-none [&::-webkit-details-marker]:hidden" aria-label="Open account menu">
              <span className="flex size-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700" aria-hidden="true">
                {initials}
              </span>
              <span>{authUser.username || displayName}</span>
              <FaChevronDown aria-hidden="true" />
            </summary>
            <ul className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow z-50">
              <li><Link to="/dashboard" onClick={closeAccountMenu} className="cursor-pointer">Dashboard</Link></li>
              <li><Link to="/profile" onClick={closeAccountMenu} className="cursor-pointer">My Profile</Link></li>
              <li><button type="button" onClick={handleLogout} className="cursor-pointer">Logout</button></li>
            </ul>
          </details>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost cursor-pointer">Login</Link>
            <Link to="/signup" className="btn btn-primary ml-2 cursor-pointer">Sign Up</Link>
          </>
        )}
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-base-100 shadow lg:hidden z-50">
          <ul className="menu p-4">
            <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
            <li><Link to="/services" onClick={() => setOpen(false)}>Services</Link></li>
            <li><Link to="/outage-info" onClick={() => setOpen(false)}>Outage Schedule</Link></li>
            <li><Link to="/help" onClick={() => setOpen(false)}>Help</Link></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
