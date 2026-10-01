import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaBolt } from "react-icons/fa6";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar.jsx";
import AuthLayout from "../layout/AuthLayout.jsx";
import { baseUrl } from "../services/Base.jsx";
import { AuthContext } from "../context/AuthProvider.jsx";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotValues, setForgotValues] = useState({
    username: "",
    email: "",
    phone: "",
    new_password: "",
    confirm_password: "",
  });
  const [resetting, setResetting] = useState(false);
  const { setAuthUser, setAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const getMessage = (data, fallback) => {
    if (Array.isArray(data?.detail)) {
      return data.detail.map((item) => item.msg).join(". ");
    }
    return data?.detail || data?.message || fallback;
  };

  const handleLogin = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          getMessage(data, `Login failed (${res.status})`)
        );
      }

      const accessToken = data?.access_token;

      if (!accessToken || !data?.refresh_token) {
        throw new Error("Login token not found.");
      }

      localStorage.setItem("lm_token", accessToken);
      localStorage.setItem("lm_refresh_token", data.refresh_token);
      setAccessToken(accessToken);

      const userRes = await fetch(`${baseUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = await userRes.json().catch(() => ({}));

      if (!userRes.ok) {
        throw new Error(
          getMessage(userData, "Could not load user information.")
        );
      }

      if (userData.id) {
        setAuthUser(userData);
        toast.success(data?.message || "Logged in successfully.");
        navigate("/");
      } else {
        toast.error("User information not found.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    if (forgotValues.new_password !== forgotValues.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }

    setResetting(true);
    try {
      const response = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: forgotValues.username,
          email: forgotValues.email,
          phone: forgotValues.phone,
          new_password: forgotValues.new_password,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(getMessage(data, "Password reset failed. Please try again."));
      }
      toast.success(data.message || "Password reset successfully.");
      setShowForgotPassword(false);
      setPassword("");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setResetting(false);
    }
  };

  const handleForgotChange = (event) => {
    const { name, value } = event.target;
    setForgotValues((previous) => ({ ...previous, [name]: value }));
  };

  return (
    <>
      <Navbar />

      <AuthLayout>
        <div className="w-full max-w-md">
          <div className="mb-7">
            <span className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-600">
              <FaBolt aria-hidden="true" />
            </span>

            <p className="mb-2 text-xs font-semibold tracking-widest text-blue-600">
              WELCOME TO POWERCARE
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome back
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Sign in to check outage schedules and stay connected with your
              community.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {showForgotPassword ? (
              <form onSubmit={handleForgotPassword}>
                <h3 className="text-xl font-bold text-slate-900">Reset password</h3>
                <p className="my-3 text-sm text-slate-500">
                  Enter the username, email, and phone number on your account.
                </p>
                {[
                  ["Username", "username", "text"],
                  ["Email", "email", "email"],
                  ["Phone number", "phone", "tel"],
                  ["New password", "new_password", "password"],
                  ["Confirm new password", "confirm_password", "password"],
                ].map(([label, name, type]) => (
                  <label key={name} className="mb-4 block text-sm font-semibold text-slate-700">
                    <span className="mb-2 block">{label}</span>
                    <input
                      name={name}
                      type={type}
                      value={forgotValues[name]}
                      onChange={handleForgotChange}
                      required
                      minLength={type === "password" ? 6 : undefined}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-normal"
                    />
                  </label>
                ))}
                <button
                  type="submit"
                  disabled={resetting}
                  className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {resetting ? "Resetting..." : "Reset password"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="mt-4 w-full text-sm font-semibold text-blue-600"
                >
                  Back to sign in
                </button>
              </form>
            ) : (
              <>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Username
            </label>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              className="mb-5 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              placeholder="Enter your username"
            />

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              placeholder="Enter your password"
            />

            <div className="mt-2 text-right text-sm">
              <button type="button" onClick={() => setShowForgotPassword(true)} className="font-semibold text-blue-600">
                Forgot password?
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Sign In
              <FaArrowRight />
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              New to PowerCare?{" "}
              <Link to="/signup" className="font-semibold text-blue-600">
                Create an account
              </Link>
            </p>
              </>
            )}
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default Login;