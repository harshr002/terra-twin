# TerraTwin – System Architecture

## Overview
TerraTwin is a modular, cloud-agnostic digital twin platform that connects real-world data (sensors, spatial data, imagery) with AI-driven intelligence.

## Layers

### 1. Data Ingestion Layer
- Kafka for streaming
- Python-based data simulators
- Image/video ingestion via OpenCV

### 2. Processing Layer
- Apache Flink for real-time processing
- Spark for batch analytics
- Python for transformations

### 3. Storage Layer
- PostgreSQL + PostGIS (spatial data)
- Delta Lake (structured data)
- FAISS / ChromaDB (vector storage)

### 4. ML & AI Layer
- YOLO for vision detection
- PyTorch for training
- RAG-based LLM system for reasoning

### 5. API Layer
- FastAPI backend
- REST APIs for all services
- Authentication-ready structure

### 6. Visualization Layer
- Dashboards (Superset / custom UI)
- Real-time monitoring views
- AI agent interface

## Design Principle
Everything is modular and can scale from local machine to cloud without architecture changes.

