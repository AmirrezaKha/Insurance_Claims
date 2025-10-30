import React, { useState } from "react";

const UploadForm = () => {
  const [fileName, setFileName] = useState("No file chosen");

  const handleFileChange = (e) => {
    setFileName(e.target.files[0]?.name || "No file chosen");
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Upload CSV File</h2>
      <form className="flex flex-col space-y-4">
        <label className="flex flex-col items-start">
          <span className="font-medium text-gray-700">Choose CSV</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mt-2 p-2 border rounded-lg bg-white hover:border-blue-400"
          />
          <span className="mt-1 text-gray-500 text-sm">{fileName}</span>
        </label>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
