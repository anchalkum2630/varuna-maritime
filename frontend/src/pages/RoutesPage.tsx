import { useEffect, useMemo, useState } from "react";
import { fetchRoutes, postSetBaseline } from "../services/api";
import type { Route } from "../types";
import Table from "../components/Table";

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ vesselType: "", fuelType: "", year: "" });

  useEffect(() => {
    setLoading(true);
    fetchRoutes().then(data => setRoutes(data)).finally(() => setLoading(false));
  }, []);

  const vesselOptions = useMemo(() => Array.from(new Set(routes.map(r => r.vesselType))), [routes]);
  const fuelOptions = useMemo(() => Array.from(new Set(routes.map(r => r.fuelType))), [routes]);
  const yearOptions = useMemo(() => Array.from(new Set(routes.map(r => String(r.year)))), [routes]);

  const filtered = routes.filter(r =>
    (filters.vesselType ? r.vesselType === filters.vesselType : true) &&
    (filters.fuelType ? r.fuelType === filters.fuelType : true) &&
    (filters.year ? String(r.year) === filters.year : true)
  );

  const onSetBaseline = async (routeId: string) => {
    await postSetBaseline(routeId);
    const updated = await fetchRoutes();
    setRoutes(updated);
    alert("Baseline set.");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">Routes</h2>

      <div className="flex gap-2">
        <select className="p-2 border rounded" value={filters.vesselType} onChange={e => setFilters(f => ({ ...f, vesselType: e.target.value }))}>
          <option value="">All Vessels</option>
          {vesselOptions.map(v => <option key={v} value={v}>{v}</option>)}
        </select>

        <select className="p-2 border rounded" value={filters.fuelType} onChange={e => setFilters(f => ({ ...f, fuelType: e.target.value }))}>
          <option value="">All Fuels</option>
          {fuelOptions.map(v => <option key={v} value={v}>{v}</option>)}
        </select>

        <select className="p-2 border rounded" value={filters.year} onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}>
          <option value="">All Years</option>
          {yearOptions.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      {loading ? <div>Loading...</div> : (
        <Table>
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">routeId</th>
              <th className="p-2">vesselType</th>
              <th className="p-2">fuelType</th>
              <th className="p-2">year</th>
              <th className="p-2">ghgIntensity</th>
              <th className="p-2">fuelConsumption (t)</th>
              <th className="p-2">distance (km)</th>
              <th className="p-2">totalEmissions (t)</th>
              <th className="p-2">baseline</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.routeId} className="border-t">
                <td className="p-2">{r.routeId}</td>
                <td className="p-2">{r.vesselType}</td>
                <td className="p-2">{r.fuelType}</td>
                <td className="p-2">{r.year}</td>
                <td className="p-2">{r.ghgIntensity}</td>
                <td className="p-2">{r.fuelConsumption}</td>
                <td className="p-2">{r.distance}</td>
                <td className="p-2">{r.totalEmissions}</td>
                <td className="p-2">
                  {r.isBaseline ? <span className="text-green-600 font-semibold">Baseline</span> :
                    <button onClick={() => onSetBaseline(r.routeId)} className="px-2 py-1 bg-blue-600 text-white rounded">Set Baseline</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
