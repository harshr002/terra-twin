import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [analytics, setAnalytics] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [liveEvents, setLiveEvents] = useState([]);

  const fetchData = async () => {
    try {
      const analyticsRes = await axios.get(`${API_BASE}/analytics`);
      const alertsRes = await axios.get(`${API_BASE}/alerts`);
      setAnalytics(analyticsRes.data);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error("API fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchData();

    const ws = new WebSocket("ws://127.0.0.1:8000/ws");

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      setLiveEvents((prev) => [payload, ...prev].slice(0, 8));
      fetchData();
    };

    return () => ws.close();
  }, []);

  return (
    <div className="dashboard">
      <header>
        <div>
          <p className="eyebrow">TerraTwin</p>
          <h1>Autonomous Digital Twin Dashboard</h1>
          <p className="subtitle">
            Real-time IoT ingestion, analytics, anomaly detection, and live streaming.
          </p>
        </div>
        <span className="status">LIVE</span>
      </header>

      <section className="cards">
        <div className="card">
          <p>Total Records</p>
          <h2>{analytics?.total_records ?? 0}</h2>
        </div>

        <div className="card">
          <p>Average Temperature</p>
          <h2>
            {analytics?.avg_temperature
              ? analytics.avg_temperature.toFixed(2)
              : "0.00"}{" "}
            °C
          </h2>
        </div>

        <div className="card">
          <p>Average Humidity</p>
          <h2>
            {analytics?.avg_humidity
              ? analytics.avg_humidity.toFixed(2)
              : "0.00"}{" "}
            %
          </h2>
        </div>

        <div className="card alert-card">
          <p>ML Alerts</p>
          <h2>{alerts?.anomalies_detected ?? 0}</h2>
        </div>
      </section>

      <section className="grid">
        <div className="panel">
          <h3>Latest Sensor Reading</h3>
          {analytics?.latest ? (
            <div className="reading">
              <p><strong>Device:</strong> {analytics.latest.device_id}</p>
              <p><strong>Temperature:</strong> {analytics.latest.temperature} °C</p>
              <p><strong>Humidity:</strong> {analytics.latest.humidity} %</p>
              <p><strong>Timestamp:</strong> {analytics.latest.timestamp}</p>
            </div>
          ) : (
            <p>No readings yet.</p>
          )}
        </div>

        <div className="panel">
          <h3>Live WebSocket Stream</h3>
          <div className="stream">
            {liveEvents.length === 0 ? (
              <p>Waiting for live sensor events...</p>
            ) : (
              liveEvents.map((event, index) => (
                <div key={index} className="stream-item">
                  <span>{event.data?.device_id}</span>
                  <span>{event.data?.temperature} °C</span>
                  <span>{event.data?.humidity} %</span>
                  {event.alert && <b>ALERT</b>}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="panel">
        <h3>Detected Anomalies</h3>
        <div className="alerts">
          {alerts?.alerts?.length ? (
            alerts.alerts.slice(0, 8).map((alert, index) => (
              <div key={index} className="alert-item">
                <strong>{alert.device_id}</strong>
                <span>{alert.temperature} °C</span>
                <span>{alert.humidity} %</span>
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