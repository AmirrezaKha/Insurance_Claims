import React, { useState, useEffect } from "react";

const MlflowPanel = () => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/mlflow/models")
      .then((res) => res.json())
      .then((data) => setModels(data.models || []));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">MLflow Models</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Version</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m, i) => (
            <tr key={i}>
              <td className="border p-2">{m.name}</td>
              <td className="border p-2">{m.version}</td>
              <td className="border p-2">{m.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MlflowPanel;
