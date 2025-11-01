import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Table2,
  Workflow,
  LineChart,
  FileBarChart,
  Layers,
  BarChart3,
  Sun,
  Moon,
} from "lucide-react";

import DbtPanel from "./components/DbtPanel.jsx";
import TablesPanel from "./components/TablesPanel.jsx";
import DatabricksQuery from "./components/DatabricksQuery.jsx";
import DatabricksJobsPanel from "./components/DatabricksJobsPanel.jsx";
import ClaimSummaryPanel from "./components/ClaimSummaryPanel.jsx";
import InsuranceDashboard from "./components/DashboardPanel.jsx";

const panels = [
  { key: "dbt", label: "dbt", icon: <Layers className="w-5 h-5" /> },
  { key: "tables", label: "Tabellen", icon: <Table2 className="w-5 h-5" /> },
  { key: "databricks", label: "Abfragen", icon: <Database className="w-5 h-5" /> },
  { key: "jobs", label: "Jobs", icon: <Workflow className="w-5 h-5" /> },
  { key: "claimsummary", label: "Schadensübersicht", icon: <FileBarChart className="w-5 h-5" /> },
  { key: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
];

const App = () => {
  const [activePanel, setActivePanel] = useState("dbt");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const renderPanel = () => {
    switch (activePanel) {
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
      case "dashboard":
        return <InsuranceDashboard />;
      default:
        return <DbtPanel />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg">
        <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Databricks
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:scale-110 transition-transform"
            title="Thema wechseln"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {panels.map((item) => (
            <button
              key={item.key}
              onClick={() => setActivePanel(item.key)}
              className={`flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl font-medium transition-all duration-200 ${
                activePanel === item.key
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <footer className="text-center p-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          © 2025 Databricks Steuerungs-Panel
        </footer>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold tracking-tight capitalize">
            {activePanel === "claimsummary" ? "Schadensübersicht" :
             activePanel === "tables" ? "Tabellen" :
             activePanel === "databricks" ? "Abfragen" :
             activePanel === "jobs" ? "Jobs" :
             activePanel === "dashboard" ? "Dashboard" :
             "dbt"}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700"
          >
            {renderPanel()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
