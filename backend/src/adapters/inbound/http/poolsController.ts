import { Router } from "express";
import { PoolRepository } from "../../outbound/postgres/poolRepo";

const router = Router();
const repo = new PoolRepository();

router.post("/", async (req, res) => {
  const { year, members } = req.body;
  if (!Array.isArray(members)) return res.status(400).json({ error: "members array required" });

  try {
    const pool = await repo.createPool(year, members);
    res.json(pool);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
