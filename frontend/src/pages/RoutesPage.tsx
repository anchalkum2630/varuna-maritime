import { useEffect, useState } from "react";
import { getRoutes, setBaseline } from "../services/api";
import Table from "../components/Table";

interface RouteData {
  id: number;
  route_id: string;
  vessel_type: string;
  fuel_type: string;
  year: number;
  ghg_intensity: string;
  fuel_consumption: string;
  distance: string;
  total_emissions: string;
  is_baseline: boolean;
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const data = await getRoutes();
      setRoutes(data);
    } catch (err) {
      console.error("Failed to fetch routes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBaseline = async (routeId: string) => {
    try {
      await setBaseline(routeId);
      fetchRoutes();
    } catch (err) {
      console.error("Failed to set baseline:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Routes</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table
            headers={[
              "route_id",
              "vessel_type",
              "fuel_type",
              "year",
              "ghg_intensity",
              "fuel_consumption",
              "distance",
              "total_emissions",
              "is_baseline",
            ]}
            data={routes}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {routes.map((r) => (
              <button
                key={r.route_id}
                onClick={() => handleBaseline(r.route_id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Set {r.route_id} as Baseline
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
