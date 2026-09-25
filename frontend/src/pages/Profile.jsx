import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { baseUrl } from "../services/Base.jsx";
import { AuthContext } from "../context/AuthProvider.jsx";
import ChangePassword from "./ChangePassword.jsx";

function ProfileForm({ profile, areas, onSaved }) {
  const [values, setValues] = useState({
    username: profile.username || "",
    email: profile.email || "",
    firstname: profile.firstname || "",
    lastname: profile.lastname || "",
    phone: profile.phone || "",
    postal_code: profile.postal_code || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("lm_token");

      const response = await fetch(baseUrl + "/users/me", {
        method: "PUT",
        body: JSON.stringify({
          ...values,
          postal_code: values.postal_code || null,
        }),
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      }).catch((error) => {
        throw new Error("Cannot connect to the server. Please try again.", {
          cause: error,
        });
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

      const saved = responseData;

      toast.success(responseData.detail || "Profile saved successfully!");
      onSaved(saved);
    } catch (failure) {
      toast.error(
        failure.message || "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form id="edit-profile" className="pc-card" onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>
      <p className="pc-muted">
        Keep your personal information and service area up to date.
      </p>

      <div className="pc-form-grid">
        <Field
          label="Username"
          name="username"
          value={values.username}
          onChange={handleChange}
          required
          pattern="[A-Za-z0-9_]{3,30}"
        />

        <Field
          label="Email address"
          name="email"
          value={values.email}
          onChange={handleChange}
          type="email"
          required
        />

        <Field
          label="First name"
          name="firstname"
          value={values.firstname}
          onChange={handleChange}
          required
        />

        <Field
          label="Last name"
          name="lastname"
          value={values.lastname}
          onChange={handleChange}
          required
        />

        <Field
          label="Phone number"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          type="tel"
          required
        />

        <Field label="My area">
          <select
            name="postal_code"
            value={values.postal_code}
            onChange={handleChange}
          >
            <option value="">Select your area</option>
            {areas.map((item) => (
              <option key={item.id} value={item.postal_code}>
                {item.area_name} · {item.postal_code}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {error && (
        <p className="pc-error" role="alert">
          {error}
        </p>
      )}

      <div className="pc-actions">
        <button
          type="reset"
          className="pc-button secondary"
          onClick={() => {
            setValues({
              username: profile.username || "",
              email: profile.email || "",
              firstname: profile.firstname || "",
              lastname: profile.lastname || "",
              phone: profile.phone || "",
              postal_code: profile.postal_code || "",
            });
            setError("");
          }}
        >
          Reset
        </button>

        <button className="pc-button" disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

const Profile = () => {
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
      if (!profilePath) return;

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

          throw new Error(
            Array.isArray(data.detail)
              ? data.detail.map((item) => item.msg).join(". ")
              : data.detail || "Could not load the data."
          );
        }

        if (active) {
          setProfileData(data);
        }
      } catch (error) {
        if (active) {
          setProfileError(
            error instanceof TypeError
              ? "Cannot connect to the server. Please try again."
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

          throw new Error(
            Array.isArray(data.detail)
              ? data.detail.map((item) => item.msg).join(". ")
              : data.detail || "Could not load the data."
          );
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

  const { logout, setAuthUser } = useContext(AuthContext);

  return (
    <>
      <PageHeader
        title="My Profile"
        description="Manage your personal information and account security."
      />

      <RequestState {...profile} />
      <RequestState {...areas} />

      {profile.data && areas.data && (
        <div className="pc-profile-grid">
          <aside className="pc-card pc-profile-summary">
            <span className="pc-profile-avatar">
              {profile.data.firstname.charAt(0)}
            </span>

            <h2>
              {profile.data.firstname} {profile.data.lastname}
            </h2>

            <p className="pc-muted">{profile.data.email}</p>

            <span className="pc-status scheduled">{profile.data.role}</span>

            <nav>
              <a href="#edit-profile">Profile information</a>
              <a href="#password">Change password</a>
              <Link to="/complaints">My complaints</Link>
              <Link to="/area-info">My area</Link>

              <button className="pc-text-button danger" onClick={logout}>
                Log out
              </button>
            </nav>
          </aside>

          <div className="pc-stack">
            <ProfileForm
              profile={profile.data}
              areas={areas.data}
              onSaved={(user) => {
                setAuthUser(user);
                profile.reload();
              }}
            />

            <ChangePassword />
          </div>
        </div>
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

function Field({ label, name, children, ...props }) {
  return (
    <label className="pc-field">
      <span>
        {label}
        {props.required && <b className="pc-required"> *</b>}
      </span>

      {children || <input name={name} {...props} />}
    </label>
  );
}

export default Profile;