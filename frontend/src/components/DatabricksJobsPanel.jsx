import React, { useEffect, useState } from "react";

const DatabricksJobsPanel = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/databricks/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs || []))
      .catch((err) => console.error("Fehler beim Abrufen der Jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 bg-yellow-50 dark:bg-yellow-900 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-yellow-700 dark:text-yellow-300">
        Databricks Jobs
      </h2>

      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Jobs werden geladen...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">Keine Jobs gefunden.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-yellow-200 dark:bg-yellow-800 text-gray-800 dark:text-yellow-200">
                <th className="border px-4 py-2">Job-ID</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Ersteller</th>
                <th className="border px-4 py-2">Zeitplan</th>
                <th className="border px-4 py-2">Max. gleichzeitige Ausführungen</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.job_id}
                  className="even:bg-yellow-100 dark:even:bg-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-700 transition-colors"
                >
                  <td className="border px-4 py-2">{job.job_id}</td>
                  <td className="border px-4 py-2">{job.name}</td>
                  <td className="border px-4 py-2">{job.creator_user_name}</td>
                  <td className="border px-4 py-2">{job.schedule || "-"}</td>
                  <td className="border px-4 py-2">{job.max_concurrent_runs}</td>
                  <td className="border px-4 py-2">{job.state || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DatabricksJobsPanel;
