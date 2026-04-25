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
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Dự án chờ triển khai" 
          value="02" 
          subValue="Đã hoàn thành Coding" 
          icon={Rocket} 
          color="bg-emerald-500" 
        />
        <StatCard 
          label="Quỹ AMC khả dụng" 
          value={formatCurrency(400000)} // 40% of 1M
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

      <div className="grid grid-cols-1 gap-8">
        {/* Deployment Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Triển khai dự án & Bàn giao</h3>
              <p className="text-sm text-slate-500">Người về đích - Đảm bảo dự án Go-live thành công</p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2">
              <Rocket size={16} />
              Final Stage
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Tên dự án</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Ngày xong code</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Biên bản bàn giao</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockDeployments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-900">{item.projectName}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{item.customer}</td>
                    <td className="px-6 py-4 text-center text-sm font-bold text-slate-500">{item.finishDate}</td>
                    <td className="px-6 py-4">
                      {item.docsUrl ? (
                        <a href={item.docsUrl} className="text-blue-600 flex items-center gap-1 text-xs font-bold hover:underline">
                          <FileSignature size={14} />
                          Biên bản.pdf
                        </a>
                      ) : (
                        <input 
                          type="text" 
                          placeholder="Dán link biên bản..." 
                          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs w-40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        item.status === 'Go-live' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status === 'Go-live' ? 'Đã Go-live' : 'Chờ cài đặt'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status === 'Waiting' ? (
                        <button 
                          onClick={handleGoLive}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100 flex items-center gap-2 ml-auto"
                        >
                          <CheckCircle2 size={14} />
                          Kích hoạt Go-live
                        </button>
                      ) : (
                        <div className="flex items-center justify-end text-emerald-600 gap-1.5 font-bold text-xs uppercase">
                          <Rocket size={14} />
                          Project Live
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
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Hỗ trợ khách hàng & AMC</h3>
              <p className="text-sm text-slate-500">Quản lý các yêu cầu bảo trì và xử lý lỗi phát sinh</p>
            </div>
            <Headset className="text-slate-400" size={24} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">ID Ticket</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Nội dung hỗ trợ</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Point AMC</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Thời gian xử lý</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockSupportTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-black text-slate-400 font-mono">#{ticket.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{ticket.content}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-black">
                        {ticket.amcPoints} pts
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">{ticket.processTime}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        ticket.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
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
