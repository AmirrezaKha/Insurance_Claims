import React, { useEffect, useState } from "react";

const AirflowPanel = () => {
  const [dags, setDags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8001"}/airflow/dags`)
      .then((res) => res.json())
      .then(setDags)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const triggerDag = (dag_id) => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8001"}/airflow/dags/${dag_id}/trigger`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then(() => alert(`Triggered DAG: ${dag_id}`))
      .catch((err) => alert(`Error: ${err.message}`));
  };

  if (loading) return <p>Loading DAGs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Airflow DAGs</h2>
      <ul>
        {dags.map((dag) => (
          <li key={dag.dag_id}>
            {dag.dag_id} - {dag.is_paused ? "Paused" : "Active"}
            <button onClick={() => triggerDag(dag.dag_id)}>Trigger</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AirflowPanel;
