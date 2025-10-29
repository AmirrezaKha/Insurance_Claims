from fastapi import FastAPI
import requests
import os
import subprocess

app = FastAPI()

DATABRICKS_HOST = os.getenv("DATABRICKS_HOST")
DATABRICKS_TOKEN = os.getenv("DATABRICKS_TOKEN")

@app.get("/")
def root():
    return {"message": "FastAPI + Databricks + Airflow + dbt stack running"}

@app.get("/databricks/jobs")
def get_databricks_jobs():
    headers = {"Authorization": f"Bearer {DATABRICKS_TOKEN}"}
    r = requests.get(f"{DATABRICKS_HOST}/api/2.1/jobs/list", headers=headers)
    return r.json()

@app.get("/run_dbt")
def run_dbt():
    result = subprocess.run(
        ["docker", "exec", "dbt", "dbt", "run", "--profiles-dir", "/usr/app/dbt"],
        capture_output=True
    )
    return {"stdout": result.stdout.decode(), "stderr": result.stderr.decode()}
