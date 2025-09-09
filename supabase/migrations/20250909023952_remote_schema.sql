drop policy "allow ALL when id=uid" on "public"."quest_submission";


  create policy "allow ALL when id=uid"
  on "public"."quest_submission"
  as permissive
  for all
  to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



