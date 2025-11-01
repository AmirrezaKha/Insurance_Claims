import React, { useEffect, useState } from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie,
  Tooltip, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

function InsuranceDashboard() {
  const [data, setData] = useState([]);
  const [region, setRegion] = useState("");
  const [segment, setSegment] = useState("");
  const [fuel, setFuel] = useState("");

  const fetchData = () => {
    // Build query parameters dynamically
    const params = new URLSearchParams();
    if (region) params.append("region", region);
    if (segment) params.append("segment", segment);
    if (fuel) params.append("fuel", fuel);

    fetch(`http://localhost:8000/api/insurance-data?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error fetching data:", err));
  };

  useEffect(() => {
    fetchData();
  }, [region, segment, fuel]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* === FILTER SECTION === */}
      <div className="flex gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="">All Regions</option>
          <option value="NRW">NRW</option>
          <option value="BY">Bavaria</option>
          <option value="BW">Baden-Württemberg</option>
          {/* Add more as per your data */}
        </select>

        <select
          className="border p-2 rounded"
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
        >
          <option value="">All Segments</option>
          <option value="SUV">SUV</option>
          <option value="Limousine">Limousine</option>
          <option value="Kompakt">Kompakt</option>
        </select>

        <select
          className="border p-2 rounded"
          value={fuel}
          onChange={(e) => setFuel(e.target.value)}
        >
          <option value="">All Fuel Types</option>
          <option value="Benzin">Benzin</option>
          <option value="Diesel">Diesel</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Elektrisch">Elektrisch</option>
        </select>
      </div>

      {/* === CHART GRID === */}
      <div className="grid grid-cols-2 gap-8">
        <div className="shadow-lg p-4 rounded-2xl bg-white">
          <h2 className="text-xl font-semibold mb-2">
            Average Contract Duration vs Customer Age
          </h2>
          <LineChart width={500} height={300} data={data}>
            <XAxis dataKey="kundenalter" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line type="monotone" dataKey="vertragsdauer" stroke="#8884d8" />
          </LineChart>
        </div>

        <div className="shadow-lg p-4 rounded-2xl bg-white">
          <h2 className="text-xl font-semibold mb-2">Vehicle Age Distribution</h2>
          <BarChart width={500} height={300} data={data}>
            <XAxis dataKey="segment" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="fahrzeugalter" fill="#82ca9d" />
          </BarChart>
        </div>

        <div className="shadow-lg p-4 rounded-2xl bg-white">
          <h2 className="text-xl font-semibold mb-2">Airbags by Segment</h2>
          <BarChart width={500} height={300} data={data}>
            <XAxis dataKey="segment" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="airbags" fill="#8884d8" />
          </BarChart>
        </div>

        <div className="shadow-lg p-4 rounded-2xl bg-white">
          <h2 className="text-xl font-semibold mb-2">Fuel Type Distribution</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={data.reduce((acc, row) => {
                const found = acc.find((x) => x.name === row.kraftstoffart);
                if (found) found.value += 1;
                else acc.push({ name: row.kraftstoffart, value: 1 });
                return acc;
              }, [])}
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
        </div>
      </div>
    </div>
  );
}

export default InsuranceDashboard;
