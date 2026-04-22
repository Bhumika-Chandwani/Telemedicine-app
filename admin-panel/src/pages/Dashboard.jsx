import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    pendingApprovals: 0,
    specializationStats: [],
    registrationStats: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError("No token found. Please login again.");
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch stats");

      // ✅ SAFE SET (IMPORTANT FIX)
      setStats({
        totalPatients: data.totalPatients || 0,
        totalDoctors: data.totalDoctors || 0,
        pendingApprovals: data.pendingApprovals || 0,
        specializationStats: data.specializationStats || [],
        registrationStats: data.registrationStats || []
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const CustomTooltipPie = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = (stats.specializationStats || []).reduce(
        (sum, entry) => sum + entry.value,
        0
      );

      const percent = total
        ? ((payload[0].value / total) * 100).toFixed(1)
        : 0;

      return (
        <div className="custom-tooltip">
          <p>{`${percent}% of our doctors are ${payload[0].name}`}</p>
          <p>{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h2 className="page-title">Dashboard Overview</h2>

      {/* 🔹 SUMMARY CARDS */}
      <div className="summary-cards">
        <div className="summary-card stat-card-1">
          <div className="card-info">
            <h4>Total Patients</h4>
            <h2>{stats.totalPatients}</h2>
          </div>
          <div className="card-icon">👥</div>
        </div>

        <div className="summary-card stat-card-2">
          <div className="card-info">
            <h4>Total Doctors</h4>
            <h2>{stats.totalDoctors}</h2>
          </div>
          <div className="card-icon">🩺</div>
        </div>

        <div className="summary-card stat-card-3">
          <div className="card-info">
            <h4>Pending Approvals</h4>
            <h2>{stats.pendingApprovals}</h2>
          </div>
          <div className="card-icon">⏳</div>
        </div>
      </div>

      {/* 🔹 CHARTS */}
      <div className="charts-container">

        {/* PIE CHART */}
        <div className="chart-card pie-chart-card">
          <h3>Doctor Specializations</h3>

          {stats.specializationStats &&
          stats.specializationStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.specializationStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                >
                  {stats.specializationStats.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltipPie />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No specialization data</div>
          )}
        </div>

        {/* LINE CHART */}
        <div className="chart-card line-chart-card">
          <h3>Monthly Growth</h3>

          {stats.registrationStats &&
          stats.registrationStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.registrationStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="patients" stroke="#8884d8" strokeWidth={3} />
                <Line dataKey="doctors" stroke="#82ca9d" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No registration data</div>
          )}
        </div>

      </div>
    </div>
  );
}