-- Bảng nền CRM + thu nhập. Chạy trên Supabase: SQL Editor → New query → dán cả file → Run.
-- (Hoặc supabase db push nếu dùng CLI local trùng bản ghi này.)

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  source_id   TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'qualified')),
  evidence_url TEXT,
  demo_date   TIMESTAMPTZ,
  docs_url    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);

-- ---------------------------------------------------------------------------
-- sales_activities (vd: type = 'demo', status = 'completed')
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sales_activities (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type       TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'completed',
  lead_id    UUID REFERENCES public.leads (id) ON DELETE SET NULL,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sales_activities_type_created
  ON public.sales_activities (type, status, created_at);

-- ---------------------------------------------------------------------------
-- contracts (tương thích fetchProjectFinancials + fetchCRMOverview)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contracts (
  id          TEXT PRIMARY KEY,
  project_id  UUID,
  total_value NUMERIC(18, 2) NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'signed' CHECK (status IN ('signed', 'paid')),
  doc_url     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contracts_project ON public.contracts (project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON public.contracts (created_at);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts (status);

-- ---------------------------------------------------------------------------
-- earnings_logs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.earnings_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL,
  source_type TEXT NOT NULL,
  amount      NUMERIC(18, 2) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_earnings_logs_project ON public.earnings_logs (project_id);

-- ---------------------------------------------------------------------------
-- RLS: user đã đăng nhập thao tác bình thường
-- ---------------------------------------------------------------------------
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leads_all_authenticated" ON public.leads;
CREATE POLICY "leads_all_authenticated" ON public.leads
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "sales_activities_all_authenticated" ON public.sales_activities;
CREATE POLICY "sales_activities_all_authenticated" ON public.sales_activities
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "contracts_all_authenticated" ON public.contracts;
CREATE POLICY "contracts_all_authenticated" ON public.contracts
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "earnings_logs_all_authenticated" ON public.earnings_logs;
CREATE POLICY "earnings_logs_all_authenticated" ON public.earnings_logs
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
