import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";
import { API_BASE_URL } from "../../config/config";

const COLORS = ["#2563eb", "#16a34a", "#ca8a04", "#dc2626", "#6b7280"];

function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/tickets/get-all`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ limit: 100 }),
        });

        const data = await response.json();
        setIssues(data.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  /* ================= DATA TRANSFORM ================= */

  const countByKey = (key) => {
    return Object.values(
      issues.reduce((acc, item) => {
        const value = item[key] || "Unknown";
        acc[value] = acc[value] || { name: value, value: 0 };
        acc[value].value += 1;
        return acc;
      }, {}),
    );
  };

  const statusData = countByKey("status");
  const categoryData = countByKey("category");

  if (loading) return <p style={{ padding: 20 }}>Loading Dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h2>Issue Monitoring Dashboard</h2>

      {/* ===== Summary Cards ===== */}
      <div className="stats-grid">
        <div className="stat-card">
          <h2>Total Issues</h2>
          <p>{issues.length}</p>
        </div>
        <div className="stat-card open">
          <h2>Open</h2>
          <p>{issues.filter((i) => i.status === "open").length}</p>
        </div>
        <div className="stat-card closed">
          <h2>Closed</h2>
          <p>{issues.filter((i) => i.status === "closed").length}</p>
        </div>
      </div>

      {/* ===== Charts ===== */}
      <div className="chart-grid">
        {/* Status Pie */}
        <div className="chart-card">
          <h3>Issues by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {statusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="chart-card">
          <h3>Issues by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="chart-card full">
          <h3>Category-wise Issue Count</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
