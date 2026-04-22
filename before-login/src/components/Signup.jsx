import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Signup = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Availability state (day-wise)
  const [availability, setAvailability] = useState(
    DAYS.reduce((acc, day) => {
      acc[day] = { enabled: false, startTime: "", endTime: "" };
      return acc;
    }, {})
  );

  // Break time
  const [breakTime, setBreakTime] = useState({
    startTime: "",
    endTime: "",
  });

  const [formData, setFormData] = useState({
    role: "patient",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",

    // Doctor-only fields
    phone: "",
    qualification: "",
    specialization: "",
    experience: "",
    bio: "",
    languagesSpoken: "",

    profilePhoto: null,
    medicalLicense: null,
    identityProof: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const validateStep1 = () => {
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword)
      return "All fields are required";
    if (password !== confirmPassword)
      return "Passwords do not match";
    if (password.length < 6)
      return "Password must be at least 6 characters";
    return null;
  };

  const handleNext = () => {
    const errorMsg = validateStep1();
    if (errorMsg) return setError(errorMsg);
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = new FormData();

    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("password", formData.password);
    payload.append("role", formData.role);

    if (formData.role === "doctor") {
      payload.append("phone", formData.phone);
      payload.append("qualification", formData.qualification);
      payload.append("specialization", formData.specialization);
      payload.append("experience", formData.experience);
      payload.append("bio", formData.bio);

      payload.append(
        "languagesSpoken",
        JSON.stringify(
          formData.languagesSpoken
            .split(",")
            .map((l) => l.trim())
            .filter(Boolean)
        )
      );

      // Convert availability to backend format
      const formattedAvailability = Object.keys(availability)
        .filter((day) => availability[day].enabled)
        .map((day) => ({
          day,
          slots: [
            {
              startTime: availability[day].startTime,
              endTime: availability[day].endTime,
            },
          ],
        }));

      payload.append(
        "availability",
        JSON.stringify(formattedAvailability)
      );

      payload.append("breakTime", JSON.stringify(breakTime));

      if (formData.profilePhoto)
        payload.append("profilePhoto", formData.profilePhoto);
      if (formData.medicalLicense)
        payload.append("medicalLicense", formData.medicalLicense);
      if (formData.identityProof)
        payload.append("identityProof", formData.identityProof);
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        body: payload,
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

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <div className="signup-card">
          {/* Header */}
          <div className="signup-header">
            <h1>Telemedicine Portal</h1>
            <p>Create your account to get started</p>
          </div>

          {/* Progress Indicator */}
          <div className="progress-bar">
            <div className="progress-step">
              <div className={`step-circle ${step >= 1 ? 'active' : ''}`}>1</div>
              <span className="step-label">Basic Info</span>
            </div>
            <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className="progress-step">
              <div className={`step-circle ${step >= 2 ? 'active' : ''}`}>2</div>
              <span className="step-label">
                {formData.role === "doctor" ? "Professional Details" : "Complete"}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Form Content */}
          <div className="signup-form">
            {step === 1 && (
              <div className="form-content">
                {/* Role Selection */}
                <div className="form-group">
                  <label className="form-label">I am a</label>
                  <div className="select-wrapper">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                    </select>
                  </div>
                </div>

                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    placeholder="Enter your full name"
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="your.email@example.com"
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Password */}
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Create a strong password"
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    placeholder="Re-enter your password"
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <button type="button" onClick={handleNext} className="btn-primary">
                  Continue to Next Step
                </button>
              </div>
            )}

            {step === 2 && formData.role === "doctor" && (
              <div className="form-content">
                {/* Professional Information */}
                <div className="form-section">
                  <h3 className="section-title">Professional Information</h3>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      placeholder="+1 (555) 123-4567"
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Qualification</label>
                    <input
                      name="qualification"
                      value={formData.qualification}
                      placeholder="e.g., MBBS, MD"
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Specialization</label>
                      <input
                        name="specialization"
                        value={formData.specialization}
                        placeholder="e.g., Cardiology"
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Experience (Years)</label>
                      <input
                        name="experience"
                        type="number"
                        value={formData.experience}
                        placeholder="5"
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Professional Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      placeholder="Tell patients about your expertise and approach to care..."
                      onChange={handleChange}
                      rows="4"
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Languages Spoken</label>
                    <input
                      name="languagesSpoken"
                      value={formData.languagesSpoken}
                      placeholder="English, Spanish, French"
                      onChange={handleChange}
                      className="form-input"
                    />
                    <small className="form-hint">Separate multiple languages with commas</small>
                  </div>
                </div>

                {/* Availability Section */}
                <div className="form-section">
                  <h3 className="section-title">📅 Availability Schedule</h3>
                  <p className="section-description">
                    Select the days you're available and set your working hours
                  </p>

                  <div className="availability-list">
                    {DAYS.map((day) => (
                      <div key={day} className="availability-item">
                        <label className="day-checkbox">
                          <input
                            type="checkbox"
                            checked={availability[day].enabled}
                            onChange={(e) =>
                              setAvailability({
                                ...availability,
                                [day]: {
                                  ...availability[day],
                                  enabled: e.target.checked,
                                },
                              })
                            }
                          />
                          <span className="day-name">{day}</span>
                        </label>

                        {availability[day].enabled && (
                          <div className="time-inputs">
                            <div className="time-group">
                              <label className="time-label">Start Time</label>
                              <input
                                type="time"
                                value={availability[day].startTime}
                                onChange={(e) =>
                                  setAvailability({
                                    ...availability,
                                    [day]: {
                                      ...availability[day],
                                      startTime: e.target.value,
                                    },
                                  })
                                }
                                className="time-input"
                              />
                            </div>
                            <span className="time-separator">—</span>
                            <div className="time-group">
                              <label className="time-label">End Time</label>
                              <input
                                type="time"
                                value={availability[day].endTime}
                                onChange={(e) =>
                                  setAvailability({
                                    ...availability,
                                    [day]: {
                                      ...availability[day],
                                      endTime: e.target.value,
                                    },
                                  })
                                }
                                className="time-input"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Break Time Section */}
                <div className="form-section">
                  <h3 className="section-title">🕐 Break Time</h3>
                  <p className="section-description">
                    Set your daily break time (applies to all working days)
                  </p>

                  <div className="break-time-wrapper">
                    <div className="time-group">
                      <label className="time-label">Break Start</label>
                      <input
                        type="time"
                        value={breakTime.startTime}
                        onChange={(e) =>
                          setBreakTime({
                            ...breakTime,
                            startTime: e.target.value,
                          })
                        }
                        className="time-input"
                      />
                    </div>
                    <span className="time-separator">—</span>
                    <div className="time-group">
                      <label className="time-label">Break End</label>
                      <input
                        type="time"
                        value={breakTime.endTime}
                        onChange={(e) =>
                          setBreakTime({
                            ...breakTime,
                            endTime: e.target.value,
                          })
                        }
                        className="time-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Document Upload Section */}
                <div className="form-section">
                  <h3 className="section-title">📄 Required Documents</h3>

                  <div className="form-group">
                    <label className="form-label">Profile Photo</label>
                    <input
                      type="file"
                      name="profilePhoto"
                      accept="image/*"
                      onChange={handleChange}
                      className="form-file"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Medical License</label>
                    <input
                      type="file"
                      name="medicalLicense"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleChange}
                      className="form-file"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Identity Proof</label>
                    <input
                      type="file"
                      name="identityProof"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleChange}
                      className="form-file"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="button-group">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && formData.role === "patient" && (
              <div className="form-content patient-complete">
                <div className="complete-icon">✓</div>
                <h3 className="complete-title">You're All Set!</h3>
                <p className="complete-description">
                  Click below to complete your registration
                </p>
                <div className="button-group">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
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