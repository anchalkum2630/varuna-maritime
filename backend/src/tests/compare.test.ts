import { percentDiff } from "../core/application/compare";

test("percentDiff formula", () => {
  const p = percentDiff(91, 88);
  // manual: (88/91 -1)*100 ≈ -3.2967
  expect(p).toBeCloseTo(-3.2967, 3);
});
