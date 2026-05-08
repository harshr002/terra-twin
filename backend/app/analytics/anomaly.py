import numpy as np
from sklearn.ensemble import IsolationForest


def detect_anomalies(records):
    if len(records) < 10:
        return []

    X = np.array([
        [r.temperature, r.humidity]
        for r in records
    ])

    model = IsolationForest(
        n_estimators=100,
        contamination=0.1,
        random_state=42
    )

    predictions = model.fit_predict(X)

    anomalies = []

    for record, pred in zip(records, predictions):
        if pred == -1:
            anomalies.append({
                "device_id": record.device_id,
                "temperature": record.temperature,
                "humidity": record.humidity,
                "timestamp": str(record.timestamp)
            })

    return anomalies