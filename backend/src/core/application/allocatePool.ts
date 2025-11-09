export type Member = { shipId: string; cb: number };

export function allocatePool(members: Member[]): { shipId: string; cb_before: number; cb_after: number }[] {
  const sum = members.reduce((s, m) => s + m.cb, 0);
  if (sum < 0) throw new Error("Pool sum must be >= 0");

  const out = members.map(m => ({ ...m, cb_after: m.cb }));
  const surplus = out.filter(m => m.cb_after > 0).sort((a, b) => b.cb_after - a.cb_after);
  const deficit = out.filter(m => m.cb_after < 0).sort((a, b) => a.cb_after - b.cb_after); // most negative first

  for (const d of deficit) {
    let need = -d.cb_after;
    for (const s of surplus) {
      if (s.cb_after <= 0) continue;
      const transfer = Math.min(s.cb_after, need);
      s.cb_after -= transfer;
      d.cb_after += transfer;
      need -= transfer;
      if (need <= 0) break;
    }
  }

  return out.map(o => ({ shipId: o.shipId, cb_before: members.find(m => m.shipId === o.shipId)!.cb, cb_after: o.cb_after }));
}
