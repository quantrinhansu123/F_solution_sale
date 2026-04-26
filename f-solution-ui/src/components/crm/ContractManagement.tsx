import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileCheck, Download, BadgeCheck, TrendingUp, Wallet, Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import type { ContractView, LeadView } from '../../utils/crmDb';
import { formatVnd, formatVndDigits, parseVndDigitsInput } from '../../utils/formatVnd';
import {
  contractFormStatusLabel,
  deleteContractFromDb,
  fetchContractsFromDb,
  fetchLeadsFromDb,
  insertContractToDb,
  updateContractInDb,
} from '../../utils/crmDb';

const ContractManagement: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<ContractView[]>([]);
  const [leadOptions, setLeadOptions] = useState<LeadView[]>([]);
  const [leadNameById, setLeadNameById] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<ContractView | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    value: 0,
    formStatus: 'Pending' as 'Paid' | 'Deposit' | 'Pending',
    docUrl: '#',
    /** Gắn bản ghi hợp đồng với lead (từ màn Demo) */
    projectId: null as string | null,
    linkedCustomerName: null as string | null,
  });

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setContracts(await fetchContractsFromDb());
    } catch (e) {
      console.error(e);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    void fetchLeadsFromDb()
      .then((rows) => {
        setLeadOptions(rows);
        const m = new Map<string, string>();
        rows.forEach((x) => m.set(x.id, x.name));
        setLeadNameById(m);
      })
      .catch(() => {
        setLeadOptions([]);
        setLeadNameById(new Map());
      });
  }, []);

  /** Từ màn Demo: mở sẵn form tạo HĐ, gắn project_id = lead. */
  useEffect(() => {
    if (loading) return;
    const lead = (location.state as { fromDemoLead?: LeadView } | null)?.fromDemoLead;
    if (!lead) return;
    navigate('.', { replace: true, state: {} });
    const idSuffix =
      String(lead.id)
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(-8) || Date.now().toString().slice(-6);
    setEditingContract(null);
    setFormData({
      id: `HD-${idSuffix}`,
      value: 0,
      formStatus: 'Pending',
      docUrl: lead.docsUrl && lead.docsUrl.trim() ? lead.docsUrl : '#',
      projectId: lead.id,
      linkedCustomerName: lead.name,
    });
    setIsModalOpen(true);
  }, [loading, location.state, navigate]);

  /** Từ màn Báo giá: mở sẵn form tạo HĐ theo báo giá đã chọn. */
  useEffect(() => {
    if (loading) return;
    const quote = (
      location.state as {
        fromQuotation?: {
          id: string;
          code: string;
          customerName: string;
          amount: number;
          leadId?: string | null;
          docUrl?: string | null;
        };
      } | null
    )?.fromQuotation;
    if (!quote) return;
    navigate('.', { replace: true, state: {} });
    const safeCode = String(quote.code || Date.now().toString().slice(-6))
      .replace(/[^a-zA-Z0-9-]/g, '')
      .slice(0, 24);
    setEditingContract(null);
    setFormData({
      id: `HD-${safeCode}`,
      value: Number.isFinite(quote.amount) ? Math.max(0, quote.amount) : 0,
      formStatus: 'Pending',
      docUrl: quote.docUrl && quote.docUrl.trim() ? quote.docUrl : '#',
      projectId: quote.leadId ?? null,
      linkedCustomerName: quote.customerName || null,
    });
    setIsModalOpen(true);
  }, [loading, location.state, navigate]);

  const handleOpenModal = (contract?: ContractView) => {
    if (contract) {
      setEditingContract(contract);
      setFormData({
        id: contract.id,
        value: contract.value,
        formStatus: contract.formStatus,
        docUrl: contract.docUrl || '#',
        projectId: contract.projectId ?? null,
        linkedCustomerName: contract.projectId ? leadNameById.get(contract.projectId) || null : null,
      });
    } else {
      setEditingContract(null);
      setFormData({
        id: `HD-${Date.now().toString().slice(-4)}`,
        value: 0,
        formStatus: 'Pending',
        docUrl: '#',
        projectId: null,
        linkedCustomerName: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContract(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingContract) {
        await updateContractInDb(editingContract.id, {
          value: formData.value,
          formStatus: formData.formStatus,
          docUrl: formData.docUrl,
          projectId: formData.projectId,
        });
      } else {
        await insertContractToDb({
          id: formData.id,
          value: formData.value,
          formStatus: formData.formStatus,
          docUrl: formData.docUrl,
          projectId: formData.projectId,
        });
      }
      await reload();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      const msg =
        err instanceof Error && err.message
          ? err.message
          : 'Không lưu được hợp đồng. Kiểm tra lại cấu trúc bảng contracts/RLS trên Supabase.';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hợp đồng này?')) return;
    try {
      await deleteContractFromDb(id);
      await reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 text-[13px]">
        <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400 mb-2" />
          <p className="text-slate-500 text-sm">Đang tải hợp đồng từ database…</p>
        </div>
      </div>
    );
  }

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
                <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
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
                  <td className="px-4 py-2.5 text-[12px] text-slate-700">
                    {contract.projectId && leadNameById.get(contract.projectId)
                      ? leadNameById.get(contract.projectId)
                      : '—'}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-slate-900 text-[12px]">
                    {formatVnd(contract.value)}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1 text-emerald-600 font-black text-[12px]">
                      <TrendingUp size={12} />
                      {formatVnd(contract.value * 0.31)}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border flex items-center gap-1 w-fit ${
                      contract.formStatus === 'Paid' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {contract.formStatus === 'Paid' && <BadgeCheck size={10} />}
                      {contractFormStatusLabel(contract.formStatus)}
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
              {formData.projectId && (
                <p className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                  Từ cơ hội Demo{formData.linkedCustomerName ? ` — ${formData.linkedCustomerName}` : ''} —{' '}
                  <span className="font-bold">
                    lưu <code className="text-xs">project_id</code> = lead
                  </span>
                </p>
              )}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Khách hàng</label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm bg-white"
                  value={formData.projectId || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      projectId: e.target.value || null,
                      linkedCustomerName: e.target.value ? leadNameById.get(e.target.value) || null : null,
                    }))
                  }
                >
                  <option value="">— Chưa liên kết khách hàng —</option>
                  {leadOptions.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Mã hợp đồng</label>
                <input
                  required
                  type="text"
                  readOnly={!!editingContract}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm read-only:bg-slate-50"
                  value={formData.id}
                  onChange={e => setFormData({ ...formData, id: e.target.value })}
                  placeholder="VD: HD-001"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Giá trị hợp đồng (VNĐ)</label>
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm tabular-nums"
                  value={formatVndDigits(formData.value)}
                  onChange={(e) =>
                    setFormData({ ...formData, value: parseVndDigitsInput(e.target.value) })
                  }
                />
                <p className="text-[11px] text-slate-500">
                  Hoa hồng 31% (dự kiến):{' '}
                  <span className="font-bold text-slate-800 tabular-nums">
                    {formatVnd(Math.round(formData.value * 0.31))}
                  </span>
                </p>
              </div>
                <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Trạng thái thanh toán</label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm bg-white"
                  value={formData.formStatus}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      formStatus: e.target.value as 'Paid' | 'Deposit' | 'Pending',
                    })
                  }
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
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {saving ? '…' : editingContract ? 'Lưu thay đổi' : 'Tạo hợp đồng'}
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
