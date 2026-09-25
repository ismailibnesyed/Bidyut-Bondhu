import Navbar from "../components/Navbar.jsx";
import AuthLayout from "../layout/AuthLayout.jsx";
import toast from "react-hot-toast";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { baseUrl } from '../services/Base.jsx';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignup = async () => {
    const userData = {
      email,
      username,
      firstname,
      lastname,
      password,
      phone,
      role,
    };

    try {
      const res = await fetch(`${baseUrl}/auth/create_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.detail || "Sign up failed. Please try again.")
        return;
      }
      toast.success(
        data.message || "Account created successfully!"
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <AuthLayout signup>
        <div className="w-full max-w-md">

          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Sign Up now!
            </h1>

            <p className="py-6">
              Please fill the input correctly
            </p>
          </div>

          <div className="card bg-base-100 w-full border border-slate-200 shadow-sm">
            <div className="card-body">
              <fieldset className="fieldset">
                {/* Email */}
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input w-full"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* Username */}
                <label className="label">Username</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                {/* First Name */}
                <label className="label">First Name</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="First Name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />

                {/* Last Name */}
                <label className="label">Last Name</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Last Name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />

                {/* Phone */}
                <label className="label">Phone</label>
                <input
                  type="tel"
                  className="input w-full"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                {/* Password */}
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input w-full"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Role */}
                <label className="label">Role</label>
                <select
                  className="select w-full"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                {/* Login Link */}
                <div className="mt-2">
                  <Link
                    to="/login"
                    className="link link-hover"
                  >
                    Already have an account?
                  </Link>
                </div>


                {/* Signup Button */}
                <button
                  onClick={handleSignup}
                  className="btn mt-4 border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Sign Up
                </button>

              </fieldset>

            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default Signup;