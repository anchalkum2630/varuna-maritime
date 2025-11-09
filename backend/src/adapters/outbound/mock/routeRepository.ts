import fs from "fs";
import path from "path";

const dataPath = path.resolve(__dirname, "../../../infrastructure/seed/routes.json");

export type Route = {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline?: boolean;
};

let routesCache: Route[] = [];

function load() {
  if (routesCache.length === 0) {
    const raw = fs.readFileSync(dataPath, "utf-8");
    routesCache = JSON.parse(raw) as Route[];
  }
  return routesCache;
}

function persist() {
  fs.writeFileSync(dataPath, JSON.stringify(routesCache, null, 2));
}

export class RouteRepository {
  getAll(): Route[] {
    return load();
  }

  find(routeId: string, year?: number): Route | undefined {
    const all = load();
    return all.find(r => r.routeId === routeId && (year ? r.year === year : true));
  }

  setBaseline(routeId: string): Route | null {
    const all = load();
    let found: Route | null = null;
    routesCache = all.map(r => {
      if (r.routeId === routeId) {
        found = { ...r, isBaseline: true };
        return found;
      }
      return { ...r, isBaseline: false };
    });
    persist();
    return found;
  }

  getBaseline(): Route | undefined {
    const all = load();
    return all.find(r => r.isBaseline);
  }
}
