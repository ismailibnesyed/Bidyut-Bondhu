import { useState, useContext, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { baseUrl } from "../services/Base.jsx";
import ScheduleTable from "../components/dashboard/ScheduleTable.jsx";
import { AuthContext } from "../context/AuthProvider.jsx";

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

const emptyForm = {
  postal_code: "",
  start_time: "",
  end_time: "",
  reason: "",
  status: "Scheduled",
};

function asDate(value) {
  if (!value) return new Date();
  return new Date(
    !/(Z|[+-]\d{2}:\d{2})$/.test(value) ? `${value}Z` : value
  );
}

function localTime(value) {
  if (!value) return "";
  const date = asDate(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

// Custom Hook to manage API calls and eliminate duplication
function useFetchData(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);

  const reload = useCallback(() => {
    setRefreshIndex((v) => v + 1);
  }, []);

  useEffect(() => {
    let active = true;

    if (!path) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    async function fetchData() {
      try {
        const token = localStorage.getItem("lm_token");
        const response = await fetch(`${baseUrl}${path}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const resData = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 401 && active) {
            window.dispatchEvent(new Event("auth-expired"));
          }

          throw new Error(
            Array.isArray(resData.detail)
              ? resData.detail.map((item) => item.msg).join(". ")
              : resData.detail || "Could not load data."
          );
        }

        if (active) setData(resData);
      } catch (err) {
        if (active) {
          setError(
            err instanceof TypeError
              ? "Cannot connect to the server. Please try again."
              : err.message
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [path, refreshIndex]);

  return { data, loading, error, reload };
}

// ==========================================
// MAIN SCHEDULES COMPONENT
// ==========================================

const Schedules = () => {
  const { authUser } = useContext(AuthContext);
  const isAdmin = authUser?.role === "admin";

  const schedules = useFetchData("/outage/loadshedding");
  const areas = useFetchData("/areas");

  const [params, setParams] = useSearchParams();

  // Filter States
  const [district, setDistrict] = useState("");
  const [postal, setPostal] = useState("");
  const [month, setMonth] = useState("");
  const [sort, setSort] = useState("oldest");

  const [filters, setFilters] = useState({
    district: "",
    postal: "",
    month: "",
  });

  // Admin Form States
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const query = (params.get("q") || "").toLowerCase();
  const areaList = areas.data || [];

  // Filter & Sort Logic
  const filteredSchedules = (schedules.data || [])
    .filter((item) => {
      const area = areaList.find((val) => val.postal_code === item.postal_code);
      const searchContent = [
        item.postal_code,
        item.reason,
        area?.area_name,
        area?.district,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!filters.postal || item.postal_code === filters.postal) &&
        (!filters.district || area?.district === filters.district) &&
        (!filters.month || localTime(item.start_time).startsWith(filters.month)) &&
        (!query || searchContent.includes(query))
      );
    })
    .sort((a, b) =>
      sort === "oldest"
        ? asDate(a.start_time) - asDate(b.start_time)
        : asDate(b.start_time) - asDate(a.start_time)
    );

  const upcoming = filteredSchedules.filter(
    (item) => item.status === "Scheduled" && asDate(item.start_time) > new Date()
  );

  const ongoing = filteredSchedules.filter(
    (item) =>
      !["Cancelled", "Completed"].includes(item.status) &&
      asDate(item.start_time) <= new Date() &&
      asDate(item.end_time) > new Date()
  );

  // Handlers
  function handleEdit(item) {
    setEditing(item.id);
    setForm({
      postal_code: item.postal_code,
      start_time: localTime(item.start_time),
      end_time: localTime(item.end_time),
      reason: item.reason || "",
      status: item.status,
    });
    setFormError("");

    document.getElementById("schedule-form")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (new Date(form.end_time) <= new Date(form.start_time)) {
      setFormError("End time must be after start time.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const token = localStorage.getItem("lm_token");
      const url = editing
        ? `${baseUrl}/admin/update_loadshedding/${editing}`
        : `${baseUrl}/admin/create_loadshedding`;

      const response = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...form,
          start_time: new Date(form.start_time).toISOString(),
          end_time: new Date(form.end_time).toISOString(),
        }),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          window.dispatchEvent(new Event("auth-expired"));
        }
        throw new Error(
          Array.isArray(responseData.detail)
            ? responseData.detail.map((item) => item.msg).join(". ")
            : responseData.detail || "The request failed. Please try again."
        );
      }

      toast.success(
        responseData.message ||
          (editing ? "Schedule updated successfully." : "Schedule created successfully.")
      );

      setForm(emptyForm);
      setEditing(null);
      schedules.reload();
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Load Shedding Schedule"
        description="Check upcoming load shedding schedules for your area."
      />

      {/* Filter Form */}
      <form
        className="pc-card pc-filters"
        onSubmit={(e) => {
          e.preventDefault();
          setFilters({ district, postal, month });
        }}
      >
        <Field label="District">
          <select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setPostal("");
            }}
          >
            <option value="">All districts</option>
            {[...new Set(areaList.map((item) => item.district))].map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>
        </Field>

        <Field label="Area">
          <select value={postal} onChange={(e) => setPostal(e.target.value)}>
            <option value="">All areas</option>
            {areaList
              .filter((item) => !district || item.district === district)
              .map((item) => (
                <option key={item.id} value={item.postal_code}>
                  {item.area_name} ({item.postal_code})
                </option>
              ))}
          </select>
        </Field>

        <Field
          label="Month"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />

        <Button type="submit">Search</Button>

        <Button
          type="button"
          className="pc-button secondary"
          onClick={() => {
            setDistrict("");
            setPostal("");
            setMonth("");
            setFilters({ district: "", postal: "", month: "" });
            setParams({});
          }}
        >
          Reset
        </Button>
      </form>

      {query && <p className="pc-info">Search results for “{params.get("q")}”</p>}

      <RequestState
        loading={areas.loading}
        error={areas.error}
        reload={areas.reload}
      />

      {/* Overview Statistics */}
      <div className="pc-stat-grid">
        {[
          ["Total schedules", filteredSchedules.length, "blue"],
          ["Upcoming", upcoming.length, "green"],
          ["Ongoing now", ongoing.length, "red"],
        ].map(([label, value, color]) => (
          <section className={`pc-stat ${color}`} key={label}>
            <span className="pc-stat-dot">ϟ</span>
            <div>
              <p>{label}</p>
              <strong>
                {schedules.loading || schedules.error ? "—" : value}
              </strong>
              <small>for selected period</small>
            </div>
          </section>
        ))}
      </div>

      <div className="pc-main-aside">
        <section className="pc-card">
          <div className="pc-card-heading">
            <h2>Load shedding schedule</h2>
            <select
              aria-label="Sort schedules"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="oldest">Earliest first</option>
              <option value="newest">Newest first</option>
            </select>
          </div>

          <RequestState {...schedules} />

          {!schedules.loading && !schedules.error && (
            <ScheduleTable
              schedules={filteredSchedules}
              onEdit={isAdmin ? handleEdit : undefined}
            />
          )}
        </section>

        <div>
          <AreaMap
            area={areaList.find((item) => item.postal_code === filters.postal)}
          />

          <aside className="pc-note">
            <h3>Important note</h3>
            <p>
              Schedules may change. Check regularly for updates and report
              unexpected outages.
            </p>
          </aside>
        </div>
      </div>

      {/* Admin Panel Schedule Form */}
      {isAdmin && (
        <form
          id="schedule-form"
          className="pc-card pc-section-gap"
          onSubmit={handleSubmit}
        >
          <h2>{editing ? "Update schedule" : "Create schedule"}</h2>

          <div className="pc-form-grid">
            <Field label="Area" required>
              <select
                required
                value={form.postal_code}
                name="postal_code"
                onChange={handleChange}
              >
                <option value="">Select an area</option>
                {areaList.map((item) => (
                  <option key={item.id} value={item.postal_code}>
                    {item.area_name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status">
              <select value={form.status} name="status" onChange={handleChange}>
                {["Scheduled", "Running", "Completed", "Cancelled"].map((val) => (
                  <option key={val}>{val}</option>
                ))}
              </select>
            </Field>

            <Field
              label="Start time"
              type="datetime-local"
              required
              value={form.start_time}
              name="start_time"
              onChange={handleChange}
            />

            <Field
              label="End time"
              type="datetime-local"
              required
              value={form.end_time}
              name="end_time"
              onChange={handleChange}
            />
          </div>

          <Field
            label="Reason"
            required
            value={form.reason}
            name="reason"
            onChange={handleChange}
          />

          {formError && (
            <p className="pc-error" role="alert">
              {formError}
            </p>
          )}

          <div className="pc-actions">
            <Button
              type="button"
              className="pc-button secondary"
              onClick={() => {
                setEditing(null);
                setForm(emptyForm);
                setFormError("");
              }}
            >
              Cancel / Clear
            </Button>

            <Button type="submit" disabled={saving}>
              {saving
                ? "Saving…"
                : editing
                ? "Update schedule"
                : "Create schedule"}
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

function PageHeader({ title, description, welcome = false }) {
  const headerClass = `pc-page-header ${welcome ? "welcome" : ""}`.trim();

  return (
    <header className={headerClass}>
      <div>
        {welcome ? (
          <p className="pc-eyebrow">WELCOME BACK</p>
        ) : (
          <p className="pc-breadcrumb">
            <Link to="/dashboard">Dashboard</Link>
            <span>›</span>
            {title}
          </p>
        )}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <p className="pc-motto">
        Reliable Power.
        <br />
        Stronger Communities.
      </p>
    </header>
  );
}

function AreaMap({ area }) {
  const query = area
    ? `${area.area_name}, ${area.district}, Bangladesh`
    : "Chattogram, Bangladesh";

  const encodedQuery = encodeURIComponent(query);
  const mapUrl = `https://maps.google.com/maps?q=${encodedQuery}&output=embed`;
  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

  return (
    <section className="pc-card">
      <div className="pc-card-heading">
        <h2>Area location</h2>
        <a href={externalMapUrl} target="_blank" rel="noopener noreferrer">
          Open map ↗
        </a>
      </div>

      <iframe
        title={`Map of ${query}`}
        className="pc-map"
        loading="lazy"
        referrerPolicy="no-referrer"
        src={mapUrl}
      />

      <p className="pc-muted pc-small">
        Map shows the area name, not an exact service boundary.
      </p>
    </section>
  );
}

function Button({ type = "button", className = "pc-button", children, ...props }) {
  return (
    <button type={type} className={className} {...props}>
      {children}
    </button>
  );
}

function Field({ label, name, children, ...props }) {
  return (
    <label className="pc-field">
      <span>
        {label}
        {props.required && <b className="pc-required">*</b>}
      </span>
      {children || <input name={name} {...props} />}
    </label>
  );
}

function RequestState({ loading, error, reload }) {
  if (loading) {
    return (
      <div className="pc-empty" role="status">
        Loading your information…
      </div>
    );
  }

  if (error) {
    return (
      <div className="pc-error" role="alert">
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

export default Schedules;