import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, FileText, CheckCircle2, Presentation, Edit2, Trash2, X, Plus, Loader2, Search, FileCheck, FileSpreadsheet } from 'lucide-react';
import type { LeadView } from '../../utils/crmDb';
import {
  deleteLeadFromDb,
  fetchLeadsFromDb,
  fetchQualifiedLeadsForDemos,
  logCompletedDemo,
  updateLeadToDb,
} from '../../utils/crmDb';

const DemoManagement: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [demos, setDemos] = useState<LeadView[]>([]);
  const [allLeads, setAllLeads] = useState<LeadView[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDemo, setEditingDemo] = useState<LeadView | null>(null);
  /** Lead đã chọn khi tạo cơ hội mới (gắn từ danh sách Lead) */
  const [selectedLead, setSelectedLead] = useState<LeadView | null>(null);
  const [leadSearch, setLeadSearch] = useState('');
  const [openLeadList, setOpenLeadList] = useState(false);
  const leadComboRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    demoDate: '',
    docsUrl: '',
  });

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setDemos(await fetchQualifiedLeadsForDemos());
    } catch (e) {
      console.error(e);
      setDemos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const demoIdSet = useMemo(() => new Set(demos.map((d) => d.id)), [demos]);

  /** Từ màn Leads: mở modal với lead đã chọn (hoặc sửa cơ hội nếu lead đã có trong Demo). */
  useEffect(() => {
    if (loading) return;
    const pl = (location.state as { preselectLead?: LeadView } | null)?.preselectLead;
    if (!pl) return;
    navigate('.', { replace: true, state: {} });
    const existing = demos.find((d) => d.id === pl.id);
    if (existing) {
      setEditingDemo(existing);
      setSelectedLead(null);
      setLeadSearch('');
      setOpenLeadList(false);
      setFormData({
        name: existing.name,
        phone: existing.phone,
        demoDate: existing.demoDate || '',
        docsUrl: existing.docsUrl || '',
      });
    } else {
      setEditingDemo(null);
      setSelectedLead(pl);
      setLeadSearch('');
      setOpenLeadList(false);
      setFormData({
        name: '',
        phone: '',
        demoDate: pl.demoDate || '',
        docsUrl: pl.docsUrl || '',
      });
    }
    setIsModalOpen(true);
  }, [loading, location.state, demos, navigate]);

  useEffect(() => {
    if (!isModalOpen || editingDemo) return;
    void fetchLeadsFromDb()
      .then(setAllLeads)
      .catch(() => setAllLeads([]));
  }, [isModalOpen, editingDemo]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!leadComboRef.current?.contains(e.target as Node)) setOpenLeadList(false);
    };
    if (isModalOpen) document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isModalOpen]);

  const pickerCandidates = useMemo(
    () => allLeads.filter((l) => !demoIdSet.has(l.id)),
    [allLeads, demoIdSet]
  );

  const filteredLeads = useMemo(() => {
    const q = leadSearch.trim().toLowerCase();
    if (!q) return pickerCandidates.slice(0, 50);
    return pickerCandidates
      .filter((l) => {
        const name = l.name.toLowerCase();
        const phoneDigits = l.phone.replace(/\D/g, '');
        const qDigits = q.replace(/\D/g, '');
        return (
          name.includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          (qDigits.length > 0 && phoneDigits.includes(qDigits)) ||
          l.sourceId.toLowerCase().includes(q) ||
          String(l.id).toLowerCase().includes(q)
        );
      })
      .slice(0, 50);
  }, [pickerCandidates, leadSearch]);

  const handleOpenModal = (demo?: LeadView) => {
    if (demo) {
      setEditingDemo(demo);
      setSelectedLead(null);
      setLeadSearch('');
      setOpenLeadList(false);
      setFormData({
        name: demo.name,
        phone: demo.phone,
        demoDate: demo.demoDate || '',
        docsUrl: demo.docsUrl || '',
      });
    } else {
      setEditingDemo(null);
      setSelectedLead(null);
      setLeadSearch('');
      setOpenLeadList(false);
      setFormData({
        name: '',
        phone: '',
        demoDate: '',
        docsUrl: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDemo(null);
    setSelectedLead(null);
    setLeadSearch('');
    setOpenLeadList(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDemo) {
      if (!selectedLead) return;
    }
    setSaving(true);
    try {
      if (editingDemo) {
        await updateLeadToDb(editingDemo.id, {
          name: formData.name,
          phone: formData.phone,
          sourceId: editingDemo.sourceId,
          status: 'Chất lượng',
          evidenceUrl: editingDemo.evidenceUrl || '',
          demoDate: formData.demoDate,
          docsUrl: formData.docsUrl,
        });
      } else if (selectedLead) {
        await updateLeadToDb(selectedLead.id, {
          name: selectedLead.name,
          phone: selectedLead.phone,
          sourceId: selectedLead.sourceId,
          status: 'Chất lượng',
          evidenceUrl: selectedLead.evidenceUrl || '',
          demoDate: formData.demoDate,
          docsUrl: formData.docsUrl,
        });
      }
      await reload();
      handleCloseModal();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa cơ hội này? (sẽ xóa bản ghi lead)')) return;
    try {
      await deleteLeadFromDb(id);
      await reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDemo = async (leadId: string) => {
    try {
      await logCompletedDemo(leadId);
      await reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center text-[13px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400 mb-2" />
        <p className="text-slate-500 text-sm">Đang tải (lead chất lượng)…</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-[13px]">
      <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-base font-bold text-slate-900">Cơ hội &amp; Demo (Sales)</h3>
          <p className="text-[11px] text-slate-500">Lead <code className="text-xs">qualified</code> từ Supabase</p>
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
                      onClick={() => void handleDelete(lead.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all border border-transparent hover:border-red-100"
                      title="Xóa"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex flex-col items-end gap-1 mt-1">
                    <div className="flex flex-wrap items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => void handleConfirmDemo(lead.id)}
                        className="bg-slate-900 text-white px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-slate-800 transition-all shadow-sm"
                      >
                        <CheckCircle2 size={12} />
                        Xác nhận (+50k)
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/crm/quotes', { state: { fromDemoLead: lead } })}
                        className="bg-indigo-600 text-white px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-indigo-700 transition-all shadow-sm border border-indigo-700/30"
                        title="Tạo báo giá từ cơ hội này (gắn lead)"
                      >
                        <FileSpreadsheet size={12} />
                        Lên báo giá
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/crm/contracts', { state: { fromDemoLead: lead } })}
                        className="bg-emerald-600 text-white px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-700 transition-all shadow-sm border border-emerald-700/30"
                        title="Tạo hợp đồng từ cơ hội này"
                      >
                        <FileCheck size={12} />
                        Lên hợp đồng
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            <form onSubmit={e => void handleSave(e)} className="p-6 space-y-4">
              {editingDemo ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase px-1">Khách hàng</label>
                    <div className="px-3 py-2 rounded-lg border border-slate-100 bg-slate-50 text-sm text-slate-800">
                      <span className="font-bold">{formData.name}</span>
                      <span className="text-slate-400 mx-2">·</span>
                      <span className="text-slate-600">{formData.phone}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-1.5" ref={leadComboRef}>
                  <label className="text-[11px] font-black text-slate-400 uppercase px-1">
                    Chọn khách hàng (Lead) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      size={16}
                    />
                    <input
                      type="text"
                      autoComplete="off"
                      value={selectedLead ? `${selectedLead.name} · ${selectedLead.phone}` : leadSearch}
                      onChange={(e) => {
                        setSelectedLead(null);
                        setLeadSearch(e.target.value);
                        setOpenLeadList(true);
                      }}
                      onFocus={() => {
                        if (selectedLead) {
                          setLeadSearch(`${selectedLead.name} ${selectedLead.phone}`.trim());
                          setSelectedLead(null);
                        }
                        setOpenLeadList(true);
                      }}
                      className="w-full pl-9 pr-10 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm"
                      placeholder="Gõ tên, SĐT, nguồn hoặc ID để tìm lead…"
                    />
                    {selectedLead && (
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 hover:text-slate-900"
                        onClick={() => {
                          setSelectedLead(null);
                          setLeadSearch('');
                        }}
                      >
                        Đổi
                      </button>
                    )}
                    {openLeadList && !selectedLead && (
                      <ul className="absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                        {filteredLeads.length === 0 ? (
                          <li className="px-3 py-2 text-xs text-slate-500">
                            {pickerCandidates.length === 0
                              ? 'Không còn lead trống — tất cả đã có trong Demo, hoặc chưa có lead ở màn Leads.'
                              : 'Không khớp từ khóa.'}
                          </li>
                        ) : (
                          filteredLeads.map((l) => (
                            <li key={l.id}>
                              <button
                                type="button"
                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex flex-col gap-0.5"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  setSelectedLead(l);
                                  setLeadSearch('');
                                  setOpenLeadList(false);
                                }}
                              >
                                <span className="font-bold text-slate-900">{l.name}</span>
                                <span className="text-[11px] text-slate-500">
                                  {l.phone} · {l.sourceId} · {l.status}
                                </span>
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 px-1">
                    Chỉ hiện lead chưa có trong bảng Demo bên dưới. Khi lưu, lead được gắn trạng thái Chất lượng + lịch/biên bản demo.
                  </p>
                </div>
              )}
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
                  disabled={saving || (!editingDemo && !selectedLead)}
                  className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {saving ? '…' : editingDemo ? 'Lưu thay đổi' : 'Tạo mới'}
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
