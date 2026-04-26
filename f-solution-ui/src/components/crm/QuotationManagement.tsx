import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Plus, Edit2, Trash2, X, Loader2, FileSpreadsheet, ExternalLink, FileCheck } from 'lucide-react';
import {
  deleteQuotationFromDb,
  fetchQuotationsFromDb,
  insertQuotationToDb,
  quotationStatusToLabel,
  updateQuotationInDb,
  type QuotationView,
  type QuotationStatusDb,
  type LeadView,
} from '../../utils/crmDb';
import { formatVnd } from '../../utils/formatVnd';

const statusClasses: Record<QuotationStatusDb, string> = {
  draft: 'bg-slate-50 text-slate-600 border-slate-200',
  sent: 'bg-sky-50 text-sky-700 border-sky-100',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  rejected: 'bg-rose-50 text-rose-700 border-rose-100',
};

const QuotationManagement: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [rows, setRows] = useState<QuotationView[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<QuotationView | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    customerName: '',
    customerPhone: '',
    amount: 0,
    status: 'draft' as QuotationStatusDb,
    docUrl: '',
    notes: '',
    leadId: '' as string,
  });

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await fetchQuotationsFromDb());
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  /** Từ màn Demo: mở form tạo báo giá với lead đã gắn. */
  useEffect(() => {
    if (loading) return;
    const lead = (location.state as { fromDemoLead?: LeadView } | null)?.fromDemoLead;
    if (!lead) return;
    navigate('.', { replace: true, state: {} });
    const noteBits = [
      `Từ cơ hội Demo (Sales).`,
      lead.demoDate && `Lịch demo: ${lead.demoDate}`,
      lead.docsUrl && `Biên bản: ${lead.docsUrl}`,
    ].filter(Boolean);
    setEditing(null);
    setFormData({
      code: `BG-${Date.now().toString().slice(-8)}`,
      title: '',
      customerName: lead.name,
      customerPhone: lead.phone,
      amount: 0,
      status: 'draft',
      docUrl: lead.docsUrl && lead.docsUrl.trim() ? lead.docsUrl : '',
      notes: noteBits.join(' '),
      leadId: lead.id,
    });
    setIsModalOpen(true);
  }, [loading, location.state, navigate]);

  const handleOpenModal = (q?: QuotationView) => {
    if (q) {
      setEditing(q);
      setFormData({
        code: q.code,
        title: q.title,
        customerName: q.customerName,
        customerPhone: q.customerPhone,
        amount: q.amount,
        status: q.status,
        docUrl: q.docUrl || '',
        notes: q.notes || '',
        leadId: q.leadId || '',
      });
    } else {
      setEditing(null);
      setFormData({
        code: `BG-${Date.now().toString().slice(-8)}`,
        title: '',
        customerName: '',
        customerPhone: '',
        amount: 0,
        status: 'draft',
        docUrl: '',
        notes: '',
        leadId: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        code: formData.code,
        title: formData.title,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        amount: formData.amount,
        status: formData.status,
        docUrl: formData.docUrl || undefined,
        notes: formData.notes || undefined,
        leadId: formData.leadId.trim() ? formData.leadId.trim() : null,
      };
      if (editing) {
        await updateQuotationInDb(editing.id, payload);
      } else {
        await insertQuotationToDb(payload);
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
    if (!window.confirm('Xóa báo giá này?')) return;
    try {
      await deleteQuotationFromDb(id);
      await reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center text-[13px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400 mb-2" />
        <p className="text-slate-500 text-sm">Đang tải báo giá…</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-[13px]">
      <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-base font-bold text-slate-900">Báo giá (Sales)</h3>
          <p className="text-[11px] text-slate-500">
            Mỗi dòng dưới có <strong>« In / mẫu A4 »</strong> (dữ liệu từ CRM) hoặc mở mẫu tại{' '}
            <Link
              to="/baogiafinal.html"
              className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-0.5"
            >
              /baogiafinal.html
              <ExternalLink size={10} className="inline shrink-0" />
            </Link>{' '}
            (cần <code className="text-[10px]">?id=</code>).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/baogiafinal.html"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors"
            title="Hướng dẫn: chọn dòng dưới bảng rồi bấm In A4, hoặc thêm ?id= UUID"
          >
            <ExternalLink size={16} />
            Trang mẫu báo giá
          </Link>
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Tạo báo giá
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã BG</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nội dung</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá trị</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-sm">
                  <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  Chưa có báo giá. Bấm <strong className="text-slate-600">Tạo báo giá</strong> để thêm.
                </td>
              </tr>
            ) : (
              rows.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <FileSpreadsheet size={14} className="text-slate-400" />
                      <span className="font-bold text-slate-900">{q.code}</span>
                    </div>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                      {q.createdAt ? new Date(q.createdAt).toLocaleString('vi-VN') : ''}
                    </p>
                  </td>
                  <td className="px-4 py-2.5">
                    <p className="font-bold text-slate-900 leading-tight">{q.customerName || '—'}</p>
                    <p className="text-[11px] text-slate-500">{q.customerPhone || '—'}</p>
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-slate-700 max-w-[200px]">
                    <span className="line-clamp-2">{q.title || '—'}</span>
                  </td>
                  <td className="px-4 py-2.5 font-bold text-slate-900 whitespace-nowrap">{formatVnd(q.amount)}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${statusClasses[q.status]}`}
                    >
                      {quotationStatusToLabel(q.status)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1 flex-wrap">
                      <Link
                        to={`/baogiafinal.html?id=${encodeURIComponent(q.id)}&autoprint=1`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md hover:bg-indigo-100"
                        title="Mở mẫu và bật in A4 ngay"
                      >
                        In A4
                      </Link>
                      {q.docUrl ? (
                        <a
                          href={q.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md border border-transparent hover:border-indigo-100"
                          title="File báo giá"
                        >
                          <FileText size={14} />
                        </a>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleOpenModal(q)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md border border-transparent hover:border-blue-100"
                        title="Sửa"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          navigate('/crm/contracts', {
                            state: {
                              fromQuotation: {
                                id: q.id,
                                code: q.code,
                                customerName: q.customerName,
                                amount: q.amount,
                                leadId: q.leadId ?? null,
                                docUrl: q.docUrl ?? '#',
                              },
                            },
                          })
                        }
                        className="px-2 py-1 text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md hover:bg-emerald-100 inline-flex items-center gap-1"
                        title="Tạo hợp đồng từ báo giá này"
                      >
                        <FileCheck size={12} />
                        Lên HĐ
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(q.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md border border-transparent hover:border-red-100"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-slate-900">
                {editing ? 'Sửa báo giá' : 'Tạo báo giá mới'}
              </h3>
              <button type="button" onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={(e) => void handleSave(e)} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Mã báo giá</label>
                <input
                  required
                  type="text"
                  readOnly={!!editing}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none text-sm read-only:bg-slate-50"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="VD: BG-2026-001"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Tên khách / Công ty</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none text-sm"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase px-1">Số điện thoại</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none text-sm"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase px-1">Giá trị (VNĐ)</label>
                  <input
                    required
                    type="number"
                    min={0}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none text-sm"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Nội dung / gói dịch vụ</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none text-sm"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Gói triển khai AMS + 1 năm vận hành"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Trạng thái</label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none text-sm bg-white"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as QuotationStatusDb })
                  }
                >
                  <option value="draft">Nháp</option>
                  <option value="sent">Đã gửi</option>
                  <option value="accepted">Chốt</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Link file PDF / Drive</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none text-sm"
                  value={formData.docUrl}
                  onChange={(e) => setFormData({ ...formData, docUrl: e.target.value })}
                  placeholder="https://..."
                />
                <p className="text-[10px] text-slate-500">
                  Sau khi lưu, mở <strong className="text-slate-700">In A4</strong> trên dòng tương ứng trong bảng để xem mẫu <code className="text-[9px]">baogiafinal</code> với dữ liệu CRM. Hoặc:{' '}
                  <Link
                    to={editing ? `/baogiafinal.html?id=${encodeURIComponent(editing.id)}` : '/baogiafinal.html'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    {editing ? 'Mở mẫu cho báo giá này' : 'Hướng dẫn mẫu in'}
                  </Link>
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Ghi chú (tuỳ chọn)</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none text-sm resize-y"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">
                  Lead ID (UUID) — nếu đã gắn với lead trong CRM
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none text-sm font-mono text-[12px]"
                  value={formData.leadId}
                  onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                  placeholder="Để trống nếu không liên kết"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all border border-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {saving ? '…' : editing ? 'Lưu' : 'Tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationManagement;
