import { useState, useContext, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { baseUrl } from "../services/Base.jsx";
import { AuthContext } from "../context/AuthProvider.jsx";

function ComplaintAction({ complaint, role, technicians, reload }) {
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("value");
    setSaving(true);

    try {
      const token = localStorage.getItem("lm_token");
      const response = await fetch(
        baseUrl +
          (role === "admin"
            ? `/admin/complaints/${complaint.id}/assign`
            : `/technician/update_complaints/${complaint.id}`),
        {
          method: "PUT",
          body: JSON.stringify(
            role === "admin"
              ? { assigned_to: Number(value) }
              : { status: value }
          ),
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          window.dispatchEvent(new Event("auth-expired"));
        }
        const message = Array.isArray(responseData.detail)
          ? responseData.detail.map((item) => item.msg).join(". ")
          : responseData.detail || "The request failed. Please try again.";
        throw new Error(message);
      }

      toast.success(responseData.message || "Complaint updated successfully");
      reload();
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pc-inline-form">
      <select
        name="value"
        aria-label={role === "admin" ? "Assign technician" : "Complaint status"}
        required
        defaultValue={
          role === "admin" ? complaint.assigned_to || "" : complaint.status
        }
      >
        {role === "admin" ? (
          <>
            <option value="">Select technician</option>
            {technicians.map((item) => (
              <option key={item.id} value={item.id}>
                {item.firstname} {item.lastname}
              </option>
            ))}
          </>
        ) : (
          ["Pending", "Assigned", "Processing", "Solved"].map((status) => (
            <option key={status}>{status}</option>
          ))
        )}
      </select>

      <button disabled={saving} className="pc-button">
        {saving ? "Saving…" : role === "admin" ? "Assign" : "Update"}
      </button>
    </form>
  );
}

const Complaints = () => {
  const { authUser } = useContext(AuthContext);
  const role = authUser?.role;

  const requestPath =
    role === "admin"
      ? "/admin/complaints"
      : role === "technician"
      ? "/technician/complaints"
      : "/users/me/complaints";

  const staffPath = role === "admin" ? "/admin/users" : null;

  const [requestRefresh, setRequestRefresh] = useState(0);
  const reloadRequest = () => setRequestRefresh((prev) => prev + 1);

  const [requestData, setRequestData] = useState([]);
  const [requestLoading, setRequestLoading] = useState(true);
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    let active = true;
    setRequestLoading(true);
    setRequestError("");

    async function loadRequestData() {
      try {
        const token = localStorage.getItem("lm_token");
        const response = await fetch(baseUrl + requestPath, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 401) {
            window.dispatchEvent(new Event("auth-expired"));
          }
          const message = Array.isArray(result.detail)
            ? result.detail.map((item) => item.msg).join(". ")
            : result.detail || "Could not load data.";
          throw new Error(message);
        }

        if (active) setRequestData(result);
      } catch (err) {
        if (active) {
          setRequestError(
            err instanceof TypeError
              ? "Cannot connect to the server."
              : err.message
          );
        }
      } finally {
        if (active) setRequestLoading(false);
      }
    }

    loadRequestData();

    return () => {
      active = false;
    };
  }, [requestPath, requestRefresh]);

  const [staffData, setStaffData] = useState([]);
  const [staffLoading, setStaffLoading] = useState(Boolean(staffPath));
  const [staffError, setStaffError] = useState("");

  useEffect(() => {
    if (!staffPath) {
      setStaffLoading(false);
      return;
    }

    let active = true;
    setStaffLoading(true);
    setStaffError("");

    async function loadStaffData() {
      try {
        const token = localStorage.getItem("lm_token");
        const response = await fetch(baseUrl + staffPath, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 401) {
            window.dispatchEvent(new Event("auth-expired"));
          }
          const message = Array.isArray(result.detail)
            ? result.detail.map((item) => item.msg).join(". ")
            : result.detail || "Could not load user data.";
          throw new Error(message);
        }

        if (active) setStaffData(result);
      } catch (err) {
        if (active) {
          setStaffError(
            err instanceof TypeError
              ? "Cannot connect to the server."
              : err.message
          );
        }
      } finally {
        if (active) setStaffLoading(false);
      }
    }

    loadStaffData();

    return () => {
      active = false;
    };
  }, [staffPath]);

  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const [status, setStatus] = useState("");

  const filtered = requestData.filter(
    (item) =>
      (!status || item.status === status) &&
      [item.title, item.description, item.postal_code, item.id]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title={
          role === "admin"
            ? "Manage Complaints"
            : role === "technician"
            ? "Assigned Complaints"
            : "My Complaints"
        }
        description="Track reported issues and follow their progress."
      />

      <div className="pc-card pc-filters">
        <Field
          label="Search complaints"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Title, area code or complaint number"
        />

        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {["Pending", "Assigned", "Processing", "Solved"].map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>
        </Field>

        {role === "user" && (
          <Link className="pc-button" to="/complaint/create">
            + Report Complaint
          </Link>
        )}
      </div>

      <RequestState
        loading={requestLoading}
        error={requestError}
        reload={reloadRequest}
      />
      {role === "admin" && (
        <RequestState loading={staffLoading} error={staffError} />
      )}

      {!requestLoading && !requestError && (
        <div className="pc-stack">
          {filtered.length ? (
            filtered.map((item) => (
              <article className="pc-card" key={item.id}>
                <div className="pc-card-heading">
                  <div>
                    <p className="pc-eyebrow">COMPLAINT #{item.id}</p>
                    <h2>{item.title}</h2>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <p className="pc-complaint-description">{item.description}</p>

                <p className="pc-small pc-muted">
                  Area {item.postal_code}
                  {" · "}
                  {new Date(item.created_at).toLocaleString()}
                </p>

                {role !== "user" && (
                  <ComplaintAction
                    complaint={item}
                    role={role}
                    technicians={staffData.filter(
                      (user) => user.role === "technician" && user.is_active
                    )}
                    reload={reloadRequest}
                  />
                )}
              </article>
            ))
          ) : (
            <div className="pc-card pc-empty">
              No complaints match this selection.
            </div>
          )}
        </div>
      )}
    </>
  );
};

function PageHeader({ title, description }) {
  return (
    <header className="pc-page-header">
      <div>
        <p className="pc-breadcrumb">
          <Link to="/dashboard">Dashboard</Link>
          <span>›</span>
          {title}
        </p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </header>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={"pc-status " + String(status).toLowerCase()}>
      {status}
    </span>
  );
}

function Field({ label, name, children, ...props }) {
  return (
    <label className="pc-field">
      <span>{label}</span>
      {children || <input name={name} {...props} />}
    </label>
  );
}

function RequestState({ loading, error, reload }) {
  if (loading) {
    return <div className="pc-empty">Loading your information…</div>;
  }

  if (error) {
    return (
      <div className="pc-error">
        <p>{error}</p>
        {reload && (
          <button className="pc-button secondary" onClick={reload}>
            Try again
          </button>
        )}
      </div>
    );
  }

  return null;
}

export default Complaints;