create or replace function public.get_user_analytics(
  p_from timestamptz,
  p_to timestamptz,
  p_previous_from timestamptz
)
returns jsonb
language sql
security invoker
set search_path = pg_catalog, public
as $$
  with user_links as (
    select id, slug, is_active
    from public.urls
    where user_id = (select auth.uid())::text
  ),
  current_events as (
    select e.id, e.event_id, e.link_id, e.clicked_at, e.referrer_host, e.country_code
    from public.link_click_events e
    join user_links l on l.id = e.link_id
    where e.clicked_at >= p_from and e.clicked_at < p_to
  ),
  previous_events as (
    select count(*)::bigint as clicks
    from public.link_click_events e
    join user_links l on l.id = e.link_id
    where e.clicked_at >= p_previous_from and e.clicked_at < p_from
  ),
  timeline as (
    select coalesce(jsonb_agg(
      jsonb_build_object('bucketStart', bucket_start, 'clicks', clicks)
      order by bucket_start
    ), '[]'::jsonb) as value
    from (
      select buckets.bucket_start, count(e.id)::bigint as clicks
      from generate_series(
        date_trunc('day', p_from at time zone 'UTC'),
        date_trunc('day', (p_to - interval '1 microsecond') at time zone 'UTC'),
        interval '1 day'
      ) as buckets(bucket_start)
      left join current_events e
        on date_trunc('day', e.clicked_at at time zone 'UTC') = buckets.bucket_start
      group by buckets.bucket_start
    ) points
  ),
  top_links as (
    select coalesce(jsonb_agg(
      jsonb_build_object('linkId', link_id, 'slug', slug, 'clicks', clicks)
      order by clicks desc, link_id asc
    ), '[]'::jsonb) as value
    from (
      select e.link_id, l.slug, count(*)::bigint as clicks
      from current_events e
      join user_links l on l.id = e.link_id
      group by e.link_id, l.slug
      order by clicks desc, e.link_id asc
      limit 5
    ) links
  ),
  referrers as (
    select coalesce(jsonb_agg(
      jsonb_build_object('host', host, 'clicks', clicks)
      order by clicks desc, host asc
    ), '[]'::jsonb) as value
    from (
      select coalesce(referrer_host, 'direct') as host, count(*)::bigint as clicks
      from current_events
      group by coalesce(referrer_host, 'direct')
      order by clicks desc, host asc
      limit 5
    ) sources
  ),
  recent_activity as (
    select coalesce(jsonb_agg(
      jsonb_build_object(
        'eventId', event_id,
        'linkId', link_id,
        'slug', slug,
        'clickedAt', clicked_at,
        'referrerHost', referrer_host,
        'countryCode', country_code
      ) order by clicked_at desc, id desc
    ), '[]'::jsonb) as value
    from (
      select e.*, l.slug
      from current_events e
      join user_links l on l.id = e.link_id
      order by e.clicked_at desc, e.id desc
      limit 10
    ) activity
  ),
  coverage as (
    select started_at
    from public.analytics_coverage
    where singleton = true
    limit 1
  )
  select jsonb_build_object(
    'summary', jsonb_build_object(
      'clicks', (select count(*)::bigint from current_events),
      'totalLinks', (select count(*)::bigint from user_links),
      'activeLinks', (select count(*)::bigint from user_links where is_active = true),
      'approximateVisitors', null,
      'previousPeriodChangePercent', case
        when (select clicks from previous_events) = 0 then null
        else round((
          ((select count(*)::numeric from current_events) - (select clicks from previous_events))
          / (select clicks from previous_events)
        ) * 100, 1)
      end
    ),
    'timeline', (select value from timeline),
    'topLinks', (select value from top_links),
    'referrers', (select value from referrers),
    'recentActivity', (select value from recent_activity),
    'coverageStartedAt', (select started_at from coverage)
  );
$$;

revoke all on function public.get_user_analytics(timestamptz, timestamptz, timestamptz) from public;
grant execute on function public.get_user_analytics(timestamptz, timestamptz, timestamptz) to authenticated;
