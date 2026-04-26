import { supabase } from '../supabase';

/** Tên cột khoá chính trên bảng public.leads (mặc định: id) */
const LEADS_ID_COL = import.meta.env.VITE_LEADS_ID_COLUMN || 'id';

/** Chỉ bật sau khi đã chạy migration 012 trên Supabase (có cột demo_date, …). Thêm: VITE_LEADS_DEMO_COLUMNS=true */
const leadsDemoColumns =
  import.meta.env.VITE_LEADS_DEMO_COLUMNS === 'true' ||
  import.meta.env.VITE_LEADS_DEMO_COLUMNS === '1';

/** Cột theo bảng public.leads */
export type LeadRow = {
  id: string;
  name: string;
  phone: string;
  source_id: string;
  status: 'new' | 'qualified';
  evidence_url: string | null;
  demo_date: string | null;
  docs_url: string | null;
  created_at: string;
};

export type LeadView = {
  id: string;
  name: string;
  phone: string;
  sourceId: string;
  status: string;
  evidenceUrl?: string;
  /** Các ảnh bằng chứng dạng data URL (base64) */
  evidenceImages?: string[];
  /** public.users.user_id — nhiều người phụ trách (thứ tự theo mảng lưu) */
  assignedUserIds: string[];
  demoDate?: string;
  docsUrl?: string;
};

/** Dùng cho checkbox "Người phụ trách" — chỉ hiển thị tên. */
export type CrmUserOption = {
  id: string;
  /** Chỉ tên (hoặc phần trước @ nếu chưa có tên) */
  name: string;
};

function displayNameFromUserRow(r: Record<string, unknown>): string {
  const n = String((r.full_name as string) || (r.name as string) || '').trim();
  if (n) return n;
  const em = String((r.email as string) || '');
  if (em) {
    const local = em.split('@')[0] || em;
    return local;
  }
  return `User ${String(r.user_id ?? '').slice(0, 8)}`;
}

function parseAssignedUserIds(r: Record<string, unknown>): string[] {
  const v = r.assigned_user_ids;
  const fromJson = (): string[] => {
    if (v == null) return [];
    if (Array.isArray(v)) return v.map((x) => String(x)).filter((s) => s.length > 0);
    if (typeof v === 'string') {
      try {
        const p = JSON.parse(v);
        if (Array.isArray(p)) return p.map(String).filter(Boolean);
      } catch {
        return [];
      }
    }
    return [];
  };
  const ids = fromJson();
  if (ids.length) return ids;
  const one = r.assigned_to ? String(r.assigned_to) : '';
  return one ? [one] : [];
}

/** Danh sách user từ bảng public.users (cần quyền SELECT). */
export async function fetchCrmUserOptions(): Promise<CrmUserOption[]> {
  const { data, error } = await supabase
    .from('users')
    .select('user_id, full_name, email')
    .order('full_name', { ascending: true, nullsFirst: false });
  if (error) {
    const retry = await supabase.from('users').select('user_id, email, full_name');
    if (retry.error) {
      const minimal = await supabase.from('users').select('user_id, email');
      if (minimal.error) {
        console.error('fetchCrmUserOptions', error, retry.error, minimal.error);
        throw error;
      }
      return ((minimal.data as Record<string, unknown>[]) || [])
        .map((r) => ({
          id: String(r.user_id ?? ''),
          name: displayNameFromUserRow(r),
        }))
        .filter((o) => o.id);
    }
    return ((retry.data as Record<string, unknown>[]) || [])
      .map((r) => ({
        id: String(r.user_id ?? ''),
        name: displayNameFromUserRow(r),
      }))
      .filter((o) => o.id);
  }
  return ((data as Record<string, unknown>[]) || [])
    .map((r) => ({
      id: String(r.user_id ?? ''),
      name: displayNameFromUserRow(r),
    }))
    .filter((o) => o.id);
}

/** Màn /settings — danh sách từ public.users (SELECT theo RLS). */
export type SettingsUserView = {
  id: string;
  name: string;
  email: string;
  dept: string;
  status: string;
};

