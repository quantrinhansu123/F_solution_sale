import React from 'react';
import { FileCheck, Download, BadgeCheck, TrendingUp, Wallet } from 'lucide-react';
import { mockContracts } from '../../data/crmMockData';

const ContractManagement: React.FC = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Commission Highlight */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-emerald-50 text-xs font-bold uppercase tracking-wider">Chính sách hoa hồng Sale</p>
            <h3 className="text-2xl font-black">31% Doanh thu</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-emerald-50 text-xs font-medium">Tổng thưởng dự kiến (trên 20tr)</p>
          <p className="text-2xl font-black">6.200.000 ₫</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">Quản lý Hợp đồng & Doanh số</h3>
          <p className="text-sm text-slate-500">Danh sách hợp đồng đã chốt và trạng thái thanh toán</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Mã hợp đồng</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Giá trị (VNĐ)</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Thưởng Sale (31%)</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Chứng từ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileCheck size={16} className="text-slate-400" />
                      <span className="font-bold text-slate-900">{contract.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {formatCurrency(contract.value)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-black">
                      <TrendingUp size={14} />
                      {formatCurrency(contract.value * 0.31)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight flex items-center gap-1 w-fit ${
                      contract.status === 'Paid' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {contract.status === 'Paid' && <BadgeCheck size={12} />}
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a 
                      href={contract.docUrl} 
                      className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors w-fit"
                    >
                      <Download size={14} />
                      Tải File
                    </a>
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

export default ContractManagement;
