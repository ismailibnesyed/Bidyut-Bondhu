import { baseUrl } from "../services/Base.jsx";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaClipboardList, FaCalendarDays, FaLocationDot, FaHeadset, FaBolt } from "react-icons/fa6";
import { AuthContext } from "../context/AuthProvider.jsx";
const UserPage = () => {
  const {
    authUser
  } = useContext(AuthContext);
  const profilePath = "/users/me";
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [profileRefresh, setProfileRefresh] = useState(0);
  function reloadProfile() {
    setProfileRefresh(value => value + 1);
  }
  useEffect(() => {
    let active = true;
    setProfileData(null);
    setProfileError("");
    setProfileLoading(Boolean(profilePath));
    async function fetchProfile() {
      if (!profilePath) return;
      try {
        const token = localStorage.getItem("lm_token");
        const response = await fetch(baseUrl + profilePath, {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {}
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (response.status === 401 && active) window.dispatchEvent(new Event("auth-expired"));
          throw new Error(Array.isArray(data.detail) ? data.detail.map(item => item.msg).join(". ") : data.detail || "Could not load the data.");
        }
        if (active) setProfileData(data);
      } catch (error) {
        if (active) setProfileError(error instanceof TypeError ? "Cannot connect to the server. Please try again." : error.message);
      } finally {
        if (active) setProfileLoading(false);
      }
    }
    fetchProfile();
    return () => {
      active = false;
    };
  }, [profilePath, profileRefresh]);
  const profile = {
    data: profileData,
    loading: profileLoading,
    error: profileError,
    reload: reloadProfile
  };
  const areasPath = "/areas";
  const [areasData, setAreasData] = useState(null);
  const [areasLoading, setAreasLoading] = useState(true);
  const [areasError, setAreasError] = useState("");
  const [areasRefresh, setAreasRefresh] = useState(0);
  function reloadAreas() {
    setAreasRefresh(value => value + 1);
  }
  useEffect(() => {
    let active = true;
    setAreasData(null);
    setAreasError("");
    setAreasLoading(Boolean(areasPath));
    async function fetchAreas() {
      if (!areasPath) return;
      try {
        const token = localStorage.getItem("lm_token");
        const response = await fetch(baseUrl + areasPath, {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {}
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (response.status === 401 && active) window.dispatchEvent(new Event("auth-expired"));
          throw new Error(Array.isArray(data.detail) ? data.detail.map(item => item.msg).join(". ") : data.detail || "Could not load the data.");
        }
        if (active) setAreasData(data);
      } catch (error) {
        if (active) setAreasError(error instanceof TypeError ? "Cannot connect to the server. Please try again." : error.message);
      } finally {
        if (active) setAreasLoading(false);
      }
    }
    fetchAreas();
    return () => {
      active = false;
    };
  }, [areasPath, areasRefresh]);
  const areas = {
    data: areasData,
    loading: areasLoading,
    error: areasError,
    reload: reloadAreas
  };
  const schedulesPath = "/outage/loadshedding";
  const [schedulesData, setSchedulesData] = useState(null);
  const [schedulesLoading, setSchedulesLoading] = useState(true);
  const [schedulesError, setSchedulesError] = useState("");
  const [schedulesRefresh, setSchedulesRefresh] = useState(0);
  function reloadSchedules() {
    setSchedulesRefresh(value => value + 1);
  }
  useEffect(() => {
    let active = true;
    setSchedulesData(null);
    setSchedulesError("");
    setSchedulesLoading(Boolean(schedulesPath));
    async function fetchSchedules() {
      if (!schedulesPath) return;
      try {
        const token = localStorage.getItem("lm_token");
        const response = await fetch(baseUrl + schedulesPath, {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {}
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (response.status === 401 && active) window.dispatchEvent(new Event("auth-expired"));
          throw new Error(Array.isArray(data.detail) ? data.detail.map(item => item.msg).join(". ") : data.detail || "Could not load the data.");
        }
        if (active) setSchedulesData(data);
      } catch (error) {
        if (active) setSchedulesError(error instanceof TypeError ? "Cannot connect to the server. Please try again." : error.message);
      } finally {
        if (active) setSchedulesLoading(false);
      }
    }
    fetchSchedules();
    return () => {
      active = false;
    };
  }, [schedulesPath, schedulesRefresh]);
  const schedules = {
    data: schedulesData,
    loading: schedulesLoading,
    error: schedulesError,
    reload: reloadSchedules
  };
  const complaintsUrl = authUser.role === "admin" ? "/admin/complaints" : authUser.role === "technician" ? "/technician/complaints" : "/users/me/complaints";
  const complaintsPath = complaintsUrl;
  const [complaintsData, setComplaintsData] = useState(null);
  const [complaintsLoading, setComplaintsLoading] = useState(true);
  const [complaintsError, setComplaintsError] = useState("");
  const [complaintsRefresh, setComplaintsRefresh] = useState(0);
  function reloadComplaints() {
    setComplaintsRefresh(value => value + 1);
  }
  useEffect(() => {
    let active = true;
    setComplaintsData(null);
    setComplaintsError("");
    setComplaintsLoading(Boolean(complaintsPath));
    async function fetchComplaints() {
      if (!complaintsPath) return;
      try {
        const token = localStorage.getItem("lm_token");
        const response = await fetch(baseUrl + complaintsPath, {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {}
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (response.status === 401 && active) window.dispatchEvent(new Event("auth-expired"));
          throw new Error(Array.isArray(data.detail) ? data.detail.map(item => item.msg).join(". ") : data.detail || "Could not load the data.");
        }
        if (active) setComplaintsData(data);
      } catch (error) {
        if (active) setComplaintsError(error instanceof TypeError ? "Cannot connect to the server. Please try again." : error.message);
      } finally {
        if (active) setComplaintsLoading(false);
      }
    }
    fetchComplaints();
    return () => {
      active = false;
    };
  }, [complaintsPath, complaintsRefresh]);
  const complaints = {
    data: complaintsData,
    loading: complaintsLoading,
    error: complaintsError,
    reload: reloadComplaints
  };
  const area = areas.data?.find(item => item.postal_code === profile.data?.postal_code);
  const areaSchedules = (schedules.data || []).filter(item => item.postal_code === profile.data?.postal_code);
  const today = areaSchedules.filter(item => asDate(item.start_time).toDateString() === new Date().toDateString());
  const ongoing = areaSchedules.filter(item => item.status !== "Cancelled" && item.status !== "Completed" && asDate(item.start_time) <= new Date() && asDate(item.end_time) > new Date());
  const actions = [[authUser.role === "admin" ? "/admin/areas/create" : authUser.role === "technician" ? "/complaints" : "/complaint/create", authUser.role === "admin" ? "Create an Area" : authUser.role === "technician" ? "Assigned Complaints" : "Report a Complaint", "Help improve power services in your community.", FaClipboardList, "blue"], ["/outage-info", "Check Outage Schedule", "View upcoming load shedding in your area.", FaCalendarDays, "green"], ["/area-info", "My Area Info", "See your area details and keep them updated.", FaLocationDot, "yellow"], ["/help", "Get Support", "Find answers and learn how to use PowerCare.", FaHeadset, "purple"]];
  return <>
      <PageHeader welcome title={`${profile.data?.firstname || authUser.username}!`} description="Stay informed, stay prepared. Manage your power services in one place." />

      <div className="pc-quick-grid">
        {actions.map(([path, title, description, Icon, color]) => <Link to={path} className={`pc-quick ${color}`} key={path}>
            <span className="pc-round-icon">
              <Icon />
            </span>
            <h2>{title}</h2>
            <p>{description}</p>
            <span className="pc-quick-arrow">→</span>
          </Link>)}
      </div>

      <RequestState {...profile} />

      <div className="pc-two-columns">
        <section className="pc-card">
          <div className="pc-card-heading">
            <h2>Current schedule status</h2>
            <span className="pc-status scheduled">Your area</span>
          </div>

          <RequestState {...schedules} />

          {!schedules.loading && !schedules.error && <div className={`pc-outage-status ${ongoing.length ? "warning" : ""}`}>
              <FaBolt />
              <div>
                <h3>
                  {!area ? "Choose your area" : ongoing.length ? "Scheduled outage in progress" : "No active scheduled outage"}
                </h3>
                <p>
                  {area ? `${area.area_name} · Based on published schedules, not live meter readings.` : "Select your area in your profile to see relevant updates."}
                </p>
                {!area && <Link to="/profile">Update my area →</Link>}
              </div>
            </div>}
        </section>

        <section className="pc-card">
          <div className="pc-card-heading">
            <h2>Today's schedule</h2>
            <Link to="/outage-info">View all →</Link>
          </div>

          <RequestState {...schedules} />

          {!schedules.loading && !schedules.error && (today.length ? today.map(item => <div className="pc-list-row" key={item.id}>
                  <span>
                    {asDate(item.start_time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}{" "}
                    –{" "}
                    {asDate(item.end_time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}
                  </span>
                  <StatusBadge status={item.status} />
                </div>) : <p className="pc-empty">
                No published schedules for your area today.
              </p>)}
        </section>

        <AreaMap area={area} />

        <section className="pc-card">
          <div className="pc-card-heading">
            <h2>
              {authUser.role === "user" ? "My recent complaints" : "Recent complaints"}
            </h2>
            <Link to="/complaints">View all →</Link>
          </div>

          <RequestState {...complaints} />

          {!complaints.loading && !complaints.error && (complaints.data?.length ? complaints.data.slice(0, 5).map(item => <Link className="pc-list-row" to={`/complaints?search=${encodeURIComponent(item.title)}`} key={item.id}>
                  <div>
                    <h3>{item.title}</h3>
                    <p className="pc-small pc-muted">
                      Area {item.postal_code} ·{" "}
                      {asDate(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </Link>) : <p className="pc-empty">
                No complaints yet. Your reports will appear here.
              </p>)}
        </section>
      </div>

      <section className="pc-tips">
        <h2>Tips for a better experience</h2>
        <div>
          <p>
            <b>Keep your area updated</b>
            <br />
            Receive schedules relevant to your neighbourhood.
          </p>
          <p>
            <b>Report accurate information</b>
            <br />
            Include the location and time of the issue.
          </p>
          <p>
            <b>Stay connected</b>
            <br />
            Check your complaint status for team updates.
          </p>
        </div>
      </section>
    </>;
};
// Backend timestamps without a timezone are UTC.
// Backend timestamps without a timezone are UTC.
function asDate(value) {
  return new Date(value && !/(Z|[+-]\d{2}:\d{2})$/.test(value) ? value + "Z" : value);
}
function PageHeader({
  title,
  description,
  welcome = false
}) {
  const headerClass = `pc-page-header ${welcome ? "welcome" : ""}`.trim();
  return <header className={headerClass}>
      <div>
        {welcome ? <p className="pc-eyebrow">WELCOME BACK</p> : <p className="pc-breadcrumb">
            <Link to="/dashboard">Dashboard</Link>
            <span>›</span>
            {title}
          </p>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <p className="pc-motto">
        Reliable Power.
        <br />
        Stronger Communities.
      </p>
    </header>;
}
function AreaMap({
  area
}) {
  const query = area ? `${area.area_name}, ${area.district}, Bangladesh` : "Chattogram, Bangladesh";
  const encodedQuery = encodeURIComponent(query);
  const mapUrl = `https://maps.google.com/maps?q=${encodedQuery}&output=embed`;
  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
  return <section className="pc-card">
      <div className="pc-card-heading">
        <h2>Area location</h2>
        <a href={externalMapUrl} target="_blank" rel="noopener noreferrer">
          Open map ↗
        </a>
      </div>

      <iframe title={`Map of ${query}`} className="pc-map" loading="lazy" referrerPolicy="no-referrer" src={mapUrl} />

      <p className="pc-muted pc-small">
        Map shows the area name, not an exact service boundary.
      </p>
    </section>;
}
function StatusBadge({
  status
}) {
  return <span className={"pc-status " + String(status).toLowerCase()}>{status}</span>;
}
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

export default UserPage;
