import React, { useState } from 'react';
import { FileCheck, Download, BadgeCheck, TrendingUp, Wallet, Plus, Edit2, Trash2, X } from 'lucide-react';
import { mockContracts } from '../../data/crmMockData';

const ContractManagement: React.FC = () => {
  const [contracts, setContracts] = useState(mockContracts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: '',
    value: 0,
    status: 'Đã thanh toán',
    docUrl: '#'
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const handleOpenModal = (contract?: any) => {
    if (contract) {
      setEditingContract(contract);
      setFormData({
        id: contract.id,
        value: contract.value,
        status: contract.status,
        docUrl: contract.docUrl || '#'
      });
    } else {
      setEditingContract(null);
      setFormData({
        id: `HD-${Date.now().toString().slice(-4)}`,
        value: 0,
        status: 'Đã thanh toán',
        docUrl: '#'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContract(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContract) {
      setContracts(contracts.map(c => c.id === editingContract.id ? { ...c, ...formData } : c));
    } else {
      setContracts([formData, ...contracts]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hợp đồng này?')) {
      setContracts(contracts.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-4 text-[13px]">
      {/* Commission Highlight */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4 text-white shadow-lg shadow-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-emerald-50 text-[10px] font-bold uppercase tracking-wider">Hoa hồng Sale</p>
            <h3 className="text-xl font-black">31% Doanh thu</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-emerald-50 text-[10px] font-medium">Thưởng dự kiến (trên 20tr)</p>
          <p className="text-xl font-black">6.200.000 ₫</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Quản lý Hợp đồng & Doanh số</h3>
            <p className="text-[11px] text-slate-500">Danh sách hợp đồng đã chốt và thanh toán</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Tạo Hợp đồng
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã hợp đồng</th>
                <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá trị (VNĐ)</th>
                <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sale (31%)</th>
                <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <FileCheck size={14} className="text-slate-400" />
                      <span className="font-bold text-slate-900">{contract.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-bold text-slate-900 text-[12px]">
                    {formatCurrency(contract.value)}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1 text-emerald-600 font-black text-[12px]">
                      <TrendingUp size={12} />
                      {formatCurrency(contract.value * 0.31)}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border flex items-center gap-1 w-fit ${
                      contract.status === 'Đã thanh toán' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {contract.status === 'Đã thanh toán' && <BadgeCheck size={10} />}
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex items-center gap-1 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(contract)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all border border-transparent hover:border-blue-100"
                          title="Sửa"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(contract.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all border border-transparent hover:border-red-100"
                          title="Xóa"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <a 
                        href={contract.docUrl} 
                        className="text-slate-600 hover:text-slate-900 flex items-center gap-1 text-[11px] font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded transition-colors inline-flex"
                      >
                        <Download size={12} />
                        Tải
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">
                {editingContract ? 'Chỉnh sửa Hợp đồng' : 'Tạo Hợp đồng mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Mã hợp đồng</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm"
                  value={formData.id}
                  onChange={e => setFormData({ ...formData, id: e.target.value })}
                  placeholder="VD: HD-001"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Giá trị hợp đồng (VNĐ)</label>
                <input
                  required
                  type="number"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm"
                  value={formData.value}
                  onChange={e => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Trạng thái thanh toán</label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm bg-white"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Paid">Đã thanh toán (Paid)</option>
                  <option value="Deposit">Đã đặt cọc (Deposit)</option>
                  <option value="Pending">Chờ thanh toán (Pending)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Link file hợp đồng</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm"
                  value={formData.docUrl}
                  onChange={e => setFormData({ ...formData, docUrl: e.target.value })}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all border border-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all"
                >
                  {editingContract ? 'Lưu thay đổi' : 'Tạo hợp đồng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractManagement;
