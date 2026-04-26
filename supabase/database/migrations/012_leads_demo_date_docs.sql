-- BẮT BUỘC chạy trên Supabase: Dashboard → SQL Editor → dán → Run.
-- Sau đó: Project Settings → API → bấm "Reload schema" (hoặc chờ vài phút).
-- Trong f-solution-ui/.env thêm: VITE_LEADS_DEMO_COLUMNS=true rồi restart dev server.

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS demo_date TIMESTAMPTZ;
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS docs_url TEXT;
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS evidence_url TEXT;
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- (Tuỳ chọn) Làm mới schema PostgREST nếu vẫn thấy PGRST204 — chạy riêng khi cần:
-- NOTIFY pgrst, 'reload schema';
