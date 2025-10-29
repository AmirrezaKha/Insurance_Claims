FROM python:3.10-slim
WORKDIR /app
COPY app.py .
RUN pip install fastapi uvicorn requests
EXPOSE 8001
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]
