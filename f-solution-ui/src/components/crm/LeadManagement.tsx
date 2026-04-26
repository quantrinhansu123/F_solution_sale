import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, CheckCircle2, UserPlus, Edit2, Trash2, X, Loader2, Presentation, ImagePlus } from 'lucide-react';
import type { LeadView } from '../../utils/crmDb';
import {
  deleteLeadFromDb,
  fetchCrmUserOptions,
  fetchLeadsFromDb,
  insertLeadToDb,
  leadMarkQualifiedInDb,
  updateLeadToDb,
  type CrmUserOption,
} from '../../utils/crmDb';

const MAX_EVIDENCE_IMAGES = 12;
const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      if (typeof r.result === 'string') resolve(r.result);
      else reject(new Error('read'));
    };
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

function collectImageFilesFromClipboard(files: FileList | null, items: DataTransferItemList | null): File[] {
  const out: File[] = [];
  const seen = new Set<string>();
  const add = (f: File) => {
    if (!f.type.startsWith('image/')) return;
    const k = `${f.name}-${f.size}-${f.type}`;
    if (seen.has(k)) return;
    seen.add(k);
    out.push(f);
  };
  if (files?.length) {
    for (const f of Array.from(files)) add(f);
  }
  if (items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image/') === 0) {
        const f = items[i].getAsFile();
        if (f) add(f);
      }
    }
  }
  return out;
}

