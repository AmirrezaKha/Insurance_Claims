# Use official Python slim image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install essential dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Copy FastAPI code
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    requests \
    dbt-core \
    dbt-databricks \
    databricks-sql-connector \
    prometheus-fastapi-instrumentator       
# Mount your dbt project when running container
VOLUME /usr/app/dbt

# Expose the FastAPI port
EXPOSE 8001

# Run the FastAPI app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]
