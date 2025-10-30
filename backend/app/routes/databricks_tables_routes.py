from fastapi import APIRouter
from app.services.databricks_tables_service import list_tables

router = APIRouter(prefix="/tables", tags=["Tables"])

@router.get("/")
def get_tables(schema: str = "default"):
    """
    Example: /tables/?schema=default
    """
    return list_tables(schema)
