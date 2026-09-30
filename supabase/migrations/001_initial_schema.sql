-- =========================================================
-- EcoSetu - Complete Database Schema
-- Paste this into Supabase SQL Editor and click Run
-- =========================================================

-- ─────────────────────────────────────────
-- 1. COLLECTORS (Kabadiwala users from app)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS collectors (
  id                       TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name                     TEXT NOT NULL,
  initials                 TEXT,
  phone                    TEXT UNIQUE,
  location                 TEXT,
  operating_area           TEXT,
  language                 TEXT DEFAULT 'en',
  total_lots               INT DEFAULT 0,
  total_earnings           INT DEFAULT 0,
  completed_transactions   INT DEFAULT 0,
  cumulative_savings       INT DEFAULT 0,
  created_at               TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────
-- 2. RECYCLERS (Dashboard users / facilities)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recyclers (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name             TEXT NOT NULL,
  email            TEXT UNIQUE,
  phone            TEXT,
  location         TEXT,
  category         TEXT,
  cpcb_number      TEXT,
  verified         BOOLEAN DEFAULT false,
  rating           TEXT DEFAULT '4.8',
  pickup_available BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────
-- 3. BATCHES (Groups of lots from one pickup)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS batches (
  batch_id      TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  collector_id  TEXT REFERENCES collectors(id) ON DELETE CASCADE,
  status        TEXT DEFAULT 'active',   -- active | pending | sold
  sync_status   TEXT DEFAULT 'synced',   -- synced | pending
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────
-- 4. LOTS (Individual scrap items)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lots (
  lot_id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  batch_id              TEXT REFERENCES batches(batch_id) ON DELETE CASCADE,
  collector_id          TEXT REFERENCES collectors(id),
  material              TEXT NOT NULL,
  declared_weight       INT NOT NULL,
  condition             TEXT,
  indicative_value      INT DEFAULT 0,
  collector_declaration TEXT,
  verified_material     TEXT,
  verified_weight       NUMERIC,
  final_price           NUMERIC,
  handover_status       TEXT DEFAULT 'pending',  -- pending | settling | settled | rejected
  payment_status        TEXT DEFAULT 'pending',  -- pending | received
  image_url             TEXT,
  recycler_id           TEXT REFERENCES recyclers(id),
  recycler_name         TEXT,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────
-- 5. PAYMENTS / TRANSACTIONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  lot_id        TEXT REFERENCES lots(lot_id),
  collector_id  TEXT REFERENCES collectors(id),
  recycler_id   TEXT REFERENCES recyclers(id),
  recycler_name TEXT,
  amount        INT NOT NULL,
  material      TEXT,
  weight        INT,
  unit          TEXT DEFAULT 'kg',
  status        TEXT DEFAULT 'pending',  -- pending | received
  has_dispute   BOOLEAN DEFAULT false,
  reference_id  TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────
-- 6. AUTO-UPDATE updated_at triggers
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ language plpgsql;

DROP TRIGGER IF EXISTS set_lots_updated_at ON lots;
CREATE TRIGGER set_lots_updated_at BEFORE UPDATE ON lots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_batches_updated_at ON batches;
CREATE TRIGGER set_batches_updated_at BEFORE UPDATE ON batches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────
-- 7. ROW LEVEL SECURITY (RLS) - allow anon reads, authenticated writes
-- ─────────────────────────────────────────
ALTER TABLE collectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE recyclers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches    ENABLE ROW LEVEL SECURITY;
ALTER TABLE lots       ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments   ENABLE ROW LEVEL SECURITY;

-- Public read for dashboard & app
CREATE POLICY "Public read collectors"  ON collectors  FOR SELECT USING (true);
CREATE POLICY "Public read recyclers"   ON recyclers   FOR SELECT USING (true);
CREATE POLICY "Public read batches"     ON batches     FOR SELECT USING (true);
CREATE POLICY "Public read lots"        ON lots        FOR SELECT USING (true);
CREATE POLICY "Public read payments"    ON payments    FOR SELECT USING (true);

-- Anon INSERT for app users (no auth needed for kabadiwala)
CREATE POLICY "Anon insert collectors"  ON collectors  FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon insert batches"     ON batches     FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon insert lots"        ON lots        FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon insert payments"    ON payments    FOR INSERT WITH CHECK (true);

-- Anon UPDATE for lot status changes
CREATE POLICY "Anon update batches"     ON batches     FOR UPDATE USING (true);
CREATE POLICY "Anon update lots"        ON lots        FOR UPDATE USING (true);
CREATE POLICY "Anon update collectors"  ON collectors  FOR UPDATE USING (true);

-- ─────────────────────────────────────────
-- 8. SEED DATA (Demo collectors & recyclers)
-- ─────────────────────────────────────────
INSERT INTO collectors (id, name, initials, phone, location, operating_area, language, total_lots, total_earnings, completed_transactions)
VALUES
  ('collector-ravi-001',  'Ravi Kumar',    'RK', '98201 44310', 'Andheri East, Mumbai',  'Andheri, Jogeshwari', 'hi', 47, 18500, 12),
  ('collector-sunita-002','Sunita Pawar',  'SP', '98765 32100', 'Kurla West, Mumbai',    'Kurla, Sion',         'mr', 31, 12800, 9),
  ('collector-ahmed-003', 'Ahmed Sheikh',  'AS', '91234 88720', 'Dharavi, Mumbai',       'Dharavi, Sion',       'en', 52, 22400, 15),
  ('collector-meena-004', 'Meena Raut',    'MR', '97654 11230', 'Borivali East, Mumbai', 'Borivali, Dahisar',   'mr', 28, 11200, 8),
  ('collector-priya-005', 'Priya Desai',   'PD', '90123 55670', 'Powai, Mumbai',         'Powai, Vikhroli',     'en', 19, 8600,  6),
  ('collector-ramesh-006','Ramesh Yadav',  'RY', '87654 99210', 'Malad West, Mumbai',    'Malad, Goregaon',     'hi', 35, 14200, 11)
ON CONFLICT (id) DO NOTHING;

INSERT INTO recyclers (id, name, email, phone, location, category, cpcb_number, verified)
VALUES
  ('recycler-green-001',  'Green Recycle Hub',      'admin@greenrecyclehub.in', '+91 22 6812 4400', 'MIDC Andheri East, Mumbai', 'EcoGreen E-Waste',        'CPCB-EWM-MH-04421', true),
  ('recycler-metro-002',  'Metro Recycling Solutions','info@metrorecycling.in', '+91 22 5500 1100', 'Kurla Industrial Area',     'General E-Waste',         'CPCB-EWM-MH-09832', true),
  ('recycler-earth-003',  'EarthCycle Industries',   'contact@earthcycle.in',  '+91 22 4411 9900', 'Navi Mumbai MIDC',          'Battery & PCB Specialist','CPCB-EWM-MH-11203', false)
ON CONFLICT (id) DO NOTHING;

-- Seed some demo batches and lots for the dashboard to show
INSERT INTO batches (batch_id, collector_id, status, created_at)
VALUES
  ('batch-demo-001', 'collector-ravi-001',   'active',  now() - interval '2 hours'),
  ('batch-demo-002', 'collector-sunita-002', 'pending', now() - interval '5 hours'),
  ('batch-demo-003', 'collector-ahmed-003',  'sold',    now() - interval '1 day')
ON CONFLICT (batch_id) DO NOTHING;

INSERT INTO lots (lot_id, batch_id, collector_id, material, declared_weight, condition, indicative_value, handover_status, payment_status, recycler_id, recycler_name, created_at)
VALUES
  ('KC-LOT-8812', 'batch-demo-001', 'collector-ravi-001',   'Battery', 12, 'Good',  1440, 'pending',   'pending', 'recycler-green-001', 'Green Recycle Hub',       now() - interval '2 hours'),
  ('KC-LOT-8811', 'batch-demo-001', 'collector-sunita-002', 'PCB',     6,  'Fair',  1680, 'pending',   'pending', 'recycler-green-001', 'Green Recycle Hub',       now() - interval '5 hours'),
  ('KC-LOT-8810', 'batch-demo-002', 'collector-ahmed-003',  'Cable',   18, 'Good',  6120, 'pending',   'pending', 'recycler-metro-002', 'Metro Recycling Solutions',now() - interval '5 hours'),
  ('KC-LOT-8809', 'batch-demo-002', 'collector-meena-004',  'Motor',   30, 'Fair',  1950, 'settling',  'pending', 'recycler-green-001', 'Green Recycle Hub',       now() - interval '8 hours'),
  ('KC-LOT-8808', 'batch-demo-003', 'collector-priya-005',  'CRT Glass',25,'Good',   450, 'settled',   'received','recycler-metro-002', 'Metro Recycling Solutions',now() - interval '1 day'),
  ('KC-LOT-8807', 'batch-demo-003', 'collector-ramesh-006', 'PCB',     9,  'Good',  2502, 'settled',   'received','recycler-green-001', 'Green Recycle Hub',       now() - interval '1 day')
ON CONFLICT (lot_id) DO NOTHING;

INSERT INTO payments (id, lot_id, collector_id, recycler_id, recycler_name, amount, material, weight, status, reference_id, created_at)
VALUES
  ('pay-001', 'KC-LOT-8808', 'collector-priya-005',  'recycler-metro-002', 'Metro Recycling Solutions', 450,  'CRT Glass', 25, 'received', 'TXN-MRS-7719', now() - interval '1 day'),
  ('pay-002', 'KC-LOT-8807', 'collector-ramesh-006', 'recycler-green-001', 'Green Recycle Hub',         2502, 'PCB',       9,  'received', 'TXN-GRH-8801', now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;
