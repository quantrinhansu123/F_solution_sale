import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const AllocationChart: React.FC = () => {
  const data = [
    { name: 'Production', value: 45, color: '#0F172A' },
    { name: 'Growth', value: 34.5, color: '#10B981' },
    { name: 'Operations', value: 20.5, color: '#94A3B8' },
  ];

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 flex flex-col h-full">
      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Fund Allocation</h3>
      
      <div className="flex-1 relative min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={450}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-black text-slate-900 leading-none">60%</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Split</span>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-bold text-slate-500">
                {item.name} {item.name === 'Production' ? '(Dev/SA)' : item.name === 'Growth' ? '(Sale/Mkt)' : '(CS/Others)'}
              </span>
            </div>
            <span className="text-base font-black text-slate-900">{item.value}%</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
          This distribution is calculated based on the <span className="text-slate-900 font-black">60% Net Allocation</span> policy approved for the 2026 fiscal cycle.
        </p>
      </div>
    </div>
  );
};

export default AllocationChart;
