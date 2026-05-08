from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List

from backend.app.db.database import SessionLocal, engine, Base
from backend.app.db.models import SensorData
from backend.app.analytics.anomaly import detect_anomalies

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TerraTwin API", version="2.0")


# -------------------------
# Input Schema
# -------------------------
class SensorInput(BaseModel):
    device_id: str
    temperature: float
    humidity: float


# -------------------------
# WebSocket Manager
# -------------------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)


manager = ConnectionManager()


# -------------------------
# Health Check
# -------------------------
@app.get("/")
def root():
    return {"status": "TerraTwin backend running"}


# -------------------------
# Ingest Endpoint
# -------------------------
@app.post("/ingest")
async def ingest(data: SensorInput):
    db = SessionLocal()

    record = SensorData(
        device_id=data.device_id,
        temperature=data.temperature,
        humidity=data.humidity
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    response_data = {
        "id": record.id,
        "device_id": record.device_id,
        "temperature": record.temperature,
        "humidity": record.humidity,
        "timestamp": str(record.timestamp),
    }

    # ML anomaly detection
    records = db.query(SensorData).order_by(
        SensorData.timestamp.desc()
    ).limit(100).all()

    anomalies = detect_anomalies(records)

    latest_alert = None
    for alert in anomalies:
        if alert["timestamp"] == response_data["timestamp"]:
            latest_alert = alert
            break

    db.close()

    # Live streaming
    await manager.broadcast({
        "type": "sensor_update",
        "data": response_data,
        "alert": latest_alert
    })

    return {
        "message": "stored in sqlite",
        "data": response_data,
        "alert": latest_alert
    }


# -------------------------
# Analytics
# -------------------------
@app.get("/analytics")
def analytics():
    db = SessionLocal()
    records = db.query(SensorData).all()
    db.close()

    if not records:
        return {"message": "no data"}

    temperatures = [r.temperature for r in records]
    humidities = [r.humidity for r in records]

    latest = records[-1]

    return {
        "total_records": len(records),
        "avg_temperature": sum(temperatures) / len(temperatures),
        "avg_humidity": sum(humidities) / len(humidities),
        "latest": {
            "device_id": latest.device_id,
            "temperature": latest.temperature,
            "humidity": latest.humidity,
            "timestamp": str(latest.timestamp)
        }
    }


# -------------------------
# Alerts API
# -------------------------
@app.get("/alerts")
def get_alerts():
    db = SessionLocal()

    records = db.query(SensorData).order_by(
        SensorData.timestamp.desc()
    ).limit(100).all()

    db.close()

    anomalies = detect_anomalies(records)

    return {
        "total_records_checked": len(records),
        "anomalies_detected": len(anomalies),
        "alerts": anomalies
    }


# -------------------------
# WebSocket Endpoint
# -------------------------
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)