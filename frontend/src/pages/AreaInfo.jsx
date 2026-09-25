import { baseUrl } from "../services/Base.jsx";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const AreaInfo = () => {
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
  const [selected, setSelected] = useState("");
  const area = areas.data?.find(item => item.postal_code === (selected || profile.data?.postal_code));
  return <>
      <PageHeader title="My Area Information" description="Explore your service area and check the latest schedules." />

      <RequestState {...areas} />
      <RequestState {...profile} />

      <div className="pc-two-columns">
        <section className="pc-card">
          <h2>Area information</h2>

          <Field label="Choose an area">
            <select value={selected || profile.data?.postal_code || ""} onChange={event => setSelected(event.target.value)}>
              <option value="">Select an area</option>
              {areas.data?.map(item => <option key={item.id} value={item.postal_code}>
                  {item.area_name}
                </option>)}
            </select>
          </Field>

          {area ? <>
              <div className="pc-info">
                <h2>{area.area_name}</h2>
                <p>District: {area.district}</p>
                <p>Postal code: {area.postal_code}</p>
              </div>

              <Link className="pc-button" to={`/outage-info?q=${encodeURIComponent(area.postal_code)}`}>
                View area schedules →
              </Link>
            </> : <p className="pc-empty">Select an area to view its information.</p>}

          <p className="pc-section-gap pc-muted">
            To change your saved service area,{" "}
            <Link to="/profile">update your profile</Link>.
          </p>
        </section>

        <AreaMap area={area} />
      </div>
    </>;
};
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
function Field({
  label,
  name,
  children,
  ...props
}) {
  return <label className="pc-field"><span>{label}{props.required && <b className="pc-required"> *</b>}</span>{children || <input name={name} {...props} />}</label>;
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

export default AreaInfo;
