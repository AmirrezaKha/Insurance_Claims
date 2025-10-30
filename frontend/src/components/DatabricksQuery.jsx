import React, { useState } from "react";

const DatabricksQuery = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const runQuery = async () => {
    const res = await fetch("http://localhost:8000/databricks/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setResults(data.results || []);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Run Databricks Query</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter SQL query"
        className="w-full border p-2 h-32"
      />
      <button onClick={runQuery} className="mt-3 bg-orange-500 text-white px-4 py-2 rounded">
        Run Query
      </button>

      {results.length > 0 && (
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr>
              {Object.keys(results[0]).map((col) => (
                <th key={col} className="border p-2">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j} className="border p-2">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DatabricksQuery;
