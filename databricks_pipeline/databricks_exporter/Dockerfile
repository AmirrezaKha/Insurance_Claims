FROM python:3.10-slim
WORKDIR /app
COPY app.py .
RUN pip install fastapi uvicorn prometheus_client requests
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
