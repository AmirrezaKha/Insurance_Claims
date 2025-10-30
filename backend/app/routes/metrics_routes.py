from fastapi import APIRouter, Response
from prometheus_client import Gauge, generate_latest

router = APIRouter(tags=["Metrics"])

dbt_run_duration = Gauge("dbt_run_duration_seconds", "Duration of last dbt run")
dbt_run_success = Gauge("dbt_run_success", "1 if last dbt run succeeded else 0")

@router.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type="text/plain")
