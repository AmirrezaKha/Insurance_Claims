import React, { useState } from "react";

const DatabricksQuery = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  const handleRunQuery = () => {
    setResult("Sample result: your query ran successfully!");
  };

  return (
    <div className="p-6 bg-orange-50 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-orange-700">Databricks SQL Query</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your SQL query here..."
        className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-orange-300 resize-none"
        rows={5}
      />
      <button
        onClick={handleRunQuery}
        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
      >
        Run Query
      </button>
      {result && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-inner border border-orange-200">
          <p className="text-gray-700">{result}</p>
        </div>
      )}
    </div>
  );
};

export default DatabricksQuery;
