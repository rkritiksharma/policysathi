-- Unified SQL Fix for Schema & Dummy Data
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/oqcxroesekzqzeuwovud/sql

-- 1. FIX SCHEMA (Add missing columns if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='policies' AND column_name='payment_status') THEN
        ALTER TABLE public.policies ADD COLUMN payment_status text DEFAULT 'due' CHECK (payment_status IN ('paid', 'partial', 'due'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='policies' AND column_name='amount_paid') THEN
        ALTER TABLE public.policies ADD COLUMN amount_paid numeric DEFAULT 0;
    END IF;
END $$;

-- 2. SEED DATA
DO $$
DECLARE
    v_agent_id UUID;
    v_co_id_1 UUID;
    v_co_id_2 UUID;
    v_co_id_3 UUID;
    v_co_id_4 UUID;
    v_co_id_5 UUID;
    v_cust_id_1 UUID;
    v_cust_id_2 UUID;
    v_cust_id_3 UUID;
    v_cust_id_4 UUID;
    v_cust_id_5 UUID;
    v_pol_id_1 UUID;
    v_pol_id_2 UUID;
    v_pol_id_3 UUID;
    v_pol_id_4 UUID;
    v_pol_id_5 UUID;
BEGIN
    -- Identify Agent ID
    SELECT id INTO v_agent_id FROM public.agents WHERE email = 'gptsharehub@gmail.com';
    
    IF v_agent_id IS NULL THEN
        RAISE EXCEPTION 'Agent with email gptsharehub@gmail.com not found. Please sign up first.';
    END IF;

    -- Clean up existing dummy data for this agent to avoid duplicates
    DELETE FROM public.payments WHERE agent_id = v_agent_id;
    DELETE FROM public.tasks WHERE agent_id = v_agent_id;
    DELETE FROM public.policies WHERE agent_id = v_agent_id;
    DELETE FROM public.customers WHERE agent_id = v_agent_id;

    -- Insert Companies (if missing)
    INSERT INTO public.companies (name, type) VALUES ('HDFC ERGO', 'General') ON CONFLICT DO NOTHING;
    INSERT INTO public.companies (name, type) VALUES ('ICICI Lombard', 'General') ON CONFLICT DO NOTHING;
    INSERT INTO public.companies (name, type) VALUES ('Star Health', 'Health') ON CONFLICT DO NOTHING;
    INSERT INTO public.companies (name, type) VALUES ('LIC of India', 'Life') ON CONFLICT DO NOTHING;
    INSERT INTO public.companies (name, type) VALUES ('Tata AIG', 'General') ON CONFLICT DO NOTHING;

    SELECT id INTO v_co_id_1 FROM public.companies WHERE name = 'HDFC ERGO' LIMIT 1;
    SELECT id INTO v_co_id_2 FROM public.companies WHERE name = 'ICICI Lombard' LIMIT 1;
    SELECT id INTO v_co_id_3 FROM public.companies WHERE name = 'Star Health' LIMIT 1;
    SELECT id INTO v_co_id_4 FROM public.companies WHERE name = 'LIC of India' LIMIT 1;
    SELECT id INTO v_co_id_5 FROM public.companies WHERE name = 'Tata AIG' LIMIT 1;

    -- Insert 5 Customers
    INSERT INTO public.customers (agent_id, name, email, phone, city)
    VALUES (v_agent_id, 'Rajesh Kumar', 'rajesh@example.com', '9876543210', 'Delhi') RETURNING id INTO v_cust_id_1;
    INSERT INTO public.customers (agent_id, name, email, phone, city)
    VALUES (v_agent_id, 'Priya Singh', 'priya@example.com', '9988776655', 'Mumbai') RETURNING id INTO v_cust_id_2;
    INSERT INTO public.customers (agent_id, name, email, phone, city)
    VALUES (v_agent_id, 'Amit Sharma', 'amit@example.com', '9123456789', 'Bangalore') RETURNING id INTO v_cust_id_3;
    INSERT INTO public.customers (agent_id, name, email, phone, city)
    VALUES (v_agent_id, 'Suman Devi', 'suman@example.com', '8877665544', 'Jaipur') RETURNING id INTO v_cust_id_4;
    INSERT INTO public.customers (agent_id, name, email, phone, city)
    VALUES (v_agent_id, 'Vikram Patel', 'vikram@example.com', '7766554433', 'Ahmedabad') RETURNING id INTO v_cust_id_5;

    -- Insert 5 Policies (Including new payment columns)
    INSERT INTO public.policies (agent_id, customer_id, company_id, policy_number, policy_type, status, premium_total, amount_paid, payment_status, expiry_date)
    VALUES (v_agent_id, v_cust_id_1, v_co_id_1, 'POL-1001', 'Car', 'Active', 15000, 15000, 'paid', CURRENT_DATE + INTERVAL '1 month') RETURNING id INTO v_pol_id_1;
    INSERT INTO public.policies (agent_id, customer_id, company_id, policy_number, policy_type, status, premium_total, amount_paid, payment_status, expiry_date)
    VALUES (v_agent_id, v_cust_id_2, v_co_id_2, 'POL-1002', 'Bike', 'Active', 2500, 0, 'due', CURRENT_DATE + INTERVAL '11 months') RETURNING id INTO v_pol_id_2;
    INSERT INTO public.policies (agent_id, customer_id, company_id, policy_number, policy_type, status, premium_total, amount_paid, payment_status, expiry_date)
    VALUES (v_agent_id, v_cust_id_3, v_co_id_3, 'POL-1003', 'Health', 'Active', 8000, 4000, 'partial', CURRENT_DATE + INTERVAL '6 months') RETURNING id INTO v_pol_id_3;
    INSERT INTO public.policies (agent_id, customer_id, company_id, policy_number, policy_type, status, premium_total, amount_paid, payment_status, expiry_date)
    VALUES (v_agent_id, v_cust_id_4, v_co_id_4, 'POL-1004', 'Life', 'Active', 25000, 25000, 'paid', CURRENT_DATE + INTERVAL '10 months') RETURNING id INTO v_pol_id_4;
    INSERT INTO public.policies (agent_id, customer_id, company_id, policy_number, policy_type, status, premium_total, amount_paid, payment_status, expiry_date)
    VALUES (v_agent_id, v_cust_id_5, v_co_id_5, 'POL-1005', 'Commercial', 'Expired', 45000, 0, 'due', CURRENT_DATE - INTERVAL '5 days') RETURNING id INTO v_pol_id_5;

    -- Insert 5 Tasks
    INSERT INTO public.tasks (agent_id, customer_id, title, description, due_date, status)
    VALUES (v_agent_id, v_cust_id_1, 'Visit Rajesh for renewal', 'Discuss comprehensive plan', CURRENT_TIMESTAMP + INTERVAL '2 days', 'pending');
    INSERT INTO public.tasks (agent_id, customer_id, title, description, due_date, status)
    VALUES (v_agent_id, v_cust_id_2, 'Call Priya regarding claim', 'Check documentation status', CURRENT_TIMESTAMP + INTERVAL '4 hours', 'pending');
    INSERT INTO public.tasks (agent_id, customer_id, title, description, due_date, status)
    VALUES (v_agent_id, v_cust_id_3, 'Send Amit policy soft copy', 'Email PDF of the health policy', CURRENT_TIMESTAMP + INTERVAL '1 day', 'pending');
    INSERT INTO public.tasks (agent_id, customer_id, title, description, due_date, status)
    VALUES (v_agent_id, v_cust_id_4, 'Collect premium from Suman', 'Collect 25k cheque', CURRENT_TIMESTAMP - INTERVAL '1 day', 'done');
    INSERT INTO public.tasks (agent_id, customer_id, title, description, due_date, status)
    VALUES (v_agent_id, v_cust_id_5, 'Follow up with Vikram', 'Ask for vehicle photos', CURRENT_TIMESTAMP + INTERVAL '3 days', 'pending');

    -- Insert 5 Payments
    INSERT INTO public.payments (agent_id, policy_id, amount, payment_mode, reference_no)
    VALUES (v_agent_id, v_pol_id_1, 15000, 'UPI', 'TXN001');
    INSERT INTO public.payments (agent_id, policy_id, amount, payment_mode, reference_no)
    VALUES (v_agent_id, v_pol_id_3, 4000, 'UPI', 'TXN003');
    INSERT INTO public.payments (agent_id, policy_id, amount, payment_mode, reference_no)
    VALUES (v_agent_id, v_pol_id_4, 25000, 'Cheque', 'CHQ998');

    RAISE NOTICE 'Fix & Seed completed for gptsharehub@gmail.com. Check your dashboard!';
END $$;
