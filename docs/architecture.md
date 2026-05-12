# TerraTwin Architecture

## Overview

TerraTwin is built as a real-time AI-powered digital twin system that simulates IoT data, ingests it through a backend API, stores it persistently, performs ML-based anomaly detection, and streams live updates to a dashboard.

## System Flow

```text
IoT Simulator
   ↓
FastAPI /ingest
   ↓
SQLite Database
   ↓
Analytics + ML Anomaly Detection
   ↓
WebSocket Live Stream
   ↓
React Dashboard