import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// ✅ Save token BEFORE React renders anything
const urlParams = new URLSearchParams(window.location.search);
const urlToken  = urlParams.get("token");
const urlName   = urlParams.get("name");
const urlRole   = urlParams.get("role");

if (urlToken) {
  localStorage.setItem("token", urlToken);
  localStorage.setItem("name",  decodeURIComponent(urlName || ""));
  localStorage.setItem("role",  urlRole || "patient");
  window.history.replaceState({}, document.title, "/");
  console.log("✅ Token saved from URL");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);