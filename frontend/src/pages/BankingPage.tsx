import { useState } from "react";
import { getBankRecords, bankCB, applyBank } from "../services/api";

export default function BankingPage() {
  const [shipId, setShipId] = useState("R002");
  const [year, setYear] = useState(2024);
  const [records, setRecords] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    setError(null);
    try {
      const res = await getBankRecords(shipId, year);
      setRecords(res);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch records");
    }
  };

  const handleBank = async () => {
    setError(null);
    try {
      await bankCB(shipId, year);
      await fetchRecords();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to bank CB");
    }
  };

  const handleApply = async () => {
    setError(null);
    if (!records.length) {
      setError("No records to apply");
      return;
    }

    const amount = Number(records[0].amount); // ensure number
    if (isNaN(amount)) {
      setError("Invalid amount in record");
      return;
    }

    try {
      await applyBank(shipId, year, amount);
      await fetchRecords();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to apply bank");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Banking</h2>

      <div className="flex gap-2 mb-2">
        <input
          value={shipId}
          onChange={(e) => setShipId(e.target.value)}
          placeholder="Ship ID"
          className="border px-2"
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          placeholder="Year"
          className="border px-2"
        />
        <button
          onClick={fetchRecords}
          className="bg-blue-500 text-white px-2 rounded"
        >
          Fetch Records
        </button>
      </div>

      <div className="flex gap-2 mb-2">
        <button
          onClick={handleBank}
          className="bg-green-500 text-white px-2 rounded"
        >
          Bank CB
        </button>
        <button
          onClick={handleApply}
          className="bg-yellow-500 text-white px-2 rounded"
        >
          Apply Bank
        </button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <ul>
        {records.map((r) => (
          <li key={r.id}>
            {r.shipId} - {r.year} - {r.amount} (Banked: {r.banked ?? 0})
          </li>
        ))}
      </ul>
    </div>
  );
}
