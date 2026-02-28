-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

DO $$
DECLARE
    v_agent_id UUID;
    v_co_id UUID;
    v_first_names TEXT[] := ARRAY['Aarav', 'Vihaan', 'Aditya', 'Arjun', 'Sai', 'Rohan', 'Krishna', 'Ishaan', 'Shaurya', 'Ayaan', 'Diya', 'Sanya', 'Priya', 'Riya', 'Ananya', 'Aarohi', 'Avni', 'Kavya', 'Neha', 'Pooja', 'Rahul', 'Vikas', 'Amit', 'Suresh', 'Ramesh', 'Sanjay', 'Sunil', 'Anil', 'Nitin', 'Manoj'];
    v_last_names TEXT[] := ARRAY['Sharma', 'Singh', 'Kumar', 'Das', 'Patel', 'Yadav', 'Gupta', 'Joshi', 'Chauhan', 'Rajput', 'Mishra', 'Pandey', 'Tiwari', 'Reddy', 'Nair'];
    v_cities TEXT[] := ARRAY['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal'];
    
    i INTEGER;
    v_name TEXT;
    v_city TEXT;
    v_phone TEXT;
    v_email TEXT;
    v_dob DATE;
    v_customer_id UUID;
    
    v_policy_type TEXT;
    v_status TEXT;
    v_premium NUMERIC;
    v_amount_paid NUMERIC;
    v_payment_status TEXT;
    v_expiry_date DATE;
BEGIN
    -- 1. Identify the Agent (Using the user's specific email)
    SELECT id INTO v_agent_id FROM public.agents WHERE email = 'gptsharehub@gmail.com' LIMIT 1;

    IF v_agent_id IS NULL THEN
        RAISE EXCEPTION 'Agent with email gptsharehub@gmail.com not found. Please ensure you are signed in with that email.';
    END IF;

    -- Make sure we have at least one company to attach policies to
    SELECT id INTO v_co_id FROM public.companies LIMIT 1;
    IF v_co_id IS NULL THEN
        INSERT INTO public.companies (name, type) VALUES ('HDFC ERGO', 'General') RETURNING id INTO v_co_id;
    END IF;

    -- 2. DANGER: DUAL CLEANUP! Delete all existing data for this agent
    DELETE FROM public.payments WHERE agent_id = v_agent_id;
    DELETE FROM public.tasks WHERE agent_id = v_agent_id;
    DELETE FROM public.policies WHERE agent_id = v_agent_id;
    DELETE FROM public.customers WHERE agent_id = v_agent_id;

    -- 3. Loop to insert 50 diverse customers
    FOR i IN 1..50 LOOP
        -- Generate random-ish but varied names and details
        v_name := v_first_names[1 + mod(i * 7, array_length(v_first_names, 1))] || ' ' || v_last_names[1 + mod(i * 11, array_length(v_last_names, 1))];
        v_city := v_cities[1 + mod(i * 13, array_length(v_cities, 1))];
        v_phone := '9' || lpad((floor(random() * 90000000) + 10000000)::text, 9, '0');
        v_email := lower(split_part(v_name, ' ', 1)) || i::text || '@example.com';
        v_dob := CURRENT_DATE - (INTERVAL '1 year' * (18 + mod(i * 17, 42))); -- Ages 18 to 60

        -- Edge Case Testing: Leave some fields null so UI handles "N/A" states properly
        IF mod(i, 5) = 0 THEN
            v_email := NULL; -- No email every 5th customer
        END IF;
        IF mod(i, 7) = 0 THEN
            v_dob := NULL; -- No DOB every 7th customer
        END IF;
        IF mod(i, 8) = 0 THEN
            v_city := NULL; -- No City every 8th customer
        END IF;

        -- Insert the customer (Trigger will give them customer_code e.g. PS-XXXX)
        INSERT INTO public.customers (agent_id, name, email, phone, city, dob)
        VALUES (v_agent_id, v_name, v_email, v_phone, v_city, v_dob)
        RETURNING id INTO v_customer_id;

        -- 4. Insert Policies (Give a policy to exactly 25 out of the 50 customers to test empty states vs filled states)
        IF mod(i, 2) = 0 THEN
            -- Randomize policy types and statuses
            IF mod(i, 3) = 0 THEN v_policy_type := 'Health'; ELSIF mod(i, 3) = 1 THEN v_policy_type := 'Life'; ELSE v_policy_type := 'Car'; END IF;
            IF mod(i, 4) = 0 THEN v_status := 'Expired'; ELSE v_status := 'Active'; END IF;
            
            v_premium := 5000 + (i * 300);
            v_expiry_date := CURRENT_DATE + (INTERVAL '1 day' * (i * 10 - 150)); -- Range of dates in past and future
            
            -- Some unpaid, some paid, some partial
            IF mod(i, 5) = 0 THEN
                v_amount_paid := 0; v_payment_status := 'due';
            ELSIF mod(i, 6) = 0 THEN
                v_amount_paid := v_premium / 2; v_payment_status := 'partial';
            ELSE
                v_amount_paid := v_premium; v_payment_status := 'paid';
            END IF;

            INSERT INTO public.policies (
                agent_id, customer_id, company_id, policy_number, policy_type, status, premium_total, amount_paid, payment_status, expiry_date, vehicle_reg_no, vehicle_make
            )
            VALUES (
                v_agent_id, v_customer_id, v_co_id, 'POL-TS' || lpad(i::text, 4, '0'), 
                v_policy_type, v_status, v_premium, v_amount_paid, v_payment_status, v_expiry_date,
                CASE WHEN v_policy_type = 'Car' THEN 'RJ14' || lpad(i::text, 4, '0') ELSE 'N/A' END,
                CASE WHEN v_policy_type = 'Car' THEN 'Maruti' ELSE NULL END
            );
        END IF;
    END LOOP;

END $$;
