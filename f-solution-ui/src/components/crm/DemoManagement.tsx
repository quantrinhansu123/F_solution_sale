import React from 'react';
import { Calendar, FileText, CheckCircle2, Presentation } from 'lucide-react';
import { mockLeads } from '../../data/crmMockData';

const DemoManagement: React.FC = () => {
  // Only show leads that are Qualified and either have a demo date or are in caring stage
  const demoLeads = mockLeads.filter(l => l.status === 'Qualified');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Cơ hội & Demo (Sales)</h3>
          <p className="text-sm text-slate-500">Theo dõi lịch hẹn và kết quả trình bày giải pháp</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <Presentation size={14} />
            Target: 50.000đ / Demo
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Lịch hẹn Demo</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Biên bản họp</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {demoLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{lead.name}</p>
                  <p className="text-xs text-slate-500">{lead.phone}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Calendar size={14} className="text-slate-400" />
                    {lead.demoDate || <span className="text-slate-300 font-normal italic">Chưa đặt lịch</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {lead.docsUrl ? (
                    <a 
                      href={lead.docsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 text-sm font-bold underline underline-offset-4"
                    >
                      <FileText size={14} />
                      Google Docs
                    </a>
                  ) : (
                    <div className="text-slate-400 text-xs flex items-center gap-1.5 italic">
                      <FileText size={14} className="opacity-20" />
                      Chưa cập nhật
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                   <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-[11px] font-black uppercase">
                    In Progress
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ml-auto hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
                    <CheckCircle2 size={14} />
                    Demo Done (+50k)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DemoManagement;
