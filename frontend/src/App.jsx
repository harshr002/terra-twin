import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./App.css";

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [analytics, setAnalytics] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [events, setEvents] = useState([]);

  const fetchData = async () => {
    const analyticsRes = await axios.get(`${API_BASE}/analytics`);
    const alertsRes = await axios.get(`${API_BASE}/alerts`);
    setAnalytics(analyticsRes.data);
    setAlerts(alertsRes.data);
  };

  useEffect(() => {
    fetchData();

    const ws = new WebSocket("ws://127.0.0.1:8000/ws");

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      const point = {
        time: new Date().toLocaleTimeString(),
        temperature: payload.data.temperature,
        humidity: payload.data.humidity,
        device_id: payload.data.device_id,
        alert: payload.alert,
      };

      setEvents((prev) => [point, ...prev].slice(0, 20));
      fetchData();
    };

    return () => ws.close();
  }, []);

  const chartData = [...events].reverse();

  return (
    <div className="dashboard">
      <header className="hero">
        <div>
          <p className="eyebrow">TerraTwin Command Center</p>
          <h1>AI-Powered Digital Twin Monitoring</h1>
          <p className="subtitle">
            Live IoT ingestion, SQLite persistence, ML anomaly detection, and
            WebSocket streaming in one production-style system.
          </p>
        </div>
        <div className="live-pill">LIVE SYSTEM</div>
      </header>

      <section className="cards">
        <div className="card">
          <span>Total Records</span>
          <h2>{analytics?.total_records ?? 0}</h2>
        </div>

        <div className="card">
          <span>Avg Temperature</span>
          <h2>{analytics?.avg_temperature?.toFixed(2) ?? "0.00"}°C</h2>
        </div>

        <div className="card">
          <span>Avg Humidity</span>
          <h2>{analytics?.avg_humidity?.toFixed(2) ?? "0.00"}%</h2>
        </div>

        <div className="card danger">
          <span>ML Anomalies</span>
          <h2>{alerts?.anomalies_detected ?? 0}</h2>
        </div>
      </section>

      <section className="grid">
        <div className="panel large">
          <h3>Live Temperature Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel large">
          <h3>Live Humidity Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="humidity" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid">
        <div className="panel">
          <h3>Latest Reading</h3>
          {analytics?.latest ? (
            <div className="reading">
              <p><b>Device:</b> {analytics.latest.device_id}</p>
              <p><b>Temperature:</b> {analytics.latest.temperature}°C</p>
              <p><b>Humidity:</b> {analytics.latest.humidity}%</p>
              <p><b>Timestamp:</b> {analytics.latest.timestamp}</p>
            </div>
          ) : (
            <p>No readings yet.</p>
          )}
        </div>

        <div className="panel">
          <h3>Live Event Stream</h3>
          <div className="event-list">
            {events.length === 0 ? (
              <p>Waiting for WebSocket events...</p>
            ) : (
              events.slice(0, 8).map((event, index) => (
                <div key={index} className="event-item">
                  <span>{event.device_id}</span>
                  <span>{event.temperature}°C</span>
                  <span>{event.humidity}%</span>
                  {event.alert && <b>ALERT</b>}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="panel">
        <h3>ML Anomaly Alerts</h3>
        <div className="alert-list">
          {alerts?.alerts?.length ? (
            alerts.alerts.slice(0, 10).map((alert, index) => (
              <div key={index} className="alert-item">
                <b>{alert.device_id}</b>
                <span>{alert.temperature}°C</span>
                <span>{alert.humidity}%</span>
                <small>{alert.timestamp}</small>
              </div>
            ))
          ) : (
            <p>No anomalies detected yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;