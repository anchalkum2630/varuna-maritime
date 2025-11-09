import React from "react";

export default function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="table-card p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          {children}
        </table>
      </div>
    </div>
  );
}
