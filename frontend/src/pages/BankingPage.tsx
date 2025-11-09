import { useEffect, useState } from "react";
import { fetchCB, bankSurplus, applyBank } from "../services/api";

export default function BankingPage() {
  const [shipId, setShipId] = useState("R002");
  const [year, setYear] = useState(2024);
  const [cb, setCb] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  const getCB = async () => {
    try {
      const res = await fetchCB(shipId, year);
      setCb(res.cb ?? null);
      setMessage("");
    } catch (err: any) {
      setCb(null);
      setMessage(err?.response?.data?.error || "Error fetching CB");
    }
  };

  useEffect(() => { getCB(); }, []);

  const onBank = async () => {
    if (!cb || cb <= 0) { setMessage("No positive CB to bank"); return; }
    try {
      const res = await bankSurplus({ shipId, year });
      setMessage(`Banked: ${res.cb_after}`);
      getCB();
    } catch (err: any) {
      setMessage(err?.response?.data?.error || "Error banking");
    }
  };

  const onApply = async () => {
    if (!cb) { setMessage("Fetch CB first"); return; }
    try {
      const amount = cb; // applying full CB (demo). Adjust UI if you want partial apply.
      const res = await applyBank({ shipId, year, amount });
      setMessage(`Applied: ${res.applied}`);
      getCB();
    } catch (err: any) {
      setMessage(err?.response?.data?.error || "Error applying bank");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">Banking (Article 20)</h2>

      <div className="bg-white p-4 shadow rounded">
        <div className="flex gap-2 items-center mb-3">
          <input className="border p-2" value={shipId} onChange={e => setShipId(e.target.value)} />
          <input type="number" className="border p-2 w-28" value={year} onChange={e => setYear(Number(e.target.value))} />
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={getCB}>Get CB</button>
        </div>

        <div className="mb-3">CB: <strong>{cb !== null ? cb.toLocaleString() : "-"}</strong></div>

        <div className="flex gap-2">
          <button onClick={onBank} className="bg-green-600 text-white px-3 py-1 rounded">Bank (bank positive CB)</button>
          <button onClick={onApply} className="bg-orange-600 text-white px-3 py-1 rounded">Apply banked to deficit</button>
        </div>

        {message && <div className="mt-3 text-sm text-red-600">{message}</div>}
      </div>
    </div>
  );
}
