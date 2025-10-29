from fastapi import FastAPI
from fastapi.responses import HTMLResponse
import requests
import os
import subprocess
from prometheus_fastapi_instrumentator import Instrumentator
import sqlite3
# import pyodbc  # for Databricks connection
import html
import traceback
import databricks.sql

app = FastAPI()

DBT_PROJECT_DIR = "/usr/app/dbt"
DATABRICKS_HOST = os.getenv("DATABRICKS_HOST", "")
DATABRICKS_TOKEN = os.getenv("DATABRICKS_TOKEN", "")
DBT_LOG_FILE = os.path.join(DBT_PROJECT_DIR, "logs/dbt.log")

Instrumentator().instrument(app).expose(app)

# Helper function to wrap HTML content with a consistent style
def render_page(title: str, body_content: str) -> HTMLResponse:
    html = f"""
    <html>
    <head>
        <title>{title}</title>
        <style>
            body {{
                font-family: Arial;
                background-color: #10172a;
                color: #eee;
                text-align: center;
                padding: 20px;
            }}
            nav {{
                background-color: #0f172a;
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 25px;
            }}
            nav a {{
                color: #38bdf8;
                margin: 0 15px;
                text-decoration: none;
                font-weight: bold;
            }}
            nav a:hover {{
                text-decoration: underline;
                color: #0ea5e9;
            }}
            table {{
                margin: auto;
                border-collapse: collapse;
                width: 80%;
                background-color: #1e293b;
                border-radius: 12px;
                overflow: hidden;
            }}
            th, td {{
                border: 1px solid #334155;
                padding: 12px;
            }}
            th {{
                background-color: #0ea5e9;
                color: #fff;
            }}
            tr:nth-child(even) {{
                background-color: #273549;
            }}
            h1 {{
                color: #38bdf8;
                margin-bottom: 20px;
            }}
            h2 {{ color: #2c3e50; }}
            .footer {{
                margin-top: 20px;
                color: #aaa;
                font-size: 14px;
            }}
            a {{
                color: #38bdf8;
                text-decoration: none;
            }}
            a:hover {{
                text-decoration: underline;
            }}
            pre {{
                background-color: #1e293b;
                padding: 10px;
                border-radius: 5px;
                text-align: left;
                overflow-x: auto;
            }}
        </style>
    </head>
    <body>
        <nav>
            <a href="/run_dbt">🚀 Run DBT</a>
            <a href="/tables">📊 Tables</a>
            <a href="/mlflow">🧠 MLflow</a>
            <a href="/jobs">⚙️ Jobs</a>
        </nav>
        {body_content}
        <div class="footer">💡 Databricks + Airflow + dbt + FastAPI</div>
    </body>
    </html>
    """
    return HTMLResponse(content=html)


@app.get("/", response_class=HTMLResponse)
def root():
    body = """
        <h1>🚀 Databricks + Airflow + dbt + FastAPI Stack</h1>
        <p>All services are up and running inside Docker Compose.</p>
        <p><a href="/databricks/jobs">View Databricks Jobs</a></p>
        <p><a href="/run_dbt">Run dbt Models</a></p>
        <p><a href="/dbt/logs">View DBT Logs</a></p>
    """
    return render_page("Databricks Data Pipeline", body)


@app.get("/databricks/jobs/json")
def get_jobs_json():
    headers = {"Authorization": f"Bearer {DATABRICKS_TOKEN}"}
    r = requests.get(f"{DATABRICKS_HOST}/api/2.1/jobs/list", headers=headers)
    return r.json()


@app.get("/databricks/jobs", response_class=HTMLResponse)
def get_databricks_jobs():
    headers = {"Authorization": f"Bearer {DATABRICKS_TOKEN}"}
    url = f"{DATABRICKS_HOST}/api/2.1/jobs/list"
    try:
        r = requests.get(url, headers=headers)
        r.raise_for_status()
        jobs = r.json().get("jobs", [])

        table_rows = ""
        for job in jobs:
            job_id = job.get("job_id", "N/A")
            name = job.get("settings", {}).get("name", "N/A")
            creator = job.get("creator_user_name", "N/A")
            last_state = job.get("state", {}).get("life_cycle_state", "Unknown")
            table_rows += f"<tr><td>{job_id}</td><td>{name}</td><td>{creator}</td><td>{last_state}</td></tr>"

        body = f"""
            <h1>🚀 Databricks Jobs</h1>
            <table>
                <tr><th>Job ID</th><th>Name</th><th>Creator</th><th>Last Run State</th></tr>
                {table_rows}
            </table>
        """
        return render_page("Databricks Jobs", body)

    except Exception as e:
        return render_page("Databricks Jobs", f"<h3 style='color:red;'>Error fetching jobs: {str(e)}</h3>")

