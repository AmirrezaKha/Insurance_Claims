from fastapi import APIRouter, Query
from fastapi.responses import HTMLResponse, JSONResponse
from app.core.dbt_utils import run_dbt_command
from app.services.databricks_service import execute_sql

router = APIRouter(prefix="/dbt", tags=["DBT"])

@router.get("/execute", response_class=HTMLResponse)
def execute_dbt(
    command: str = Query("run", description="DBT command to execute (run, test, compile)"),
    sql: str = Query("SELECT * FROM workspace.insurance_claims.bronze_insurance_claims LIMIT 10", 
                     description="Optional SQL query to fetch after DBT run"),
    response_type: str = Query("html", description="Response type: html or json")
):
    """
    Execute a DBT command and optionally run a SQL query to fetch data.
    """
    # Run DBT command
    result = run_dbt_command(command)
    if result["returncode"] != 0:
        if response_type == "json":
            return JSONResponse(status_code=500, content={"error": result["stderr"]})
        return f"<h2>❌ DBT {command} Failed</h2><pre>{result['stderr']}</pre>"

    # Execute SQL query
    cols, rows = execute_sql(sql)

    if response_type == "json":
        return {"columns": cols, "rows": rows, "dbt_result": result}

    # Generate HTML table
    table_html = "".join(
        f"<tr>{''.join(f'<td>{r}</td>' for r in row)}</tr>" for row in rows
    )
    return f"""
        <h1>✅ DBT {command.capitalize()} Successful</h1>
        <table border="1">
            <tr>{''.join(f'<th>{c}</th>' for c in cols)}</tr>
            {table_html}
        </table>
        <pre>{result['stdout']}</pre>
    """
