# TerraTwin

AI-powered digital twin platform for real-time IoT monitoring, anomaly detection, and live infrastructure intelligence.

## Live Demo

- Backend API: https://terra-twin-production.up.railway.app/docs
- Dashboard: Coming soon

## What It Does

TerraTwin simulates IoT sensor streams, ingests live data through FastAPI, stores readings in SQLite, detects anomalies using machine learning, and streams live updates to a React dashboard using WebSockets.

## Tech Stack

- FastAPI
- SQLite + SQLAlchemy
- IsolationForest ML anomaly detection
- WebSockets
- React + Vite
- Recharts
- Docker
- Railway

## Architecture

IoT Simulator → FastAPI Backend → SQLite Database → ML Anomaly Detection → WebSocket Stream → React Dashboard

## Core Features

- Real-time IoT data ingestion
- Persistent sensor data storage
- Live analytics API
- ML-based anomaly detection
- Real-time WebSocket updates
- React dashboard with live charts
- Dockerized backend
- Railway deployment

## Author

Harsh Roy