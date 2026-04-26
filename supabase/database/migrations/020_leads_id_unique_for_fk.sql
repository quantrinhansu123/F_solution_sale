-- Đảm bảo public.leads.id đủ điều kiện làm khóa tham chiếu (FK)
-- Chạy migration này trước/hoặc cùng lúc với 016_quotations.sql nếu gặp:
-- "there is no unique constraint matching given keys for referenced table leads"

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS id uuid;
UPDATE public.leads SET id = gen_random_uuid() WHERE id IS NULL;
ALTER TABLE public.leads ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.leads ALTER COLUMN id SET NOT NULL;

-- Nếu id bị trùng (do dữ liệu legacy), gán lại UUID cho bản ghi trùng từ dòng thứ 2 trở đi.
WITH dup AS (
  SELECT ctid
  FROM (
    SELECT ctid, row_number() OVER (PARTITION BY id ORDER BY created_at NULLS LAST, ctid) AS rn
    FROM public.leads
  ) t
  WHERE t.rn > 1
)
UPDATE public.leads l
SET id = gen_random_uuid()
FROM dup
WHERE l.ctid = dup.ctid;

DO $$
BEGIN
  -- Nếu chưa có PK thì thêm PK trên id.
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.leads'::regclass
      AND contype = 'p'
  ) THEN
    ALTER TABLE public.leads ADD CONSTRAINT leads_pkey PRIMARY KEY (id);
  END IF;

  -- Nếu đã có PK khác cột, đảm bảo id vẫn unique để làm FK.
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.leads'::regclass
      AND contype IN ('p', 'u')
      AND conkey = ARRAY[
        (SELECT attnum
         FROM pg_attribute
         WHERE attrelid = 'public.leads'::regclass
           AND attname = 'id'
           AND NOT attisdropped)
      ]::smallint[]
  ) THEN
    ALTER TABLE public.leads ADD CONSTRAINT leads_id_unique UNIQUE (id);
  END IF;
END $$;
