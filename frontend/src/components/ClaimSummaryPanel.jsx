import React, { useState } from "react";

const ClaimSummaryPanel = () => {
  const [policyId, setPolicyId] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRun = async () => {
    if (!policyId.trim()) {
      setError("Please enter a policy ID");
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

      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();

      setOutput(data.output || JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-purple-50 rounded-xl shadow-md max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4 text-purple-700">Generate Claim Summary</h2>

      <input
        type="text"
        value={policyId}
        onChange={(e) => setPolicyId(e.target.value)}
        placeholder="Enter policy ID (e.g., POL050456)"
        className="p-2 border border-purple-300 rounded mb-4 w-full"
      />
      <button
        onClick={handleRun}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Run Job
      </button>

      {loading && <p className="mt-2">Running job...</p>}
      {error && <p className="mt-2 text-red-600">Error: {error}</p>}
      {output && (
        <div className="mt-4 p-4 bg-white border border-purple-200 rounded">
          <pre className="text-sm font-mono whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
};

export default ClaimSummaryPanel;
