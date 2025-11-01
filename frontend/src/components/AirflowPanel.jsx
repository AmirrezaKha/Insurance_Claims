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
      .then(() => alert(`DAG ausgelöst: ${dag_id}`))
      .catch((err) => alert(`Fehler: ${err.message}`));
  };

  if (loading) return <p className="text-gray-700 dark:text-gray-300">Lade DAGs...</p>;
  if (error) return <p className="text-red-600 dark:text-red-400">Fehler: {error}</p>;

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Airflow DAGs</h2>
      <ul className="space-y-3">
        {dags.map((dag) => (
          <li
            key={dag.dag_id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <span className="text-gray-800 dark:text-gray-200">
              {dag.dag_id} -{" "}
              <span className={dag.is_paused ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
                {dag.is_paused ? "Pausiert" : "Aktiv"}
              </span>
            </span>
            <button
              onClick={() => triggerDag(dag.dag_id)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Auslösen
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AirflowPanel;
