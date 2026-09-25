import { FaTools } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdManageHistory } from "react-icons/md";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input
        id="my-drawer-4"
        type="checkbox"
        className="drawer-toggle inline"
      />
      <div className="drawer-content">
        {/* Sidebar toggle */}
        <label
          htmlFor="my-drawer-4"
          aria-label="open sidebar"
          className="btn btn-square btn-ghost drawer-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
            className="my-1.5 inline-block size-4"
          >
            <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
            <path d="M9 4v16" />
            <path d="M14 10l2 2l-2 2" />
          </svg>
        </label>

        {/* Page content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content */}
          <ul className="menu w-full grow">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/areas/create">Create Area</Link></li>
            <li>
              <Link
                to="/admin/areas"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Manage Areas"
              >
                <MdManageHistory />
                <span className="is-drawer-close:hidden">Manage Areas</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Users & Staff"
              >
                <IoMdSettings />
                <span className="is-drawer-close:hidden">Users & Staff</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/technicians"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Technicians"
              >
                <FaTools />
                <span className="is-drawer-close:hidden">Technicians</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
