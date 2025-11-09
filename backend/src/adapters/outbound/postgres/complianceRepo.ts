import { db } from "../../../infrastructure/db";
import { computeCB } from "../../../core/application/computeCB";

export class ComplianceRepository {
  async getCB(shipId: string, year: number) {
    // Compute CB for a ship & year
    const { rows: routeRows } = await db.query(
      "SELECT * FROM routes WHERE route_id=$1 AND year=$2",
      [shipId, year]
    );
    const route = routeRows[0];
    if (!route) return null;

    const cb = computeCB(route.ghg_intensity, route.fuel_consumption);

    // Store snapshot in ship_compliance
    await db.query(
      "INSERT INTO ship_compliance(ship_id, year, cb_gco2eq) VALUES($1,$2,$3) ON CONFLICT (ship_id,year) DO UPDATE SET cb_gco2eq=$3",
      [shipId, year, cb]
    );

    return { shipId, year, cb };
  }

  async getAdjustedCB(shipId: string, year: number) {
    const { rows } = await db.query(
      "SELECT cb_gco2eq FROM ship_compliance WHERE ship_id=$1 AND year=$2",
      [shipId, year]
    );
    const cb = rows[0]?.cb_gco2eq || 0;

    // Subtract any applied banking
    const { rows: bankRows } = await db.query(
      "SELECT SUM(amount_gco2eq) as applied FROM bank_entries WHERE ship_id=$1 AND year=$2",
      [shipId, year]
    );
    const applied = bankRows[0]?.applied || 0;
    return cb - applied;
  }
}
