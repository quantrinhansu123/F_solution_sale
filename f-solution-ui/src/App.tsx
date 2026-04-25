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

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>(null);

  const revenue = 20000000;

  const stats = useMemo(() => {
    return [
      { label: 'Doanh thu phần mềm', value: '20.000.000 ₫', icon: BarChart, color: 'bg-blue-500' },
      { label: 'Lợi nhuận', value: '6.000.000 ₫', subValue: 'Target achieved', trend: '30% Rate', icon: TrendingUp, color: 'bg-green-500' },
      { label: 'Chi phí chung', value: '2.000.000 ₫', subValue: 'Operating overheads', trend: '10% Cap', icon: Wallet, color: 'bg-orange-500' },
      { label: 'Quỹ chia cho bộ phận', value: '12.000.000 ₫', subValue: '6 Departments mapped', trend: 'Allocated', icon: Users, variant: 'dark' as 'dark', color: 'bg-purple-500' },
    ];
  }, [revenue]);

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
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DistributionTable />
            </div>
            <div className="lg:col-span-1">
              <AllocationChart />
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'crm') {
      return (
        <div className="space-y-8">
          {activeSubTab === 'leads' && <LeadManagement />}
          {activeSubTab === 'demo' && <DemoManagement />}
          {activeSubTab === 'contracts' && <ContractManagement />}
          {(activeSubTab === 'overview' || activeSubTab === null) && <CRMOverview />}
        </div>
      );
    }

    if (activeTab === 'ticket') {
      return (
        <div className="space-y-8">
          {activeSubTab === 'ba' && <SpecificationTable />}
          {activeSubTab === 'dev' && <DevTaskTable />}
          {activeSubTab === 'cs' && <CSTab />}
          {(activeSubTab === 'overview' || activeSubTab === null) && <TicketOverview />}
          {activeSubTab !== 'ba' && activeSubTab !== 'dev' && activeSubTab !== 'cs' && activeSubTab !== 'overview' && activeSubTab !== null && (
            <div className="bg-white rounded-[32px] border border-slate-100 p-24 text-center">
              <h2 className="text-2xl font-black text-slate-900 uppercase">Module: {getPageTitle()}</h2>
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
      <div className="bg-white rounded-[32px] border border-slate-100 p-24 text-center">
        <h2 className="text-2xl font-black text-slate-900 uppercase">Module: {getPageTitle()}</h2>
      </div>
    );
  };

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

        <div className="p-8 space-y-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
