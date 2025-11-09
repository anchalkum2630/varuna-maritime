import { TARGET } from "../../shared/config";

export function percentDiff(baseline: number, comparison: number): number {
  return ((comparison / baseline) - 1) * 100;
}

export function isCompliant(ghgIntensity: number): boolean {
  return ghgIntensity <= TARGET;
}
