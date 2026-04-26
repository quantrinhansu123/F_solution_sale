import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import DistributionTable from './components/DistributionTable';
import AllocationChart from './components/AllocationChart';
import CRMOverview from './components/crm/CRMOverview';
import LeadManagement from './components/crm/LeadManagement';
import DemoManagement from './components/crm/DemoManagement';
import ContractManagement from './components/crm/ContractManagement';
import TicketOverview from './components/ticket/TicketOverview';
import SpecificationTable from './components/ticket/SpecificationTable';
import DevTaskTable from './components/ticket/DevTaskTable';
import CSTab from './components/ticket/CSTab';
import IncomeTab from './components/income/IncomeTab';
import SettingsTab from './components/settings/SettingsTab';
import type { TabType, SubTabType } from './types';
import {
  Users,
  BarChart,
  TrendingUp,
  Activity,
  ArrowUpRight,
  MoreVertical,
  LayoutDashboard,
  Wallet,
  ShieldAlert,
  Megaphone,
  Briefcase,
  Code,
  Headphones,
  AlertTriangle
} from 'lucide-react';

import { fetchProjectFinancials } from './utils/finance';
import type { FinancialData } from './types';
import { supabase } from './supabase';
import LoginPage from './pages/LoginPage';
import type { Session } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>(null);
  const [dbStatus, setDbStatus] = useState<'testing' | 'success' | 'error'>('testing');
  
  // State quản lý tài chính dự án
  const [projectId, setProjectId] = useState<string>('045a11d9-9d7f-427b-8731-3688f6240ac4'); // ID dự án mẫu
  const [financials, setFinancials] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  React.useEffect(() => {
    // Lấy session hiện tại
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setDbStatus('success');
    });

    // Lắng nghe thay đổi trạng thái auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setDbStatus('success');
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch dữ liệu tài chính khi projectId thay đổi
  React.useEffect(() => {
    if (session && projectId) {
      setLoading(true);
      fetchProjectFinancials(projectId).then(data => {
        setFinancials(data);
        setLoading(false);
      });
    }
  }, [session, projectId]);

  const stats = useMemo(() => {
    if (!financials) return [];
    return [
      { label: 'Doanh thu phần mềm', value: `${Math.round(financials.totalValue).toLocaleString('vi-VN')} ₫`, icon: BarChart, color: 'bg-blue-500' },
      { label: 'Lợi nhuận (30%)', value: `${Math.round(financials.profit).toLocaleString('vi-VN')} ₫`, subValue: 'Fixed profit margin', trend: '30%', icon: TrendingUp, color: 'bg-green-500' },
      { label: 'Chi phí chung (10%)', value: `${Math.round(financials.overheads).toLocaleString('vi-VN')} ₫`, subValue: 'Operating overheads', trend: '10%', icon: Wallet, color: 'bg-orange-500' },
      { label: 'Quỹ phân bổ (60%)', value: `${Math.round(financials.pool60).toLocaleString('vi-VN')} ₫`, subValue: 'Net allocation pool', trend: '60%', icon: Users, variant: 'dark' as const, color: 'bg-purple-500' },
    ];
  }, [financials]);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Financial Overview';
      case 'crm': {
        switch (activeSubTab) {
          case 'leads': return 'Quản lý Leads';
          case 'demo': return 'Cơ hội & Demo';
          case 'contracts': return 'Quản lý Hợp đồng';
          default: return 'Tổng quan CRM';
        }
      }
      case 'ticket': {
        switch (activeSubTab) {
          case 'ba': return 'BA & Đặc tả';
          case 'dev': return 'Phát triển (Dev)';
          case 'cs': return 'Triển khai (CS)';
          default: return 'Tổng quan Ticket';
        }
      }
      case 'income': return 'Income Statements';
      case 'settings': return 'System Settings';
      default: return 'Dashboard';
    }
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') {
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
    }

    if (activeTab === 'crm') {
      return (
        <div className="space-y-5">
          {activeSubTab === 'leads' && <LeadManagement />}
          {activeSubTab === 'demo' && <DemoManagement />}
          {activeSubTab === 'contracts' && <ContractManagement />}
          {(activeSubTab === 'overview' || activeSubTab === null) && <CRMOverview />}
        </div>
      );
    }

    if (activeTab === 'ticket') {
      return (
        <div className="space-y-5">
          {activeSubTab === 'ba' && <SpecificationTable />}
          {activeSubTab === 'dev' && <DevTaskTable />}
          {activeSubTab === 'cs' && <CSTab />}
          {(activeSubTab === 'overview' || activeSubTab === null) && <TicketOverview />}
          {activeSubTab !== 'ba' && activeSubTab !== 'dev' && activeSubTab !== 'cs' && activeSubTab !== 'overview' && activeSubTab !== null && (
            <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
              <h2 className="text-xl font-black text-slate-900 uppercase">Module: {getPageTitle()}</h2>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'income') {
      return <IncomeTab />;
    }

    if (activeTab === 'settings') {
      return <SettingsTab />;
    }

    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
        <h2 className="text-xl font-black text-slate-900 uppercase">Module: {getPageTitle()}</h2>
      </div>
    );
  };

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />

      <main className="flex-1 flex flex-col">
        <Header title={getPageTitle()} />

        <div className="p-5 space-y-5">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
