# TerraTwin Frontend

React-based real-time dashboard for TerraTwin.

This frontend connects to the TerraTwin backend and visualizes:

- Live IoT sensor readings
- Temperature trends
- Humidity trends
- Machine learning anomaly alerts
- Real-time WebSocket event streams

---

# Tech Stack

- React
- Vite
- Axios
- Recharts
- WebSockets

---

# Features

## Live Metrics

Displays:

- Total records
- Average temperature
- Average humidity
- Total anomaly alerts

## Live Charts

Visualizes:

- Temperature trends
- Humidity trends

## Event Streaming

Receives real-time updates from backend using WebSockets.

---

# Local Setup

## Install dependencies

```bash
npm install
```

## Run frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Backend API

Connected to:

```text
https://terra-twin-production.up.railway.app
```

---

# Author

Harsh Roy