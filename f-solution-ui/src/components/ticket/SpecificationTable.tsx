import React, { useState } from 'react';
import { FileText, Palette, CheckCircle, Plus, Search, ExternalLink, MoreHorizontal, Filter } from 'lucide-react';
import { mockSpecifications } from '../../data/ticketMockData';

const SpecificationTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpecs = mockSpecifications.filter(spec => 
    spec.feature.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-6 border-b border-slate-50 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between bg-slate-50/50">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Đặc tả & Thiết kế (BA)</h3>
          <p className="text-sm text-slate-500">Quản lý SRS và bản vẽ UI/UX trước khi chuyển Dev</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Tìm tính năng..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100">
            <Plus size={18} />
            Thêm yêu cầu mới
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30">
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Tính năng</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Tài liệu (SRS)</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Thiết kế (UI/UX)</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Point (BA)</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredSpecs.map((spec) => (
              <tr key={spec.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{spec.feature}</p>
                  <p className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{spec.id}</p>
                </td>
                <td className="px-6 py-4">
                  <a 
                    href={spec.srsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 group/link"
                  >
                    <FileText size={16} className="text-blue-500 group-hover/link:scale-110 transition-transform" />
                    Tài liệu SRS
                    <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </td>
                <td className="px-6 py-4">
                  <a 
                    href={spec.figmaUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 group/link"
                  >
                    <Palette size={16} className="text-indigo-500 group-hover/link:scale-110 transition-transform" />
                    Link Figma
                    <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-black text-slate-700 border border-slate-200">
                      {spec.points}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">pts</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                    spec.status === 'Approved' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    {spec.status === 'Approved' ? 'Đã phê duyệt' : 'Đang biên soạn'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {spec.status === 'Drafting' ? (
                    <button className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 flex items-center gap-1.5 ml-auto">
                      <CheckCircle size={14} />
                      Phê duyệt
                    </button>
                  ) : (
                    <div className="flex items-center justify-end gap-1.5 text-green-600 font-bold text-xs">
                      <CheckCircle size={14} />
                      Ready for Dev
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecificationTable;
