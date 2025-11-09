import { useEffect, useState } from "react";
import { getComparison } from "../services/api";
import Table from "../components/Table";

export default function ComparePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchCompare();
  }, []);

  const fetchCompare = async () => {
    const res = await getComparison();
    setData(res);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Compare</h2>
      {data ? (
        <>
          <h3 className="font-semibold">Baseline: {data.baseline.routeId} ({data.baseline.ghgIntensity} gCO2e/MJ)</h3>
          <Table
            headers={["routeId","vesselType","fuelType","year","ghgIntensity","percentDiff","compliant"]}
            data={data.comparisons}
          />
        </>
      ) : <p>Loading...</p>}
    </div>
  );
}
