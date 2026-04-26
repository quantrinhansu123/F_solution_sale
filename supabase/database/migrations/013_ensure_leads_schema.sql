-- Chạy trên Supabase → SQL → Run khi gặp PGRST204: "Could not find the 'name' column of 'leads'"
-- Nghĩa là bảng public.leads thiếu cột (hoặc bảng trống / tên bảng khác).
-- Sau đó: Project Settings → API → Reload schema (hoặc Settings → General → chạm schema refresh nếu có).

-- 1) Tạo bảng đủ cột nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS public.leads (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text,
  phone         text,
  source_id     text,
  status        text,
  evidence_url  text,
  demo_date     timestamptz,
  docs_url      text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- 2) Bổ sung từng cột nếu bảng cũ đã có nhưng thiếu cột
--    (Bắt buộc: id — nếu thiếu, PostgREST lỗi 42703 "column leads.id does not exist")
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS id uuid;
UPDATE public.leads SET id = gen_random_uuid() WHERE id IS NULL;
ALTER TABLE public.leads ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.leads ALTER COLUMN id SET NOT NULL;

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS source_id text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS status text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS evidence_url text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS demo_date timestamptz;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS docs_url text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS created_at timestamptz;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- 3) Default cho cột mới tạo: tránh toàn bộ null (PostgREST cần thấy cột ổn định)
ALTER TABLE public.leads ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE public.leads ALTER COLUMN updated_at SET DEFAULT now();

-- 4) Backfill tối thiểu (nếu bảng có dòng mà cột mới toàn null)
UPDATE public.leads
SET
  name = COALESCE(name, 'Chưa khai'),
  phone = COALESCE(phone, ''),
  source_id = COALESCE(source_id, 'n/a'),
  status = COALESCE(status, 'new'),
  created_at = COALESCE(created_at, now()),
  updated_at = COALESCE(updated_at, now())
WHERE name IS NULL OR source_id IS NULL OR status IS NULL;

-- 5) Index (giống 000, tránh bỏ qua nếu đã tạo)
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);

-- 6) RLS (nếu chưa chạy 000)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "leads_all_authenticated" ON public.leads;
CREATE POLICY "leads_all_authenticated" ON public.leads
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
