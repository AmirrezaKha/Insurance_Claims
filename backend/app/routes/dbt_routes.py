from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from app.core.dbt_utils import run_dbt_command
from app.services.databricks_service import execute_sql
from app.core.config import settings

router = APIRouter(prefix="/dbt", tags=["DBT"])

@router.get("/run", response_class=HTMLResponse)
def run_dbt():
    result = run_dbt_command()
    if result["returncode"] != 0:
        return f"<h2>❌ DBT Failed</h2><pre>{result['stderr']}</pre>"

    cols, rows = execute_sql("SELECT * FROM workspace.insurance_claims.bronze_insurance_claims LIMIT 10")
    table_html = "".join(
        f"<tr>{''.join(f'<td>{r}</td>' for r in row)}</tr>"
        for row in rows
    )
    return f"""
        <h1>✅ DBT Run Successful</h1>
        <table border="1">
            <tr>{''.join(f'<th>{c}</th>' for c in cols)}</tr>
            {table_html}
        </table>
    """
