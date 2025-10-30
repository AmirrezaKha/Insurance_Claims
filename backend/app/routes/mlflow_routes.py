from fastapi import APIRouter
import mlflow

router = APIRouter(prefix="/mlflow", tags=["MLflow"])

@router.get("/experiments")
def list_experiments():
    experiments = mlflow.search_experiments()
    return [{"name": e.name, "experiment_id": e.experiment_id} for e in experiments]

@router.get("/runs/{experiment_id}")
def list_runs(experiment_id: str):
    runs = mlflow.search_runs(experiment_ids=[experiment_id])
    return runs.to_dict(orient="records")
