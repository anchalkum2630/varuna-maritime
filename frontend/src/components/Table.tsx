type TableProps = {
  headers: string[];
  data: any[];
};

export default function Table({ headers, data }: TableProps) {
  return (
    <table className="min-w-full border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          {headers.map((h) => (
            <th key={h} className="border px-2 py-1">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            {headers.map((h) => (
              <td key={h} className="border px-2 py-1">
                {String(row[h] ?? row[h.toLowerCase()])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
