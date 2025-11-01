import React, { useEffect, useState } from "react";

const TablesPanel = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const apiUrl = import.meta.env.VITE_API_URL || "http://fastapi:8001";

    fetch(`${apiUrl}/tables`)
      .then((res) => {
        if (!res.ok) throw new Error(`Fehler beim Abrufen der Tabellen: ${res.status}`);
        return res.json();
      })
      .then((data) => setTables(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 bg-purple-50 dark:bg-purple-900 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">Tabellen-Panel</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Liste aller Tabellen in Ihrem Databricks-Arbeitsbereich für das Schema <strong>default</strong>.
      </p>

      {loading && <p className="text-gray-600 dark:text-gray-400">Laden...</p>}
      {error && <p className="text-red-600 dark:text-red-400">Fehler: {error}</p>}

      {tables.length > 0 ? (
        <table className="min-w-full border border-purple-300 dark:border-purple-700 bg-white dark:bg-purple-800 rounded-md">
          <thead className="bg-purple-100 dark:bg-purple-700">
            <tr>
              {Object.keys(tables[0]).map((col) => (
                <th key={col} className="p-2 border border-purple-200 dark:border-purple-600">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tables.map((table, idx) => (
              <tr key={idx} className="hover:bg-purple-50 dark:hover:bg-purple-700">
                {Object.values(table).map((val, i) => (
                  <td key={i} className="p-2 border border-purple-200 dark:border-purple-600 text-xs font-mono text-gray-900 dark:text-gray-100">
                    {val?.toString() || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="text-gray-700 dark:text-gray-300">Keine Tabellen gefunden.</p>
      )}
    </div>
  );
};

export default TablesPanel;
