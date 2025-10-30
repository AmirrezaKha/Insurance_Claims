import pandas as pd
import io
import os
from app.services.databricks_service import execute_sql
import databricks.sql
from app.core.config import settings

def upload_csv_to_table(file_bytes: bytes, filename: str = "uploaded_file"):
    """
    Upload CSV content to Databricks automatically using the file name as table name.
    
    Args:
        file_bytes: CSV file content in bytes.
        filename: Original CSV file name (optional). Will be used to name the table.
    """
    df = pd.read_csv(io.BytesIO(file_bytes))

    table_name = f"workspace.insurance_claims.{os.path.splitext(filename)[0]}"

    with databricks.sql.connect(
        server_hostname=settings.DATABRICKS_HOST.replace("https://", ""),
        http_path="/sql/1.0/warehouses/2a160fe88bd1510d",
        access_token=settings.DATABRICKS_TOKEN
    ) as conn:
        with conn.cursor() as cursor:
            cols = ", ".join([f"{c} STRING" for c in df.columns])
            cursor.execute(f"CREATE OR REPLACE TABLE {table_name} ({cols})")
            
            for _, row in df.iterrows():
                values = ", ".join([f"'{v}'" for v in row])
                cursor.execute(f"INSERT INTO {table_name} VALUES ({values})")
    
    return {"message": f"✅ Uploaded {len(df)} rows to {table_name}"}
