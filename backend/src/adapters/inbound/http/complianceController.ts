import { Router } from "express";
import { ComplianceRepository } from "../../outbound/postgres/complianceRepo";

const router = Router();
const repo = new ComplianceRepository();

// GET /compliance/cb?shipId=R002&year=2024
router.get("/cb", async (req, res) => {
  const shipId = String(req.query.shipId || "");
  const year = Number(req.query.year || 0);
  if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });

  const result = await repo.getCB(shipId, year);
  if (!result) return res.status(404).json({ error: "ship not found" });

  res.json(result);
});

// GET /compliance/adjusted-cb?shipId=R002&year=2024
router.get("/adjusted-cb", async (req, res) => {
  const shipId = String(req.query.shipId || "");
  const year = Number(req.query.year || 0);
  if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });

  const adjusted = await repo.getAdjustedCB(shipId, year);
  res.json({ shipId, year, adjusted });
});

export default router;
