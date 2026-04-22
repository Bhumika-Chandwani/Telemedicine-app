import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const Signup = () => {
  const navigate = useNavigate();

  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // Doctor availability
  const [availability, setAvailability] = useState(
    DAYS.reduce((acc, day) => {
      acc[day] = { enabled: false, startTime: "", endTime: "" };
      return acc;
    }, {})
  );
  const [breakTime, setBreakTime] = useState({ startTime: "", endTime: "" });

  const [formData, setFormData] = useState({
    role:            "patient",
    name:            "",
    email:           "",
    password:        "",
    confirmPassword: "",

    // Doctor-only
    phone:           "",
    qualification:   "",
    specialization:  "",
    experience:      "",
    bio:             "",
    languagesSpoken: "",
    profilePhoto:    null,
    medicalLicense:  null,
    identityProof:   null,

    // Patient Step 3 — health profile
    dob:                  "",
    gender:               "",
    hasChronicDisease:    false,
    chronicDiseaseDetail: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files
        ? files[0]
        : type === "checkbox"
        ? checked
        : value,
    }));
  };

  /* ── Validation ── */
  const validateStep1 = () => {
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword) return "All fields are required";
    if (password !== confirmPassword)  return "Passwords do not match";
    if (password.length < 6)           return "Password must be at least 6 characters";
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) return setError(err);
    setError("");
    setStep(2);
  };

  /* ── Submit — used by both doctor (step 2) and patient (step 3 or skip) ── */
  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setError("");
    setLoading(true);

    const payload = new FormData();
    payload.append("name",     formData.name);
    payload.append("email",    formData.email);
    payload.append("password", formData.password);
    payload.append("role",     formData.role);

    if (formData.role === "doctor") {
      payload.append("phone",          formData.phone);
      payload.append("qualification",  formData.qualification);
      payload.append("specialization", formData.specialization);
      payload.append("experience",     formData.experience);
      payload.append("bio",            formData.bio);
      payload.append(
        "languagesSpoken",
        JSON.stringify(
          formData.languagesSpoken.split(",").map((l) => l.trim()).filter(Boolean)
        )
      );

      const formattedAvailability = Object.keys(availability)
        .filter((day) => availability[day].enabled)
        .map((day) => ({
          day,
          slots: [{ startTime: availability[day].startTime, endTime: availability[day].endTime }],
        }));

      payload.append("availability", JSON.stringify(formattedAvailability));
      payload.append("breakTime",    JSON.stringify(breakTime));

      if (formData.profilePhoto)   payload.append("profilePhoto",   formData.profilePhoto);
      if (formData.medicalLicense) payload.append("medicalLicense", formData.medicalLicense);
      if (formData.identityProof)  payload.append("identityProof",  formData.identityProof);
    }

    if (formData.role === "patient") {
      // Append Step 3 health fields (all optional — backend handles null)
      if (formData.dob)    payload.append("dob",    formData.dob);
      if (formData.gender) payload.append("gender", formData.gender);
      payload.append("hasChronicDisease", String(formData.hasChronicDisease));
      if (formData.hasChronicDisease && formData.chronicDiseaseDetail) {
        payload.append("chronicDiseaseDetail", formData.chronicDiseaseDetail);
      }
    }

    try {
      const res  = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        body:   payload,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      navigate("/login", {
        state: { success: "Account created successfully. Please login." },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Progress bar — patients have 3 steps, doctors have 2 ── */
  const totalSteps = formData.role === "patient" ? 3 : 2;
  const stepLabels = formData.role === "patient"
    ? ["Basic Info", "Health Profile", "Done"]
    : ["Basic Info", "Professional Details"];

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <div className="signup-card">

          {/* Header */}
          <div className="signup-header">
            <h1>Telemedicine Portal</h1>
            <p>Create your account to get started</p>
          </div>

          {/* Progress bar */}
          <div className="progress-bar">
            {stepLabels.map((label, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center" }}>
                <div className="progress-step">
                  <div className={`step-circle ${step >= i + 1 ? "active" : ""}`}>
                    {i + 1}
                  </div>
                  <span className="step-label">{label}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`progress-line ${step >= i + 2 ? "active" : ""}`} />
                )}
              </div>
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="signup-form">

            {/* ── STEP 1 — Basic Info (all roles) ── */}
            {step === 1 && (
              <div className="form-content">
                <div className="form-group">
                  <label className="form-label">I am a</label>
                  <div className="select-wrapper">
                    <select name="role" value={formData.role} onChange={handleChange} className="form-select">
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input name="name" value={formData.name} placeholder="Enter your full name"
                    onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" name="email" value={formData.email}
                    placeholder="your.email@gmail.com" onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" name="password" value={formData.password}
                    placeholder="Create a strong password" onChange={handleChange} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword}
                    placeholder="Re-enter your password" onChange={handleChange} className="form-input" />
                </div>

                <button type="button" onClick={handleNext} className="btn-primary">
                  Continue to Next Step
                </button>
              </div>
            )}

            {/* ── STEP 2 — Patient: Health Profile ── */}
            {step === 2 && formData.role === "patient" && (
              <div className="form-content">
                <div className="form-section">
                  <h3 className="section-title">Health Profile</h3>
                  <p className="section-description">
                    This helps us personalise your symptom predictions. You can update these anytime in Settings.
                  </p>

                  {/* Date of Birth */}
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob}
                      onChange={handleChange} className="form-input"
                      max={new Date().toISOString().split("T")[0]} />
                  </div>

                  {/* Gender */}
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <div className="select-wrapper">
                      <select name="gender" value={formData.gender}
                        onChange={handleChange} className="form-select">
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  {/* Chronic disease */}
                  <div className="form-group">
                    <label className="day-checkbox" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        name="hasChronicDisease"
                        checked={formData.hasChronicDisease}
                        onChange={handleChange}
                        style={{ width: 16, height: 16, accentColor: "#059669" }}
                      />
                      <span className="form-label" style={{ margin: 0 }}>
                        I have a chronic disease or pre-existing condition
                      </span>
                    </label>

                    {formData.hasChronicDisease && (
                      <textarea
                        name="chronicDiseaseDetail"
                        value={formData.chronicDiseaseDetail}
                        onChange={handleChange}
                        placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma..."
                        rows={2}
                        className="form-textarea"
                        style={{ marginTop: 10 }}
                      />
                    )}
                  </div>
                </div>

                <div className="button-group">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                    Back
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="btn-primary">
                    Continue
                  </button>
                </div>

                {/* Skip link */}
                <p style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "#6b7280" }}>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    style={{ background: "none", border: "none", color: "#059669", cursor: "pointer", textDecoration: "underline", fontSize: 13 }}
                  >
                    Skip for now
                  </button>
                  {" — you can fill these in Settings later"}
                </p>
              </div>
            )}

            {/* ── STEP 3 — Patient: Confirm & Submit ── */}
            {step === 3 && formData.role === "patient" && (
              <div className="form-content patient-complete">
                <div className="complete-icon">✓</div>
                <h3 className="complete-title">You're All Set!</h3>
                <p className="complete-description">
                  Click below to create your account and start your health journey.
                </p>

                {/* Summary of what was filled */}
                <div style={{
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderRadius: 10, padding: "12px 16px", marginBottom: 20,
                  textAlign: "left", fontSize: 13, color: "#166534",
                }}>
                  <p style={{ margin: "0 0 6px", fontWeight: 600 }}>Account summary</p>
                  <p style={{ margin: "3px 0" }}>Name: {formData.name}</p>
                  <p style={{ margin: "3px 0" }}>Email: {formData.email}</p>
                  {formData.dob && (
                    <p style={{ margin: "3px 0" }}>Date of birth: {formData.dob}</p>
                  )}
                  {formData.gender && (
                    <p style={{ margin: "3px 0" }}>Gender: {formData.gender}</p>
                  )}
                  {formData.hasChronicDisease && (
                    <p style={{ margin: "3px 0" }}>
                      Chronic condition: {formData.chronicDiseaseDetail || "Yes (details not provided)"}
                    </p>
                  )}
                  {(!formData.dob || !formData.gender) && (
                    <p style={{ margin: "6px 0 0", color: "#4b5563", fontSize: 12 }}>
                      Some health fields were skipped — you can add them in Settings after login.
                    </p>
                  )}
                </div>

                <div className="button-group">
                  <button type="button" onClick={() => setStep(2)} className="btn-secondary">
                    Back
                  </button>
                  <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary">
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2 — Doctor: Professional Details ── */}
            {step === 2 && formData.role === "doctor" && (
              <div className="form-content">
                <div className="form-section">
                  <h3 className="section-title">Professional Information</h3>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input name="phone" value={formData.phone} placeholder="+91 98765 43210"
                      onChange={handleChange} className="form-input" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Qualification</label>
                    <input name="qualification" value={formData.qualification}
                      placeholder="e.g., MBBS, MD" onChange={handleChange} className="form-input" />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Specialization</label>
                      <input name="specialization" value={formData.specialization}
                        placeholder="e.g., Cardiology" onChange={handleChange} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Experience (Years)</label>
                      <input type="number" name="experience" value={formData.experience}
                        placeholder="5" onChange={handleChange} className="form-input" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Professional Bio</label>
                    <textarea name="bio" value={formData.bio}
                      placeholder="Tell patients about your expertise..." onChange={handleChange}
                      rows="4" className="form-textarea" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Languages Spoken</label>
                    <input name="languagesSpoken" value={formData.languagesSpoken}
                      placeholder="English, Hindi, Marathi" onChange={handleChange} className="form-input" />
                    <small className="form-hint">Separate multiple languages with commas</small>
                  </div>
                </div>

                {/* Availability */}
                <div className="form-section">
                  <h3 className="section-title">📅 Availability Schedule</h3>
                  <p className="section-description">Select the days you're available and set your working hours</p>
                  <div className="availability-list">
                    {DAYS.map((day) => (
                      <div key={day} className="availability-item">
                        <label className="day-checkbox">
                          <input type="checkbox" checked={availability[day].enabled}
                            onChange={(e) => setAvailability({ ...availability,
                              [day]: { ...availability[day], enabled: e.target.checked } })} />
                          <span className="day-name">{day}</span>
                        </label>
                        {availability[day].enabled && (
                          <div className="time-inputs">
                            <div className="time-group">
                              <label className="time-label">Start Time</label>
                              <input type="time" value={availability[day].startTime}
                                onChange={(e) => setAvailability({ ...availability,
                                  [day]: { ...availability[day], startTime: e.target.value } })}
                                className="time-input" />
                            </div>
                            <span className="time-separator">—</span>
                            <div className="time-group">
                              <label className="time-label">End Time</label>
                              <input type="time" value={availability[day].endTime}
                                onChange={(e) => setAvailability({ ...availability,
                                  [day]: { ...availability[day], endTime: e.target.value } })}
                                className="time-input" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Break time */}
                <div className="form-section">
                  <h3 className="section-title">🕐 Break Time</h3>
                  <p className="section-description">Set your daily break time (applies to all working days)</p>
                  <div className="break-time-wrapper">
                    <div className="time-group">
                      <label className="time-label">Break Start</label>
                      <input type="time" value={breakTime.startTime}
                        onChange={(e) => setBreakTime({ ...breakTime, startTime: e.target.value })}
                        className="time-input" />
                    </div>
                    <span className="time-separator">—</span>
                    <div className="time-group">
                      <label className="time-label">Break End</label>
                      <input type="time" value={breakTime.endTime}
                        onChange={(e) => setBreakTime({ ...breakTime, endTime: e.target.value })}
                        className="time-input" />
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="form-section">
                  <h3 className="section-title">📄 Required Documents</h3>
                  <div className="form-group">
                    <label className="form-label">Profile Photo</label>
                    <input type="file" name="profilePhoto" accept="image/*"
                      onChange={handleChange} className="form-file" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Medical License</label>
                    <input type="file" name="medicalLicense" accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleChange} className="form-file" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Identity Proof</label>
                    <input type="file" name="identityProof" accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleChange} className="form-file" />
                  </div>
                </div>

                <div className="button-group">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary">Back</button>
                  <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary">
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </div>
            )}

          </div>

          <div className="signup-footer">
            <p>
              Already have an account?{" "}
              <a href="/login" className="login-link">Sign In</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;