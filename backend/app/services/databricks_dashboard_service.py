from app.core.databricks import execute_sql

def get_insurance_data(filters: dict = None):
    base_query = """
    SELECT 
        vertragsdauer,
        fahrzeugalter,
        kundenalter,
        regionscode,
        regionsdichte,
        segment,
        modell,
        kraftstoffart,
        airbags,
        hubraum
    FROM workspace.insurance_claims.silver_insurance_claims_bi
    """
    
    conditions = []
    if filters:
        if filters.get("region"):
            conditions.append(f"regionscode = '{filters['region']}'")
        if filters.get("segment"):
            conditions.append(f"segment = '{filters['segment']}'")
        if filters.get("fuel"):
            conditions.append(f"kraftstoffart = '{filters['fuel']}'")
        if filters.get("age_min") and filters.get("age_max"):
            conditions.append(f"kundenalter BETWEEN {filters['age_min']} AND {filters['age_max']}")
    
    if conditions:
        base_query += " WHERE " + " AND ".join(conditions)
    
    base_query += " LIMIT 500"
    
    cols, rows = execute_sql(base_query)
    data = [dict(zip(cols, row)) for row in rows]
    return data
