-- =============================================================================
-- BẮT BUỘC: lỗi 42703 "column leads.id does not exist" — cột chưa có trên Postgres.
-- Mở Supabase → Project ĐÚNG (cùng URL với .env) → SQL Editor → dán cả file → Run.
-- Sau đó: Settings → API → Reload schema.
-- Nếu bảng tên khác (không phải public.leads) hoặc é view: sửa tên/đổi env VITE_LEADS_ID_COLUMN
-- =============================================================================

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS id uuid;
UPDATE public.leads SET id = gen_random_uuid() WHERE id IS NULL;
ALTER TABLE public.leads ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.leads ALTER COLUMN id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.leads'::regclass
      AND contype = 'p'
  ) THEN
    ALTER TABLE public.leads ADD CONSTRAINT leads_id_pkey PRIMARY KEY (id);
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'PK: %', SQLERRM;
END $$;
