-- ============================================
-- Le Quai Ouest - Schéma initial
-- ============================================

-- Table des profils staff
CREATE TABLE IF NOT EXISTS public.staff_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'staff')),
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des clients
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    notes TEXT,
    total_visits INT DEFAULT 0,
    last_visit_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    consent_given_at TIMESTAMPTZ,
    deletion_requested_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON public.clients(phone);

-- Table des réservations
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    reservation_date DATE NOT NULL,
    service TEXT NOT NULL CHECK (service IN ('midi', 'soir')),
    time_slot TIME,
    guests_count INT NOT NULL CHECK (guests_count BETWEEN 1 AND 20),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show')),
    special_requests TEXT,
    table_number TEXT,
    amount_cents INT,
    source TEXT DEFAULT 'website' CHECK (source IN ('website', 'phone', 'walk_in', 'thefork')),
    staff_notes TEXT,
    formspree_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_client ON public.reservations(client_id);

-- Table des notes
CREATE TABLE IF NOT EXISTS public.reservation_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservation_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read staff_profiles" ON public.staff_profiles
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update own profile" ON public.staff_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Authenticated users can read clients" ON public.clients
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert clients" ON public.clients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update clients" ON public.clients
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage reservations" ON public.reservations
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage notes" ON public.reservation_notes
    FOR ALL USING (auth.role() = 'authenticated');

-- Service role bypass for webhooks
CREATE POLICY "Service role full access clients" ON public.clients
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access reservations" ON public.reservations
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to increment visit count
CREATE OR REPLACE FUNCTION increment_visits(p_client_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.clients
    SET total_visits = total_visits + 1,
        last_visit_at = NOW(),
        updated_at = NOW()
    WHERE id = p_client_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
