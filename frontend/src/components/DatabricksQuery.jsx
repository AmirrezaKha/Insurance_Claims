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

      if (!res.ok) throw new Error("Failed to run query");
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
    <div className="p-6 bg-orange-50 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-orange-700">
        Databricks SQL Query
      </h2>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your SQL query here..."
        className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-orange-300 resize-none"
        rows={5}
      />

      <button
        onClick={handleRunQuery}
        disabled={loading}
        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
      >
        {loading ? "Running..." : "Run Query"}
      </button>

      {error && <p className="text-red-600 mt-3">Error: {error}</p>}

      {/* Results Table */}
      {!loading && rows.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border border-orange-300 bg-white rounded-md shadow-sm">
            <thead className="bg-orange-100">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className="p-2 border border-orange-200 text-left font-semibold"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-orange-50">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="p-2 border border-orange-200 text-sm text-gray-700"
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
        <p className="text-gray-700 mt-4">No results yet. Run a query above.</p>
      )}
    </div>
  );
};

export default DatabricksQuery;
