from airflow import DAG
from airflow.providers.databricks.operators.databricks import DatabricksRunNowOperator
from airflow.operators.bash import BashOperator
from datetime import datetime
import os

DBT_PROJECT_DIR = "/usr/app/dbt"  # Path inside the Airflow container

with DAG(
    dag_id="databricks_dbt_pipeline",
    schedule_interval=None,
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=["databricks", "dbt"],
) as dag:

    # Trigger Databricks Job
    run_databricks = DatabricksRunNowOperator(
        task_id="Medallion_Insurance_Claim_Architecture",
        databricks_conn_id="databricks_default",
        job_id=420851972173020 
    )

    # Trigger dbt run directly inside Airflow container
    # Run dbt inside Airflow container
    # run_dbt = BashOperator(
    #     task_id="run_dbt_models",
    #     bash_command=f"dbt run --profiles-dir {DBT_PROJECT_DIR}",
    #     env={
    #         "DBT_PROFILES_DIR": DBT_PROJECT_DIR,
    #         "DATABRICKS_HOST": os.getenv("DATABRICKS_HOST"),
    #         "DATABRICKS_TOKEN": os.getenv("DATABRICKS_TOKEN")
    #     }
    # )
    run_dbt = BashOperator(
    task_id="run_dbt_models",
    bash_command=f"docker exec dbt dbt run --profiles-dir /usr/app/dbt",
)

    run_databricks >> run_dbt
