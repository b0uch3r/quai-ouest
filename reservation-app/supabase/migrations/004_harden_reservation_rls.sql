-- Harden reservation writes after moving mutations to server-side route handlers.

DROP POLICY IF EXISTS "Authenticated users can manage reservations" ON public.reservations;
DROP POLICY IF EXISTS "Authenticated users can manage notes" ON public.reservation_notes;
DROP POLICY IF EXISTS "service_insert_notifications" ON public.notification_log;

CREATE POLICY "Authenticated users can read reservations" ON public.reservations
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read notes" ON public.reservation_notes
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role full access reservation notes" ON public.reservation_notes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role insert notifications" ON public.notification_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);
