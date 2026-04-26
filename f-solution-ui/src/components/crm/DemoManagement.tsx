import React, { useState } from 'react';
import { Calendar, FileText, CheckCircle2, Presentation, Edit2, Trash2, X, Plus } from 'lucide-react';
import { mockLeads } from '../../data/crmMockData';

const DemoManagement: React.FC = () => {
  const [demos, setDemos] = useState(mockLeads.filter(l => l.status === 'Qualified'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDemo, setEditingDemo] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    demoDate: '',
    docsUrl: '',
    status: 'Qualified'
  });

  const handleOpenModal = (demo?: any) => {
    if (demo) {
      setEditingDemo(demo);
      setFormData({
        name: demo.name,
        phone: demo.phone,
        demoDate: demo.demoDate || '',
        docsUrl: demo.docsUrl || '',
        status: demo.status
      });
    } else {
      setEditingDemo(null);
      setFormData({
        name: '',
        phone: '',
        demoDate: '',
        docsUrl: '',
        status: 'Qualified'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDemo(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDemo) {
      setDemos(demos.map(d => d.id === editingDemo.id ? { ...d, ...formData } : d));
    } else {
      const newDemo = {
        ...formData,
        id: `D${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setDemos([newDemo, ...demos]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa demo này?')) {
      setDemos(demos.filter(d => d.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-[13px]">
      <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-base font-bold text-slate-900">Cơ hội & Demo (Sales)</h3>
          <p className="text-[11px] text-slate-500">Theo dõi lịch hẹn và kết quả trình bày giải pháp</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-purple-100 flex items-center gap-1.5">
            <Presentation size={12} />
            +50K / Demo
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Thêm Cơ hội
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lịch hẹn Demo</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Biên bản họp</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {demos.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-4 py-2.5">
                  <p className="font-bold text-slate-900 leading-tight">{lead.name}</p>
                  <p className="text-[11px] text-slate-500">{lead.phone}</p>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-700">
                    <Calendar size={12} className="text-slate-400" />
                    {lead.demoDate || <span className="text-slate-300 font-normal italic">N/A</span>}
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  {lead.docsUrl ? (
                    <a 
                      href={lead.docsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-[12px] font-bold underline underline-offset-2"
                    >
                      <FileText size={12} />
                      Docs
                    </a>
                  ) : (
                    <div className="text-slate-400 text-[11px] flex items-center gap-1.5 italic opacity-60">
                      <FileText size={12} />
                      N/A
                    </div>
                  )}
                </td>
                <td className="px-4 py-2.5">
                   <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[9px] font-black uppercase border border-indigo-100">
                    Đang thực hiện
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
                  <button className="bg-slate-900 text-white px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 ml-auto hover:bg-slate-800 transition-all shadow-sm">
                    <CheckCircle2 size={12} />
                    Xác nhận (+50k)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Demo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">
                {editingDemo ? 'Chỉnh sửa Cơ hội' : 'Thêm Cơ hội mới'}
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
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Ngày hẹn Demo</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm"
                  value={formData.demoDate}
                  onChange={e => setFormData({ ...formData, demoDate: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Link biên bản họp</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm"
                  value={formData.docsUrl}
                  onChange={e => setFormData({ ...formData, docsUrl: e.target.value })}
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
                  {editingDemo ? 'Lưu thay đổi' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoManagement;
