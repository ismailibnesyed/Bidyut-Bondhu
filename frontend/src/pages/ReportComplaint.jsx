import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { baseUrl } from "../services/Base.jsx";

const ReportComplaint = () => {
  const navigate = useNavigate();
  const areasPath = "/areas";

  const [areasData, setAreasData] = useState(null);
  const [areasLoading, setAreasLoading] = useState(true);
  const [areasError, setAreasError] = useState("");
  const [areasRefresh, setAreasRefresh] = useState(0);

  function reloadAreas() {
    setAreasRefresh((value) => value + 1);
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
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 401 && active) {
            window.dispatchEvent(new Event("auth-expired"));
          }

          throw new Error(data.detail || "Could not load areas.");
        }

        if (active) {
          setAreasData(data);
        }
      } catch (error) {
        if (active) {
          setAreasError(
            error instanceof TypeError
              ? "Cannot connect to the server. Please try again."
              : error.message
          );
        }
      } finally {
        if (active) {
          setAreasLoading(false);
        }
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
    reload: reloadAreas,
  };

  const profilePath = "/users/me";

  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [profileRefresh, setProfileRefresh] = useState(0);

  function reloadProfile() {
    setProfileRefresh((value) => value + 1);
  }

  useEffect(() => {
    let active = true;

    setProfileData(null);
    setProfileError("");
    setProfileLoading(Boolean(profilePath));

    async function fetchProfile() {
      try {
        const token = localStorage.getItem("lm_token");

        const response = await fetch(baseUrl + profilePath, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 401 && active) {
            window.dispatchEvent(new Event("auth-expired"));
          }

          throw new Error(data.detail || "Could not load profile.");
        }

        if (active) {
          setProfileData(data);
        }
      } catch (error) {
        if (active) {
          setProfileError(
            error instanceof TypeError
              ? "Cannot connect to server."
              : error.message
          );
        }
      } finally {
        if (active) {
          setProfileLoading(false);
        }
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
    reload: reloadProfile,
  };

  const [values, setValues] = useState({
    postal_code: null,
    title: "",
    description: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setValues({
      ...values,
      [name]: value,
    });
  }

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("lm_token");

      const response = await fetch(baseUrl + "/users/me/complaints", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          postal_code:
            values.postal_code ?? profile.data?.postal_code ?? "",
        }),
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      }).catch(() => {
        throw new Error("Cannot connect to the server. Please try again.");
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          window.dispatchEvent(new Event("auth-expired"));
        }

        throw new Error(
          responseData.detail || "The request failed. Please try again."
        );
      }

      toast.success(
        responseData.message || "Complaint submitted successfully."
      );

      navigate("/complaints");
    } catch (failure) {
      toast.error(failure.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Report a Complaint"
        description="Let us know about a power problem in your area."
      />

      <div className="pc-main-aside">
        <section className="pc-card">
          <h2>Complaint details</h2>

          <RequestState {...areas} />
          <RequestState {...profile} />

          {areas.data && profile.data && (
            <form onSubmit={handleSubmit}>
              <Field label="Area" required>
                <select
                  name="postal_code"
                  value={
                    values.postal_code ?? profile.data.postal_code ?? ""
                  }
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an area</option>

                  {areas.data.map((item) => (
                    <option key={item.id} value={item.postal_code}>
                      {item.area_name} ({item.postal_code})
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Complaint title"
                name="title"
                value={values.title}
                onChange={handleChange}
                placeholder="e.g. No power in my street"
                required
                maxLength={150}
              />

              <Field label="Description" required>
                <textarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={6}
                  placeholder="Describe the problem, when it started, and a nearby landmark."
                />
              </Field>

              {error && (
                <p role="alert" className="pc-error">
                  {error}
                </p>
              )}

              <div className="pc-actions">
                <Link className="pc-button secondary" to="/dashboard">
                  Cancel
                </Link>

                <button
                  disabled={saving || !areas.data.length}
                  className="pc-button"
                >
                  {saving ? "Submitting…" : "Submit Complaint"}
                </button>
              </div>

              {!areas.data.length && (
                <p className="pc-note">
                  No service areas are available yet. An administrator needs to
                  create an area first.
                </p>
              )}
            </form>
          )}
        </section>

        <aside className="pc-note">
          <h2>A helpful report includes</h2>

          <ul>
            <li>Your correct service area</li>
            <li>A clear description of the problem</li>
            <li>The time you first noticed it</li>
            <li>A street name or nearby landmark</li>
          </ul>

          <p>You can follow progress from My Complaints.</p>
        </aside>
      </div>
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

export default ReportComplaint;