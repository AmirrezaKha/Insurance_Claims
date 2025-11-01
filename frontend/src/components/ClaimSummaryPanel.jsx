import React, { useState } from "react";

const ClaimSummaryPanel = () => {
  const [policyId, setPolicyId] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRun = async () => {
    if (!policyId.trim()) {
      setError("Bitte geben Sie eine Policen-ID ein");
      return;
    }

    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      console.log("Sending body:", JSON.stringify({ policy_id: policyId }));
      const res = await fetch("http://localhost:8001/jobs/run_claim_summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policy_id: policyId }),
      });

      if (!res.ok) throw new Error(`Fehler: ${res.status}`);
      const data = await res.json();

      setOutput(data.output || JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-xl shadow-md max-w-md mx-auto mt-6 bg-purple-50 dark:bg-purple-900 border border-purple-100 dark:border-purple-700">
      <h2 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">
        Schadenübersicht erstellen
      </h2>

      <input
        type="text"
        value={policyId}
        onChange={(e) => setPolicyId(e.target.value)}
        placeholder="Policen-ID eingeben (z. B. POL050456)"
        className="p-2 border border-purple-300 dark:border-purple-600 rounded mb-4 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      <button
        onClick={handleRun}
        className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
      >
        Job ausführen
      </button>

      {loading && <p className="mt-2 text-gray-700 dark:text-gray-300">Job wird ausgeführt...</p>}
      {error && <p className="mt-2 text-red-600 dark:text-red-400">Fehler: {error}</p>}
      {output && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded">
          <pre className="text-sm font-mono whitespace-pre-wrap text-gray-900 dark:text-gray-100">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ClaimSummaryPanel;
