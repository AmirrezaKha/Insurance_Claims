from app.core.dbt_utils import run_dbt_command

def run_dbt():
    """Run dbt and return the result."""
    return run_dbt_command("run")

def test_dbt():
    """Test dbt and return the result."""
    return run_dbt_command("test")

def compile_dbt():
    """Compile dbt and return the result."""
    return run_dbt_command("compile")

def execute_dbt_command(command: str):
    """Run any DBT command."""
    return run_dbt_command(command)
