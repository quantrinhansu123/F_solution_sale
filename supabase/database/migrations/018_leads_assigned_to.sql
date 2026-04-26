-- Gán lead cho user (bảng public.users, khóa user_id)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.users(user_id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads (assigned_to);
COMMENT ON COLUMN public.leads.assigned_to IS 'Người phụ trách (public.users)';
