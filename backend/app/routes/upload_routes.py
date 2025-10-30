from fastapi import APIRouter, File, UploadFile, Form
from app.services.upload_service import upload_csv_to_table

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("/")
async def upload_csv(file: UploadFile = File(...), table_name: str = Form(...)):
    file_bytes = await file.read()
    result = upload_csv_to_table(file_bytes, table_name)
    return result
