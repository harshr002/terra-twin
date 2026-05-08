import requests
import time
import random

URL = "http://127.0.0.1:8000/ingest"

devices = ["sensor_1", "sensor_2", "sensor_3"]

print("Starting IoT stream...")

while True:
    payload = {
        "device_id": random.choice(devices),
        "temperature": round(random.uniform(20, 40), 2),
        "humidity": round(random.uniform(30, 80), 2)
    }

    try:
        res = requests.post(URL, json=payload)
        print("Sent:", payload, "Status:", res.status_code)

    except Exception as e:
        print("Error:", e)

    time.sleep(2)
