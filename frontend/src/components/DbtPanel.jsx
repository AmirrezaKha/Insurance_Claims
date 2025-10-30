import React from "react";

const DbtPanel = () => {
  return (
    <div className="p-6 bg-green-50 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-green-700">dbt Panel</h2>
      <p className="text-gray-700 mb-4">
        Run your dbt models and check results.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          Run Models
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          View Logs
        </button>
      </div>
    </div>
  );
};

export default DbtPanel;
