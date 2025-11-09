import { MJ_PER_T, TARGET } from "../../shared/config";

export function computeCB(ghgIntensity: number, fuelT: number): number {
  const energy = fuelT * MJ_PER_T;
  const cb = (TARGET - ghgIntensity) * energy;
  return Math.round(cb * 100) / 100;
}
