import requests
import databricks.sql
from app.core.config import settings

def list_jobs():
    headers = {"Authorization": f"Bearer {settings.DATABRICKS_TOKEN}"}
    r = requests.get(f"{settings.DATABRICKS_HOST}/api/2.1/jobs/list", headers=headers)
    r.raise_for_status()
    return r.json().get("jobs", [])

def execute_sql(query: str):
    with databricks.sql.connect(
        server_hostname=settings.DATABRICKS_HOST.replace("https://", ""),
        http_path="/sql/1.0/warehouses/2a160fe88bd1510d",
        access_token=settings.DATABRICKS_TOKEN
    ) as conn:
        with conn.cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()
            cols = [desc[0] for desc in cursor.description]
            return cols, rows
