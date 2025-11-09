import { MJ_PER_T, TARGET } from "../../infrastructure/config";

export function computeCB(ghgIntensity: number, fuelT: number): number {
  const energy = fuelT * MJ_PER_T; // MJ
  const cb = (TARGET - ghgIntensity) * energy; // gCO2e
  return Math.round(cb * 100) / 100;
}
