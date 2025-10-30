# import os
# import requests
# from fastapi import HTTPException
# from app.core.config import settings

# # DATABRICKS_HOST = os.environ.get("DATABRICKS_HOST")
# # DATABRICKS_TOKEN = os.environ.get("DATABRICKS_TOKEN")
# # JOB_ID = os.environ.get("DATABRICKS_JOB_ID")

# HEADERS = {"Authorization": f"Bearer {settings.DATABRICKS_TOKEN}"}


# def run_claim_summary_job(policy_id: int) -> dict:
#     """
#     Trigger a Databricks Job with a given policy_id.
#     Returns the response from Databricks API (run_id, start_time, etc.)
#     """
#     url = f"{settings.DATABRICKS_HOST}/api/2.1/jobs/run-now"
#     payload = {
#         "job_id": settings.DATABRICKS_JOB_ID,
#         "notebook_params": {"police_id": str(policy_id)}
#     }

#     res = requests.post(url, json=payload, headers=HEADERS)
#     if res.status_code != 200:
#         raise HTTPException(status_code=res.status_code, detail=res.text)

#     return res.json()


# def get_run_status(run_id: str) -> dict:
#     """
#     Get the status of a Databricks job run
#     """
#     url = f"https://{settings.DATABRICKS_HOST}/api/2.1/jobs/runs/get?run_id={run_id}"
#     res = requests.get(url, headers=HEADERS)
#     if res.status_code != 200:
#         raise HTTPException(status_code=res.status_code, detail=res.text)
#     return res.json()


# def get_run_output(run_id: str) -> dict:
#     """
#     Get the notebook output of a completed Databricks job run
#     """
#     url = f"https://{settings.DATABRICKS_HOST}/api/2.1/jobs/runs/get-output?run_id={run_id}"
#     res = requests.get(url, headers=HEADERS)
#     if res.status_code != 200:
#         raise HTTPException(status_code=res.status_code, detail=res.text)
#     return res.json()
# app/api/databricks.py
import time
from fastapi import APIRouter, HTTPException
from app.core.databricks_client import run_claim_summary_job, get_run_status, get_run_output

router = APIRouter()

@router.post("/claim-summary/{policy_id}")
def run_claim_summary(policy_id: str):
    """
    Trigger Databricks job using a string policy_id like 'POL050456'
    """
    job_run = run_claim_summary_job(policy_id)
    run_id = job_run.get("run_id")
    if not run_id:
        raise HTTPException(status_code=500, detail="Failed to get run_id from Databricks response")

    while True:
        status = get_run_status(run_id)
        life_cycle_state = status["state"]["life_cycle_state"]
        result_state = status["state"]["result_state"]

        if life_cycle_state in ["TERMINATED", "SKIPPED", "INTERNAL_ERROR"]:
            break

        time.sleep(5)

    output = get_run_output(run_id)
    if "error" in output and output["error"]:
        raise HTTPException(status_code=500, detail=output["error"])

    return {
        "run_id": run_id,
        "output": output.get("notebook_output", {}).get("result")
    }
