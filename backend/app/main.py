from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.routes import (
    databricks_tables_routes,
    dbt_routes,
    upload_routes,
    metrics_routes,
    databricks_routes,
    databricks_jobs_routes
)

app = FastAPI(title="Databricks Pipeline API")

# CORS: allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus
Instrumentator().instrument(app).expose(app)

# Routers
app.include_router(dbt_routes.router)
app.include_router(upload_routes.router)
app.include_router(metrics_routes.router)
app.include_router(databricks_routes.router)
app.include_router(databricks_tables_routes.router)
app.include_router(databricks_jobs_routes.router)

@app.get("/")
def root():
    return {"message": "FastAPI Databricks Stack Running 🚀"}