@app.get("/run_dbt", response_class=HTMLResponse)
def run_dbt_and_fetch_results():
    # Step 1: Run dbt
    try:
        result = subprocess.run(
            ["dbt", "run", "--profiles-dir", "/root/.dbt", "--project-dir", DBT_PROJECT_DIR],
            capture_output=True,
            text=True
        )

        dbt_stdout = html.escape(result.stdout)
        dbt_stderr = html.escape(result.stderr)

        if result.returncode != 0:
            body = f"""
                <h1>🚨 DBT Run Failed</h1>
                <h2>STDOUT:</h2><pre>{dbt_stdout}</pre>
                <h2>STDERR:</h2><pre>{dbt_stderr}</pre>
            """
            return render_page("DBT Run Error", body)

    except Exception as e:
        return render_page("DBT Run Error", f"<h3 style='color:red;'>Error running dbt: {html.escape(str(e))}</h3>")

    # Step 2: Fetch results using Databricks SQL Connector
    try:
        with databricks.sql.connect(
            server_hostname=DATABRICKS_HOST.replace("https://", ""),
            http_path="/sql/1.0/warehouses/2a160fe88bd1510d",
            access_token=DATABRICKS_TOKEN
        ) as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM workspace.insurance_claims.bronze_insurance_claims LIMIT 10")
                rows = cursor.fetchall()

                # Build HTML table
                table_rows = ""
                for row in rows:
                    table_rows += "<tr>" + "".join(f"<td>{html.escape(str(col))}</td>" for col in row) + "</tr>"

                body = f"""
                    <h1>✅ DBT Run Succeeded</h1>
                    <h2>Last 10 rows from bronze_insurance_claims:</h2>
                    <table border="1" cellpadding="5">
                        <tr>{"".join(f"<th>{html.escape(desc[0])}</th>" for desc in cursor.description)}</tr>
                        {table_rows}
                    </table>
                """
                return render_page("DBT Run & Results", body)

    except Exception as e:
        return render_page("DBT Fetch Error", f"<h3 style='color:red;'>Error fetching data: {html.escape(str(e))}</h3>")


@app.get("/dbt/logs", response_class=HTMLResponse)
def dbt_logs():
    if os.path.exists(DBT_LOG_FILE):
        with open(DBT_LOG_FILE, "r") as f:
            content = f.read()
        body = f"<h1>DBT Logs</h1><pre>{content}</pre>"
    else:
        body = "<p>No logs found</p>"
    return render_page("DBT Logs", body)

@app.get("/tables", response_class=HTMLResponse)
def list_tables():
    try:
        with databricks.sql.connect(
            server_hostname=DATABRICKS_HOST.replace("https://", ""),
            http_path="/sql/1.0/warehouses/2a160fe88bd1510d",
            access_token=DATABRICKS_TOKEN
        ) as conn:
            with conn.cursor() as cursor:
                cursor.execute("SHOW TABLES IN workspace.insurance_claims")
                rows = cursor.fetchall()

                table_html = "".join(
                    f"<tr><td>{html.escape(row[0])}</td><td>{html.escape(row[1])}</td></tr>"
                    for row in rows
                )

                return render_page("Tables", f"""
                    <h1>📊 Databricks Tables</h1>
                    <table border='1' cellpadding='5'>
                        <tr><th>Database</th><th>Table Name</th></tr>
                        {table_html}
                    </table>
                """)
    except Exception as e:
        return render_page("Error", f"<pre>{html.escape(str(e))}</pre>")


@app.get("/mlflow", response_class=HTMLResponse)
def list_mlflow_runs():
    try:
        headers = {"Authorization": f"Bearer {DATABRICKS_TOKEN}"}
        url = f"{DATABRICKS_HOST}/api/2.0/mlflow/runs/search"
        payload = {"max_results": 10}

        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()

        runs_html = ""
        for run in data.get("runs", []):
            run_info = run["info"]
            metrics = run.get("data", {}).get("metrics", {})
            runs_html += f"""
                <tr>
                    <td>{html.escape(run_info['run_id'])}</td>
                    <td>{html.escape(run_info['experiment_id'])}</td>
                    <td>{html.escape(str(metrics))}</td>
                </tr>
            """

        return render_page("MLflow Runs", f"""
            <h1>🏃‍♂️ MLflow Recent Runs</h1>
            <table border="1" cellpadding="5">
                <tr><th>Run ID</th><th>Experiment ID</th><th>Metrics</th></tr>
                {runs_html}
            </table>
        """)
    except Exception as e:
        return render_page("Error", f"<pre>{html.escape(str(e))}</pre>")

@app.get("/jobs", response_class=HTMLResponse)
def list_job_runs():
    try:
        headers = {"Authorization": f"Bearer {DATABRICKS_TOKEN}"}
        url = f"{DATABRICKS_HOST}/api/2.1/jobs/runs/list?limit=5"

        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()

        jobs_html = ""
        for run in data.get("runs", []):
            jobs_html += f"""
                <tr>
                    <td>{html.escape(run['run_name'])}</td>
                    <td>{html.escape(run['state']['life_cycle_state'])}</td>
                    <td>{html.escape(run['state'].get('result_state', 'N/A'))}</td>
                    <td>{html.escape(str(run['start_time']))}</td>
                </tr>
            """

        return render_page("Databricks Jobs", f"""
            <h1>🧱 Recent Databricks Job Runs</h1>
            <table border="1" cellpadding="5">
                <tr><th>Job Name</th><th>Status</th><th>Result</th><th>Start Time</th></tr>
                {jobs_html}
            </table>
        """)
    except Exception as e:
        return render_page("Error", f"<pre>{html.escape(str(e))}</pre>")

from prometheus_client import Gauge, generate_latest

dbt_run_duration = Gauge("dbt_run_duration_seconds", "Duration of last dbt run")
dbt_run_success = Gauge("dbt_run_success", "1 if last dbt run succeeded else 0")

@app.get("/dbt_metrics")
def dbt_metrics():
    return Response(generate_latest(), media_type="text/plain")