-- Ảnh bằng chứng: mảng chuỗi data URL (base64) lưu trong jsonb
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS evidence_images jsonb NOT NULL DEFAULT '[]'::jsonb;
COMMENT ON COLUMN public.leads.evidence_images IS 'Mảng chuỗi ảnh dạng data URL (data:image/...;base64,...)';
