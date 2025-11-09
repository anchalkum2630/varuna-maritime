import { db } from "../../../infrastructure/db";
import { allocatePool } from "../../../core/application/allocatePool";

export class PoolRepository {
  async createPool(year: number, members: { shipId: string; cb: number }[]) {
    const sum = members.reduce((s, m) => s + m.cb, 0);
    if (sum < 0) throw new Error("Total pool CB must be >= 0");

    const { rows } = await db.query("INSERT INTO pools(year) VALUES($1) RETURNING id, created_at", [year]);
    const poolId = rows[0].id;

    const allocated = allocatePool(members);

    for (const m of allocated) {
      await db.query(
        "INSERT INTO pool_members(pool_id, ship_id, cb_before, cb_after) VALUES($1,$2,$3,$4)",
        [poolId, m.shipId, m.cb_before, m.cb_after]
      );
    }

    return { poolId, year, members: allocated };
  }
}
