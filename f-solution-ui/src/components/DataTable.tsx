import React from 'react';

interface DataTableProps {
  columns: string[];
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-slate-50/30 transition-colors">
                {Object.values(row).map((val: any, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 text-sm font-bold text-slate-700">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="p-12 text-center text-slate-400 font-bold">
          Chưa có dữ liệu để hiển thị.
        </div>
      )}
    </div>
  );
};

export default DataTable;
