import subprocess
import html
from app.core.config import settings

def run_dbt_command(command: str = "run"):
    result = subprocess.run(
        ["dbt", command, "--profiles-dir", "/root/.dbt", "--project-dir", settings.DBT_PROJECT_DIR],
        capture_output=True,
        text=True
    )
    return {
        "returncode": result.returncode,
        "stdout": html.escape(result.stdout),
        "stderr": html.escape(result.stderr)
    }
