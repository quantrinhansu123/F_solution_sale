import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import type { DepartmentAllocation } from '../types';

interface AllocationChartProps {
  breakdown: DepartmentAllocation[];
}

const AllocationChart: React.FC<AllocationChartProps> = ({ breakdown }) => {
  // Chuẩn bị dữ liệu cho biểu đồ từ mảng breakdown thật
  const chartData = breakdown.map(dept => ({
    name: dept.name,
    value: dept.percentage,
    color: dept.name.includes('Dev') ? '#0F172A' : 
           dept.name.includes('Sale') ? '#10B981' : 
           dept.name.includes('Product') ? '#8B5CF6' : '#94A3B8'
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col h-full text-[13px]">
      <h3 className="text-base font-bold text-slate-900 tracking-tight mb-6">Phân bổ Quỹ (Fund)</h3>
      
      <div className="flex-1 relative min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={450}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-slate-900 leading-none">60%</span>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Total Split</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between group">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[12px] font-bold text-slate-500">
                {item.name}
              </span>
            </div>
            <span className="text-[14px] font-black text-slate-900">{item.value.toFixed(1)}%</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-slate-50 mt-6">
        <p className="text-[10px] text-slate-400 font-bold leading-normal">
          Dựa trên chính sách <span className="text-slate-900 font-black">60% Net Allocation</span> năm 2026.
        </p>
      </div>
    </div>
  );
};

export default AllocationChart;
