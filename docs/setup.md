# TerraTwin Setup Guide

## Project Overview

TerraTwin is an AI-powered digital twin platform that simulates IoT devices, ingests real-time sensor data, stores it persistently, performs machine learning-based anomaly detection, and streams live updates to a React dashboard.

---

# 1. Clone Repository

```bash
git clone <your-github-repo-url>
cd terra-twin
```

---

# 2. Backend Setup (FastAPI)

Create virtual environment:

```bash
python3 -m venv venv
```

Activate environment:

### Mac/Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start backend:

```bash
python -m uvicorn backend.app.main:app --reload
```

Backend Swagger UI:

```text
http://127.0.0.1:8000/docs
```

---

# 3. Frontend Setup (React + Vite)

Go to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# 4. IoT Simulator

Open another terminal:

```bash
cd ~/terra-twin
source venv/bin/activate
python backend/app/simulators/iot_stream.py
```

This starts simulated sensor devices sending live temperature and humidity data.

---

# 5. Docker Setup

Build Docker image:

```bash
docker build -t terratwin-backend .
```

Run container:

```bash
docker run -p 8000:8000 terratwin-backend
```

---

# 6. APIs

## Ingest Sensor Data

```text
POST /ingest
```

## Analytics

```text
GET /analytics
```

## ML Alerts

```text
GET /alerts
```

## WebSocket Stream

```text
ws://127.0.0.1:8000/ws
```

---

# 7. Live Deployment

## Backend (Railway)

https://terra-twin-production.up.railway.app/docs

---

# Tech Stack

- FastAPI
- Python
- SQLAlchemy
- SQLite
- Scikit-learn
- IsolationForest
- WebSockets
- React
- Vite
- Recharts
- Docker
- Railway

---

# Author

Harsh Roy