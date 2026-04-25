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
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Progress */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Tiến độ dự án</h3>
            <Code className="text-slate-400" size={20} />
          </div>
          <div className="space-y-6">
            {projectProgress.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-600">{item.stage}</span>
                  <span className="text-slate-900">{item.progress}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-xs font-bold text-indigo-900 flex items-center gap-2">
              <AlertCircle size={14} />
              Ghi chú Audit
            </p>
            <p className="text-[11px] text-indigo-700 mt-1 leading-relaxed">
              Khâu <b>Lập trình</b> đang chậm tiến độ 5% so với kế hoạch ban đầu. Cần BA hỗ trợ đặc tả chi tiết hơn.
            </p>
          </div>
        </div>

        {/* Hot Tickets Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Ticket "Nóng" cần Audit</h3>
              <p className="text-sm text-slate-500">Tickets quá hạn hoặc Reopen nhiều lần</p>
            </div>
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter">
              Critical Area
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Ticket</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Deadline</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Reopen</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Assignee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {hotTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{ticket.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{ticket.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                        ticket.status === 'Reopened' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                        <Clock size={12} />
                        {ticket.deadline}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                        <RotateCcw size={12} className={ticket.reopenCount > 1 ? 'text-red-500' : 'text-slate-400'} />
                        {ticket.reopenCount} lần
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {ticket.assignee.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{ticket.assignee}</span>
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
