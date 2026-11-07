-- Canada Study Hub security and role alignment.
-- Admin is an account-management role only. No RLS policy is created for admin
-- on applications, application_documents, offers, invoices, or payments.
alter type public.app_role add value if not exists 'admin';
revoke insert, update, delete on public.user_roles from authenticated;
grant select on public.user_roles to authenticated;
comment on table public.user_roles is 'Authorization source of truth. Never store role values in profiles or accept role changes from clients.';
comment on table public.applications is 'Business data. Admin has no RLS policy or direct access; admin operations are limited to account management.';
