import { db } from "../../../infrastructure/db";
import { computeCB } from "../../../core/application/computeCB";

export class BankingRepository {
  async getBankRecords(shipId?: string, year?: number) {
    const query = "SELECT * FROM bank_entries WHERE ($1::text IS NULL OR ship_id=$1) AND ($2::int IS NULL OR year=$2)";
    const { rows } = await db.query(query, [shipId || null, year || null]);
    return rows;
  }

  async bankCB(shipId: string, year: number, cbAmount: number) {
    const { rows } = await db.query(
      "INSERT INTO bank_entries(ship_id, year, amount_gco2eq) VALUES($1,$2,$3) RETURNING *",
      [shipId, year, cbAmount]
    );
    return rows[0];
  }

  async applyBank(shipId: string, year: number, amount: number) {
    // Fetch available
    const { rows } = await db.query(
      "SELECT id, amount_gco2eq FROM bank_entries WHERE ship_id=$1 AND year=$2 ORDER BY id",
      [shipId, year]
    );
    let rem = amount;
    const appliedIds: number[] = [];

    for (const row of rows) {
      if (rem <= 0) break;
      const use = Math.min(rem, row.amount_gco2eq);
      await db.query("UPDATE bank_entries SET amount_gco2eq=amount_gco2eq-$1 WHERE id=$2", [use, row.id]);
      rem -= use;
      appliedIds.push(row.id);
    }
    return { shipId, year, applied: amount, remainingBank: rem };
  }

  async getAvailableBank(shipId: string, year: number) {
    const { rows } = await db.query(
      "SELECT SUM(amount_gco2eq) as total FROM bank_entries WHERE ship_id=$1 AND year=$2",
      [shipId, year]
    );
    return rows[0]?.total || 0;
  }
}
