import { Router } from "express";
import { RouteRepository } from "../../outbound/mock/routeRepository";
import { computeCB } from "../../../core/application/computeCB";

const router = Router();
const repo = new RouteRepository();

// simple in-memory bank entries
const bankEntries: { id: number; shipId: string; year: number; amount: number }[] = [];
let bankIdCounter = 1;

router.get("/records", (req, res) => {
  const shipId = String(req.query.shipId || "");
  const year = Number(req.query.year || 0);
  const records = bankEntries.filter(b => (!shipId || b.shipId === shipId) && (!year || b.year === year));
  res.json(records);
});

// POST /banking/bank { shipId, year }
router.post("/bank", (req, res) => {
  const { shipId, year } = req.body;
  if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });
  const route = repo.find(shipId, Number(year));
  if (!route) return res.status(404).json({ error: "route not found" });
  const cb = computeCB(route.ghgIntensity, route.fuelConsumption);
  if (cb <= 0) return res.status(400).json({ error: "no positive CB to bank" });
  const entry = { id: bankIdCounter++, shipId, year: Number(year), amount: cb };
  bankEntries.push(entry);
  res.json({ cb_before: cb, applied: 0, cb_after: cb, entry });
});

// POST /banking/apply { shipId, year, amount }
router.post("/apply", (req, res) => {
  const { shipId, year, amount } = req.body;
  if (!shipId || !year || typeof amount !== "number") return res.status(400).json({ error: "shipId, year, amount required" });
  const available = bankEntries.filter(b => b.shipId === shipId && b.year === Number(year)).reduce((s, b) => s + b.amount, 0);
  if (amount > available) return res.status(400).json({ error: "amount > available banked" });
  // apply: reduce entries
  let rem = amount;
  for (let i = 0; i < bankEntries.length && rem > 0; i++) {
    const b = bankEntries[i];
    if (b.shipId === shipId && b.year === Number(year)) {
      const used = Math.min(b.amount, rem);
      b.amount -= used;
      rem -= used;
    }
  }
  // delete zero amounts
  for (let i = bankEntries.length - 1; i >= 0; i--) if (bankEntries[i].amount <= 0) bankEntries.splice(i, 1);
  res.json({ shipId, year, applied: amount, remainingBank: available - amount });
});

export default router;
