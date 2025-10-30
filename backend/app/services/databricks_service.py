import requests
import databricks.sql
from app.core.config import settings

def list_jobs():
    
    headers = {"Authorization": f"Bearer {settings.DATABRICKS_TOKEN}"}
    url = f"{settings.DATABRICKS_HOST}/api/2.1/jobs/list"
    r = requests.get(url, headers=headers)
    r.raise_for_status()
    jobs = r.json().get("jobs", [])

    jobs_info = []
    for job in jobs:
        info = {
            "job_id": job.get("job_id"),
            "name": job.get("settings", {}).get("name"),
            "creator_user_name": job.get("creator_user_name"),
            "schedule": job.get("settings", {}).get("schedule", {}).get("quartz_cron_expression"),
            "max_concurrent_runs": job.get("settings", {}).get("max_concurrent_runs"),
            "state": job.get("settings", {}).get("state")
        }
        jobs_info.append(info)

    return jobs_info

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
