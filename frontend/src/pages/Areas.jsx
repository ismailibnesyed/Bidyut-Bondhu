import { baseUrl } from "../services/Base.jsx";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const Areas = () => {
  const requestPath = "/areas";
  const [requestData, setRequestData] = useState(null);
  const [requestLoading, setRequestLoading] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [requestRefresh, setRequestRefresh] = useState(0);
  function reloadRequest() {
    setRequestRefresh(value => value + 1);
  }
  useEffect(() => {
    let active = true;
    setRequestData(null);
    setRequestError("");
    setRequestLoading(Boolean(requestPath));
    async function fetchRequest() {
      if (!requestPath) return;
      try {
        const token = localStorage.getItem("lm_token");
        const response = await fetch(baseUrl + requestPath, {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {}
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (response.status === 401 && active) window.dispatchEvent(new Event("auth-expired"));
          throw new Error(Array.isArray(data.detail) ? data.detail.map(item => item.msg).join(". ") : data.detail || "Could not load the data.");
        }
        if (active) setRequestData(data);
      } catch (error) {
        if (active) setRequestError(error instanceof TypeError ? "Cannot connect to the server. Please try again." : error.message);
      } finally {
        if (active) setRequestLoading(false);
      }
    }
    fetchRequest();
    return () => {
      active = false;
    };
  }, [requestPath, requestRefresh]);
  const request = {
    data: requestData,
    loading: requestLoading,
    error: requestError,
    reload: reloadRequest
  };
  const [search, setSearch] = useState("");
  const areas = (request.data || []).filter(item => [item.area_name, item.district, item.postal_code].join(" ").toLowerCase().includes(search.toLowerCase()));
  return <>
      <PageHeader title="Manage Areas" description="Keep your service areas organised and up to date." />

      <section className="pc-card">
        <div className="pc-card-heading">
          <h2>Service areas</h2>
          <Link className="pc-button" to="/admin/areas/create">
            + Create Area
          </Link>
        </div>

        <Field label="Search areas" value={search} onChange={event => setSearch(event.target.value)} placeholder="Area name, district or postal code" />

        <RequestState {...request} />

        {!request.loading && !request.error && (areas.length ? <div className="pc-table-wrap">
              <table className="pc-table">
                <thead>
                  <tr>
                    <th>Area</th>
                    <th>District</th>
                    <th>Postal code</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {areas.map(area => <tr key={area.id}>
                      <td>{area.area_name}</td>
                      <td>{area.district}</td>
                      <td>{area.postal_code}</td>
                      <td>
                        <Link to={`/admin/areas/${encodeURIComponent(area.postal_code)}/edit`}>
                          Edit area →
                        </Link>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div> : <p className="pc-empty">
              No areas found. Create an area to get started.
            </p>)}
      </section>
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
function Field({
  label,
  name,
  children,
  ...props
}) {
  return <label className="pc-field"><span>{label}{props.required && <b className="pc-required"> *</b>}</span>{children || <input name={name} {...props} />}</label>;
}

export default Areas;
