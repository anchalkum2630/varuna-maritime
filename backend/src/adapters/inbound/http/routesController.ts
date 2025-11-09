import { Router } from "express";
import { RouteRepository } from "../../outbound/postgres/routeRepo";
import { percentDiff, isCompliant } from "../../../core/application/compare";

const router = Router();
const repo = new RouteRepository();

router.get("/", async (_, res) => {
  const data = await repo.getAll();
  res.json(data);
});

router.post("/:routeId/baseline", async (req, res) => {
  const { routeId } = req.params;
  const updated = await repo.setBaseline(routeId);
  if (!updated) return res.status(404).json({ error: "route not found" });
  res.json({ message: "baseline set", baseline: updated });
});

router.get("/comparison", async (_, res) => {
  const baseline = await repo.getBaseline();
  if (!baseline) return res.status(400).json({ error: "no baseline set" });

  const comparisons = (await repo.getAll())
    .filter(r => r.route_id !== baseline.route_id)
    .map(r => ({
      routeId: r.route_id,
      vesselType: r.vessel_type,
      fuelType: r.fuel_type,
      year: r.year,
      ghgIntensity: r.ghg_intensity,
      percentDiff: Number(percentDiff(baseline.ghg_intensity, r.ghg_intensity).toFixed(4)),
      compliant: isCompliant(r.ghg_intensity)
    }));
  res.json({ baseline: { routeId: baseline.route_id, ghgIntensity: baseline.ghg_intensity }, comparisons });
});

export default router;
