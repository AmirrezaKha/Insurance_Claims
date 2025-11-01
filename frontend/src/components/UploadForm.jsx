import React, { useState } from "react";

const UploadForm = () => {
  const [fileName, setFileName] = useState("Keine Datei ausgewählt");

  const handleFileChange = (e) => {
    setFileName(e.target.files[0]?.name || "Keine Datei ausgewählt");
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">
        CSV-Datei hochladen
      </h2>
      <form className="flex flex-col space-y-4">
        <label className="flex flex-col items-start">
          <span className="font-medium text-gray-700 dark:text-gray-300">CSV auswählen</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mt-2 p-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100 hover:border-blue-400 dark:hover:border-blue-300"
          />
          <span className="mt-1 text-gray-500 dark:text-gray-400 text-sm">{fileName}</span>
        </label>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Hochladen
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
