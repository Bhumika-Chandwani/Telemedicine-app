import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// ✅ Helper: Set cookie
function setCookie(name, value, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

// ✅ Helper: Delete cookie
export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ Allow backend to set HttpOnly cookie
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Save token in cookie (1 day expiry) + localStorage as fallback
      setCookie("token", data.token, 1);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      // Role-based redirect
      if (data.user.role === "patient") {
        setTimeout(() => {
          const redirectURL = `http://localhost:5174/?token=${data.token}&name=${encodeURIComponent(data.user.name)}&role=${data.user.role}`;
          console.log("🚀 Redirecting to:", redirectURL); // debug
          window.location.href = redirectURL;
        }, 100);

      } else if (data.user.role === "doctor") {
        setTimeout(() => {
          window.location.href = `http://localhost:5175/?token=${data.token}&name=${encodeURIComponent(data.user.name)}&role=${data.user.role}`;
          console.log("🚀 Redirecting to:", redirectURL); // debug
        }, 100);
      }
      else if (data.user.role === "admin") {
        setTimeout(() => {
          const redirectURL = `http://localhost:5176/?token=${data.token}&name=${encodeURIComponent(data.user.name)}&role=${data.user.role}`;
          console.log("🚀 Redirecting to:", redirectURL); // debug
          window.location.href = redirectURL;
        }, 100);
      } else {
        navigate("/login");
      }

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tm-auth-wrapper">
      <div className="tm-auth-card">
        <div className="tm-auth-header">
          <h2>Telemedicine Portal</h2>
          <p>Login to continue your journey</p>
        </div>

        <div className="tm-auth-steps">
          <div className="step active"><span>1</span><p>Login</p></div>
          <div className="line" />
          <div className="step"><span>2</span><p>Dashboard</p></div>
        </div>

        <form className="tm-auth-form" onSubmit={handleSubmit}>
          {error && <div className="tm-error">{error}</div>}

          <div className="tm-form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="your.email@example.com"
              value={form.email} onChange={handleChange} required />
          </div>

          <div className="tm-form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password"
              value={form.password} onChange={handleChange} required />
          </div>

          <button className="tm-primary-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="tm-auth-footer">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign Up</span>
        </div>
      </div>
    </div>
  );
}