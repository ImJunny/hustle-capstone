-- Drop the trigger
drop trigger if exists trigger_update_jobs_and_delete_payments_on_post_open
on app.posts;

-- Drop the trigger function
drop function if exists app.update_jobs_and_delete_payments_on_post_open;
----------------------------------------
-- 1. Create the trigger function
create or replace function app.update_jobs_and_delete_payments_on_post_open()
returns trigger as $$
begin
  -- Only proceed if the new status is 'open' and old status was not 'open'
  if new.status_type = 'open' and old.status_type is distinct from 'open' then
    -- Update initiated_jobs with matching post_uuid
    update app.initiated_jobs
    set progress_type = 'accepted'
    where job_post_uuid = new.uuid;

    -- Delete all payments where job_uuid matches the initiated_jobs.uuid
    delete from app.payments
    where job_uuid in (
      select uuid from app.initiated_jobs where job_post_uuid = new.uuid
    );
  end if;

  return new;
end;
$$ language plpgsql;

-- 2. Create the trigger
create trigger trigger_update_jobs_and_delete_payments_on_post_open
after update on app.posts
for each row
execute function app.update_jobs_and_delete_payments_on_post_open();

