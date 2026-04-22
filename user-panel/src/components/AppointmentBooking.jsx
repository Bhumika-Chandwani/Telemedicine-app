import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar, Clock, User, Star, Video,
  Loader2, CheckCircle, ChevronLeft,
  Filter, ChevronDown, Search,
  AlertCircle, Coffee, X,
} from "lucide-react";
import { getVerifiedDoctors, bookAppointment, getAvailableSlots } from "../services/api";

const BASE = "http://localhost:5000";

/* ── helpers ── */
const toDisplayTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
};

// Next N days that the doctor is available, starting from today
const getUpcomingDates = (availability, count = 14) => {
  const days  = availability.map(a => a.day);
  const names = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const result = [];
  const today  = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 60 && result.length < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const name = names[d.getDay()];
    if (days.includes(name)) {
      result.push({
        date:  d.toISOString().split("T")[0],
        label: d.toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short" }),
        day:   name,
      });
    }
  }
  return result;
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export function AppointmentBooking({ navigateTo }) {
  // Doctor list
  const [doctors,  setDoctors]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("All");
  const [specs,    setSpecs]    = useState(["All"]);

  // Booking flow
  const [step,         setStep]         = useState("list");   // "list" | "date" | "slot" | "confirm" | "done"
  const [selected,     setSelected]     = useState(null);
  const [dates,        setDates]        = useState([]);
  const [chosenDate,   setChosenDate]   = useState(null);
  const [slots,        setSlots]        = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [chosenSlot,   setChosenSlot]   = useState(null);
  const [booking,      setBooking]      = useState(false);
  const [bookErr,      setBookErr]      = useState("");
  const [consultType,  setConsultType]  = useState("video");
  const [notes,        setNotes]        = useState("");

  /* ── Load doctors ── */
  useEffect(() => {
    getVerifiedDoctors().then(data => {
      setDoctors(data);
      setSpecs(["All", ...new Set(data.map(d => d.specialization).filter(Boolean))]);
      setLoading(false);
    });
  }, []);

  /* ── When doctor selected → compute available dates ── */
  const pickDoctor = (doc) => {
    setSelected(doc);
    setChosenDate(null);
    setChosenSlot(null);
    setSlots([]);
    setBookErr("");
    setNotes("");
    setDates(getUpcomingDates(doc.availability || []));
    setStep("date");
    window.scrollTo(0, 0);
  };

  /* ── When date selected → fetch 30-min slots from backend ── */
  const pickDate = async (d) => {
    setChosenDate(d);
    setChosenSlot(null);
    setSlotsLoading(true);
    setStep("slot");
    const res = await getAvailableSlots(selected._id, d.date);
    setSlotsLoading(false);
    setSlots(res?.slots ?? []);
  };

  /* ── Confirm booking ── */
  const confirm = async () => {
    if (!chosenSlot) return;
    setBooking(true);
    setBookErr("");
    const r = await bookAppointment({
      doctorId: selected._id,
      date: chosenDate.date,
      timeSlot: chosenSlot.label,
      consultationType: consultType,
      notes,
    });
    setBooking(false);
    if (r?.appointment) {
      setStep("done");
      setTimeout(() => navigateTo("dashboard"), 2200);
    } else {
      setBookErr(r?.message || "Booking failed. Please try another slot.");
      // Refresh slots so newly-taken slot is grayed out
      setSlotsLoading(true);
      const fresh = await getAvailableSlots(selected._id, chosenDate.date);
      setSlots(fresh?.slots ?? []);
      setSlotsLoading(false);
      setChosenSlot(null);
    }
  };

  const back = () => {
    if (step === "date")   { setStep("list"); setSelected(null); }
    if (step === "slot")   { setStep("date"); setChosenDate(null); setSlots([]); }
    if (step === "confirm"){ setStep("slot"); }
  };

  /* ── Filtered list ── */
  const list = doctors.filter(d =>
    (filter === "All" || d.specialization === filter) &&
    (search === "" || d.name.toLowerCase().includes(search.toLowerCase()) ||
     d.specialization?.toLowerCase().includes(search.toLowerCase()))
  );

  /* ════════════════════
     STEP: DONE
  ════════════════════ */
  if (step === "done") return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9", display:"flex",
      alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"white", borderRadius:24, padding:48, textAlign:"center",
        maxWidth:360, width:"100%", boxShadow:"0 8px 40px rgba(0,0,0,0.08)" }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:"#D1FAE5",
          display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
          <CheckCircle size={40} color="#10B981" />
        </div>
        <h2 style={{ fontSize:22, fontWeight:800, color:"#0F172A", margin:"0 0 8px" }}>
          Appointment Booked!
        </h2>
        <p style={{ color:"#64748B", fontSize:14, margin:"0 0 6px" }}>
          Dr. {selected?.name}
        </p>
        <p style={{ color:"#10B981", fontSize:13, fontWeight:600, margin:0 }}>
          {chosenDate?.label} • {chosenSlot?.label}
        </p>
        <p style={{ color:"#94A3B8", fontSize:12, marginTop:16 }}>
          Redirecting to dashboard…
        </p>
      </div>
    </div>
  );

  /* ════════════════════
     STEP: LIST
  ════════════════════ */
  if (step === "list") return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9" }}>

      {/* Header */}
      <div style={{ background:"white", borderBottom:"1px solid #E2E8F0",
        padding:"16px 16px 0", position:"sticky", top:0, zIndex:20 }}>
        <h1 style={{ fontSize:18, fontWeight:800, color:"#0F172A", margin:"0 0 12px" }}>
          Book Appointment
        </h1>

        {/* Search */}
        <div style={{ position:"relative", marginBottom:12 }}>
          <Search size={15} color="#94A3B8" style={{ position:"absolute", left:12,
            top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search doctor or specialization…"
            style={{ width:"100%", paddingLeft:36, paddingRight:14, height:40,
              border:"1.5px solid #E2E8F0", borderRadius:10, fontSize:13,
              color:"#0F172A", background:"#F8FAFC", outline:"none",
              boxSizing:"border-box", fontFamily:"inherit" }}
          />
        </div>

        {/* Filter chips */}
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:14,
          scrollbarWidth:"none", msOverflowStyle:"none" }}>
          {specs.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{
                flexShrink:0, padding:"6px 14px", borderRadius:20, fontSize:12,
                fontWeight:600, border:"none", cursor:"pointer", transition:"all 0.15s",
                background: filter === s ? "#10B981" : "#F1F5F9",
                color:      filter === s ? "white"   : "#64748B",
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor cards */}
      <div style={{ padding:16 }}>
        {loading ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", paddingTop:80, gap:12 }}>
            <Loader2 size={36} color="#10B981" style={{ animation:"spin 0.8s linear infinite" }} />
            <p style={{ color:"#94A3B8", fontSize:14 }}>Loading verified doctors…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : list.length === 0 ? (
          <div style={{ textAlign:"center", paddingTop:80 }}>
            <div style={{ width:64, height:64, borderRadius:18, background:"#F1F5F9",
              display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <User size={28} color="#CBD5E1" />
            </div>
            <p style={{ color:"#64748B", fontWeight:600, margin:"0 0 6px" }}>No doctors found</p>
            <p style={{ color:"#94A3B8", fontSize:13 }}>Try a different filter or search</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize:12, color:"#94A3B8", marginBottom:14, fontWeight:500 }}>
              {list.length} doctor{list.length !== 1 ? "s" : ""} available
            </p>
            <div style={{ display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(min(100%,320px),1fr))", gap:14 }}>
              {list.map(doc => <DoctorCard key={doc._id} doc={doc} onSelect={pickDoctor} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );

  /* ════════════════════
     STEP: DATE PICKER
  ════════════════════ */
  if (step === "date") return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9" }}>
      <StepHeader title="Select Date" subtitle={`Dr. ${selected.name}`} onBack={back} />

      <div style={{ padding:16, maxWidth:600, margin:"0 auto" }}>
        {/* Doctor mini-card */}
        <DoctorMiniCard doc={selected} />

        <p style={{ fontSize:13, fontWeight:700, color:"#475569", margin:"20px 0 12px",
          textTransform:"uppercase", letterSpacing:"0.05em" }}>
          Available Dates
        </p>

        {dates.length === 0 ? (
          <div style={{ background:"white", borderRadius:16, padding:32, textAlign:"center" }}>
            <AlertCircle size={32} color="#F59E0B" style={{ margin:"0 auto 12px" }} />
            <p style={{ color:"#64748B", fontWeight:600, margin:"0 0 6px" }}>
              No upcoming availability
            </p>
            <p style={{ color:"#94A3B8", fontSize:13 }}>
              This doctor hasn't set their schedule yet
            </p>
          </div>
        ) : (
          <div style={{ display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(130px,1fr))", gap:10 }}>
            {dates.map(d => (
              <button key={d.date} onClick={() => pickDate(d)}
                style={{
                  background:"white", border:"2px solid #E2E8F0",
                  borderRadius:14, padding:"14px 10px", cursor:"pointer",
                  textAlign:"center", transition:"all 0.15s",
                  boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#10B981";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(16,185,129,0.15)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#E2E8F0";
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                }}>
                <p style={{ fontSize:11, fontWeight:600, color:"#10B981",
                  textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 4px" }}>
                  {d.label.split(" ")[0]}
                </p>
                <p style={{ fontSize:20, fontWeight:800, color:"#0F172A", margin:"0 0 2px" }}>
                  {d.label.split(" ")[1]}
                </p>
                <p style={{ fontSize:11, color:"#64748B", margin:0 }}>
                  {d.label.split(" ").slice(2).join(" ")}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  /* ════════════════════
     STEP: SLOT PICKER
  ════════════════════ */
  if (step === "slot") return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9" }}>
      <StepHeader
        title="Select Time"
        subtitle={`${chosenDate?.day}, ${chosenDate?.label}`}
        onBack={back}
      />

      <div style={{ padding:16, maxWidth:600, margin:"0 auto" }}>
        <DoctorMiniCard doc={selected} />

        {/* Selected date badge */}
        <div style={{ display:"flex", alignItems:"center", gap:8, margin:"16px 0 12px",
          padding:"10px 14px", background:"white", borderRadius:12,
          border:"1.5px solid #E2E8F0" }}>
          <Calendar size={15} color="#10B981" />
          <span style={{ fontSize:13, fontWeight:600, color:"#0F172A" }}>
            {chosenDate?.label}
          </span>
        </div>

        {slotsLoading ? (
          <div style={{ background:"white", borderRadius:16, padding:48,
            display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
            <Loader2 size={32} color="#10B981"
              style={{ animation:"spin 0.8s linear infinite" }} />
            <p style={{ color:"#94A3B8", fontSize:13 }}>Loading available slots…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : slots.length === 0 ? (
          <div style={{ background:"white", borderRadius:16, padding:32, textAlign:"center" }}>
            <Clock size={32} color="#CBD5E1" style={{ margin:"0 auto 12px" }} />
            <p style={{ color:"#64748B", fontWeight:600, margin:"0 0 6px" }}>
              No slots available
            </p>
            <p style={{ color:"#94A3B8", fontSize:13 }}>
              All slots are booked for this day. Please choose another date.
            </p>
            <button onClick={back}
              style={{ marginTop:16, padding:"10px 24px", background:"#10B981",
                color:"white", border:"none", borderRadius:10, fontWeight:600,
                fontSize:13, cursor:"pointer" }}>
              Pick another date
            </button>
          </div>
        ) : (
          <>
            {/* Legend */}
            <div style={{ display:"flex", gap:16, marginBottom:14, flexWrap:"wrap" }}>
              {[
                { color:"#D1FAE5", border:"#10B981", text:"#065F46", label:"Available" },
                { color:"#F1F5F9", border:"#E2E8F0", text:"#94A3B8", label:"Booked"    },
                { color:"#FEF3C7", border:"#F59E0B", text:"#92400E", label:"Break"     },
              ].map(({ color, border, text, label }) => (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:14, height:14, borderRadius:4,
                    background:color, border:`1.5px solid ${border}` }} />
                  <span style={{ fontSize:11, color:text, fontWeight:500 }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Slot grid */}
            <div style={{ display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(130px,1fr))", gap:8 }}>
              {slots.map((s, i) => {
                const chosen = chosenSlot?.label === s.label;
                return (
                  <button key={i}
                    onClick={() => { if (s.available) { setChosenSlot(s); setStep("confirm"); } }}
                    disabled={!s.available}
                    style={{
                      padding:"12px 10px", borderRadius:12, border:"2px solid",
                      fontSize:12, fontWeight:600, cursor: s.available ? "pointer" : "not-allowed",
                      transition:"all 0.15s", textAlign:"center",
                      background: chosen    ? "#10B981"
                                : s.available ? "white" : "#F8FAFC",
                      borderColor: chosen    ? "#10B981"
                                 : s.available ? "#D1FAE5" : "#E2E8F0",
                      color:  chosen    ? "white"
                            : s.available ? "#065F46" : "#CBD5E1",
                      boxShadow: chosen ? "0 4px 14px rgba(16,185,129,0.3)" : "none",
                      opacity: s.available ? 1 : 0.6,
                    }}>
                    <Clock size={12} style={{ marginBottom:4,
                      display:"block", margin:"0 auto 4px" }} />
                    {toDisplayTime(s.startTime)}
                    <div style={{ fontSize:10, fontWeight:400, opacity:0.8, marginTop:2 }}>
                      – {toDisplayTime(s.endTime)}
                    </div>
                    {!s.available && (
                      <div style={{ fontSize:9, marginTop:4, opacity:0.7 }}>Booked</div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );

  /* ════════════════════
     STEP: CONFIRM
  ════════════════════ */
  if (step === "confirm") return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9" }}>
      <StepHeader title="Confirm Booking" subtitle="Review your appointment" onBack={back} />

      <div style={{ padding:16, maxWidth:560, margin:"0 auto" }}>

        {/* Summary card */}
        <div style={{ background:"white", borderRadius:20, overflow:"hidden",
          boxShadow:"0 4px 24px rgba(0,0,0,0.06)", marginBottom:16 }}>

          {/* Gradient header */}
          <div style={{ background:"linear-gradient(135deg,#10B981,#0D9488)",
            padding:"24px 20px", color:"white" }}>
            <p style={{ fontSize:11, opacity:0.8, margin:"0 0 4px",
              textTransform:"uppercase", letterSpacing:"0.08em" }}>Appointment Summary</p>
            <h3 style={{ fontSize:18, fontWeight:800, margin:0 }}>
              Dr. {selected.name}
            </h3>
            <p style={{ fontSize:13, opacity:0.8, margin:"4px 0 0" }}>
              {selected.specialization}
            </p>
          </div>

          <div style={{ padding:20, display:"flex", flexDirection:"column", gap:14 }}>
            {[
              { icon: Calendar, label:"Date",  value: chosenDate?.label },
              { icon: Clock,    label:"Time",  value: `${toDisplayTime(chosenSlot?.startTime)} – ${toDisplayTime(chosenSlot?.endTime)}` },
              { icon: Video,    label:"Type",  value: consultType === "video" ? "Video Consultation" : consultType === "chat" ? "Chat" : "In-Person" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:"#F0FDF4",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon size={17} color="#10B981" />
                </div>
                <div>
                  <p style={{ fontSize:11, color:"#94A3B8", margin:"0 0 2px",
                    textTransform:"uppercase", letterSpacing:"0.05em", fontWeight:600 }}>
                    {label}
                  </p>
                  <p style={{ fontSize:14, fontWeight:700, color:"#0F172A", margin:0 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consult type */}
        <div style={{ background:"white", borderRadius:16, padding:16,
          marginBottom:16, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
          <p style={{ fontSize:12, fontWeight:700, color:"#475569", margin:"0 0 10px",
            textTransform:"uppercase", letterSpacing:"0.05em" }}>
            Consultation Type
          </p>
          <div style={{ display:"flex", gap:8 }}>
            {[
              { val:"video",     icon:"📹", label:"Video" },
              { val:"chat",      icon:"💬", label:"Chat"  },
              { val:"in-person", icon:"🏥", label:"In-Person" },
            ].map(({ val, icon, label }) => (
              <button key={val} onClick={() => setConsultType(val)}
                style={{
                  flex:1, padding:"10px 6px", borderRadius:10, border:"2px solid",
                  fontSize:12, fontWeight:600, cursor:"pointer", textAlign:"center",
                  transition:"all 0.15s",
                  background:    consultType === val ? "#F0FDF4" : "white",
                  borderColor:   consultType === val ? "#10B981" : "#E2E8F0",
                  color:         consultType === val ? "#065F46" : "#64748B",
                }}>
                <span style={{ fontSize:18, display:"block", marginBottom:4 }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ background:"white", borderRadius:16, padding:16,
          marginBottom:20, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
          <p style={{ fontSize:12, fontWeight:700, color:"#475569", margin:"0 0 8px",
            textTransform:"uppercase", letterSpacing:"0.05em" }}>
            Notes (Optional)
          </p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Describe your symptoms or reason for visit…"
            rows={3}
            style={{ width:"100%", padding:"10px 12px", border:"1.5px solid #E2E8F0",
              borderRadius:10, fontSize:13, color:"#0F172A", resize:"vertical",
              outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}
            onFocus={e => e.target.style.borderColor = "#10B981"}
            onBlur={e  => e.target.style.borderColor = "#E2E8F0"}
          />
        </div>

        {/* Error */}
        {bookErr && (
          <div style={{ background:"#FEF2F2", border:"1px solid #FECACA",
            borderRadius:12, padding:"12px 16px", marginBottom:16,
            display:"flex", alignItems:"flex-start", gap:10 }}>
            <AlertCircle size={16} color="#EF4444" style={{ flexShrink:0, marginTop:1 }} />
            <p style={{ color:"#B91C1C", fontSize:13, margin:0 }}>{bookErr}</p>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={confirm}
          disabled={booking}
          style={{
            width:"100%", padding:"16px", borderRadius:14,
            background: booking ? "#94A3B8" : "linear-gradient(135deg,#10B981,#0D9488)",
            color:"white", border:"none", fontSize:15, fontWeight:800,
            cursor: booking ? "not-allowed" : "pointer",
            boxShadow:"0 4px 18px rgba(16,185,129,0.35)",
            display:"flex", alignItems:"center", justifyContent:"center", gap:10,
            transition:"all 0.2s",
          }}>
          {booking
            ? <><Loader2 size={18} style={{ animation:"spin 0.8s linear infinite" }} /> Confirming…</>
            : "✅ Confirm Appointment"
          }
        </button>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

        <p style={{ textAlign:"center", fontSize:11, color:"#94A3B8", marginTop:12 }}>
          You can cancel or reschedule from your dashboard
        </p>
      </div>
    </div>
  );

  return null;
}

/* ════════════════════════════════════════
   SUB-COMPONENTS
════════════════════════════════════════ */

function StepHeader({ title, subtitle, onBack }) {
  return (
    <div style={{ background:"white", borderBottom:"1px solid #E2E8F0",
      padding:"14px 16px", position:"sticky", top:0, zIndex:20,
      display:"flex", alignItems:"center", gap:12 }}>
      <button onClick={onBack}
        style={{ width:36, height:36, borderRadius:10, border:"1.5px solid #E2E8F0",
          background:"white", cursor:"pointer", display:"flex",
          alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <ChevronLeft size={18} color="#64748B" />
      </button>
      <div>
        <h1 style={{ fontSize:16, fontWeight:800, color:"#0F172A", margin:0 }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize:12, color:"#94A3B8", margin:0, marginTop:2 }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function DoctorMiniCard({ doc }) {
  return (
    <div style={{ background:"white", borderRadius:16, padding:"14px 16px",
      display:"flex", alignItems:"center", gap:14,
      boxShadow:"0 1px 8px rgba(0,0,0,0.05)", border:"1.5px solid #F0FDF4" }}>
      <div style={{ width:48, height:48, borderRadius:12, overflow:"hidden", flexShrink:0,
        background:"linear-gradient(135deg,#10B981,#0D9488)",
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        {doc.profilePhoto
          ? <img src={`${BASE}/${doc.profilePhoto}`} alt={doc.name}
              style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          : <User size={22} color="white" />
        }
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:14, fontWeight:700, color:"#0F172A", margin:"0 0 3px", truncate:true }}>
          Dr. {doc.name}
        </p>
        <p style={{ fontSize:12, color:"#10B981", fontWeight:600, margin:"0 0 3px" }}>
          {doc.specialization}
        </p>
        <p style={{ fontSize:11, color:"#94A3B8", margin:0 }}>
          {doc.experience ? `${doc.experience} yrs exp` : ""} {doc.qualification ? `• ${doc.qualification}` : ""}
        </p>
      </div>
      {doc.breakTime?.startTime && (
        <div style={{ display:"flex", alignItems:"center", gap:4,
          background:"#FEF3C7", borderRadius:8, padding:"4px 8px", flexShrink:0 }}>
          <Coffee size={12} color="#92400E" />
          <span style={{ fontSize:10, color:"#92400E", fontWeight:600 }}>
            {toDisplayTime(doc.breakTime.startTime)}
          </span>
        </div>
      )}
    </div>
  );
}

function DoctorCard({ doc, onSelect }) {
  const availDays = (doc.availability || []).map(a => a.day.slice(0, 3));
  const breakInfo = doc.breakTime?.startTime
    ? `Break: ${toDisplayTime(doc.breakTime.startTime)}–${toDisplayTime(doc.breakTime.endTime)}`
    : null;

  return (
    <div style={{ background:"white", borderRadius:20, overflow:"hidden",
      boxShadow:"0 2px 12px rgba(0,0,0,0.05)", border:"1.5px solid #F1F5F9",
      display:"flex", flexDirection:"column", transition:"all 0.2s" }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(16,185,129,0.15)";
        e.currentTarget.style.borderColor = "#A7F3D0";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
        e.currentTarget.style.borderColor = "#F1F5F9";
        e.currentTarget.style.transform = "translateY(0)";
      }}>

      {/* Photo strip */}
      <div style={{ height:4, background:"linear-gradient(90deg,#10B981,#0D9488)" }} />

      <div style={{ padding:18, flex:1 }}>
        {/* Doctor identity */}
        <div style={{ display:"flex", gap:14, marginBottom:14 }}>
          <div style={{ width:56, height:56, borderRadius:14, overflow:"hidden", flexShrink:0,
            background:"linear-gradient(135deg,#10B981,#0D9488)",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 4px 12px rgba(16,185,129,0.3)" }}>
            {doc.profilePhoto
              ? <img src={`${BASE}/${doc.profilePhoto}`} alt={doc.name}
                  style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              : <User size={24} color="white" />
            }
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:14, fontWeight:800, color:"#0F172A",
              margin:"0 0 3px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              Dr. {doc.name}
            </p>
            <p style={{ fontSize:12, color:"#10B981", fontWeight:600, margin:"0 0 6px" }}>
              {doc.specialization}
            </p>
            {/* Stars */}
            <div style={{ display:"flex", alignItems:"center", gap:2 }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color:"#F59E0B", fontSize:11 }}>★</span>
              ))}
              <span style={{ fontSize:11, color:"#94A3B8", marginLeft:4 }}>4.8</span>
            </div>
          </div>
        </div>

        {/* Info pills */}
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {doc.experience && (
            <InfoRow icon="🎓" text={`${doc.experience} years experience`} />
          )}
          {doc.qualification && (
            <InfoRow icon="📋" text={doc.qualification} />
          )}
          {doc.languagesSpoken?.length > 0 && (
            <InfoRow icon="🌐" text={doc.languagesSpoken.join(", ")} />
          )}
          {availDays.length > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
              <span style={{ fontSize:12 }}>📅</span>
              {availDays.map(d => (
                <span key={d} style={{ padding:"2px 8px", background:"#F0FDF4",
                  color:"#065F46", borderRadius:6, fontSize:11, fontWeight:600 }}>
                  {d}
                </span>
              ))}
            </div>
          )}
          {breakInfo && (
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Coffee size={13} color="#92400E" />
              <span style={{ fontSize:11, color:"#92400E", fontWeight:500 }}>{breakInfo}</span>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:"0 18px 18px" }}>
        <button
          onClick={() => onSelect(doc)}
          style={{
            width:"100%", padding:"12px", borderRadius:12,
            background:"linear-gradient(135deg,#10B981,#0D9488)",
            color:"white", border:"none", fontSize:13, fontWeight:700,
            cursor:"pointer", display:"flex", alignItems:"center",
            justifyContent:"center", gap:8,
            boxShadow:"0 4px 14px rgba(16,185,129,0.3)",
            transition:"all 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(16,185,129,0.45)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(16,185,129,0.3)"}
        >
          <Calendar size={15} /> Book Appointment
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon, text }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
      <span style={{ fontSize:12 }}>{icon}</span>
      <span style={{ fontSize:12, color:"#64748B",
        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
        {text}
      </span>
    </div>
  );
}
