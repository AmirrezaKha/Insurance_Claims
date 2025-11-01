import requests
from fastapi import HTTPException
from app.core.config import settings
from databricks import sql  # make sure 'databricks-sql-connector' is installed
import os

HEADERS = {"Authorization": f"Bearer {settings.DATABRICKS_TOKEN}"}

def run_claim_summary_job(policy_id: int) -> dict:
    url = f"{settings.DATABRICKS_HOST}/api/2.1/jobs/run-now"

    payload = {
    "job_id": settings.DATABRICKS_JOB_ID,
    "notebook_params": {"policy_id": policy_id}
    }
    res = requests.post(url, json=payload, headers=HEADERS)
    if res.status_code != 200:
        raise HTTPException(status_code=res.status_code, detail=res.text)
    return res.json()


def get_run_status(run_id: str) -> dict:
    url = f"{settings.DATABRICKS_HOST}/api/2.1/jobs/runs/get?run_id={run_id}"
    res = requests.get(url, headers=HEADERS)
    if res.status_code != 200:
        raise HTTPException(status_code=res.status_code, detail=res.text)
    return res.json()


def get_run_output(run_id: str) -> dict:
    url = f"{settings.DATABRICKS_HOST}/api/2.1/jobs/runs/get-output?run_id={run_id}"
    res = requests.get(url, headers=HEADERS)
    if res.status_code != 200:
        raise HTTPException(status_code=res.status_code, detail=res.text)
    return res.json()


def execute_sql(query: str):
    """
    Execute a SQL query on Databricks and return columns and rows.
    """
    # Get connection parameters from environment variables
    server_hostname = settings.DATABRICKS_HOST
    http_path = settings.DATABRICKS_HTTP_PATH
    access_token = settings.DATABRICKS_TOKEN

    if not all([server_hostname, http_path, access_token]):
        raise ValueError("Databricks connection parameters are not set in environment variables.")

    with sql.connect(
        server_hostname=server_hostname,
        http_path=http_path,
        access_token=access_token
    ) as connection:
        with connection.cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()
            cols = [col[0] for col in cursor.description]
            return cols, rows