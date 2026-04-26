-- Báo giá (quotations) — CRM
CREATE TABLE IF NOT EXISTS public.quotations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT NOT NULL,
  title           TEXT NOT NULL DEFAULT '',
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL DEFAULT '',
  amount          NUMERIC(18, 2) NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  doc_url         TEXT,
  notes           TEXT,
  lead_id         UUID REFERENCES public.leads (id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_quotations_code ON public.quotations (code);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON public.quotations (status);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON public.quotations (created_at DESC);

ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quotations_all_authenticated" ON public.quotations;
CREATE POLICY "quotations_all_authenticated" ON public.quotations
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
