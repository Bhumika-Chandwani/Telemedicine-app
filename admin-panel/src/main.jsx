import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const urlParams = new URLSearchParams(window.location.search);
const urlToken  = urlParams.get("token");
const urlName   = urlParams.get("name");
const urlRole   = urlParams.get("role");

if (urlToken) {
  localStorage.setItem("token", urlToken);
  localStorage.setItem("name",  decodeURIComponent(urlName || ""));
  localStorage.setItem("role",  urlRole || "admin");
  console.log("✅ Admin token saved to localStorage:", urlToken.substring(0, 20) + "...");

  window.history.replaceState({}, document.title, "/");
}

createRoot(document.getElementById("root")).render(
  <App />
);