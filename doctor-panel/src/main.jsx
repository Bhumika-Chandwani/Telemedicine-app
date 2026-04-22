import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './index.css'

// ✅ Read token from URL and save to localStorage BEFORE React renders
const urlParams = new URLSearchParams(window.location.search);
const urlToken  = urlParams.get("token");
const urlName   = urlParams.get("name");
const urlRole   = urlParams.get("role");

if (urlToken) {
  localStorage.setItem("token", urlToken);
  localStorage.setItem("name",  decodeURIComponent(urlName || ""));
  localStorage.setItem("role",  urlRole || "doctor");
  console.log("✅ Doctor token saved to localStorage");

  // Clean the token out of the URL bar
  window.history.replaceState({}, document.title, "/");
}

// ✅ StrictMode removed — double-mount in dev can race with localStorage reads
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);