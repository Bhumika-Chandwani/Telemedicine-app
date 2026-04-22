import React, { useEffect, useState } from "react";
import "./signup.css";


export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/all");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <h2 style={{textAlign:"center"}}>Loading...</h2>;

  return (
    <div className="container">
      <div className="card">
        <h2>All Users</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Files</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.verified ? "Yes" : "No"}</td>
                <td>
                  {u.patientPdf && <a href={`http://localhost:5000/${u.patientPdf}`} target="_blank" rel="noreferrer">Patient PDF</a>}
                  {u.qualificationPdf && <div><a href={`http://localhost:5000/${u.qualificationPdf}`} target="_blank" rel="noreferrer">Qualification</a></div>}
                  {u.clinicRegistrationPdf && <div><a href={`http://localhost:5000/${u.clinicRegistrationPdf}`} target="_blank" rel="noreferrer">Clinic</a></div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
