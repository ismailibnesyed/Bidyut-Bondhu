import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { baseUrl } from "../services/Base.jsx";

function AreaEditor({ area, postalCode }) {
  const [form, setForm] = useState(
    area || {
      area_name: "",
      district: "",
      postal_code: ""
    }
  );

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");

    const path = postalCode
      ? "/admin/update_area/" + encodeURIComponent(postalCode)
      : "/admin/create_area";

    try {
      const token = localStorage.getItem("lm_token");

      const response = await fetch(baseUrl + path, {
        method: postalCode ? "PUT" : "POST",
        body: JSON.stringify({
          area_name: form.area_name.trim(),
          district: form.district.trim(),
          postal_code: form.postal_code.trim()
        }),
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`
              }
            : {})
        }
      });

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

      toast.success(
        responseData.message ||
          (postalCode
            ? "Area updated successfully"
            : "Area created successfully")
      );

      navigate("/admin/areas");
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pc-two-columns">
      <form className="pc-card" onSubmit={handleSubmit}>
        <h2>Area Information</h2>

        <p className="pc-muted">Fill in the details for this service area.</p>

        {postalCode && (
          <Field label="Area ID" value={"A-" + area.id} readOnly />
        )}

        <Field
          label="Area name"
          name="area_name"
          value={form.area_name}
          onChange={handleChange}
          required
          placeholder="e.g. Dewan Bazar"
        />

        <Field
          label="District"
          name="district"
          value={form.district}
          onChange={handleChange}
          required
          placeholder="e.g. Chattogram"
        />

        <Field
          label="Postal code"
          name="postal_code"
          value={form.postal_code}
          onChange={handleChange}
          required
          pattern="[0-9]{4}"
          title="Enter a four-digit postal code"
          readOnly={Boolean(postalCode)}
        />

        {postalCode && (
          <p className="pc-small pc-muted">
            The postal code identifies linked users, complaints and schedules,
            so it stays unchanged.
          </p>
        )}

        {error && (
          <p className="pc-error" role="alert">
            {error}
          </p>
        )}

        <div className="pc-actions">
          <Link className="pc-button secondary" to="/admin/areas">
            Cancel
          </Link>

          <button type="submit" className="pc-button" disabled={saving}>
            {saving
              ? "Saving..."
              : postalCode
              ? "Update Area"
              : "+ Create Area"}
          </button>
        </div>
      </form>

      <div>
        <AreaMap
          area={form.area_name && form.district ? form : null}
        />

        <aside className="pc-note">
          <h2>Tips</h2>

          <p>
            Use a recognisable area name and the correct postal code. The map
            updates from the area name and district.
          </p>
        </aside>
      </div>
    </div>
  );
}

const AreaForm = () => {
  const { postalCode } = useParams();

  const requestPath = postalCode ? "/areas" : null;

  const [requestData, setRequestData] = useState(null);
  const [requestLoading, setRequestLoading] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [requestRefresh, setRequestRefresh] = useState(0);

  function reloadRequest() {
    setRequestRefresh((value) => value + 1);
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
          headers: token
            ? {
                Authorization: `Bearer ${token}`
              }
            : {}
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 401 && active) {
            window.dispatchEvent(new Event("auth-expired"));
          }

          throw new Error(
            Array.isArray(data.detail)
              ? data.detail.map((item) => item.msg).join(". ")
              : data.detail || "Could not load the data."
          );
        }

        if (active) {
          setRequestData(data);
        }
      } catch (error) {
        if (active) {
          setRequestError(
            error instanceof TypeError
              ? "Cannot connect to the server. Please try again."
              : error.message
          );
        }
      } finally {
        if (active) {
          setRequestLoading(false);
        }
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

  const area = request.data?.find((item) => item.postal_code === postalCode);

  return (
    <>
      <PageHeader
        title={postalCode ? "Update Area" : "Create New Area"}
        description="Manage service areas for load shedding schedules and complaints."
      />

      {postalCode && <RequestState {...request} />}

      {!postalCode && <AreaEditor key="create" />}

      {postalCode && area && (
        <AreaEditor
          key={postalCode}
          postalCode={postalCode}
          area={area}
        />
      )}

      {postalCode && !area && !request.loading && !request.error && (
        <p className="pc-card">
          Area not found.
          <Link to="/admin/areas">Back to areas</Link>
        </p>
      )}
    </>
  );
};

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

export default AreaForm;