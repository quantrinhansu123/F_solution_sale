import React from 'react';
import { 
  Megaphone, 
  Tag, 
  DraftingCompass, 
  Package, 
  Code, 
  Headphones, 
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity
} from 'lucide-react';

import type { DepartmentAllocation } from '../types';

interface DistributionTableProps {
  data: DepartmentAllocation[];
}

const DistributionTable: React.FC<DistributionTableProps> = ({ data }) => {
  const getIcon = (name: string) => {
    if (name.includes('Marketing')) return Megaphone;
    if (name.includes('Sale')) return Tag;
    if (name.includes('SA/BA')) return DraftingCompass;
    if (name.includes('Product')) return Package;
    if (name.includes('Dev')) return Code;
    return Headphones;
  };

  const getColor = (name: string) => {
    if (name.includes('Marketing')) return { color: 'text-blue-500', bg: 'bg-blue-50' };
    if (name.includes('Sale')) return { color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (name.includes('SA/BA')) return { color: 'text-amber-500', bg: 'bg-amber-50' };
    if (name.includes('Product')) return { color: 'text-purple-500', bg: 'bg-purple-50' };
    if (name.includes('Dev')) return { color: 'text-slate-500', bg: 'bg-slate-50' };
    return { color: 'text-rose-500', bg: 'bg-rose-50' };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full text-[13px]">
      <div className="px-5 py-4 flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-900 tracking-tight">Distribution Breakdown</h3>
        <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:opacity-70 transition-opacity">
          <Download size={12} strokeWidth={3} />
          EXPORT
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-y border-slate-100">
              <th className="px-5 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
              <th className="px-5 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Percentage</th>
              <th className="px-5 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Estimated Amount</th>
              <th className="px-5 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((dept, idx) => {
              const Icon = getIcon(dept.name);
              const colors = getColor(dept.name);
              const trend = dept.actualSpent > dept.estimatedAmount ? 'up' : dept.actualSpent < dept.estimatedAmount ? 'down' : 'neutral';

              return (
                <tr key={idx} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center ${colors.color} transition-transform group-hover:scale-105 duration-300`}>
                        <Icon size={16} strokeWidth={2.5} />
                      </div>
                      <span className="font-bold text-slate-900">{dept.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-2.5 text-center">
                    <span className="font-bold text-slate-500">{dept.percentage}%</span>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <span className="font-black text-slate-900">
                      {Math.round(dept.estimatedAmount).toLocaleString('vi-VN')} ₫
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <div className="flex justify-end">
                      {trend === 'up' && <TrendingUp size={16} className="text-emerald-500" strokeWidth={3} />}
                      {trend === 'down' && <TrendingDown size={16} className="text-rose-500" strokeWidth={3} />}
                      {trend === 'neutral' && <Minus size={16} className="text-slate-300" strokeWidth={3} />}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistributionTable;
