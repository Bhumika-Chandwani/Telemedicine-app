import React, { useEffect, useState } from "react";
import "./Doctor.css";

export default function Doctor() {
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState("All");
const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  /* ===============================
     File 
  =============================== */
  const getFileUrl = (filePath) => {
  if (!filePath) return "";

  // correct format already
  if (filePath.startsWith("uploads/")) {
    return `http://localhost:5000/${filePath}`;
  }

  // fix old full path
  const filename = filePath.split("\\").pop();
  return `http://localhost:5000/uploads/${filename}`;
};


  /* ===============================
     FETCH DOCTORS
  =============================== */
  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/admin/doctors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setDoctors(data);
    } catch (error) {
      console.error("Fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  /* ===============================
     APPROVE
  =============================== */
  const handleApprove = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/admin/doctor/approve/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
         
        },
      }
    );

    if (!res.ok) throw new Error("Approve failed");

    await fetchDoctors(); // ✅ refresh data

  } catch (error) {
    console.error("Approve error:", error.message);
  }
};

  /* ===============================
     DISAPPROVE
  =============================== */
  const handleDisapprove = async (id) => {
  console.log("Reject ID:", id);
  const reason = prompt("Enter rejection reason:");
   
  if (!reason) return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/admin/doctor/reject/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      }
    );

    if (!res.ok) throw new Error("Disapprove failed");

    await fetchDoctors(); // ✅ refresh

  } catch (error) {
    console.error("Disapprove error:", error.message);
  }
};

  /* ===============================
     DELETE
  =============================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?"))
      return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/admin/doctor/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setDoctors((prev) =>
        prev.filter((doc) => doc._id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error.message);
    }
  };

  /* ===============================
     FILTER LOGIC
  =============================== */
  const filteredDoctors = doctors.filter((doctor) => {
    if (filter === "All") return true;
    if (filter === "Approved") return doctor.isVerified;
    if (filter === "Pending")
      return !doctor.isVerified && !doctor.rejectionReason;
    if (filter === "Disapproved")
      return !doctor.isVerified && doctor.rejectionReason;
    return true;
  });

  const getStatus = (doctor) => {
    if (doctor.isVerified) return "Approved";
    if (doctor.rejectionReason) return "Disapproved";
    return "Pending";
  };


  /* ===============================
     UI
  =============================== */
return (
  <div className="page-container">
    
    {/* HEADER */}
    <div className="page-header">
      <h2 className="page-title">Doctors Management</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-dropdown"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Disapproved</option>
        </select>
      </div>
    </div>

    {/* TABLE */}
    <div className="table-container">
      {loading ? (
        <div className="loading">Loading doctors...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Status</th>
              <th>Rejection Reason</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredDoctors.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No doctors found
                </td>
              </tr>
            ) : (
              filteredDoctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.specialization}</td>
                  <td>
                    <span className={`status ${getStatus(doctor).toLowerCase()}`}>
                      {getStatus(doctor)}
                    </span>
                  </td>
                  <td>{doctor.rejectionReason || "-"}</td>

                <td className="actions">
  {/* VIEW */}
  <button
    className="btn view"
    onClick={() => setSelectedDoctor(doctor)}
  >
    View
  </button>

  {/* ✅ PENDING */}
  {!doctor.isVerified && !doctor.rejectionReason && (
    <>
      <button
        className="btn approve"
        onClick={() => handleApprove(doctor._id)}
      >
        Approve
      </button>

      <button
        className="btn disapprove"
        onClick={() => handleDisapprove(doctor._id)}
      >
        Disapprove
      </button>
    </>
  )}

  {/* ✅ APPROVED */}
  {doctor.isVerified && (
    <span className="status approved">Approved</span>
  )}

  {/* ✅ REJECTED */}
  {!doctor.isVerified && doctor.rejectionReason && (
    <button
      className="btn approve"
      onClick={() => handleApprove(doctor._id)}
    >
      Approve
    </button>
  )}

  {/* DELETE ALWAYS */}
  <button
    className="btn delete"
    onClick={() => handleDelete(doctor._id)}
  >
    Delete
  </button>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>

    {/* ✅ MODAL (PLACE HERE) */}
    {selectedDoctor && (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Doctor Details</h3>

          <p><strong>Qualification:</strong> {selectedDoctor.qualification}</p>
          <p><strong>Experience:</strong> {selectedDoctor.experience}</p>
          <p><strong>Bio:</strong> {selectedDoctor.bio}</p>
          <p><strong>Phone:</strong> {selectedDoctor.phone}</p>

          <p><strong>Profile Photo:</strong></p>

              {selectedDoctor.profilePhoto ? (
        selectedDoctor.profilePhoto.toLowerCase().endsWith(".pdf") ? (
          <a
            href={getFileUrl(selectedDoctor.profilePhoto)}
            target="_blank"
            rel="noreferrer"
          >
            View Document
          </a>
        ) : (
          <a
            href={getFileUrl(selectedDoctor.profilePhoto)}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={getFileUrl(selectedDoctor.profilePhoto)}
              alt="Profile"
              className="preview-img"
            />
          </a>
        )
      ) : (
        <span>Not uploaded</span>
      )}
        

      <p><strong>Medical License:</strong></p>

      {selectedDoctor.medicalLicense ? (
  selectedDoctor.medicalLicense.toLowerCase().endsWith(".pdf") ? (
    <a
      href={getFileUrl(selectedDoctor.medicalLicense)}
      target="_blank"
      rel="noreferrer"
    >
      View Document
    </a>
  ) : (
    <a
      href={getFileUrl(selectedDoctor.medicalLicense)}
      target="_blank"
      rel="noreferrer"
    >
      <img
        src={getFileUrl(selectedDoctor.medicalLicense)}
        alt="License"
        className="preview-img"
      />
    </a>
  )
) : (
  <span>Not uploaded</span>
)}
          <p><strong>Identity Proof:</strong></p>

        {selectedDoctor.identityProof ? (
  selectedDoctor.identityProof.toLowerCase().endsWith(".pdf") ? (
    <a
      href={getFileUrl(selectedDoctor.identityProof)}
      target="_blank"
      rel="noreferrer"
    >
      View Document
    </a>
  ) : (
    <a
      href={getFileUrl(selectedDoctor.identityProof)}
      target="_blank"
      rel="noreferrer"
    >
      <img
        src={getFileUrl(selectedDoctor.identityProof)}
        alt="ID Proof"
        className="preview-img"
      />
    </a>
  )
) : (
  <span>Not uploaded</span>
)}

          <button
            className="btn close"
            onClick={() => setSelectedDoctor(null)}
          >
            Close
          </button>
        </div>
      </div>
    )}

  </div>
);
}