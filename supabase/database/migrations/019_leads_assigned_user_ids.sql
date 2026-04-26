-- Nhiều người phụ trách: mảng UUID dạng jsonb
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS assigned_user_ids jsonb NOT NULL DEFAULT '[]'::jsonb;
COMMENT ON COLUMN public.leads.assigned_user_ids IS 'Mảng chuỗi UUID (public.users.user_id) — nhiều người phụ trách';

-- Đồng bộ từ cột cũ assigned_to (một người) nếu có cột cũ và mảng còn rỗng
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'assigned_to'
  ) THEN
    UPDATE public.leads
    SET assigned_user_ids = jsonb_build_array(assigned_to::text)
    WHERE assigned_to IS NOT NULL
      AND assigned_user_ids = '[]'::jsonb;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_leads_assigned_user_ids_gin ON public.leads USING gin (assigned_user_ids);
