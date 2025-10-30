import requests
from fastapi import HTTPException
from app.core.config import settings

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
