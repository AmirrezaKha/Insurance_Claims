from fastapi import FastAPI, Response
from prometheus_client import Gauge, generate_latest, CONTENT_TYPE_LATEST
import os, requests

app = FastAPI()

DATABRICKS_HOST = os.getenv("DATABRICKS_HOST")
DATABRICKS_TOKEN = os.getenv("DATABRICKS_TOKEN")
headers = {"Authorization": f"Bearer {DATABRICKS_TOKEN}"}

jobs_gauge = Gauge("databricks_jobs_count", "Number of jobs in Databricks")

@app.get("/metrics")
def metrics():
    resp = requests.get(f"{DATABRICKS_HOST}/api/2.1/jobs/list", headers=headers)
    jobs = resp.json().get("jobs", [])
    jobs_gauge.set(len(jobs))
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
