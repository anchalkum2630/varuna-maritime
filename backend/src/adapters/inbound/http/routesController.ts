import { Router } from "express";
import { RouteRepository } from "../../outbound/mock/routeRepository";
import { percentDiff, isCompliant } from "../../../core/application/compare";

const router = Router();
const repo = new RouteRepository();

router.get("/", (req, res) => {
  const data = repo.getAll();
  res.json(data);
});

router.post("/:routeId/baseline", (req, res) => {
  const { routeId } = req.params;
  const updated = repo.setBaseline(routeId);
  if (!updated) return res.status(404).json({ error: "route not found" });
  res.json({ message: "baseline set", baseline: updated });
});

router.get("/comparison", (req, res) => {
  const baseline = repo.getBaseline();
  if (!baseline) return res.status(400).json({ error: "no baseline set" });
  const comparisons = repo.getAll().filter(r => r.routeId !== baseline.routeId).map(r => ({
    routeId: r.routeId,
    vesselType: r.vesselType,
    fuelType: r.fuelType,
    year: r.year,
    ghgIntensity: r.ghgIntensity,
    percentDiff: Number(percentDiff(baseline.ghgIntensity, r.ghgIntensity).toFixed(4)),
    compliant: isCompliant(r.ghgIntensity)
  }));
  res.json({ baseline: { routeId: baseline.routeId, ghgIntensity: baseline.ghgIntensity }, comparisons });
});

export default router;
