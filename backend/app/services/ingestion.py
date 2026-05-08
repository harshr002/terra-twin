from datetime import datetime

# simple in-memory store (we'll replace with DB later)
DATA_STORE = []

def ingest_data(payload: dict):
    record = {
        "timestamp": datetime.utcnow().isoformat(),
        "data": payload
    }
    DATA_STORE.append(record)
    return record

def get_all_data():
    return DATA_STORE
