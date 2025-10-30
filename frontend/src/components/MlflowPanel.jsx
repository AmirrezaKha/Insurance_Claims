import React from "react";

const MlflowPanel = () => {
  return (
    <div className="p-6 bg-purple-50 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-purple-700">MLflow Panel</h2>
      <p className="text-gray-700 mb-4">
        Monitor experiments, metrics, and models.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
          View Experiments
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
          Track Metrics
        </button>
      </div>
    </div>
  );
};

export default MlflowPanel;
