import React, { useState, useMemo, useEffect } from 'react';
import StatCard from '../components/StatCard';
import DistributionTable from '../components/DistributionTable';
import AllocationChart from '../components/AllocationChart';
import { BarChart, TrendingUp, Users, Wallet } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { fetchProjectFinancials } from '../utils/finance';
import { formatVnd } from '../utils/formatVnd';
import type { FinancialData } from '../types';
const DashboardPage: React.FC = () => {
  const [projectId] = useState<string>('045a11d9-9d7f-427b-8731-3688f6240ac4');
  const [financials, setFinancials] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    fetchProjectFinancials(projectId).then((data) => {
      setFinancials(data);
      setLoading(false);
    });
  }, [projectId]);

  const stats = useMemo(() => {
    if (!financials) return [];
    return [
      {
        label: 'Doanh thu phần mềm',
        value: formatVnd(Math.round(financials.totalValue)),
        icon: BarChart,
        color: 'bg-blue-500',
      },
      {
        label: 'Lợi nhuận (30%)',
        value: formatVnd(Math.round(financials.profit)),
        subValue: 'Fixed profit margin',
        trend: '30%',
        icon: TrendingUp,
        color: 'bg-green-500',
      },
      {
        label: 'Chi phí chung (10%)',
        value: formatVnd(Math.round(financials.overheads)),
        subValue: 'Operating overheads',
        trend: '10%',
        icon: Wallet,
        color: 'bg-orange-500',
      },
      {
        label: 'Quỹ phân bổ (60%)',
        value: formatVnd(Math.round(financials.pool60)),
        subValue: 'Net allocation pool',
        trend: '60%',
        icon: Users,
        variant: 'dark' as const,
        color: 'bg-purple-500',
      },
    ];
  }, [financials]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đang tính toán tài chính...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DistributionTable data={financials?.breakdown || []} />
        </div>
        <div className="lg:col-span-1">
          <AllocationChart breakdown={financials?.breakdown || []} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
