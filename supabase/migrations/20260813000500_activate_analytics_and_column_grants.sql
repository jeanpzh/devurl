insert into public.analytics_coverage (singleton, started_at)
values (true, now())
on conflict (singleton) do nothing;

revoke insert, update on public.urls from authenticated;
grant insert (user_id, original_url, slug, is_active) on public.urls to authenticated;
grant update (original_url, slug, is_active) on public.urls to authenticated;
