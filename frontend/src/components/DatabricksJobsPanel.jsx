import React, { useEffect, useState } from "react";

const DatabricksJobsPanel = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/databricks/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs || []))
      .catch((err) => console.error("Failed to fetch jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 bg-yellow-50 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-yellow-700">Databricks Jobs</h2>

      {loading ? (
        <p className="text-gray-700">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-700">No jobs found.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-yellow-200">
              <th className="border px-4 py-2">Job ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Creator</th>
              <th className="border px-4 py-2">Schedule</th>
              <th className="border px-4 py-2">Max Concurrent Runs</th>
              <th className="border px-4 py-2">State</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.job_id} className="even:bg-yellow-100">
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
      )}
    </div>
  );
};

export default DatabricksJobsPanel;
