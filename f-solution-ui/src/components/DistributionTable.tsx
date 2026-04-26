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

const DistributionTable: React.FC = () => {
  const departments = [
    { name: 'Marketing', percentage: '2.5%', amount: '300,000', trend: 'up', icon: Megaphone, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Sale', percentage: '32%', amount: '3,840,000', trend: 'up', icon: Tag, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { name: 'SA/BA', percentage: '8%', amount: '960,000', trend: 'neutral', icon: DraftingCompass, color: 'text-amber-500', bg: 'bg-amber-50' },
    { name: 'Product', percentage: '12%', amount: '1,440,000', trend: 'up', icon: Package, color: 'text-purple-500', bg: 'bg-purple-50' },
    { name: 'Dev', percentage: '37%', amount: '4,440,000', trend: 'zigzag', icon: Code, color: 'text-slate-500', bg: 'bg-slate-50' },
    { name: 'CS', percentage: '10%', amount: '1,200,000', trend: 'down', icon: Headphones, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

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
            {departments.map((dept, idx) => (
              <tr key={idx} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${dept.bg} flex items-center justify-center ${dept.color} transition-transform group-hover:scale-105 duration-300`}>
                      <dept.icon size={16} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-slate-900">{dept.name}</span>
                  </div>
                </td>
                <td className="px-5 py-2.5 text-center">
                  <span className="font-bold text-slate-500">{dept.percentage}</span>
                </td>
                <td className="px-5 py-2.5 text-right">
                  <span className="font-black text-slate-900">{dept.amount}</span>
                </td>
                <td className="px-5 py-2.5 text-right">
                  <div className="flex justify-end">
                    {dept.trend === 'up' && <TrendingUp size={16} className="text-emerald-500" strokeWidth={3} />}
                    {dept.trend === 'down' && <TrendingDown size={16} className="text-rose-500" strokeWidth={3} />}
                    {dept.trend === 'neutral' && <Minus size={16} className="text-slate-300" strokeWidth={3} />}
                    {dept.trend === 'zigzag' && <Activity size={16} className="text-emerald-500/50" strokeWidth={3} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistributionTable;
