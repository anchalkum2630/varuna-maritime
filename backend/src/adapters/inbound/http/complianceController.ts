import { Router } from "express";
import { RouteRepository } from "../../outbound/mock/routeRepository";
import { computeCB } from "../../../core/application/computeCB";

const router = Router();
const repo = new RouteRepository();

// GET /compliance/cb?shipId=R002&year=2024
router.get("/cb", (req, res) => {
  const shipId = String(req.query.shipId || "");
  const year = Number(req.query.year || 0) || undefined;
  if (!shipId) return res.status(400).json({ error: "shipId required" });
  const route = repo.find(shipId, year);
  if (!route) return res.status(404).json({ error: "route not found" });
  const cb = computeCB(route.ghgIntensity, route.fuelConsumption);
  res.json({ shipId: route.routeId, year: route.year, cb });
});

// GET /compliance/adjusted-cb?year=2024
router.get("/adjusted-cb", (req, res) => {
  const year = Number(req.query.year || 0);
  const list = repo.getAll().filter(r => r.year === year).map(r => ({ shipId: r.routeId, cb: computeCB(r.ghgIntensity, r.fuelConsumption) }));
  res.json({ year, adjusted: list });
});

export default router;
