import React from 'react';
import { Wallet, History, TrendingUp, ArrowDownLeft, ArrowUpRight, DollarSign, CreditCard, PieChart } from 'lucide-react';
import { mockTransactions, incomeByRole } from '../../data/incomeMockData';
import { formatVnd } from '../../utils/formatVnd';

const IncomeTab: React.FC = () => {

  const totalBalance = 8450000;
  const pendingBalance = 3200000;
  const estimatedIncome = 15000000;

  return (
    <div className="space-y-4 text-[13px]">
      {/* Wallet Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Balance */}
        <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet size={60} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <CreditCard size={14} />
              <span className="text-[10px] font-black uppercase tracking-wider">Số dư khả dụng</span>
            </div>
            <div className="text-3xl font-black mb-4">{formatVnd(totalBalance)}</div>
            <button className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-black hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-1.5">
              <ArrowDownLeft size={16} />
              Rút tiền
            </button>
          </div>
        </div>

        {/* Pending Balance */}
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 shadow-sm group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center text-amber-700">
              <History size={20} />
            </div>
            <span className="text-[9px] font-black bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full uppercase">60-20-20</span>
          </div>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Tiền đang treo (Pending)</div>
          <div className="text-2xl font-black text-slate-900 mb-1">{formatVnd(pendingBalance)}</div>
          <p className="text-[10px] text-amber-700 font-medium italic">Chờ nghiệm thu & Go-live (40%)</p>
        </div>

        {/* Estimated Income */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-sm group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-700">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Thu nhập dự kiến</div>
          <div className="text-2xl font-black text-slate-900 mb-1">{formatVnd(estimatedIncome)}</div>
          <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-bold">
            <ArrowUpRight size={12} />
            +12% vs tháng trước
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Transaction Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-50 rounded flex items-center justify-center text-indigo-600">
                <History size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Lịch sử thu nhập</h3>
                <p className="text-[11px] text-slate-500">Các khoản giải ngân gần đây</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100">
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nội dung</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Loại</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Số tiền</th>
                  <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3 text-[12px] font-bold text-slate-500">{tx.date}</td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{tx.content}</p>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase tracking-tighter">{tx.id}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded text-[9px] font-black uppercase border border-slate-200">
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-black text-emerald-600 text-base">
                      +{formatVnd(tx.amount).replace('₫', '').trim()} <span className="text-[10px]">₫</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        tx.status === 'Thành công' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Widget */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 bg-emerald-50 rounded flex items-center justify-center text-emerald-600">
                <PieChart size={16} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Phân tích</h3>
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full border-[8px] border-slate-50 relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[8px] border-indigo-500 border-t-transparent border-r-transparent rotate-45"></div>
                <div className="absolute inset-0 rounded-full border-[8px] border-emerald-500 border-l-transparent border-b-transparent -rotate-45"></div>
                <div className="text-center">
                  <div className="text-xl font-black text-slate-900">100%</div>
                  <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Tổng thu</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {incomeByRole.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                    <span className="text-[12px] font-bold text-slate-700">{item.role}</span>
                  </div>
                  <span className="text-[12px] font-black text-slate-900">{formatVnd(item.amount)}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-indigo-600 rounded-2xl text-white">
              <div className="flex items-center gap-1.5 mb-1.5">
                <DollarSign size={14} />
                <span className="text-[9px] font-black uppercase tracking-wider opacity-80">Ước tính thuế TNCN</span>
              </div>
              <div className="text-xl font-black mb-0.5">~ 1.2M ₫</div>
              <p className="text-[9px] opacity-70 italic">Tạm tính 10% cho thu nhập &gt; 11M</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeTab;
