import { useState } from "react";
import toast from "react-hot-toast";
import { baseUrl } from "../services/Base.jsx";

const ChangePassword = () => {
  const [values, setValues] = useState({
    old_password: "",
    new_password: "",
    confirm: ""
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setValues({
      ...values,
      [name]: value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (values.new_password !== values.confirm) {
      setError("New passwords do not match.");
      toast.error("New passwords do not match.");
      return;
    }

    if (values.old_password === values.new_password) {
      setError("Choose a different new password.");
      toast.error("Choose a different new password.");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("lm_token");

      const response = await fetch(baseUrl + "/users/me/password", {
        method: "PUT",
        body: JSON.stringify({
          old_password: values.old_password,
          new_password: values.new_password
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

      setValues({
        old_password: "",
        new_password: "",
        confirm: ""
      });

      toast.success(
        responseData.message || "Password updated successfully."
      );
    } catch (failure) {
      toast.error(failure.message || "Something went wrong!");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form id="password" className="pc-card" onSubmit={handleSubmit}>
      <h2>Change Password</h2>

      <p className="pc-muted">
        Use a unique password to keep your PowerCare account secure.
      </p>

      <div className="pc-form-grid three">
        <PasswordField
          label="Current password"
          name="old_password"
          value={values.old_password}
          onChange={handleChange}
          autoComplete="current-password"
        />

        <PasswordField
          label="New password"
          name="new_password"
          value={values.new_password}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <PasswordField
          label="Confirm new password"
          name="confirm"
          value={values.confirm}
          onChange={handleChange}
          autoComplete="new-password"
        />
      </div>

      <p className="pc-info">
        Use at least 6 characters. A longer password with letters, numbers and
        symbols is recommended.
      </p>

      {error && (
        <p className="pc-error" role="alert">
          {error}
        </p>
      )}

      <div className="pc-actions">
        <button disabled={saving} className="pc-button">
          {saving ? "Updating…" : "Update Password"}
        </button>
      </div>
    </form>
  );
};

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

export default ChangePassword;