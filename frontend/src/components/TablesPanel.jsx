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
        if (!res.ok) throw new Error(`Failed to fetch tables: ${res.status}`);
        return res.json();
      })
      .then((data) => setTables(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 bg-purple-50 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-purple-700">Tables Panel</h2>
      <p className="text-gray-700 mb-4">
        List of all tables in your Databricks workspace for schema <strong>default</strong>.
      </p>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {tables.length > 0 ? (
        <table className="min-w-full border border-purple-300 bg-white rounded-md">
          <thead className="bg-purple-100">
            <tr>
              {Object.keys(tables[0]).map((col) => (
                <th key={col} className="p-2 border border-purple-200">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tables.map((table, idx) => (
              <tr key={idx} className="hover:bg-purple-50">
                {Object.values(table).map((val, i) => (
                  <td key={i} className="p-2 border border-purple-200 text-xs font-mono">
                    {val?.toString() || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="text-gray-700">No tables found.</p>
      )}
    </div>
  );
};

export default TablesPanel;
