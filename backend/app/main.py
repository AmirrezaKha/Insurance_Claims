from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator
from app.routes import (
    dbt_routes,
    upload_routes,
    metrics_routes,
    databricks_routes,
    mlflow_routes
)

app = FastAPI(title="Databricks Pipeline API")

Instrumentator().instrument(app).expose(app)

# Routers
app.include_router(dbt_routes.router)
app.include_router(upload_routes.router)
app.include_router(metrics_routes.router)
app.include_router(databricks_routes.router)
app.include_router(mlflow_routes.router)

@app.get("/")
def root():
    return {"message": "FastAPI Databricks Stack Running 🚀"}
