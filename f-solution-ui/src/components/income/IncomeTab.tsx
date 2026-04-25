import React from 'react';
import { Wallet, History, TrendingUp, ArrowDownLeft, ArrowUpRight, DollarSign, CreditCard, PieChart } from 'lucide-react';
import { mockTransactions, incomeByRole } from '../../data/incomeMockData';

const IncomeTab: React.FC = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const totalBalance = 8450000;
  const pendingBalance = 3200000;
  const estimatedIncome = 15000000;

  return (
    <div className="space-y-8">
      {/* Wallet Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Balance */}
        <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <CreditCard size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Số dư khả dụng</span>
            </div>
            <div className="text-4xl font-black mb-6">{formatCurrency(totalBalance)}</div>
            <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl text-sm font-black hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-2">
              <ArrowDownLeft size={18} />
              Rút tiền
            </button>
          </div>
        </div>

        {/* Pending Balance */}
        <div className="bg-amber-50 rounded-[32px] p-8 border border-amber-100 shadow-sm group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-200 rounded-2xl flex items-center justify-center text-amber-700">
              <History size={24} />
            </div>
            <span className="text-[10px] font-black bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full uppercase">Rule 60-20-20</span>
          </div>
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Tiền đang treo (Pending)</div>
          <div className="text-3xl font-black text-slate-900 mb-2">{formatCurrency(pendingBalance)}</div>
          <p className="text-[11px] text-amber-700 font-medium">Chờ nghiệm thu & Go-live (40%)</p>
        </div>

        {/* Estimated Income */}
        <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-200 shadow-sm group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-700">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Thu nhập dự kiến</div>
          <div className="text-3xl font-black text-slate-900 mb-2">{formatCurrency(estimatedIncome)}</div>
          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
            <ArrowUpRight size={14} />
            +12% so với tháng trước
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction Table */}
        <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <History size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Lịch sử thu nhập</h3>
                <p className="text-sm text-slate-500">Danh sách các khoản giải ngân gần đây</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Ngày</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Nội dung</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Loại</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Số tiền</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 text-sm font-bold text-slate-500">{tx.date}</td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{tx.content}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">{tx.id}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase">
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-emerald-600 text-lg">
                      +{formatCurrency(tx.amount).replace('₫', '').trim()} <span className="text-xs">₫</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        tx.status === 'Thành công' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
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
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <PieChart size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Phân tích</h3>
            </div>
            
            {/* Visual PieChart Mock */}
            <div className="flex justify-center mb-8">
              <div className="w-48 h-48 rounded-full border-[12px] border-slate-50 relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[12px] border-indigo-500 border-t-transparent border-r-transparent rotate-45"></div>
                <div className="absolute inset-0 rounded-full border-[12px] border-emerald-500 border-l-transparent border-b-transparent -rotate-45"></div>
                <div className="text-center">
                  <div className="text-2xl font-black text-slate-900">100%</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tổng thu</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {incomeByRole.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-bold text-slate-700">{item.role}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-indigo-600 rounded-3xl text-white">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Ước tính thuế TNCN</span>
              </div>
              <div className="text-2xl font-black mb-1">~ 1.200.000 ₫</div>
              <p className="text-[10px] opacity-70">Tạm tính 10% cho thu nhập trên 11M</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeTab;
