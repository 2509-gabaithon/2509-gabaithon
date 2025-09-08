-- Add count column to user_partner table
alter table public.user_partner 
add column count integer default 0;