const LeadManagement: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<LeadView[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadView | null>(null);
  const [userOptions, setUserOptions] = useState<CrmUserOption[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    sourceId: 'FACEBOOK',
    evidenceUrl: '',
    status: 'Mới',
    evidenceImages: [] as string[],
    assignedUserIds: [] as string[],
  });

  const addImagesFromFiles = useCallback(async (fileList: File[] | FileList) => {
    const list = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (!list.length) {
      return;
    }
    const dataUrls: string[] = [];
    for (const f of list) {
      if (f.size > MAX_IMAGE_BYTES) {
        window.alert(
          `Bỏ qua ảnh: tối đa ${(MAX_IMAGE_BYTES / (1024 * 1024)).toFixed(1)}MB/ảnh (${f.name || 'clipboard'}).`
        );
        continue;
      }
      try {
        dataUrls.push(await readFileAsDataUrl(f));
      } catch {
        window.alert('Không đọc được một ảnh.');
      }
    }
    if (!dataUrls.length) return;
    setFormData((prev) => {
      const room = Math.max(0, MAX_EVIDENCE_IMAGES - prev.evidenceImages.length);
      if (room === 0) {
        window.alert(`Đã đủ tối đa ${MAX_EVIDENCE_IMAGES} ảnh. Xóa bớt nếu cần thêm.`);
        return prev;
      }
      const toAdd = dataUrls.slice(0, room);
      if (dataUrls.length > room) {
        window.alert(`Chỉ thêm thêm được ${room} ảnh (tối đa ${MAX_EVIDENCE_IMAGES} ảnh).`);
      }
      return { ...prev, evidenceImages: [...prev.evidenceImages, ...toAdd] };
    });
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setLeads(await fetchLeadsFromDb());
    } catch (e) {
      console.error(e);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    void fetchCrmUserOptions()
      .then(setUserOptions)
      .catch((e) => {
        console.error(e);
        setUserOptions([]);
      });
  }, []);

  const userNameById = useMemo(() => {
    const m = new Map<string, string>();
    userOptions.forEach((u) => m.set(u.id, u.name));
    return m;
  }, [userOptions]);

  const handleOpenModal = (lead?: LeadView) => {
    if (lead) {
      setEditingLead(lead);
      setFormData({
        name: lead.name,
        phone: lead.phone,
        sourceId: lead.sourceId,
        evidenceUrl: lead.evidenceUrl || '',
        status: lead.status,
        evidenceImages: lead.evidenceImages?.length ? [...lead.evidenceImages] : [],
        assignedUserIds: lead.assignedUserIds?.length ? [...lead.assignedUserIds] : [],
      });
    } else {
      setEditingLead(null);
      setFormData({
        name: '',
        phone: '',
        sourceId: 'FACEBOOK',
        evidenceUrl: '',
        status: 'Mới',
        evidenceImages: [],
        assignedUserIds: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingLead) {
        await updateLeadToDb(editingLead.id, { ...formData });
      } else {
        await insertLeadToDb({ ...formData, status: 'Mới' });
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
    if (!window.confirm('Bạn có chắc chắn muốn xóa lead này?')) return;
    try {
      await deleteLeadFromDb(id);
      await reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmQuality = async (id: string) => {
    try {
      await leadMarkQualifiedInDb(id);
      await reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center justify-center text-[13px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400 mb-2" />
        <p className="text-slate-500 text-sm">Đang tải leads từ database…</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-[13px]">
      <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-base font-bold text-slate-900">Danh sách Leads (Marketing)</h3>
          <p className="text-[11px] text-slate-500">Dữ liệu từ Supabase (bảng <code className="text-xs">leads</code>)</p>
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
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Người phụ trách</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bằng chứng</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead, index) => (
              <tr
                key={`${lead.id ?? 'no-id'}-${index}`}
                className="hover:bg-slate-50/50 transition-colors group"
              >
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
                <td className="px-4 py-2.5 text-[12px] text-slate-700 max-w-[200px]">
                  {lead.assignedUserIds?.length ? (
                    <span
                      className="line-clamp-3 font-medium"
                      title={lead.assignedUserIds
                        .map((id) => userNameById.get(id) || id.slice(0, 8))
                        .join(', ')}
                    >
                      {lead.assignedUserIds
                        .map((id) => userNameById.get(id) || `…${id.slice(0, 8)}`)
                        .join(', ')}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 max-w-[180px]">
                  <div className="flex flex-col gap-1.5">
                    {lead.evidenceUrl ? (
                      <a
                        href={lead.evidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-[11px] font-semibold underline underline-offset-2"
                      >
                        Link
                        <ExternalLink size={10} />
                      </a>
                    ) : null}
                    {lead.evidenceImages && lead.evidenceImages.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-0.5">
                        {lead.evidenceImages.slice(0, 4).map((src, i) => (
                          <a
                            key={i}
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0"
                            title="Xem ảnh"
                          >
                            <img
                              src={src}
                              alt=""
                              className="w-8 h-8 object-cover rounded border border-slate-200"
                            />
                          </a>
                        ))}
                        {lead.evidenceImages.length > 4 && (
                          <span className="text-[9px] font-bold text-slate-500">+{lead.evidenceImages.length - 4}</span>
                        )}
                        <span className="text-[9px] text-slate-400 w-full">
                          {lead.evidenceImages.length} ảnh (base64)
                        </span>
                      </div>
                    ) : !lead.evidenceUrl ? (
                      <span className="text-slate-300 text-[11px] italic">Chưa có</span>
                    ) : null}
                  </div>
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
                      type="button"
                      onClick={() => navigate('/crm/demo', { state: { preselectLead: lead } })}
                      className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-all border border-transparent hover:border-purple-100"
                      title="Cơ hội Demo (Sales)"
                    >
                      <Presentation size={14} />
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
                    <button
                      type="button"
                      onClick={() => void handleConfirmQuality(lead.id)}
                      className="bg-green-600 text-white px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 ml-auto hover:bg-green-700 transition-colors shadow-sm mt-1"
                    >
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
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl overflow-x-hidden animate-in zoom-in-95 duration-200">
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
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">Người phụ trách (chỉ tên, chọn nhiều)</label>
                <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/60 p-2 space-y-1.5">
                  {userOptions.length === 0 ? (
                    <p className="text-[10px] text-amber-700 px-1">
                      Chưa tải được danh sách từ bảng <code className="text-[9px]">users</code> (RLS / kết nối).
                    </p>
                  ) : (
                    userOptions.map((u) => (
                      <label
                        key={u.id}
                        className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-800 hover:bg-white/80 rounded-md px-2 py-1"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
                          checked={formData.assignedUserIds.includes(u.id)}
                          onChange={() => {
                            setFormData((prev) => {
                              const set = new Set(prev.assignedUserIds);
                              if (set.has(u.id)) set.delete(u.id);
                              else set.add(u.id);
                              return { ...prev, assignedUserIds: Array.from(set) };
                            });
                          }}
                        />
                        <span className="font-medium leading-tight">{u.name}</span>
                      </label>
                    ))
                  )}
                </div>
                {formData.assignedUserIds.length > 0 && (
                  <p className="text-[10px] text-slate-500">
                    Đã chọn {formData.assignedUserIds.length} người
                  </p>
                )}
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
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase px-1">
                  Ảnh bằng chứng (nhiều ảnh, lưu dạng base64 trong DB)
                </label>
                <div
                  tabIndex={0}
                  role="group"
                  aria-label="Vùng thêm ảnh, hỗ trợ dán từ clipboard"
                  onPaste={(e) => {
                    const files = collectImageFilesFromClipboard(e.clipboardData?.files ?? null, e.clipboardData?.items ?? null);
                    if (files.length) {
                      e.preventDefault();
                      e.stopPropagation();
                      void addImagesFromFiles(files);
                    }
                  }}
                  className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 transition-shadow"
                >
                  <p className="text-[10px] text-slate-500 text-center mb-2 px-1">
                    <strong>Click vùng này</strong> (hoặc Tab tới) rồi <kbd className="px-1 py-0.5 rounded bg-slate-200 text-[9px] font-mono">Ctrl</kbd>
                    +<kbd className="px-1 py-0.5 rounded bg-slate-200 text-[9px] font-mono">V</kbd> để dán ảnh từ clipboard
                  </p>
                  <label className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg border border-slate-200/80 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 cursor-pointer transition-colors text-sm text-slate-600 font-semibold">
                    <ImagePlus size={18} className="text-indigo-600" />
                    Chọn ảnh
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={async (e) => {
                        const files = e.target.files;
                        e.target.value = '';
                        if (!files?.length) return;
                        if (!Array.from(files).some((f) => f.type.startsWith('image/'))) {
                          window.alert('Chỉ chấp nhận file ảnh.');
                          return;
                        }
                        await addImagesFromFiles(files);
                      }}
                    />
                  </label>
                </div>
                <p className="text-[10px] text-slate-500 px-1">
                  Tối đa {MAX_EVIDENCE_IMAGES} ảnh, mỗi ảnh ≤ {(MAX_IMAGE_BYTES / (1024 * 1024)).toFixed(1)}MB (JPEG, PNG, WebP, …).
                </p>
                {formData.evidenceImages.length > 0 && (
                  <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                    {formData.evidenceImages.map((src, idx) => (
                      <li key={idx} className="relative group aspect-square">
                        <img
                          src={src}
                          alt=""
                          className="w-full h-full object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              evidenceImages: prev.evidenceImages.filter((_, i) => i !== idx),
                            }))
                          }
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white text-xs font-black leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                          title="Xóa ảnh"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
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
                  {saving ? '…' : editingLead ? 'Lưu thay đổi' : 'Tạo Lead'}
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
