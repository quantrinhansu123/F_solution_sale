import React from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">{title}</h1>
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm nhanh..." 
            className="bg-slate-50 border border-slate-200 rounded-full py-1.5 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

        <button className="flex items-center gap-3 p-1 hover:bg-slate-50 rounded-full pr-3 transition-colors">
          <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white">
            <User size={18} />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-black text-slate-900 leading-none mb-0.5">Admin Panel</p>
            <p className="text-[10px] font-bold text-slate-400">Quản trị hệ thống</p>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      </div>
    </header>
  );
};

export default Header;
