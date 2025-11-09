import { allocatePool } from "../src/core/application/allocatePool";

interface Member {
  shipId: string;
  cb: number;
  cb_after?: number;
}

test("allocatePool simple two members works", () => {
  const members: Member[] = [
    { shipId: "A", cb: 100 },
    { shipId: "B", cb: -50 }
  ];

  const out = allocatePool(members);

  const a = out.find(o => o.shipId === "A")!;
  const b = out.find(o => o.shipId === "B")!;

  expect(a.cb_after).toBeGreaterThanOrEqual(0);
  expect(b.cb_after).toBe(0); // deficit covered exactly
});
