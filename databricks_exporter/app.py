from flask import Flask, Response
import requests
import os

app = Flask(__name__)

DATABRICKS_TOKEN = os.getenv("DATABRICKS_TOKEN")
DATABRICKS_HOST = os.getenv("DATABRICKS_HOST")

@app.route("/metrics")
def metrics():
    headers = {"Authorization": f"Bearer {DATABRICKS_TOKEN}"}
    try:
        r = requests.get(f"{DATABRICKS_HOST}/api/2.1/jobs/list", headers=headers)
        jobs = r.json().get("jobs", [])
        job_count = len(jobs)
        metric = f"databricks_jobs_total {job_count}\n"
        return Response(metric, mimetype="text/plain")
    except Exception as e:
        return Response(f"# Error fetching Databricks metrics: {str(e)}\n", mimetype="text/plain")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
