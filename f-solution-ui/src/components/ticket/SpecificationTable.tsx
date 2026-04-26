import React, { useState } from 'react';
import { FileText, Palette, CheckCircle, Plus, Search, ExternalLink, Edit2, Trash2, X } from 'lucide-react';
import { mockSpecifications } from '../../data/ticketMockData';

const SpecificationTable: React.FC = () => {
  const [specs, setSpecs] = useState(mockSpecifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState<any>(null);
  const [formData, setFormData] = useState({
    feature: '',
    srsUrl: '',
    figmaUrl: '',
    points: 1,
    status: 'Drafting'
  });

  const filteredSpecs = specs.filter(spec => 
    spec.feature.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (spec?: any) => {
    if (spec) {
      setEditingSpec(spec);
      setFormData({
        feature: spec.feature,
        srsUrl: spec.srsUrl || '',
        figmaUrl: spec.figmaUrl || '',
        points: spec.points,
        status: spec.status
      });
    } else {
      setEditingSpec(null);
      setFormData({
        feature: '',
        srsUrl: '',
        figmaUrl: '',
        points: 1,
        status: 'Drafting'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSpec(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSpec) {
      setSpecs(specs.map(s => s.id === editingSpec.id ? { ...s, ...formData } : s));
    } else {
      const newSpec = {
        ...formData,
        id: `S${Date.now().toString().slice(-4)}`
      };
      setSpecs([newSpec, ...specs]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) {
      setSpecs(specs.filter(s => s.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-[13px]">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-50 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between bg-slate-50/50">
        <div>
          <h3 className="text-base font-bold text-slate-900">Đặc tả & Thiết kế (BA)</h3>
          <p className="text-[11px] text-slate-500">Quản lý SRS và bản vẽ UI/UX trước khi chuyển Dev</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Tìm tính năng..." 
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-48 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1.5 hover:bg-indigo-700 transition-all active:scale-95 shadow-md shadow-indigo-100"
          >
            <Plus size={14} />
            Thêm yêu cầu
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30 border-b border-slate-100">
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tính năng</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tài liệu (SRS)</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thiết kế (UI/UX)</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Point</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredSpecs.map((spec) => (
              <tr key={spec.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-4 py-2.5">
                  <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{spec.feature}</p>
                  <p className="text-[9px] text-slate-400 font-mono tracking-tighter uppercase">{spec.id}</p>
                </td>
                <td className="px-4 py-2.5">
                  <a 
                    href={spec.srsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[12px] font-semibold text-blue-600 hover:text-blue-700 group/link"
                  >
                    <FileText size={14} className="text-blue-500 group-hover/link:scale-110 transition-transform" />
                    SRS
                    <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </td>
                <td className="px-4 py-2.5">
                  <a 
                    href={spec.figmaUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 group/link"
                  >
                    <Palette size={14} className="text-indigo-500 group-hover/link:scale-110 transition-transform" />
                    Figma
                    <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-center gap-1">
                    <span className="w-6 h-6 bg-slate-50 rounded flex items-center justify-center text-[11px] font-black text-slate-700 border border-slate-200">
                      {spec.points}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tight border ${
                    spec.status === 'Approved' 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {spec.status === 'Approved' ? 'Phê duyệt' : 'Biên soạn'}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <div className="flex items-center gap-1 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(spec)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all border border-transparent hover:border-blue-100"
                        title="Sửa"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(spec.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all border border-transparent hover:border-red-100"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {spec.status === 'Drafting' ? (
                      <button className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-[11px] font-bold hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 flex items-center gap-1 ml-auto">
                        <CheckCircle size={12} />
                        Duyệt
                      </button>
                    ) : (
                      <div className="flex items-center justify-end gap-1 text-green-600 font-bold text-[11px]">
                        <CheckCircle size={12} />
                        Sẵn sàng
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Specification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">
                {editingSpec ? 'Chỉnh sửa Yêu cầu' : 'Thêm Yêu cầu mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Tên tính năng</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm"
                  value={formData.feature}
                  onChange={e => setFormData({ ...formData, feature: e.target.value })}
                  placeholder="VD: Đăng nhập bằng Google"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase px-1">SRS URL</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm"
                    value={formData.srsUrl}
                    onChange={e => setFormData({ ...formData, srsUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase px-1">Figma URL</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm"
                    value={formData.figmaUrl}
                    onChange={e => setFormData({ ...formData, figmaUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase px-1">Points</label>
                  <input
                    required
                    type="number"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm"
                    value={formData.points}
                    onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase px-1">Trạng thái</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm bg-white"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Drafting">Biên soạn (Drafting)</option>
                    <option value="Approved">Phê duyệt (Approved)</option>
                  </select>
                </div>
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
                  {editingSpec ? 'Lưu thay đổi' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecificationTable;
