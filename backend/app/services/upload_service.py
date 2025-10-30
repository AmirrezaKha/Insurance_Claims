import pandas as pd
import io
from app.services.databricks_service import execute_sql
import databricks.sql
from app.core.config import settings

def upload_csv_to_table(file_bytes: bytes, table_name: str):
    df = pd.read_csv(io.BytesIO(file_bytes))

    with databricks.sql.connect(
        server_hostname=settings.DATABRICKS_HOST.replace("https://", ""),
        http_path="/sql/1.0/warehouses/2a160fe88bd1510d",
        access_token=settings.DATABRICKS_TOKEN
    ) as conn:
        with conn.cursor() as cursor:
            cursor.execute(f"CREATE OR REPLACE TABLE {table_name} AS SELECT * FROM VALUES (0) WHERE 1=0")
            for _, row in df.iterrows():
                values = ", ".join([f"'{v}'" for v in row])
                cursor.execute(f"INSERT INTO {table_name} VALUES ({values})")
    return {"message": f"✅ Uploaded {len(df)} rows to {table_name}"}
