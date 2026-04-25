import React from 'react';
import { Code2, GitPullRequest, DollarSign, CheckCircle2, Laptop, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { mockDevTasks } from '../../data/ticketMockData';
import StatCard from '../StatCard';

const DevTaskTable: React.FC = () => {
  const totalPoints = mockDevTasks.reduce((acc, task) => acc + task.points, 0);
  const donePoints = mockDevTasks.filter(t => t.status === 'Done').reduce((acc, t) => acc + t.points, 0);
  
  const totalIncome = totalPoints * 100000; // 1 Point = 100k
  const availableIncome = donePoints * 100000 * 0.6;
  const pendingIncome = (totalPoints * 100000) - availableIncome;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Tổng Point đã nhận" 
          value={`${totalPoints} Pts`} 
          subValue="Tích lũy từ đầu tháng" 
          icon={Laptop} 
          color="bg-indigo-500" 
        />
        <StatCard 
          label="Thu nhập khả dụng (60%)" 
          value={formatCurrency(availableIncome)} 
          subValue="Từ các Ticket đã Done" 
          icon={DollarSign} 
          color="bg-emerald-500" 
        />
        <StatCard 
          label="Quỹ treo (40%)" 
          value={formatCurrency(pendingIncome)} 
          subValue="Chờ UAT & Go-live" 
          icon={Clock} 
          color="bg-amber-500" 
          variant="dark"
        />
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Danh sách công việc Lập trình</h3>
            <p className="text-sm text-slate-500">Quản lý task, link PR và tiến độ giải ngân</p>
          </div>
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
            <span className="text-xs font-bold text-slate-500">Tỉ giá:</span>
            <span className="text-sm font-black text-indigo-600">1 Point = 100.000 ₫</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Ticket & ID</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Độ khó (Point)</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Bằng chứng (PR)</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Tiến độ giải ngân</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockDevTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                        <Code2 size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{task.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">#{task.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative flex justify-center group/tooltip">
                      <span className="bg-slate-100 text-slate-900 px-3 py-1 rounded-lg font-black text-sm border border-slate-200">
                        {task.points}
                      </span>
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                        Tương đương: <span className="text-emerald-400 font-black">{formatCurrency(task.points * 100000)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {task.prUrl ? (
                      <a 
                        href={task.prUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4"
                      >
                        <GitPullRequest size={14} />
                        View PR
                        <ExternalLink size={10} />
                      </a>
                    ) : (
                      <div className="text-red-400 text-[10px] font-bold flex items-center gap-1.5 italic">
                        <GitPullRequest size={14} className="opacity-30" />
                        Chưa có link PR
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 w-64">
                    <div className="flex items-center gap-1">
                      <div className={`h-2 flex-1 rounded-full transition-all ${task.disbursement.coding ? 'bg-indigo-500' : 'bg-slate-100'}`} title="Coding 60%"></div>
                      <div className={`h-2 flex-1 rounded-full transition-all ${task.disbursement.uat ? 'bg-indigo-500' : 'bg-slate-100'}`} title="UAT 20%"></div>
                      <div className={`h-2 flex-1 rounded-full transition-all ${task.disbursement.live ? 'bg-indigo-500' : 'bg-slate-100'}`} title="Live 20%"></div>
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className={`text-[8px] font-black uppercase ${task.disbursement.coding ? 'text-indigo-600' : 'text-slate-300'}`}>60%</span>
                      <span className={`text-[8px] font-black uppercase ${task.disbursement.uat ? 'text-indigo-600' : 'text-slate-300'}`}>20%</span>
                      <span className={`text-[8px] font-black uppercase ${task.disbursement.live ? 'text-indigo-600' : 'text-slate-300'}`}>20%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                      task.status === 'Done' ? 'bg-green-100 text-green-700' :
                      task.status === 'Review' ? 'bg-purple-100 text-purple-700' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {task.status === 'Todo' ? (
                      <button className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all">
                        Nhận việc
                      </button>
                    ) : task.status === 'In Progress' ? (
                      <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all" disabled={!task.prUrl}>
                        Gửi Review
                      </button>
                    ) : task.status === 'Review' ? (
                      <div className="text-purple-600 text-xs font-bold flex items-center justify-end gap-1.5">
                        <ShieldCheck size={14} />
                        Đang Review
                      </div>
                    ) : (
                      <div className="text-green-600 text-xs font-bold flex items-center justify-end gap-1.5">
                        <CheckCircle2 size={14} />
                        Hoàn thành
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DevTaskTable;
