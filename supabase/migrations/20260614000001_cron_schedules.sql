-- pg_cron + pg_net: Automated market data pipeline
-- Calls Vercel API routes on schedule

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- 1. Fetch prices every 5 minutes
select cron.schedule(
  'fetch-prices-job',
  '*/5 * * * *',
  $$
  select net.http_get(
    url := 'https://albion-trade-hub-pink.vercel.app/api/cron/fetch-prices',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4emhkZ3Z2Z3ZzcGFuYW90aGhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMwNDg3NCwiZXhwIjoyMDgwODgwODc0fQ.Ow3GodezefG_UXoNqRJkpZmZY1ccP4u6OZUO3D2GVi4'
    )
  );
  $$
);

-- 2. Calculate opportunities 2 minutes after each price fetch
select cron.schedule(
  'calculate-opportunities-job',
  '2-57/5 * * * *',
  $$
  select net.http_get(
    url := 'https://albion-trade-hub-pink.vercel.app/api/cron/calculate-opportunities',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4emhkZ3Z2Z3ZzcGFuYW90aGhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMwNDg3NCwiZXhwIjoyMDgwODgwODc0fQ.Ow3GodezefG_UXoNqRJkpZmZY1ccP4u6OZUO3D2GVi4'
    )
  );
  $$
);

-- 3. Sync items catalog daily at 4am UTC
select cron.schedule(
  'sync-items-job',
  '0 4 * * *',
  $$
  select net.http_get(
    url := 'https://albion-trade-hub-pink.vercel.app/api/cron/sync-items',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4emhkZ3Z2Z3ZzcGFuYW90aGhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMwNDg3NCwiZXhwIjoyMDgwODgwODc0fQ.Ow3GodezefG_UXoNqRJkpZmZY1ccP4u6OZUO3D2GVi4'
    )
  );
  $$
);

-- 4. Cleanup old data daily at 3am UTC (SQL direto, sem HTTP)
select cron.schedule(
  'cleanup-job',
  '0 3 * * *',
  $$
  delete from public.prices where fetched_at < now() - interval '30 days';
  update public.opportunities set status = 'expired', expired_at = now()
    where status = 'active' and detected_at < now() - interval '1 hour';
  delete from public.opportunities where status = 'expired' and expired_at < now() - interval '7 days';
  $$
);
