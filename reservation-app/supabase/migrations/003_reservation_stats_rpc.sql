-- ============================================
-- Migration 003: RPC d'agrégation dashboard
-- Réduit le volume transféré pour /api/reservations/stats
-- ============================================

CREATE OR REPLACE FUNCTION public.get_reservation_stats()
RETURNS JSONB
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  WITH reservation_base AS (
    SELECT
      reservation_date,
      service,
      status,
      guests_count,
      COALESCE(amount_cents, 0) AS amount_cents
    FROM public.reservations
  ),
  status_counts AS (
    SELECT COALESCE(jsonb_object_agg(status, count_rows), '{}'::jsonb) AS data
    FROM (
      SELECT status, COUNT(*) AS count_rows
      FROM reservation_base
      GROUP BY status
    ) status_rows
  ),
  service_counts AS (
    SELECT COALESCE(jsonb_object_agg(service, count_rows), '{}'::jsonb) AS data
    FROM (
      SELECT service, COUNT(*) AS count_rows
      FROM reservation_base
      GROUP BY service
    ) service_rows
  ),
  month_counts AS (
    SELECT COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'month', month_key,
          'count', count_rows,
          'revenue_cents', revenue_cents
        )
        ORDER BY month_key
      ),
      '[]'::jsonb
    ) AS data
    FROM (
      SELECT
        to_char(date_trunc('month', reservation_date::timestamp), 'YYYY-MM') AS month_key,
        COUNT(*) AS count_rows,
        SUM(amount_cents) AS revenue_cents
      FROM reservation_base
      GROUP BY 1
    ) month_rows
  ),
  client_counts AS (
    SELECT COUNT(*)::int AS total_clients
    FROM public.clients
    WHERE deletion_requested_at IS NULL
  )
  SELECT jsonb_build_object(
    'total_reservations', COUNT(*)::int,
    'today_reservations', COUNT(*) FILTER (WHERE reservation_date = CURRENT_DATE)::int,
    'total_clients', COALESCE((SELECT total_clients FROM client_counts), 0),
    'total_revenue_cents', COALESCE(SUM(amount_cents), 0)::int,
    'by_status', (SELECT data FROM status_counts),
    'by_service', (SELECT data FROM service_counts),
    'by_month', (SELECT data FROM month_counts),
    'avg_guests', COALESCE(ROUND(AVG(guests_count)::numeric, 1), 0),
    'no_show_rate', COALESCE(ROUND((COUNT(*) FILTER (WHERE status = 'no_show')::numeric / NULLIF(COUNT(*), 0)) * 100, 1), 0)
  )
  FROM reservation_base;
$$;

REVOKE ALL ON FUNCTION public.get_reservation_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_reservation_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_reservation_stats() TO service_role;
