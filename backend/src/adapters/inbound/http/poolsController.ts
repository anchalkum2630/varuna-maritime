import { Router } from "express";
import { allocatePool } from "../../../core/application/allocatePool";

const router = Router();

// POST /pools  { year, members: [{shipId, cb}] }
router.post("/", (req, res) => {
  const { year, members } = req.body;
  if (!Array.isArray(members)) return res.status(400).json({ error: "members array required" });
  try {
    const output = allocatePool(members);
    const sumBefore = members.reduce((s: number, m: any) => s + m.cb, 0);
    const sumAfter = output.reduce((s: number, m: any) => s + m.cb_after, 0);
    res.json({ year, poolSumBefore: sumBefore, poolSumAfter: sumAfter, members: output });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
