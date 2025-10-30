import requests
import os

AIRFLOW_URL = os.environ.get("AIRFLOW_URL", "http://localhost:8080")
AIRFLOW_USER = os.environ.get("AIRFLOW_USER", "airflow")
AIRFLOW_PASSWORD = os.environ.get("AIRFLOW_PASSWORD", "airflow")

def list_dags():
    url = f"{AIRFLOW_URL}/api/v1/dags"
    response = requests.get(url, auth=(AIRFLOW_USER, AIRFLOW_PASSWORD))
    response.raise_for_status()
    return response.json()["dags"]

def trigger_dag(dag_id: str, conf: dict = {}):
    url = f"{AIRFLOW_URL}/api/v1/dags/{dag_id}/dagRuns"
    response = requests.post(url, auth=(AIRFLOW_USER, AIRFLOW_PASSWORD), json={"conf": conf})
    response.raise_for_status()
    return response.json()
