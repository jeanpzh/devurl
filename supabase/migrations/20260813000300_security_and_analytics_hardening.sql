update public.urls
set clicks_count = 0
where clicks_count is null;

alter table public.urls
  alter column clicks_count set default 0,
  alter column clicks_count set not null;

alter table public.urls enable row level security;
revoke all on public.urls from anon;
grant select, insert, update, delete on public.urls to authenticated;

drop policy if exists "select_own_or_anonymous" on public.urls;
drop policy if exists "Users can delete their own urls" on public.urls;
drop policy if exists "Users can update their own urls" on public.urls;
drop policy if exists "update_own" on public.urls;
drop policy if exists "anon_insert_null_user" on public.urls;
drop policy if exists "authenticated_insert_own" on public.urls;

create policy "Users can read their own urls"
on public.urls
for select
to authenticated
using ((select auth.uid())::text = user_id);

create policy "Users can insert their own urls"
on public.urls
for insert
to authenticated
with check ((select auth.uid())::text = user_id);

create policy "Users can update their own urls"
on public.urls
for update
to authenticated
using ((select auth.uid())::text = user_id)
with check ((select auth.uid())::text = user_id);

create policy "Users can delete their own urls"
on public.urls
for delete
to authenticated
using ((select auth.uid())::text = user_id);

revoke all on function public.get_user_analytics(timestamptz, timestamptz, timestamptz) from public;
revoke all on function public.get_user_analytics(timestamptz, timestamptz, timestamptz) from anon;
revoke all on function public.get_user_analytics(timestamptz, timestamptz, timestamptz) from authenticated;
grant execute on function public.get_user_analytics(timestamptz, timestamptz, timestamptz) to authenticated;

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
  with bounds as (
    select p_from as current_from,
      p_to as current_to,
      p_previous_from as previous_from,
      extract(epoch from (p_to - p_from)) as current_seconds
  ),
  user_links as (
    select id, slug, is_active
    from public.urls
    where user_id = (select auth.uid())::text
  ),
  current_events as (
    select e.id, e.event_id, e.link_id, e.clicked_at, e.referrer_host, e.country_code
    from public.link_click_events e
    join user_links l on l.id = e.link_id
    cross join bounds b
    where b.current_seconds between 1 and 7776000
      and b.current_to > b.current_from
      and e.clicked_at >= b.current_from
      and e.clicked_at < b.current_to
  ),
  previous_events as (
    select count(*)::bigint as clicks
    from public.link_click_events e
    join user_links l on l.id = e.link_id
    cross join bounds b
    where b.current_seconds between 1 and 7776000
      and b.current_to > b.current_from
      and b.previous_from < b.current_from
      and e.clicked_at >= b.previous_from
      and e.clicked_at < b.current_from
  ),
  timeline as (
    select coalesce(jsonb_agg(
      jsonb_build_object('bucketStart', bucket_start, 'clicks', clicks)
      order by bucket_start
    ), '[]'::jsonb) as value
    from (
      select buckets.bucket_start, count(e.id)::bigint as clicks
      from generate_series(
        date_trunc('day', (select current_from from bounds) at time zone 'UTC'),
        date_trunc('day', ((select current_to from bounds) - interval '1 microsecond') at time zone 'UTC'),
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
