import { allocatePool } from "../core/application/allocatePool";

test("allocatePool simple two members works", () => {
  const members = [{ shipId: "A", cb: 100 }, { shipId: "B", cb: -50 }];
  const out = allocatePool(members as any);
  const a = out.find(o => o.shipId === "A")!;
  const b = out.find(o => o.shipId === "B")!;
  expect(a.cb_after).toBeGreaterThanOrEqual(0);
  expect(b.cb_after).toBe(0); // deficit covered exactly
});
