import React, { useState, useEffect, useMemo } from 'react';
import { UserPlus, Presentation, FileCheck, Target, Loader2 } from 'lucide-react';
import StatCard from '../StatCard';
import { fetchCRMOverview } from '../../utils/crm';
import { formatVnd } from '../../utils/formatVnd';
import type { CRMStats } from '../../types';

const CRMOverview: React.FC = () => {
  const [data, setData] = useState<CRMStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCRMOverview().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    if (!data) return [];
    return [
      {
        label: 'Tổng Lead tháng này',
        value: data.leads.total.toString(),
        subValue: `${data.leads.qualified} Qualified`,
        trend: `${data.leads.rate.toFixed(1)}% Qualified`,
        icon: UserPlus,
        color: 'bg-blue-500'
      },
      {
        label: 'Số ca Demo đã thực hiện',
        value: data.demos.count.toString(),
        subValue: formatVnd(data.demos.bonus),
        trend: '50k / ca',
        icon: Presentation,
        color: 'bg-purple-500'
      },
      {
        label: 'Giá trị Hợp đồng dự kiến',
        value: formatVnd(Math.round(data.contracts.totalValue)),
        subValue: `31% Fund: ${formatVnd(Math.round(data.contracts.fund31))}`,
        trend: '31% Fund',
        icon: FileCheck,
        color: 'bg-green-500',
        variant: 'dark' as const
      }
    ];
  }, [data]);

  const funnelColors = [
    { color: 'bg-blue-500/10', textColor: 'text-blue-600', width: 'w-full' },
    { color: 'bg-indigo-500/10', textColor: 'text-indigo-600', width: 'w-[85%]' },
    { color: 'bg-purple-500/10', textColor: 'text-purple-600', width: 'w-[70%]' },
    { color: 'bg-emerald-500/10', textColor: 'text-emerald-600', width: 'w-[55%]' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đang tải báo cáo CRM...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[13px]">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Sales Funnel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Phễu bán hàng (Sales Funnel)</h3>
            <p className="text-[11px] text-slate-500">Tỉ lệ chuyển đổi qua từng giai đoạn tháng này</p>
          </div>
          <Target className="text-slate-400" size={20} />
        </div>

        <div className="flex flex-col items-center space-y-1.5">
          {data?.funnel.map((item, index) => (
            <div key={index} className="w-full flex flex-col items-center">
              <div 
                className={`${funnelColors[index].width} ${funnelColors[index].color} rounded-lg p-2.5 flex items-center justify-between border border-white/50 transition-all hover:scale-[1.01] cursor-default`}
              >
                <span className={`font-bold ${funnelColors[index].textColor} text-[12px]`}>{item.stage}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-900 font-black text-base">{item.value}</span>
                  {index > 0 && (
                    <span className="text-[10px] font-bold bg-white/50 px-1.5 py-0.5 rounded text-slate-500">
                      {item.rate.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              {index < data.funnel.length - 1 && (
                <div className="h-2 w-px bg-slate-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CRMOverview;
