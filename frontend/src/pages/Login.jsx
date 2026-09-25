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
  const { setAuthUser } = useContext(AuthContext);
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

      if (!accessToken) {
        throw new Error("Login token not found.");
      }

      localStorage.setItem("lm_token", accessToken);

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
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default Login;