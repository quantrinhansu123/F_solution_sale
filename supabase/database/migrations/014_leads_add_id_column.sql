-- Lỗi 42703: "column leads.id does not exist"
-- Bảng leads cũ thiếu cột id (CREATE TABLE IF NOT EXISTS ở 013 bị bỏ qua nếu bảng đã tồn tại mà thiếu id).
-- Chạy: SQL Editor → dán → Run, sau đó Reload API schema nếu cần.

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS id uuid;
UPDATE public.leads SET id = gen_random_uuid() WHERE id IS NULL;
ALTER TABLE public.leads ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Đảm bảo mọi dòng có id
ALTER TABLE public.leads ALTER COLUMN id SET NOT NULL;

-- Khóa chính (chỉ thêm nếu bảng chưa có PK; nếu lỗi "multiple primary keys" thì bỏ qua block này)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.leads'::regclass
      AND contype = 'p'
  ) THEN
    ALTER TABLE public.leads ADD CONSTRAINT leads_pkey PRIMARY KEY (id);
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Bỏ qua PRIMARY KEY: %', SQLERRM;
END $$;
