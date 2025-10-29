FROM apache/airflow:2.10.5-python3.10

# Upgrade pip first
RUN pip install --upgrade pip

# Install Databricks provider + compatible OpenLineage
RUN pip install \
    apache-airflow-providers-databricks==7.7.4 \
    apache-airflow-providers-openlineage>=1.8.0
RUN pip install dbt-core==1.10.13 dbt-databricks==1.10.14
# Switch back to airflow user
USER airflow

# Copy DAGs
COPY dags/ /opt/airflow/dags/