function userRowToSettingsView(r: Record<string, unknown>): SettingsUserView | null {
  const id = String(r.user_id ?? '');
  if (!id) return null;
  const name = displayNameFromUserRow(r);
  const email = String((r.email as string) || '');
  const deptRaw = r.department;
  const dept =
    typeof deptRaw === 'string' && deptRaw.trim() ? deptRaw.trim() : '—';
  let status = 'Active';
  if (r.is_active === false) status = 'Inactive';
  else if (r.is_active === true) status = 'Active';
  return { id, name, email, dept, status };
}

function mapToSettingsUserViews(rows: Record<string, unknown>[]): SettingsUserView[] {
  return rows
    .map((r) => userRowToSettingsView(r))
    .filter((x): x is SettingsUserView => x != null);
}

export async function fetchSettingsUsers(): Promise<SettingsUserView[]> {
  const { data, error } = await supabase
    .from('users')
    .select('user_id, full_name, name, email, department, is_active')
    .order('full_name', { ascending: true, nullsFirst: false });
  if (!error) return mapToSettingsUserViews((data as Record<string, unknown>[]) || []);

  const r2 = await supabase
    .from('users')
    .select('user_id, full_name, name, email, department')
    .order('full_name', { ascending: true, nullsFirst: false });
  if (!r2.error) return mapToSettingsUserViews((r2.data as Record<string, unknown>[]) || []);

  const r3 = await supabase
    .from('users')
    .select('user_id, full_name, email, department')
    .order('full_name', { ascending: true, nullsFirst: false });
  if (!r3.error) return mapToSettingsUserViews((r3.data as Record<string, unknown>[]) || []);

  const r4 = await supabase
    .from('users')
    .select('user_id, full_name, email')
    .order('full_name', { ascending: true, nullsFirst: false });
  if (!r4.error) return mapToSettingsUserViews((r4.data as Record<string, unknown>[]) || []);

  const r5 = await supabase
    .from('users')
    .select('user_id, email, full_name')
    .order('email', { ascending: true, nullsFirst: false });
  if (!r5.error) return mapToSettingsUserViews((r5.data as Record<string, unknown>[]) || []);

  const r6 = await supabase
    .from('users')
    .select('user_id, email')
    .order('email', { ascending: true, nullsFirst: false });
  if (r6.error) {
    console.error('fetchSettingsUsers', error, r2.error, r3.error, r4.error, r5.error, r6.error);
    throw r6.error;
  }
  return mapToSettingsUserViews((r6.data as Record<string, unknown>[]) || []);
}

function parseEvidenceImagesRow(v: unknown): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string');
  return [];
}

function rowId(row: Record<string, unknown>) {
  const v = row[LEADS_ID_COL] ?? row.id;
  return v != null ? String(v) : '';
}

export function leadToView(row: Record<string, unknown> | LeadRow): LeadView {
  const r = row as Record<string, unknown>;
  const st = String(r.status ?? 'new');
  return {
    id: rowId(r),
    name: String(r.name ?? ''),
    phone: String(r.phone ?? ''),
    sourceId: String(r.source_id ?? ''),
    status: st === 'qualified' ? 'Chất lượng' : 'Mới',
    evidenceUrl: (r.evidence_url as string | null | undefined) || undefined,
    evidenceImages: parseEvidenceImagesRow(r.evidence_images),
    assignedUserIds: parseAssignedUserIds(r),
    demoDate: r.demo_date
      ? new Date(String(r.demo_date)).toISOString().slice(0, 10)
      : undefined,
    docsUrl: (r.docs_url as string | null | undefined) || undefined,
  };
}

function uiToLeadStatus(s: string): 'new' | 'qualified' {
  if (s === 'Chất lượng' || s === 'Qualified' || s === 'qualified') return 'qualified';
  return 'new';
}

export async function fetchLeadsFromDb(): Promise<LeadView[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchLeadsFromDb', error);
    throw error;
  }
  return (data as Record<string, unknown>[]).map(leadToView);
}

export async function fetchQualifiedLeadsForDemos(): Promise<LeadView[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('status', 'qualified')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchQualifiedLeadsForDemos', error);
    throw error;
  }
  return (data as Record<string, unknown>[]).map(leadToView);
}

