FROM python:3.10-slim

WORKDIR /usr/app/dbt
COPY dbt_project/ ./dbt_project/
RUN pip install dbt-databricks
