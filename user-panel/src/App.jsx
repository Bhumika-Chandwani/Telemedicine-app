import React, { useState, useEffect, Suspense, lazy } from "react";
import Layout    from "./components/Layout";
import Dashboard from "./components/Dashboard";
import { AppointmentBooking } from "./components/AppointmentBooking";
import { Settings } from "./components/Settings";
import { getPatientProfile } from "./services/api";

// ✅ Loading spinner for lazy screens
const ScreenLoader = () => (
  <div style={{
    flex:1, display:"flex", alignItems:"center",
    justifyContent:"center", minHeight:"60vh",
  }}>
    <div style={{
      width:36, height:36,
      border:"3px solid #10B981",
      borderTopColor:"transparent",
      borderRadius:"50%",
      animation:"spin 0.8s linear infinite",
    }} />
    <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
  </div>
);

// ✅ Error boundary — shows "Coming Soon" if component crashes
class ScreenErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError:false }; }
  static getDerivedStateFromError() { return { hasError:true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          flex:1, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          minHeight:"80vh", gap:16,
        }}>
          <div style={{
            width:72, height:72, borderRadius:20,
            background:"linear-gradient(135deg,#10B981,#059669)",
            display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:32,
            boxShadow:"0 8px 24px rgba(16,185,129,0.3)",
          }}>🚧</div>
          <h2 style={{ color:"#0F172A", fontSize:22, fontWeight:700, margin:0 }}>
            Coming Soon
          </h2>
          <p style={{ color:"#94A3B8", fontSize:14, margin:0 }}>
            This page is under construction
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const LOGIN_URL = "http://localhost:5173/login";

// Fields required for a "complete" profile
const REQUIRED_FIELDS = ["phone", "dob", "gender", "bloodGroup", "height", "weight"];

// Screens that require profile completion
const PROTECTED_SCREENS = ["appointments", "symptoms", "video", "records", "prescriptions", "messages"];

const checkProfileComplete = (patient) => {
  if (!patient) return false;
  return REQUIRED_FIELDS.every((field) => {
    const val = patient[field];
    return val !== null && val !== undefined && val !== "";
  });
};

export default function App() {
  const [currentScreen,       setCurrentScreen]       = useState("dashboard");
  const [patientName,         setPatientName]         = useState("Patient");
  const [ready,               setReady]               = useState(false);
  const [selectedRecord,      setSelectedRecord]      = useState(null);
  const [profileComplete,     setProfileComplete]     = useState(false);
  const [profileChecked,      setProfileChecked]      = useState(false);
  const [showIncompleteToast, setShowIncompleteToast] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const token     = localStorage.getItem("token");
      const savedName = localStorage.getItem("name");

      if (!token) {
        window.location.href = LOGIN_URL;
        return;
      }

      setPatientName(decodeURIComponent(savedName || "Patient"));
      setReady(true);

      // Verify session
      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          credentials: "include",
        });
        if (res.status === 401) { localStorage.clear(); window.location.href = LOGIN_URL; return; }
        if (res.ok) {
          const data = await res.json();
          const name = data?.user?.name || data?.name || savedName || "Patient";
          setPatientName(name);
          localStorage.setItem("name", name);
        }
      } catch { console.warn("⚠️ Network error — keeping user logged in"); }

      // Check profile completeness
      try {
        const profileData = await getPatientProfile();
        setProfileComplete(checkProfileComplete(profileData?.patient));
      } catch {
        setProfileComplete(false);
      } finally {
        setProfileChecked(true);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  const handleProfileUpdated = (updatedPatient) => {
    const complete = checkProfileComplete(updatedPatient);
    setProfileComplete(complete);
    if (updatedPatient?.name) {
      setPatientName(updatedPatient.name);
      localStorage.setItem("name", updatedPatient.name);
    }
  };

  const handleLogout = async () => {
    try { await fetch("http://localhost:5000/api/auth/logout", { method: "POST", credentials: "include" }); }
    catch (e) { console.warn(e); }
    localStorage.clear();
    window.location.href = LOGIN_URL;
  };

  const handleNavigate = (screen, data = null) => {
    if (data?.selectedRecord) setSelectedRecord(data.selectedRecord);

    // 🔴 Block protected screens if profile is incomplete
    if (PROTECTED_SCREENS.includes(screen) && profileChecked && !profileComplete) {
      setShowIncompleteToast(true);
      setCurrentScreen("settings");
      window.scrollTo(0, 0);
      setTimeout(() => setShowIncompleteToast(false), 5000);
      return;
    }

    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  if (!ready) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", background:"#0F172A" }}>
        <div style={{ width:44, height:44, border:"4px solid #10B981",
          borderTopColor:"transparent", borderRadius:"50%",
          animation:"spin 0.8s linear infinite", marginBottom:16 }} />
        <p style={{ color:"#94a3b8", fontSize:14, margin:0 }}>Loading...</p>
        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      </div>
    );
  }

  const commonProps = { navigateTo: handleNavigate, patientName, profileComplete };

  const wrapScreen = (Component, extraProps = {}) => (
    <ScreenErrorBoundary>
      <Suspense fallback={<ScreenLoader />}>
        <Component {...commonProps} {...extraProps} />
      </Suspense>
    </ScreenErrorBoundary>
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case "dashboard":    return <Dashboard {...commonProps} />;
      case "appointments": return wrapScreen(AppointmentBooking);
      case "settings":
        return (
          <ScreenErrorBoundary>
            <Settings
              {...commonProps}
              onLogout={handleLogout}
              onProfileUpdated={handleProfileUpdated}
              showIncompleteToast={showIncompleteToast}
              onDismissToast={() => setShowIncompleteToast(false)}
            />
          </ScreenErrorBoundary>
        );
      // coming soon screens
      default:
        return (
          <ScreenErrorBoundary>
            <Suspense fallback={<ScreenLoader />}><div /></Suspense>
          </ScreenErrorBoundary>
        );
    }
  };

  return (
    <Layout
      currentScreen={currentScreen}
      navigateTo={handleNavigate}
      patientName={patientName}
      onLogout={handleLogout}
      profileComplete={profileComplete}
      profileChecked={profileChecked}
    >
      {renderScreen()}
    </Layout>
  );
}
