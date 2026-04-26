import React from 'react';
import { Rocket, Headset, ShieldCheck, FileSignature, CheckCircle2, AlertCircle, ExternalLink, MessageSquare } from 'lucide-react';
import { mockDeployments, mockSupportTickets } from '../../data/ticketMockData';
import StatCard from '../StatCard';

const CSTab: React.FC = () => {
  const handleGoLive = () => {
    alert('Giải ngân nốt 40% quỹ dự án cho toàn bộ team! Hệ thống đang cập nhật dòng tiền...');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="space-y-4 text-[13px]">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Dự án chờ triển khai" 
          value="02" 
          subValue="Đã hoàn thành Coding" 
          icon={Rocket} 
          color="bg-emerald-500" 
        />
        <StatCard 
          label="Quỹ AMC khả dụng" 
          value={formatCurrency(400000)} 
          subValue="Phí vận hành 1M/năm" 
          icon={ShieldCheck} 
          color="bg-blue-500" 
        />
        <StatCard 
          label="Chỉ số hài lòng (CSAT)" 
          value="4.8 / 5.0" 
          subValue="Từ 12 phản hồi tháng này" 
          icon={MessageSquare} 
          color="bg-amber-500" 
          variant="dark" 
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Deployment Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Triển khai dự án & Bàn giao</h3>
              <p className="text-[11px] text-slate-500">Đảm bảo dự án Go-live thành công</p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5">
              <Rocket size={14} />
              Final Stage
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100">
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên dự án</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Xong code</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Biên bản</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockDeployments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-2.5 font-bold text-slate-900">{item.projectName}</td>
                    <td className="px-4 py-2.5 text-[12px] font-medium text-slate-600">{item.customer}</td>
                    <td className="px-4 py-2.5 text-center text-[12px] font-bold text-slate-500">{item.finishDate}</td>
                    <td className="px-4 py-2.5">
                      {item.docsUrl ? (
                        <a href={item.docsUrl} className="text-blue-600 flex items-center gap-1 text-[11px] font-bold hover:underline">
                          <FileSignature size={12} />
                          Biên bản
                        </a>
                      ) : (
                        <input 
                          type="text" 
                          placeholder="Link biên bản..." 
                          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] w-32 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                        item.status === 'Go-live' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {item.status === 'Go-live' ? 'Go-live' : 'Chờ cài'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {item.status === 'Waiting' ? (
                        <button 
                          onClick={handleGoLive}
                          className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-md shadow-emerald-100 flex items-center gap-1.5 ml-auto"
                        >
                          <CheckCircle2 size={12} />
                          Go-live
                        </button>
                      ) : (
                        <div className="flex items-center justify-end text-emerald-600 gap-1 font-bold text-[11px] uppercase">
                          <Rocket size={12} />
                          Live
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Support Ticket Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Hỗ trợ khách hàng & AMC</h3>
              <p className="text-[11px] text-slate-500">Quản lý bảo trì và xử lý lỗi phát sinh</p>
            </div>
            <Headset className="text-slate-400" size={18} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100">
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nội dung hỗ trợ</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">AMC Point</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockSupportTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-2.5 text-[10px] font-black text-slate-400 font-mono">#{ticket.id}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-900 leading-tight">{ticket.content}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-black border border-blue-100">
                        {ticket.amcPoints}pts
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] font-semibold text-slate-600">{ticket.processTime}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                        ticket.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                        {ticket.status}
                      </span>
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

export default CSTab;
