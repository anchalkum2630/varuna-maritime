import { useEffect, useState } from "react";
import { fetchComparison } from "../services/api";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import type { ComparisonResponse } from "../types";

export default function ComparePage() {
  const [data, setData] = useState<ComparisonResponse | null>(null);

  useEffect(() => {
    fetchComparison().then(setData).catch(() => setData(null));
  }, []);

  if (!data) return <div className="max-w-6xl mx-auto">Loading...</div>;

  const chartData = data.comparisons.map(c => ({
    routeId: c.routeId,
    baseline: data.baseline.ghgIntensity,
    comparison: c.ghgIntensity
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">Compare (target ≈ 89.3368 gCO₂e/MJ)</h2>

      <div className="table-card p-4">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">routeId</th>
              <th className="p-2">ghgIntensity</th>
              <th className="p-2">% difference</th>
              <th className="p-2">compliant</th>
            </tr>
          </thead>
          <tbody>
            {data.comparisons.map(c => (
              <tr key={c.routeId} className="border-t">
                <td className="p-2">{c.routeId}</td>
                <td className="p-2">{c.ghgIntensity}</td>
                <td className="p-2">{c.percentDiff.toFixed(2)}%</td>
                <td className="p-2">{c.compliant ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="h-72 bg-white shadow rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="routeId" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="baseline" name="Baseline (gCO₂e/MJ)" />
            <Bar dataKey="comparison" name="Comparison (gCO₂e/MJ)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
