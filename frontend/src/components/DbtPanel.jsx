import React, { useState } from "react";

const DbtPanel = () => {
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [command, setCommand] = useState("run");

  const runDbtCommand = async (cmd) => {
    setLoading(true);
    setOutput(null);
    try {
      const res = await fetch(`/dbt/execute?command=${cmd}`);
      const text = await res.text();
      setOutput(text);
    } catch (err) {
      setOutput(`<pre style="color:red">${err}</pre>`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-green-50 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-green-700">dbt Panel</h2>
      <p className="text-gray-700 mb-4">
        Run your dbt models and check results.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <button
          onClick={() => runDbtCommand("run")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Run Models
        </button>
        <button
          onClick={() => runDbtCommand("compile")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Compile Models
        </button>
        <button
          onClick={() => runDbtCommand("test")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Test Models
        </button>
      </div>

      {loading && <p className="text-gray-700">Running dbt command...</p>}
      {output && (
        <div
          className="mt-4 p-4 bg-green-100 rounded-lg overflow-auto max-h-96"
          dangerouslySetInnerHTML={{ __html: output }}
        />
      )}
    </div>
  );
};

export default DbtPanel;
