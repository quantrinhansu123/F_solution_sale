import React from 'react';
import { UserPlus, Presentation, FileCheck, TrendingUp, Users, Target } from 'lucide-react';
import StatCard from '../StatCard';

const CRMOverview: React.FC = () => {
  const stats = [
    {
      label: 'Tổng Lead tháng này',
      value: '128',
      subValue: '84 Qualified',
      trend: '65% Qualified',
      icon: UserPlus,
      color: 'bg-blue-500'
    },
    {
      label: 'Số ca Demo đã thực hiện',
      value: '42',
      subValue: '2.100.000 ₫',
      trend: '50k / ca',
      icon: Presentation,
      color: 'bg-purple-500'
    },
    {
      label: 'Giá trị Hợp đồng dự kiến',
      value: '6.200.000 ₫',
      subValue: 'Based on 20M revenue',
      trend: '31% Fund',
      icon: FileCheck,
      color: 'bg-green-500',
      variant: 'dark' as const
    }
  ];

  const funnelData = [
    { step: 'Leads', value: 128, color: 'bg-blue-500/10', textColor: 'text-blue-600', width: 'w-full' },
    { step: 'Qualified', value: 84, color: 'bg-indigo-500/10', textColor: 'text-indigo-600', width: 'w-[80%]' },
    { step: 'Demo', value: 42, color: 'bg-purple-500/10', textColor: 'text-purple-600', width: 'w-[60%]' },
    { step: 'Chốt Hợp đồng', value: 12, color: 'bg-emerald-500/10', textColor: 'text-emerald-600', width: 'w-[40%]' },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Sales Funnel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Phễu bán hàng (Sales Funnel)</h3>
            <p className="text-sm text-slate-500">Tỉ lệ chuyển đổi qua từng giai đoạn</p>
          </div>
          <Target className="text-slate-400" size={24} />
        </div>

        <div className="flex flex-col items-center space-y-2">
          {funnelData.map((item, index) => (
            <div key={index} className="w-full flex flex-col items-center">
              <div 
                className={`${item.width} ${item.color} rounded-xl p-4 flex items-center justify-between border border-white/50 backdrop-blur-sm transition-all hover:scale-[1.02] cursor-default`}
              >
                <span className={`font-bold ${item.textColor}`}>{item.step}</span>
                <div className="flex items-center gap-4">
                  <span className="text-slate-900 font-black text-xl">{item.value}</span>
                  {index > 0 && (
                    <span className="text-xs font-bold bg-white/50 px-2 py-1 rounded-lg text-slate-500">
                      {Math.round((item.value / funnelData[index - 1].value) * 100)}%
                    </span>
                  )}
                </div>
              </div>
              {index < funnelData.length - 1 && (
                <div className="h-4 w-px bg-slate-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CRMOverview;
