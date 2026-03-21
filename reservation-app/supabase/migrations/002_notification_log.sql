-- ============================================
-- Migration 002: Table notification_log
-- Traçabilité complète des emails envoyés
-- Permet au dashboard de voir les échecs
-- ============================================

CREATE TABLE notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'confirmation_email',
    'cancellation_email',
    'reminder_email',
    'status_change_email'
  )),
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'simulated')),
  provider_message_id TEXT,
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour requêtes fréquentes
CREATE INDEX idx_notification_log_reservation ON notification_log(reservation_id);
CREATE INDEX idx_notification_log_status ON notification_log(status);
CREATE INDEX idx_notification_log_created ON notification_log(created_at DESC);

-- RLS : seul le staff authentifié peut consulter les logs
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff_view_notifications" ON notification_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM staff_profiles WHERE id = auth.uid())
  );

-- Le service role peut insérer (appelé depuis l'API publique)
CREATE POLICY "service_insert_notifications" ON notification_log
  FOR INSERT WITH CHECK (true);
