from app.core.dbt_utils import run_dbt_command

def run_dbt():
    return run_dbt_command("run")

def test_dbt():
    return run_dbt_command("test")

def compile_dbt():
    return run_dbt_command("compile")
