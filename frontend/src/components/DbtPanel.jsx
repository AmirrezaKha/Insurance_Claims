import React, { useState } from "react";

const DbtPanel = () => {
  const [status, setStatus] = useState("");

  const runDbt = async () => {
    setStatus("Running dbt...");
    const res = await fetch("http://localhost:8000/dbt/run", { method: "POST" });
    const data = await res.json();
    setStatus(`✅ ${data.message || "dbt run completed"}`);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">dbt Pipeline</h2>
      <button onClick={runDbt} className="bg-green-600 text-white px-4 py-2 rounded">
        Run dbt
      </button>
      {status && <p className="mt-3">{status}</p>}
    </div>
  );
};

export default DbtPanel;
