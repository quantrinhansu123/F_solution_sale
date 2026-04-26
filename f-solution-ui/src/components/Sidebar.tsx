import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Ticket,
  Wallet,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { supabase } from '../supabase';

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    crm: true,
    ticket: true,
  });

  useEffect(() => {
    if (pathname.startsWith('/crm')) {
      setOpenMenus((m) => ({ ...m, crm: true }));
    }
    if (pathname.startsWith('/ticket')) {
      setOpenMenus((m) => ({ ...m, ticket: true }));
    }
  }, [pathname]);

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuItems = [
    { id: 'dashboard', to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, subItems: null as { id: string; to: string; label: string }[] | null },
    {
      id: 'crm',
      to: '/crm/overview',
      label: 'CRM & Bán hàng',
      icon: Users,
      subItems: [
        { id: 'overview', to: '/crm/overview', label: 'Overview' },
        { id: 'leads', to: '/crm/leads', label: 'Leads' },
        { id: 'demo', to: '/crm/demo', label: 'Demo' },
        { id: 'quotes', to: '/crm/quotes', label: 'Báo giá' },
        { id: 'contracts', to: '/crm/contracts', label: 'Contracts' },
      ],
    },
    {
      id: 'ticket',
      to: '/ticket/overview',
      label: 'Quản lý Ticket',
      icon: Ticket,
      subItems: [
        { id: 'overview', to: '/ticket/overview', label: 'Project Overview' },
        { id: 'ba', to: '/ticket/ba', label: 'Specification (BA)' },
        { id: 'dev', to: '/ticket/dev', label: 'Development (Dev)' },
        { id: 'cs', to: '/ticket/cs', label: 'Implementation (CS)' },
      ],
    },
    { id: 'income', to: '/income', label: 'Finance / Income', icon: Wallet, subItems: null },
    { id: 'settings', to: '/settings', label: 'Settings', icon: Settings, subItems: null },
  ];

  return (
    <aside className="w-56 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0 overflow-y-auto">
      <div className="p-4 border-b border-slate-50">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-lg">F</span>
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tight">F-Solution</span>
        </Link>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {menuItems.map((item) => {
          const hasSub = !!item.subItems;
          const inSection =
            item.id === 'dashboard' || item.id === 'income' || item.id === 'settings'
              ? pathname === item.to
              : pathname.startsWith(`/${item.id}/`) || pathname === item.to;
          const isOpen = openMenus[item.id];

          return (
            <div key={item.id} className="space-y-0.5">
              {hasSub ? (
                <div
                  className={`rounded-lg ${
                    inSection
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-stretch w-full min-h-[2.25rem]">
                    <NavLink
                      to={item.to}
                      className={`flex-1 flex items-center gap-2.5 pl-2.5 pr-1 py-1.5 font-bold text-sm ${
                        inSection ? 'text-white' : 'text-slate-600'
                      }`}
                    >
                      <item.icon size={18} strokeWidth={inSection ? 2.5 : 2} />
                      <span>{item.label}</span>
                    </NavLink>
                    <button
                      type="button"
                      onClick={() => toggleMenu(item.id)}
                      className="px-2.5 flex items-center shrink-0"
                      aria-label="Thu gọn menu"
                    >
                      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </div>
                </div>
              ) : (
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all duration-200 font-bold text-sm ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon size={18} strokeWidth={2} />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              )}

              {hasSub && isOpen && item.subItems && (
                <div className="ml-9 space-y-1 overflow-hidden transition-all duration-300">
                  {item.subItems.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      className={({ isActive }) =>
                        `block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          isActive
                            ? 'text-slate-900 bg-slate-100'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-50 space-y-2">
        <div className="bg-slate-50 rounded-xl p-2.5">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Phiên bản</p>
          <p className="text-[11px] font-bold text-slate-900">v2.4.0 (Enterprise)</p>
        </div>

        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors font-bold text-sm"
        >
          <LogOut size={18} strokeWidth={2.5} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
