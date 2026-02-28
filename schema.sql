-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS / AGENTS (Managed via Supabase Auth)
-- We'll use a public 'agents' table to store profile info linked to auth.users
create table public.agents (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  name text,
  agency_name text,
  phone text,
  address text,
  irda_code text,
  logo_url text,
  role text default 'agent', -- 'owner' or 'agent'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for agents: Users can only read/update their own profile
alter table public.agents enable row level security;
create policy "Agents can view own profile" on public.agents for select using (auth.uid() = id);
create policy "Agents can update own profile" on public.agents for update using (auth.uid() = id);
create policy "Agents can insert own profile" on public.agents for insert with check (auth.uid() = id);

-- CUSTOMERS
create table public.customers (
  id uuid default uuid_generate_v4() primary key,
  agent_id uuid references public.agents(id) on delete cascade not null,
  name text not null,
  phone text,
  whatsapp_phone text,
  email text,
  address text,
  city text,
  dob date,
  anniversary date,
  tags text[], -- Array of strings
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for customers
alter table public.customers enable row level security;
create policy "Agents can view own customers" on public.customers for select using (auth.uid() = agent_id);
create policy "Agents can insert own customers" on public.customers for insert with check (auth.uid() = agent_id);
create policy "Agents can update own customers" on public.customers for update using (auth.uid() = agent_id);
create policy "Agents can delete own customers" on public.customers for delete using (auth.uid() = agent_id);

-- COMPANIES (Insurance Providers)
create table public.companies (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type text, -- General, Health, Life, etc.
  portal_url text,
  support_phone text,
  support_email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for companies: Readable by all authenticated agents, managed by admins (or everyone for MVP)
alter table public.companies enable row level security;
create policy "Agents can view companies" on public.companies for select using (auth.role() = 'authenticated');
create policy "Agents can insert companies" on public.companies for insert with check (auth.role() = 'authenticated'); -- Allow agents to add companies for MVP
create policy "Agents can update companies" on public.companies for update using (auth.role() = 'authenticated');

-- POLICIES
create table public.policies (
  id uuid default uuid_generate_v4() primary key,
  agent_id uuid references public.agents(id) on delete cascade not null,
  customer_id uuid references public.customers(id) on delete cascade not null,
  company_id uuid references public.companies(id) on delete set null,
  policy_number text not null,
  policy_type text, -- Car, Bike, Commercial, Health
  vehicle_reg_no text,
  vehicle_make text,
  vehicle_model text,
  vehicle_variant text,
  fuel_type text,
  vehicle_year text,
  issue_date date,
  start_date date,
  expiry_date date,
  premium_od numeric,
  premium_tp numeric,
  premium_total numeric,
  idv numeric,          -- New: Insured Declared Value
  ncb text,             -- New: No Claim Bonus
  engine_no text,       -- New
  chassis_no text,      -- New
  status text default 'Active', -- Active, Expired, Renewed, Cancelled
  pdf_url text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for policies
alter table public.policies enable row level security;
create policy "Agents can view own policies" on public.policies for select using (auth.uid() = agent_id);
create policy "Agents can insert own policies" on public.policies for insert with check (auth.uid() = agent_id);
create policy "Agents can update own policies" on public.policies for update using (auth.uid() = agent_id);
create policy "Agents can delete own policies" on public.policies for delete using (auth.uid() = agent_id);

-- REMINDERS
create table public.reminders (
  id uuid default uuid_generate_v4() primary key,
  agent_id uuid references public.agents(id) on delete cascade not null,
  customer_id uuid references public.customers(id) on delete cascade not null,
  policy_id uuid references public.policies(id) on delete cascade,
  reminder_type text, -- Renewal, Birthday, etc.
  channel text, -- SMS, WhatsApp, Email
  scheduled_for timestamp with time zone,
  sent_at timestamp with time zone,
  status text default 'pending', -- pending, sent, failed
  message_preview text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for reminders
alter table public.reminders enable row level security;
create policy "Agents can view own reminders" on public.reminders for select using (auth.uid() = agent_id);
create policy "Agents can insert own reminders" on public.reminders for insert with check (auth.uid() = agent_id);
create policy "Agents can update own reminders" on public.reminders for update using (auth.uid() = agent_id);

-- TASKS
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  agent_id uuid references public.agents(id) on delete cascade not null,
  customer_id uuid references public.customers(id),
  policy_id uuid references public.policies(id),
  title text not null,
  description text,
  due_date timestamp with time zone,
  status text default 'pending', -- pending, done, cancelled
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for tasks
alter table public.tasks enable row level security;
create policy "Agents can view own tasks" on public.tasks for select using (auth.uid() = agent_id);
create policy "Agents can manage own tasks" on public.tasks for all using (auth.uid() = agent_id);

-- FUNCTIONS & TRIGGERS
-- Function to handle new user signup (automatically create agent profile)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.agents (id, email, name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'agent');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_new_user on auth.users insert
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- PAYMENTS (Payment tracking for policies)
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  agent_id uuid references public.agents(id) on delete cascade not null,
  policy_id uuid references public.policies(id) on delete cascade not null,
  amount numeric not null,
  payment_date date not null default current_date,
  payment_mode text, -- Cash, UPI, Card, Cheque, Bank Transfer
  reference_no text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for payments
alter table public.payments enable row level security;
create policy "Agents can view own payments" on public.payments for select using (auth.uid() = agent_id);
create policy "Agents can insert own payments" on public.payments for insert with check (auth.uid() = agent_id);
create policy "Agents can update own payments" on public.payments for update using (auth.uid() = agent_id);
create policy "Agents can delete own payments" on public.payments for delete using (auth.uid() = agent_id);

-- Add payment tracking columns to policies table
-- Run these ALTER statements to add to existing policies table:
-- ALTER TABLE public.policies ADD COLUMN payment_status text DEFAULT 'due' CHECK (payment_status IN ('paid', 'partial', 'due'));
-- ALTER TABLE public.policies ADD COLUMN amount_paid numeric DEFAULT 0;

