import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./Monitor.css";

function Monitor() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/v1/tickets/dashboard",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log("✅ Dashboard data:", data);
        setDashboard(data);
        setError("");
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      setError(err.message);
      setDashboard(null);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Define bar colors based on status
  const getBarColor = (status) => {
    switch (status) {
      case "closed":
        return "#007bff"; // blue
      case "open":
        return "#28a745"; // green
      case "rejected":
        return "#dc3545"; // red
      case "forwarded":
        return "#ffc107"; // yellow
      default:
        return "#8884d8"; // default
    }
  };

  // Define card colors
  const cardColors = {
    totalTickets: "#6c757d", // gray
    openTickets: "#28a745", // green
    forwardedTickets: "#ffc107", // yellow
    closedTickets: "#007bff", // blue
    rejectedTickets: "#dc3545", // red
  };

  return (
    <div className="monitor-container">
      <h2>Dashboard Monitor</h2>

      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      {dashboard ? (
        <>
          {/* Summary Cards */}
          <h2 className="status">Ticket Status</h2>
          <div className="summary-cards">
            {[
              {
                title: "Total Tickets",
                value: dashboard.data.summary.totalTickets,
                color: cardColors.totalTickets,
              },
              {
                title: "Open Tickets",
                value: dashboard.data.summary.openTickets,
                color: cardColors.openTickets,
              },
              {
                title: "Forwarded Tickets",
                value: dashboard.data.summary.forwardedTickets,
                color: cardColors.forwardedTickets,
              },
              {
                title: "Closed Tickets",
                value: dashboard.data.summary.closedTickets,
                color: cardColors.closedTickets,
              },
              {
                title: "Rejected Tickets",
                value: dashboard.data.summary.rejectedTickets,
                color: cardColors.rejectedTickets,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="card"
                style={{ backgroundColor: item.color }}
              >
                <div className="bg">
                  <h3>{item.title}</h3>
                  <p>{item.value}</p>
                </div>
                <div
                  className="blob"
                  style={{ backgroundColor: item.color }}
                ></div>
              </div>
            ))}
          </div>

          {/* Bar Chart for Status Breakdown */}
          <h2 className="status">Status Breakdown</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={dashboard.data.statusBreakdown}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count">
                  {dashboard.data.statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry._id)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p>Loading dashboard...</p>
      )}
    </div>
  );
}

export default Monitor;
