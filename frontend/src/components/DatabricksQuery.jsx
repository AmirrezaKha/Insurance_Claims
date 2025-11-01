import React, { useState } from "react";

const DatabricksQuery = () => {
  const [query, setQuery] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRunQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setColumns([]);
    setRows([]);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || ""}/databricks/query`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        }
      );

      if (!res.ok) throw new Error("Abfrage konnte nicht ausgeführt werden");
      const data = await res.json();

      setColumns(data.columns || []);
      setRows(data.rows || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-orange-50 dark:bg-orange-900 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-orange-700 dark:text-orange-300">
        Databricks SQL-Abfrage
      </h2>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Geben Sie hier Ihre SQL-Abfrage ein..."
        className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-orange-300 dark:bg-orange-800 dark:border-orange-700 dark:text-white resize-none"
        rows={5}
      />

      <button
        onClick={handleRunQuery}
        disabled={loading}
        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 transition disabled:opacity-50"
      >
        {loading ? "Abfrage läuft..." : "Abfrage ausführen"}
      </button>

      {error && <p className="text-red-600 dark:text-red-400 mt-3">Fehler: {error}</p>}

      {/* Results Table */}
      {!loading && rows.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border border-orange-300 dark:border-orange-600 bg-white dark:bg-orange-950 rounded-md shadow-sm">
            <thead className="bg-orange-100 dark:bg-orange-800 text-gray-800 dark:text-orange-200">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className="p-2 border border-orange-200 dark:border-orange-600 text-left font-semibold"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-orange-50 dark:hover:bg-orange-700 transition-colors"
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="p-2 border border-orange-200 dark:border-orange-600 text-sm text-gray-700 dark:text-gray-100"
                    >
                      {cell !== null ? String(cell) : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <p className="text-gray-700 dark:text-gray-300 mt-4">
          Noch keine Ergebnisse. Führen Sie oben eine Abfrage aus.
        </p>
      )}
    </div>
  );
};

export default DatabricksQuery;
