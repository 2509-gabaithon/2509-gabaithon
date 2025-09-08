-- Ensure default partner exists
insert into public.partner (name)
values ('もちもちうさぎ');

-- inserts a row into public.profile and public.user_partner
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Insert into profile table
  insert into public.profile (id)
  values (new.id);
  
  -- Insert into user_partner table with default partner (ID=1)
  insert into public.user_partner (user_id, partner_id, name, exp, happiness)
  values (new.id, 1, 'もちもちうさぎ', 0, 75);
  
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();