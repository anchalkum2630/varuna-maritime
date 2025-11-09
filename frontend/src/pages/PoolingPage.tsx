import { useEffect, useState } from "react";
import { fetchAdjustedCB, createPool } from "../services/api";

type Member = { shipId: string; cb: number };

export default function PoolingPage() {
  const [year, setYear] = useState(2024);
  const [members, setMembers] = useState<Member[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const load = async () => {
    try {
      const res = await fetchAdjustedCB(year);
      setMembers(res.adjusted.map((a: any) => ({ shipId: a.shipId, cb: a.cb })));
      setError("");
    } catch (e: any) {
      setMembers([]);
      setError("Could not load adjusted CB");
    }
  };

  useEffect(() => { load(); }, [year]);

  const sumBefore = members.reduce((s, m) => s + m.cb, 0);

  const validToCreate = sumBefore >= 0 && members.length > 0;

  const onCreatePool = async () => {
    if (!validToCreate) { setError("Pool invalid: sum(adjustedCB) must be >= 0"); return; }
    try {
      const res = await createPool({ year, members });
      setResult(res);
      setError("");
    } catch (e: any) {
      setError(e?.response?.data?.error || "Pool creation failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">Pooling (Article 21)</h2>

      <div className="bg-white p-4 shadow rounded space-y-3">
        <div className="flex gap-2 items-center">
          <input type="number" className="border p-2 w-32" value={year} onChange={e => setYear(Number(e.target.value))} />
          <button className="bg-gray-200 px-3 py-1 rounded" onClick={load}>Reload Adjusted CB</button>
          <div className={`px-3 py-1 rounded ${sumBefore >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            Pool sum: {Math.round(sumBefore)}
          </div>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr><th className="p-2">Ship</th><th className="p-2">cb_before</th></tr>
            </thead>
            <tbody>
              {members.map(m => <tr key={m.shipId} className="border-t"><td className="p-2">{m.shipId}</td><td className="p-2">{Math.round(m.cb)}</td></tr>)}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2">
          <button onClick={onCreatePool} disabled={!validToCreate} className={`px-3 py-1 rounded ${validToCreate ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>Create Pool</button>
        </div>

        {error && <div className="text-red-600">{error}</div>}

        {result && (
          <div className="bg-gray-100 p-3 rounded">
            <h3 className="font-semibold">Pool result</h3>
            <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
