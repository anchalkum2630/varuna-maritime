import { Router } from "express";
import { BankingRepository } from "../../outbound/postgres/bankingRepo";
import { RouteRepository } from "../../outbound/postgres/routeRepo";
import { computeCB } from "../../../core/application/computeCB";

const router = Router();
const repo = new BankingRepository();
const routeRepo = new RouteRepository();

// GET /banking/records
router.get("/records", async (req, res) => {
  const shipId = String(req.query.shipId || "");
  const year = req.query.year ? Number(req.query.year) : undefined;

  if (!shipId) return res.status(400).json({ error: "shipId required" });
  if (year !== undefined && isNaN(year)) return res.status(400).json({ error: "invalid year" });

  const data = await repo.getBankRecords(shipId, year);
  res.json(data);
});

// POST /banking/bank
router.post("/bank", async (req, res) => {
  const { shipId, year } = req.body;
  if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });

  const route = await routeRepo.find(shipId, year);
  if (!route) return res.status(404).json({ error: "route not found" });

  const cb = computeCB(route.ghg_intensity, route.fuel_consumption);
  if (cb <= 0) return res.status(400).json({ error: "no positive CB to bank" });

  const entry = await repo.bankCB(shipId, year, cb);
  res.json({ cb_before: cb, applied: 0, cb_after: cb, entry });
});

// POST /banking/apply
router.post("/apply", async (req, res) => {
  const { shipId, year, amount } = req.body;
  if (!shipId || !year || typeof amount !== "number") return res.status(400).json({ error: "shipId, year, amount required" });

  const available = await repo.getAvailableBank(shipId, year);
  if (amount > available) return res.status(400).json({ error: "amount > available banked" });

  const result = await repo.applyBank(shipId, year, amount);
  res.json(result);
});

export default router;
