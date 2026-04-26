import React from 'react';
import { Ticket as TicketIcon, Code, ShieldCheck, AlertCircle, Clock, RotateCcw, BarChart3 } from 'lucide-react';
import StatCard from '../StatCard';
import { hotTickets, projectProgress } from '../../data/ticketMockData';

const TicketOverview: React.FC = () => {
  const stats = [
    {
      label: 'Tổng Point tháng này',
      value: '452',
      subValue: 'Target: 500 points',
      trend: '+12% vs LW',
      icon: BarChart3,
      color: 'bg-indigo-600'
    },
    {
      label: 'Số Ticket đang mở',
      value: '24',
      subValue: '8 tickets high priority',
      trend: '-5 tickets',
      icon: TicketIcon,
      color: 'bg-blue-600'
    },
    {
      label: 'Tỷ lệ Bug/Reopen',
      value: '14.2%',
      subValue: 'Reopened: 12 tickets',
      trend: 'Threshold: 15%',
      isUp: false,
      icon: ShieldCheck,
      color: 'bg-slate-800',
      variant: 'dark' as const
    }
  ];

  return (
    <div className="space-y-4 text-[13px]">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Project Progress */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Tiến độ dự án</h3>
            <Code className="text-slate-400" size={18} />
          </div>
          <div className="space-y-4">
            {projectProgress.map((item, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between text-[12px] font-bold">
                  <span className="text-slate-600">{item.stage}</span>
                  <span className="text-slate-900">{item.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <p className="text-[10px] font-bold text-indigo-900 flex items-center gap-1.5">
              <AlertCircle size={12} />
              Ghi chú Audit
            </p>
            <p className="text-[10px] text-indigo-700 mt-1 leading-normal">
              Khâu <b>Lập trình</b> chậm 5%. Cần BA hỗ trợ đặc tả chi tiết hơn.
            </p>
          </div>
        </div>

        {/* Hot Tickets Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Ticket "Nóng" cần Audit</h3>
              <p className="text-[11px] text-slate-500">Tickets quá hạn hoặc Reopen nhiều lần</p>
            </div>
            <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-[9px] font-black uppercase border border-red-100">
              Critical
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100">
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadline</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Reopen</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Assignee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {hotTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-2.5">
                      <p className="font-bold text-slate-900 line-clamp-1 text-[12px]">{ticket.title}</p>
                      <p className="text-[9px] text-slate-400 font-mono tracking-tighter uppercase">{ticket.id}</p>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase border ${
                        ticket.status === 'Reopened' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-red-600">
                        <Clock size={10} />
                        {ticket.deadline}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1 text-[11px] font-black text-slate-900">
                        <RotateCcw size={10} className={ticket.reopenCount > 1 ? 'text-red-500' : 'text-slate-400'} />
                        {ticket.reopenCount}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[9px] font-bold text-slate-600">
                          {ticket.assignee.charAt(0)}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">{ticket.assignee}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketOverview;
