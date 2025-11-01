import os

class Settings:
    DATABRICKS_HOST = os.getenv("DATABRICKS_HOST", "")
    DATABRICKS_TOKEN = os.getenv("DATABRICKS_TOKEN", "")
    DATABRICKS_JOB_ID = os.getenv("DATABRICKS_JOB_ID", "")
    DATABRICKS_HTTP_PATH = os.getenv("DATABRICKS_HTTP_PATH", "")
    DBT_PROJECT_DIR = os.getenv("DBT_PROJECT_DIR", "/usr/app/dbt")
    DBT_LOG_FILE = os.path.join(DBT_PROJECT_DIR, "logs/dbt.log")

settings = Settings()
