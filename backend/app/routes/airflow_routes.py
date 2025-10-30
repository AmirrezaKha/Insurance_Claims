from fastapi import APIRouter
from app.services.airflow_service import list_dags, trigger_dag

router = APIRouter(prefix="/airflow", tags=["Airflow"])

@router.get("/dags")
def get_dags():
    """List all DAGs."""
    return list_dags()

@router.post("/dags/{dag_id}/trigger")
def run_dag(dag_id: str):
    """Trigger a DAG manually."""
    return trigger_dag(dag_id)
