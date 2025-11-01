import React, { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  Tooltip, XAxis, YAxis, CartesianGrid, Legend,
  ResponsiveContainer
} from "recharts";

function InsuranceDashboard() {
  const [data, setData] = useState([]);
  const [region, setRegion] = useState("");
  const [segment, setSegment] = useState("");
  const [fuel, setFuel] = useState("");

  const fetchData = () => {
    const params = new URLSearchParams();
    if (region) params.append("region", region);
    if (segment) params.append("segment", segment);
    if (fuel) params.append("fuel", fuel);

    // Remove /api if your FastAPI route is defined without prefix
    fetch(`http://localhost:8001/insurance-data-dashboard?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Fehler beim Abrufen der Daten:", err));
  };

  useEffect(() => {
    fetchData();
  }, [region, segment, fuel]);

  const pieData = data.reduce((acc, row) => {
    const found = acc.find((x) => x.name === row.kraftstoffart);
    if (found) found.value += 1;
    else acc.push({ name: row.kraftstoffart, value: 1 });
    return acc;
  }, []);

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* === FILTER SECTION === */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="">Alle Regionen</option>
          <option value="NRW">NRW</option>
          <option value="BY">Bayern</option>
          <option value="BW">Baden-Württemberg</option>
        </select>

        <select
          className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
        >
          <option value="">Alle Segmente</option>
          <option value="SUV">SUV</option>
          <option value="Limousine">Limousine</option>
          <option value="Kompakt">Kompakt</option>
        </select>

        <select
          className="border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          value={fuel}
          onChange={(e) => setFuel(e.target.value)}
        >
          <option value="">Alle Kraftstoffarten</option>
          <option value="Benzin">Benzin</option>
          <option value="Diesel">Diesel</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Elektrisch">Elektrisch</option>
        </select>
      </div>

      {/* === CHART GRID === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="shadow-lg p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
            Durchschnittliche Vertragsdauer vs. Kundenalter
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="kundenalter" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="vertragsdauer" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Age Bar Chart */}
        <div className="shadow-lg p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
            Fahrzeugalter-Verteilung
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="segment" stroke="#82ca9d" />
              <YAxis stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar dataKey="fahrzeugalter" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Airbags by Segment */}
        <div className="shadow-lg p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
            Airbags nach Segment
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="segment" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="airbags" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fuel Type Pie Chart */}
        <div className="shadow-lg p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
            Kraftstoffarten-Verteilung
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default InsuranceDashboard;
