# from fastapi import APIRouter, Query
# from app.services.databricks_jobs_policyid_service import run_claim_summary_job, get_run_status, get_run_output

# router = APIRouter(prefix="/jobs", tags=["Databricks Jobs"])

# from pydantic import BaseModel

# class PolicyRequest(BaseModel):
#     policy_id: str

# @router.post("/run_claim_summary")
# def run_claim_summary(req: PolicyRequest):
#     return run_claim_summary_job(req.policy_id)
# # def run_claim_summary(policy_id: int = Query(..., description="Policy ID to process")):
# #     return run_claim_summary_job(policy_id)

# @router.get("/run_status")
# def run_status(run_id: str = Query(..., description="Databricks run_id")):
#     return get_run_status(run_id)

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from app.services.databricks_jobs_policyid_service import (
    run_claim_summary_job,
    get_run_status,
    get_run_output,
)

router = APIRouter(prefix="/jobs", tags=["Databricks Jobs"])


# ✅ Request model for POST body
class PolicyRequest(BaseModel):
    policy_id: str


# ✅ Trigger a Databricks job
@router.post("/run_claim_summary")
def run_claim_summary(req: PolicyRequest):
    """
    Trigger a Databricks job using the provided policy_id (e.g., 'POL050456').
    """
    try:
        return run_claim_summary_job(req.policy_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Check job run status
@router.get("/run_status")
def run_status(run_id: str = Query(..., description="Databricks run_id")):
    """
    Get the current status of a Databricks job run by run_id.
    """
    try:
        return get_run_status(run_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Optionally: get job output by run_id
@router.get("/run_output")
def run_output(run_id: str = Query(..., description="Databricks run_id")):
    """
    Get the output of a completed Databricks job run.
    """
    try:
        return get_run_output(run_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