type LeadInsert = {
  name: string;
  phone: string;
  sourceId: string;
  status: string;
  evidenceUrl: string;
  evidenceImages?: string[];
  assignedUserIds?: string[];
  demoDate?: string;
  docsUrl?: string;
};

function demoDateToTimestamptz(isoOrDate: string | undefined) {
  if (!isoOrDate) return null;
  const d = new Date(isoOrDate);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export async function insertLeadToDb(p: LeadInsert) {
  const base: Record<string, unknown> = {
    name: p.name,
    phone: p.phone,
    source_id: p.sourceId,
    status: uiToLeadStatus(p.status),
    evidence_url: p.evidenceUrl || null,
    evidence_images: p.evidenceImages && p.evidenceImages.length > 0 ? p.evidenceImages : [],
    assigned_user_ids: p.assignedUserIds && p.assignedUserIds.length > 0 ? p.assignedUserIds : [],
  };
  if (leadsDemoColumns) {
    base.demo_date = demoDateToTimestamptz(p.demoDate);
    base.docs_url = p.docsUrl || null;
  }
  const { data, error } = await supabase
    .from('leads')
    .insert(base)
    .select(LEADS_ID_COL)
    .single();
  if (error) throw error;
  return data;
}

export async function updateLeadToDb(
  id: string,
  p: {
    name: string;
    phone: string;
    sourceId: string;
    status: string;
    evidenceUrl: string;
    evidenceImages?: string[];
    /** Nếu có, cập nhật danh sách phụ trách; nếu bỏ qua, giữ nguyên DB (vd. từ màn Demo). */
    assignedUserIds?: string[] | null;
    demoDate?: string;
    docsUrl?: string;
  }
) {
  const u: Record<string, unknown> = {
    name: p.name,
    phone: p.phone,
    source_id: p.sourceId,
    status: uiToLeadStatus(p.status),
    evidence_url: p.evidenceUrl || null,
  };
  if (p.evidenceImages !== undefined) u.evidence_images = p.evidenceImages;
  if (p.assignedUserIds !== undefined) {
    u.assigned_user_ids = p.assignedUserIds && p.assignedUserIds.length > 0 ? p.assignedUserIds : [];
  }
  if (leadsDemoColumns) {
    u.updated_at = new Date().toISOString();
    if (p.demoDate !== undefined) u.demo_date = demoDateToTimestamptz(p.demoDate);
    if (p.docsUrl !== undefined) u.docs_url = p.docsUrl || null;
  }
  const { error } = await supabase.from('leads').update(u).eq(LEADS_ID_COL, id);
  if (error) throw error;
}

export async function deleteLeadFromDb(id: string) {
  const { error } = await supabase.from('leads').delete().eq(LEADS_ID_COL, id);
  if (error) throw error;
}

/** Ghi demo đã xong (bảng sales_activities) cho CRM tổng quan. */
export async function logCompletedDemo(leadId: string) {
  const { error } = await supabase.from('sales_activities').insert({
    type: 'demo',
    status: 'completed',
    lead_id: leadId,
  });
  if (error) throw error;
}

export async function leadMarkQualifiedInDb(leadId: string) {
  const u: Record<string, unknown> = { status: 'qualified' };
  if (leadsDemoColumns) u.updated_at = new Date().toISOString();
  const { error } = await supabase.from('leads').update(u).eq(LEADS_ID_COL, leadId);
  if (error) throw error;
}

/** Cột public.contracts */
export type ContractRow = {
  id: string;
  project_id: string | null;
  total_value: string | number;
  status: 'signed' | 'paid';
  doc_url: string | null;
  created_at: string;
};

/** Form: Paid = đã thanh toán; Deposit / Pending = lưu DB dạng signed */
function formStatusToDb(s: string): 'signed' | 'paid' {
  if (s === 'Paid' || s === 'paid') return 'paid';
  return 'signed';
}

function dbToFormStatus(s: 'signed' | 'paid'): 'Paid' | 'Deposit' | 'Pending' {
  if (s === 'paid') return 'Paid';
  return 'Pending';
}

export function contractFormStatusLabel(
  s: 'Paid' | 'Deposit' | 'Pending' | string
) {
  if (s === 'Paid') return 'Đã thanh toán';
  if (s === 'Deposit') return 'Đã đặt cọc';
  return 'Chờ thanh toán';
}

export type ContractView = {
  id: string;
  value: number;
  formStatus: 'Paid' | 'Deposit' | 'Pending';
  docUrl: string;
  projectId?: string | null;
};

export function contractToView(c: ContractRow): ContractView {
  return {
    id: c.id,
    value: Number(c.total_value),
    formStatus: dbToFormStatus(c.status),
    docUrl: c.doc_url || '#',
    projectId: c.project_id ?? null,
  };
}

function isContractsTableMissing(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const e = error as { code?: string; message?: string };
  return (
    e.code === 'PGRST205' &&
    typeof e.message === 'string' &&
    e.message.includes("public.contracts")
  );
}

function isMissingContractsColumn(error: unknown, col: string): boolean {
  if (!error || typeof error !== 'object') return false;
  const e = error as { code?: string; message?: string };
  const msg = typeof e.message === 'string' ? e.message : '';
  const pgrstMissing =
    e.code === 'PGRST204' &&
    msg.includes(`'${col}'`) &&
    msg.includes("'contracts'");
  const pgMissing =
    e.code === '42703' &&
    msg.toLowerCase().includes(`contracts.${col}`.toLowerCase()) &&
    msg.toLowerCase().includes('does not exist');
  return pgrstMissing || pgMissing;
}

function isContractsProjectForeignKeyViolation(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const e = error as { code?: string; message?: string };
  if (e.code !== '23503') return false;
  const msg = String(e.message || '').toLowerCase();
  return msg.includes('contracts_project_id_fkey') || msg.includes('table "projects"');
}

export async function fetchContractsFromDb(): Promise<ContractView[]> {
  const { data, error } = await supabase
    .from('contracts')
    .select('id, project_id, total_value, status, doc_url, created_at')
    .order('created_at', { ascending: false });
  if (error) {
    if (isContractsTableMissing(error)) {
      console.warn('Bảng public.contracts chưa tồn tại. Hãy chạy migration 000_crm_earnings_foundation.sql.');
      return [];
    }
    if (isMissingContractsColumn(error, 'id')) {
      const retryNoId = await supabase
        .from('contracts')
        .select('project_id, total_value, status, doc_url, created_at')
        .order('created_at', { ascending: false });
      if (!retryNoId.error) {
        const rows = ((retryNoId.data as Record<string, unknown>[]) || []).map((r, idx) => ({
          id:
            (r.project_id ? String(r.project_id) : '') ||
            (r.created_at ? `legacy-${String(r.created_at)}` : `legacy-${idx + 1}`),
          project_id: r.project_id ? String(r.project_id) : null,
          total_value: Number(r.total_value ?? 0),
          status: (r.status as 'signed' | 'paid') || 'signed',
          doc_url: (r.doc_url as string | null) ?? null,
          created_at: String(r.created_at ?? ''),
        }));
        return rows.map(contractToView);
      }
      throw retryNoId.error;
    }
    const retryNoDoc = await supabase
      .from('contracts')
      .select('id, project_id, total_value, status, created_at')
      .order('created_at', { ascending: false });
    if (!retryNoDoc.error) {
      const rows = ((retryNoDoc.data as Record<string, unknown>[]) || []).map((r) => ({
        id: String(r.id ?? ''),
        project_id: r.project_id ? String(r.project_id) : null,
        total_value: Number(r.total_value ?? 0),
        status: (r.status as 'signed' | 'paid') || 'signed',
        doc_url: null,
        created_at: String(r.created_at ?? ''),
      }));
      return rows.map(contractToView);
    }
    if (isMissingContractsColumn(retryNoDoc.error, 'id')) {
      const retryLegacy = await supabase
        .from('contracts')
        .select('project_id, total_value, status, created_at')
        .order('created_at', { ascending: false });
      if (!retryLegacy.error) {
        const rows = ((retryLegacy.data as Record<string, unknown>[]) || []).map((r, idx) => ({
          id:
            (r.project_id ? String(r.project_id) : '') ||
            (r.created_at ? `legacy-${String(r.created_at)}` : `legacy-${idx + 1}`),
          project_id: r.project_id ? String(r.project_id) : null,
          total_value: Number(r.total_value ?? 0),
          status: (r.status as 'signed' | 'paid') || 'signed',
          doc_url: null,
          created_at: String(r.created_at ?? ''),
        }));
        return rows.map(contractToView);
      }
      throw retryLegacy.error;
    }
    console.error('fetchContractsFromDb', error);
    throw retryNoDoc.error;
  }
  return (data as ContractRow[]).map(contractToView);
}

export async function insertContractToDb(p: {
  id: string;
  value: number;
  formStatus: 'Paid' | 'Deposit' | 'Pending' | string;
  docUrl: string;
  projectId?: string | null;
}) {
  const payloadNoDoc = {
    id: p.id,
    project_id: p.projectId ?? null,
    total_value: p.value,
    status: formStatusToDb(p.formStatus),
  };
  const legacyPayloadNoDoc = {
    project_id: p.projectId ?? null,
    total_value: p.value,
    status: formStatusToDb(p.formStatus),
  };
  const payload = {
    ...payloadNoDoc,
    doc_url: p.docUrl === '#' || !p.docUrl ? null : p.docUrl,
  };
  const { error } = await supabase.from('contracts').insert(payload);
  if (error) {
    if (isContractsProjectForeignKeyViolation(error)) {
      const retryNoProject = await supabase.from('contracts').insert({
        ...payloadNoDoc,
        project_id: null,
      });
      if (!retryNoProject.error) return;
      throw retryNoProject.error;
    }
    if (isMissingContractsColumn(error, 'id')) {
      const retryLegacy = await supabase.from('contracts').insert({
        ...legacyPayloadNoDoc,
        doc_url: p.docUrl === '#' || !p.docUrl ? null : p.docUrl,
      });
      if (!retryLegacy.error) return;
      if (isMissingContractsColumn(retryLegacy.error, 'doc_url')) {
        const retryLegacyNoDoc = await supabase.from('contracts').insert(legacyPayloadNoDoc);
        if (!retryLegacyNoDoc.error) return;
        throw retryLegacyNoDoc.error;
      }
      throw retryLegacy.error;
    }
    if (isMissingContractsColumn(error, 'doc_url')) {
      const retry = await supabase.from('contracts').insert(payloadNoDoc);
      if (!retry.error) return;
      throw retry.error;
    }
    throw error;
  }
}

export async function updateContractInDb(
  id: string,
  p: { value: number; formStatus: string; docUrl: string; projectId?: string | null }
) {
  const payloadNoDoc = {
    total_value: p.value,
    status: formStatusToDb(p.formStatus),
    project_id: p.projectId ?? null,
  };
  const { error } = await supabase
    .from('contracts')
    .update({
      ...payloadNoDoc,
      doc_url: p.docUrl === '#' || !p.docUrl ? null : p.docUrl,
    })
    .eq('id', id);
  if (error) {
    if (isContractsProjectForeignKeyViolation(error)) {
      const retryNoProject = await supabase
        .from('contracts')
        .update({
          ...payloadNoDoc,
          project_id: null,
        })
        .eq('id', id);
      if (!retryNoProject.error) return;
      throw retryNoProject.error;
    }
    if (isMissingContractsColumn(error, 'id')) {
      throw new Error("Bảng contracts đang thiếu cột 'id'. Không thể sửa bản ghi theo mã hợp đồng.");
    }
    if (isMissingContractsColumn(error, 'doc_url')) {
      const retry = await supabase
        .from('contracts')
        .update(payloadNoDoc)
        .eq('id', id);
      if (!retry.error) return;
      throw retry.error;
    }
    throw error;
  }
}

export async function deleteContractFromDb(id: string) {
  const { error } = await supabase.from('contracts').delete().eq('id', id);
  if (error) {
    if (isMissingContractsColumn(error, 'id')) {
      throw new Error("Bảng contracts đang thiếu cột 'id'. Không thể xóa theo mã hợp đồng.");
    }
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Báo giá (public.quotations)
// ---------------------------------------------------------------------------

export type QuotationStatusDb = 'draft' | 'sent' | 'accepted' | 'rejected';

export type QuotationView = {
  id: string;
  code: string;
  title: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  status: QuotationStatusDb;
  docUrl?: string;
  notes?: string;
  leadId?: string;
  createdAt: string;
};

function quotationStatusToLabel(s: QuotationStatusDb) {
  const m: Record<QuotationStatusDb, string> = {
    draft: 'Nháp',
    sent: 'Đã gửi',
    accepted: 'Chốt',
    rejected: 'Từ chối',
  };
  return m[s] ?? s;
}

export { quotationStatusToLabel };

function isQuotationsTableMissing(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const e = error as { code?: string; message?: string };
  return (
    e.code === 'PGRST205' &&
    typeof e.message === 'string' &&
    e.message.includes("public.quotations")
  );
}

function quotationToView(row: Record<string, unknown>): QuotationView {
  return {
    id: String(row.id ?? ''),
    code: String(row.code ?? ''),
    title: String(row.title ?? ''),
    customerName: String(row.customer_name ?? ''),
    customerPhone: String(row.customer_phone ?? ''),
    amount: Number(row.amount ?? 0),
    status: (row.status as QuotationStatusDb) || 'draft',
    docUrl: (row.doc_url as string | null) || undefined,
    notes: (row.notes as string | null) || undefined,
    leadId: row.lead_id ? String(row.lead_id) : undefined,
    createdAt: String(row.created_at ?? ''),
  };
}

export async function fetchQuotationsFromDb(): Promise<QuotationView[]> {
  const { data, error } = await supabase
    .from('quotations')
    .select('id, code, title, customer_name, customer_phone, amount, status, doc_url, notes, lead_id, created_at')
    .order('created_at', { ascending: false });
  if (error) {
    if (isQuotationsTableMissing(error)) {
      console.warn('Bảng public.quotations chưa tồn tại. Hãy chạy migration 016_quotations.sql.');
      return [];
    }
    console.error('fetchQuotationsFromDb', error);
    throw error;
  }
  return (data as Record<string, unknown>[]).map(quotationToView);
}

export async function fetchQuotationById(id: string): Promise<QuotationView | null> {
  const { data, error } = await supabase
    .from('quotations')
    .select('id, code, title, customer_name, customer_phone, amount, status, doc_url, notes, lead_id, created_at')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('fetchQuotationById', error);
    throw error;
  }
  if (!data) return null;
  return quotationToView(data as Record<string, unknown>);
}

export async function insertQuotationToDb(p: {
  code: string;
  title: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  status: QuotationStatusDb;
  docUrl?: string;
  notes?: string;
  leadId?: string | null;
}) {
  const { error } = await supabase.from('quotations').insert({
    code: p.code,
    title: p.title,
    customer_name: p.customerName,
    customer_phone: p.customerPhone,
    amount: p.amount,
    status: p.status,
    doc_url: p.docUrl && p.docUrl !== '#' ? p.docUrl : null,
    notes: p.notes || null,
    lead_id: p.leadId || null,
  });
  if (error) throw error;
}

export async function updateQuotationInDb(
  id: string,
  p: {
    code: string;
    title: string;
    customerName: string;
    customerPhone: string;
    amount: number;
    status: QuotationStatusDb;
    docUrl?: string;
    notes?: string;
    leadId?: string | null;
  }
) {
  const { error } = await supabase
    .from('quotations')
    .update({
      code: p.code,
      title: p.title,
      customer_name: p.customerName,
      customer_phone: p.customerPhone,
      amount: p.amount,
      status: p.status,
      doc_url: p.docUrl && p.docUrl !== '#' ? p.docUrl : null,
      notes: p.notes || null,
      lead_id: p.leadId || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteQuotationFromDb(id: string) {
  const { error } = await supabase.from('quotations').delete().eq('id', id);
  if (error) throw error;
}
