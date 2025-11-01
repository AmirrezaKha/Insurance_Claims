from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from app.services.databricks_dashboard_service import get_insurance_data

router = APIRouter()

@router.get("/insurance-data")
def insurance_data(
    region: str = Query(None),
    segment: str = Query(None),
    fuel: str = Query(None),
    age_min: int = Query(None),
    age_max: int = Query(None)
):
    filters = {
        "region": region,
        "segment": segment,
        "fuel": fuel,
        "age_min": age_min,
        "age_max": age_max
    }
    data = get_insurance_data(filters)
    return JSONResponse(content=data)
