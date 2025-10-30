from fastapi import APIRouter, Query
from app.services.databricks_service import execute_sql, list_jobs

router = APIRouter(prefix="/databricks", tags=["Databricks"])

@router.get("/jobs")
def get_jobs():
    jobs = list_jobs()
    return {"jobs": jobs}

@router.get("/query")
def run_query(sql: str = Query(..., description="SQL query to execute")):
    cols, rows = execute_sql(sql)
    return {
        "columns": cols,
        "rows": rows
    }
