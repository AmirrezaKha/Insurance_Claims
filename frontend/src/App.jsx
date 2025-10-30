import React, { useState } from "react";
import DbtPanel from "./components/DbtPanel.jsx";
import TablesPanel from "./components/TablesPanel.jsx";
import DatabricksQuery from "./components/DatabricksQuery.jsx";
import DatabricksJobsPanel from "./components/DatabricksJobsPanel.jsx";
import AirflowPanel from "./components/AirflowPanel.jsx";
import ClaimSummaryPanel from "./components/ClaimSummaryPanel.jsx";


const App = () => {
  const [activePanel, setActivePanel] = useState("dbt");

  const renderPanel = () => {
    switch (activePanel) {
      // case "upload":
      //   return <UploadForm />;
      case "dbt":
        return <DbtPanel />;
      case "tables":
        return <TablesPanel />;
      case "databricks":
        return <DatabricksQuery />;
      case "jobs":
        return <DatabricksJobsPanel />;
      case "claimsummary":
        return <ClaimSummaryPanel />;
      default:
        return <DbtPanel />;
      // case "airflow":
      //   return <AirflowPanel />;
    }
  };

  const buttons = [
    // { key: "upload", label: "Upload", color: "blue" }, // commented out
    { key: "dbt", label: "dbt", color: "green" },
    { key: "tables", label: "Tables", color: "purple" },
    { key: "databricks", label: "Databricks", color: "orange" },
    { key: "jobs", label: "Jobs", color: "yellow" },
    { key: "claimsummary", label: "Claim Summary Panel", color: "pink" },
  ];

  const colorMap = {
    blue: { bg: "bg-blue-500", active: "bg-blue-600" },
    green: { bg: "bg-green-500", active: "bg-green-600" },
    purple: { bg: "bg-purple-500", active: "bg-purple-600" },
    orange: { bg: "bg-orange-500", active: "bg-orange-600" },
    yellow: { bg: "bg-yellow-500", active: "bg-yellow-600" },
    pink: { bg: "bg-pink-500", active: "bg-pink-600" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 text-center text-3xl font-bold shadow-md">
        Databricks Control Panel
      </header>

      <nav className="flex justify-center flex-wrap gap-4 mt-6">
        {buttons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setActivePanel(btn.key)}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 transform ${
              activePanel === btn.key
                ? `${colorMap[btn.color].active} shadow-lg scale-105`
                : `${colorMap[btn.color].bg} hover:${colorMap[btn.color].active}`
            }`}
          >
            {btn.label}
          </button>
        ))}
      </nav>

      <main className="flex-grow p-6 max-w-6xl mx-auto mt-8 bg-white shadow-xl rounded-2xl transition-all">
        {renderPanel()}
      </main>

      <footer className="text-center text-gray-500 py-4 mt-10">
        &copy; 2025 Databricks Control Panel. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
