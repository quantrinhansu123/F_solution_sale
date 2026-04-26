import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, UserPlus, Edit2, Trash2, X } from 'lucide-react';
import { mockLeads } from '../../data/crmMockData';

const LeadManagement: React.FC = () => {
  const [leads, setLeads] = useState(mockLeads);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    sourceId: 'FACEBOOK',
    evidenceUrl: '',
    status: 'Mới'
  });

  const handleOpenModal = (lead?: any) => {
    if (lead) {
      setEditingLead(lead);
      setFormData({
        name: lead.name,
        phone: lead.phone,
        sourceId: lead.sourceId,
        evidenceUrl: lead.evidenceUrl || '',
        status: lead.status
      });
    } else {
      setEditingLead(null);
      setFormData({
        name: '',
        phone: '',
        sourceId: 'FACEBOOK',
        evidenceUrl: '',
        status: 'Mới'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLead) {
      setLeads(leads.map(l => l.id === editingLead.id ? { ...l, ...formData } : l));
    } else {
      const newLead = {
        ...formData,
        id: `L${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setLeads([newLead, ...leads]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lead này?')) {
      setLeads(leads.filter(l => l.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-[13px]">
      <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-base font-bold text-slate-900">Danh sách Leads (Marketing)</h3>
          <p className="text-[11px] text-slate-500">Quản lý và xác nhận chất lượng khách hàng tiềm năng</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-colors shadow-sm"
        >
          <UserPlus size={16} />
          Thêm Lead
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên khách hàng</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">SĐT</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nguồn</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bằng chứng</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-4 py-2.5">
                  <p className="font-bold text-slate-900 leading-tight">{lead.name}</p>
                  <p className="text-[9px] text-slate-400 font-mono tracking-tighter uppercase">{lead.id}</p>
                </td>
                <td className="px-4 py-2.5 text-[12px] font-medium text-slate-600">{lead.phone}</td>
                <td className="px-4 py-2.5">
                  <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">
                    {lead.sourceId}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  {lead.evidenceUrl ? (
                    <a 
                      href={lead.evidenceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-[11px] font-semibold underline underline-offset-2"
                    >
                      Xem
                      <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-slate-300 text-[11px] italic">Chưa có</span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                    lead.status === 'Chất lượng' 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1 mb-1">
                    <button 
                      onClick={() => handleOpenModal(lead)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all border border-transparent hover:border-blue-100"
                      title="Sửa"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(lead.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all border border-transparent hover:border-red-100"
                      title="Xóa"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {lead.status === 'Mới' ? (
                    <button className="bg-green-600 text-white px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 ml-auto hover:bg-green-700 transition-colors shadow-sm mt-1">
                      <CheckCircle2 size={12} />
                      Xác nhận (+30k)
                    </button>
                  ) : (
                    <div className="flex items-center justify-end text-green-600 gap-1 font-bold text-[11px] mt-1">
                      <CheckCircle2 size={12} />
                      Hoàn thành
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">
                {editingLead ? 'Chỉnh sửa Lead' : 'Thêm Lead mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Tên khách hàng</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase px-1">Số điện thoại</label>
                  <input
                    required
                    type="tel"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="09xxx..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase px-1">Nguồn Lead</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm bg-white"
                    value={formData.sourceId}
                    onChange={e => setFormData({ ...formData, sourceId: e.target.value })}
                  >
                    <option value="FACEBOOK">Facebook</option>
                    <option value="GOOGLE">Google Ads</option>
                    <option value="REFERRAL">Giới thiệu</option>
                    <option value="TIKTOK">Tiktok</option>
                    <option value="ZALO">Zalo</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Evidence URL (Link bằng chứng)</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm"
                  value={formData.evidenceUrl}
                  onChange={e => setFormData({ ...formData, evidenceUrl: e.target.value })}
                  placeholder="https://..."
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
                  {editingLead ? 'Lưu thay đổi' : 'Tạo Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadManagement;
