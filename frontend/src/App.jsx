import React, { useState } from "react";
import UploadForm from "./components/UploadForm.jsx";
import DbtPanel from "./components/DbtPanel.jsx";
import MlflowPanel from "./components/MlflowPanel.jsx";
import DatabricksQuery from "./components/DatabricksQuery.jsx";

const App = () => {
  const [activePanel, setActivePanel] = useState("upload");

  const renderPanel = () => {
    switch (activePanel) {
      case "upload": return <UploadForm />;
      case "dbt": return <DbtPanel />;
      case "mlflow": return <MlflowPanel />;
      case "databricks": return <DatabricksQuery />;
      default: return <UploadForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-blue-600 text-white p-4 text-center text-2xl font-semibold">
        Databricks Control Panel
      </header>
      <nav className="flex justify-center space-x-4 p-4 bg-gray-100">
        <button onClick={() => setActivePanel("upload")} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Upload</button>
        <button onClick={() => setActivePanel("dbt")} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">dbt</button>
        <button onClick={() => setActivePanel("mlflow")} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">MLflow</button>
        <button onClick={() => setActivePanel("databricks")} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Databricks</button>
      </nav>
      <main className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-xl">
        {renderPanel()}
      </main>
    </div>
  );
};

export default App;
