-- Enable extensions for cron jobs (Must be run by Superuser/Dashboard)
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Add is_automated column to reminders if not exists
alter table public.reminders add column if not exists is_automated boolean default false;

-- Function to check for expiring policies and create reminders
create or replace function check_expiring_policies()
returns void as $$
begin
  -- 1. Policies expiring in exactly 30 days
  insert into public.reminders (agent_id, customer_id, policy_id, reminder_type, channel, scheduled_for, status, message_preview, is_automated)
  select 
    p.agent_id, 
    p.customer_id, 
    p.id, 
    'Renewal', 
    'WhatsApp', 
    now() + interval '10 hours', -- Send same day at 10 AM approx
    'pending',
    'Dear ' || c.name || ', your ' || p.policy_type || ' policy (' || p.policy_number || ') is expiring on ' || to_char(p.expiry_date, 'DD-MM-YYYY') || '. Please renew to ensure continuous coverage.',
    true
  from public.policies p
  join public.customers c on p.customer_id = c.id
  where p.expiry_date = current_date + 30
  and p.status = 'Active'
  and not exists (
    select 1 from public.reminders r 
    where r.policy_id = p.id 
    and r.reminder_type = 'Renewal' 
    and r.created_at > now() - interval '1 day' -- Avoid duplicate if run multiple times
  );

  -- 2. Policies expiring in exactly 7 days
  insert into public.reminders (agent_id, customer_id, policy_id, reminder_type, channel, scheduled_for, status, message_preview, is_automated)
  select 
    p.agent_id, 
    p.customer_id, 
    p.id, 
    'Renewal', 
    'WhatsApp', 
    now() + interval '10 hours',
    'pending',
    'URGENT: Dear ' || c.name || ', your policy (' || p.policy_number || ') expires in 7 days (' || to_char(p.expiry_date, 'DD-MM-YYYY') || '). Review now to avoid penalty.',
    true
  from public.policies p
  join public.customers c on p.customer_id = c.id
  where p.expiry_date = current_date + 7
  and p.status = 'Active';

    -- 3. Policies expiring TODAY
  insert into public.reminders (agent_id, customer_id, policy_id, reminder_type, channel, scheduled_for, status, message_preview, is_automated)
  select 
    p.agent_id, 
    p.customer_id, 
    p.id, 
    'Renewal', 
    'WhatsApp', 
    now() + interval '9 hours', -- 9 AM
    'pending',
    'FINAL REMINDER: Dear ' || c.name || ', your policy (' || p.policy_number || ') EXPIRES TODAY. Please contact us immediately to renew.',
    true
  from public.policies p
  join public.customers c on p.customer_id = c.id
  where p.expiry_date = current_date
  and p.status = 'Active';

end;
$$ language plpgsql;

-- Schedule the cron job (Runs every day at 1:00 AM UTC -> 6:30 AM IST)
-- NOTE: pg_cron usage requires specific Supabase project settings.
-- select cron.schedule('check-renewals-daily', '0 1 * * *', 'select public.check_expiring_policies()');
