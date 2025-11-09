import { computeCB } from "../src/core/application/computeCB";

test("computeCB positive for R002 values", () => {
  const cb = computeCB(88.0, 4800);
  expect(typeof cb).toBe("number");
  expect(cb).toBeGreaterThan(0);
});
