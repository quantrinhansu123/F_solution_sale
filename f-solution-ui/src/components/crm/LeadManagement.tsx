import React from 'react';
import { ExternalLink, CheckCircle2, UserPlus } from 'lucide-react';
import { mockLeads } from '../../data/crmMockData';

const LeadManagement: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Danh sách Leads (Marketing)</h3>
          <p className="text-sm text-slate-500">Quản lý và xác nhận chất lượng khách hàng tiềm năng</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
          <UserPlus size={18} />
          Thêm Lead mới
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Tên khách hàng</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">SĐT</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Nguồn (Source ID)</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Bằng chứng nhu cầu</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{lead.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{lead.id}</p>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">{lead.phone}</td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-[11px] font-bold">
                    {lead.sourceId}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {lead.evidenceUrl ? (
                    <a 
                      href={lead.evidenceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium underline underline-offset-4"
                    >
                      prnt.sc/view
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-slate-300 text-xs italic">Chưa có</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-tight ${
                    lead.status === 'Qualified' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {lead.status === 'New' ? (
                    <button className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ml-auto hover:bg-green-700 transition-colors shadow-sm shadow-green-100">
                      <CheckCircle2 size={14} />
                      Xác nhận Qualified (+30k)
                    </button>
                  ) : (
                    <div className="flex items-center justify-end text-green-600 gap-1.5 font-bold text-xs">
                      <CheckCircle2 size={14} />
                      Đã xác nhận
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadManagement;
