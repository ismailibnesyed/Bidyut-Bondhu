import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { baseUrl } from "../services/Base.jsx";

/* ==========================================================================
   Helper Sub-Components
   ========================================================================== */

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
            <span> › </span>
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
      <span>
        {label}
        {props.required && <b className="pc-required">*</b>}
      </span>
      {children || <input name={name} {...props} />}
    </label>
  );
}

function PasswordField({ label, name, ...props }) {
  return (
    <label className="pc-field">
      <span>
        {label}
        <b className="pc-required">*</b>
      </span>
      <input
        type="password"
        name={name}
        required
        minLength={6}
        {...props}
      />
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
          <button
            type="button"
            className="pc-button secondary"
            onClick={reload}
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  return null;
}

/* ==========================================================================
   Main Users Component
   ========================================================================== */

const Users = ({ techniciansOnly = false }) => {
  const usersPath = "/admin/users";

  const [usersData, setUsersData] = useState(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [usersRefresh, setUsersRefresh] = useState(0);

  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "technician",
  });

  function reloadUsers() {
    setUsersRefresh((value) => value + 1);
  }

  useEffect(() => {
    let active = true;

    setUsersData(null);
    setUsersError("");
    setUsersLoading(Boolean(usersPath));

    async function fetchUsers() {
      if (!usersPath) return;

      try {
        const token = localStorage.getItem("lm_token");

        const response = await fetch(baseUrl + usersPath, {
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
              : data.detail || "Could not load users."
          );
        }

        if (active) {
          setUsersData(data);
        }
      } catch (error) {
        if (active) {
          setUsersError(
            error instanceof TypeError
              ? "Cannot connect to the server. Please try again."
              : error.message
          );
        }
      } finally {
        if (active) {
          setUsersLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      active = false;
    };
  }, [usersPath, usersRefresh]);

  const users = {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    reload: reloadUsers,
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  }

  const filtered = (users.data || []).filter(
    (user) =>
      (!techniciansOnly || user.role === "technician") &&
      [user.firstname, user.lastname, user.username, user.email]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("lm_token");

      const response = await fetch(baseUrl + "/admin/staff", {
        method: "POST",
        body: JSON.stringify(values),
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
          Array.isArray(responseData.detail)
            ? responseData.detail.map((item) => item.msg).join(". ")
            : responseData.detail || "The request failed. Please try again."
        );
      }

      toast.success(
        responseData.message || "Staff account created successfully."
      );

      setValues({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        role: "technician",
      });

      users.reload();
    } catch (failure) {
      toast.error(failure.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title={techniciansOnly ? "Technicians" : "Users & Staff"}
        description="View registered accounts and create authorised staff accounts."
      />

      <section className="pc-card">
        <Field
          label="Search users"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <RequestState {...users} />

        {!users.loading &&
          !users.error &&
          (filtered.length ? (
            <div className="pc-table-wrap">
              <table className="pc-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr key={user.id}>
                      <td>
                        {user.firstname} {user.lastname}
                      </td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <StatusBadge status={user.role} />
                      </td>
                      <td>{user.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="pc-empty">No accounts found.</p>
          ))}
      </section>

      <form
        onReset={() => {
          setValues({
            firstname: "",
            lastname: "",
            username: "",
            email: "",
            phone: "",
            password: "",
            role: "technician",
          });
          setError("");
        }}
        className="pc-card pc-section-gap"
        onSubmit={handleSubmit}
      >
        <h2>Create Staff Account</h2>

        <div className="pc-form-grid">
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
            label="Phone number"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            type="tel"
            required
          />

          <Field label="Role">
            <select
              name="role"
              value={values.role}
              onChange={handleChange}
            >
              <option value="technician">Technician</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
        </div>

        <PasswordField
          label="Initial password"
          name="password"
          value={values.password}
          onChange={handleChange}
          autoComplete="new-password"
        />

        {error && (
          <p className="pc-error" role="alert">
            {error}
          </p>
        )}

        <div className="pc-actions">
          <button type="reset" className="pc-button secondary">
            Reset
          </button>

          <button disabled={saving} className="pc-button">
            {saving ? "Creating…" : "Create Account"}
          </button>
        </div>
      </form>
    </>
  );
};

export default Users;