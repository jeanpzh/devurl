create table if not exists public.keepalive (
  id boolean primary key default true,
  constraint keepalive_singleton check (id = true)
);

insert into public.keepalive (id)
values (true)
on conflict (id) do nothing;

alter table public.keepalive enable row level security;

revoke all on public.keepalive from public;
revoke all on public.keepalive from anon;
revoke all on public.keepalive from authenticated;
grant select on public.keepalive to anon, authenticated;

drop policy if exists "Keepalive row is publicly readable" on public.keepalive;
create policy "Keepalive row is publicly readable"
on public.keepalive
for select
to anon, authenticated
using (true);
