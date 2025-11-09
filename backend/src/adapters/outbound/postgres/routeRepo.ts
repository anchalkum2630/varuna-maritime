import { db } from "../../../infrastructure/db";

export type Route = {
  route_id: string;
  vessel_type: string;
  fuel_type: string;
  year: number;
  ghg_intensity: number;
  fuel_consumption: number;
  distance: number;
  total_emissions: number;
  is_baseline: boolean;
};

export class RouteRepository {
  async getAll(): Promise<Route[]> {
    const { rows } = await db.query("SELECT * FROM routes ORDER BY route_id");
    return rows;
  }

  async find(routeId: string, year?: number): Promise<Route | null> {
    const { rows } = await db.query(
      "SELECT * FROM routes WHERE route_id = $1" + (year ? " AND year=$2" : ""),
      year ? [routeId, year] : [routeId]
    );
    return rows[0] || null;
  }

  async setBaseline(routeId: string): Promise<Route | null> {
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      await client.query("UPDATE routes SET is_baseline=false");
      const { rows } = await client.query("UPDATE routes SET is_baseline=true WHERE route_id=$1 RETURNING *", [routeId]);
      await client.query("COMMIT");
      return rows[0] || null;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  async getBaseline(): Promise<Route | null> {
    const { rows } = await db.query("SELECT * FROM routes WHERE is_baseline=true LIMIT 1");
    return rows[0] || null;
  }
}
