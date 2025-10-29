from airflow import DAG
from airflow.providers.databricks.operators.databricks import DatabricksRunNowOperator
from airflow.operators.bash import BashOperator
from datetime import datetime

with DAG(
    dag_id="databricks_dbt_pipeline",
    schedule_interval=None,
    start_date=datetime(2024,1,1),
    catchup=False,
    tags=["databricks", "dbt"],
) as dag:

    run_databricks = DatabricksRunNowOperator(
        task_id="run_databricks_notebook",
        databricks_conn_id="databricks_default",
        job_id=12345  # Replace with your Databricks job ID
    )

    run_dbt = BashOperator(
        task_id="run_dbt_models",
        bash_command="docker exec dbt dbt run --profiles-dir /usr/app/dbt"
    )

    run_databricks >> run_dbt
