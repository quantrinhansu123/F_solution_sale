/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
  readonly NEXT_PUBLIC_SUPABASE_URL?: string
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
  readonly NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string
  /** Bật sau khi chạy migration 012 (có cột demo_date, docs_url, … trên bảng leads) */
  readonly VITE_LEADS_DEMO_COLUMNS?: string
  /** Tên cột khoá chính bảng leads, mặc định "id" — nếu DB dùng lead_id thì đặt: lead_id */
  readonly VITE_LEADS_ID_COLUMN?: string
}
