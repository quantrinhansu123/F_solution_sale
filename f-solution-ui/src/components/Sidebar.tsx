import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Ticket, 
  Wallet, 
  Settings, 
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import type { TabType, SubTabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeSubTab: SubTabType;
  setActiveSubTab: (subTab: SubTabType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  activeSubTab, 
  setActiveSubTab 
}) => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    crm: true,
    ticket: true
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'crm', 
      label: 'CRM & Bán hàng', 
      icon: Users,
      subItems: [
        { id: 'overview', label: 'Tổng quan' },
        { id: 'leads', label: 'Quản lý Leads' },
        { id: 'demo', label: 'Demo' },
        { id: 'contracts', label: 'Hợp đồng' }
      ]
    },
    { 
      id: 'ticket', 
      label: 'Quản lý Ticket', 
      icon: Ticket,
      subItems: [
        { id: 'overview', label: 'Tổng quan' },
        { id: 'ba', label: 'BA & Đặc tả' },
        { id: 'dev', label: 'Dev' },
        { id: 'cs', label: 'CS' }
      ]
    },
    { id: 'income', label: 'Thu nhập', icon: Wallet },
    { id: 'settings', label: 'Cấu hình', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xl">F</span>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">F-Solution</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isSelected = activeTab === item.id;
          const hasSubItems = !!item.subItems;
          const isOpen = openMenus[item.id];

          return (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab(item.id as TabType);
                  if (hasSubItems) {
                    toggleMenu(item.id);
                    // Default to first subitem if it's a new tab click
                    if (activeTab !== item.id) {
                      setActiveSubTab(item.subItems![0].id as SubTabType);
                    }
                  }
                  else setActiveSubTab(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isSelected 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} strokeWidth={isSelected ? 2.5 : 2} />
                  <span className="text-sm">{item.label}</span>
                </div>
                {hasSubItems && (
                  isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                )}
              </button>

              {hasSubItems && isOpen && (
                <div className="ml-9 space-y-1 overflow-hidden transition-all duration-300">
                  {item.subItems?.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveTab(item.id as TabType);
                        setActiveSubTab(sub.id as SubTabType);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                        activeSubTab === sub.id && activeTab === item.id
                          ? 'text-slate-900 bg-slate-100'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-50">
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phiên bản</p>
          <p className="text-xs font-bold text-slate-900">v2.4.0 (Enterprise)</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
