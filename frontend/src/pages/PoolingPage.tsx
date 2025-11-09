import { useState } from "react";
import { createPool } from "../services/api";
import type { PoolMember } from "../types";

export default function PoolingPage() {
  const [year, setYear] = useState(2024);
  const [members, setMembers] = useState<PoolMember[]>([
    { shipId: "R002", cb: 100 },
    { shipId: "R003", cb: -50 },
  ]);
  const [result, setResult] = useState<any>(null);

  const handleCreatePool = async () => {
    const res = await createPool(year, members);
    setResult(res);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pooling</h2>
      <div className="mb-2 flex gap-2">
        <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="border px-2"/>
        <button onClick={handleCreatePool} className="bg-green-500 text-white px-3 rounded">Create Pool</button>
      </div>
      <h3>Members</h3>
      <ul>
        {members.map(m => <li key={m.shipId}>{m.shipId} - CB: {m.cb}</li>)}
      </ul>
      {result && (
        <>
          <h3 className="mt-2 font-semibold">Result</h3>
          <ul>
            {result.members.map((m: any) => (
              <li key={m.shipId}>{m.shipId}: before={m.cb_before}, after={m.cb_after}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
