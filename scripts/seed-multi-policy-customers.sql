-- This script adds 5 new customers and gives each of them 2-3 policies.
-- Great for testing how the UI handles users with multiple active/expired policies.

DO $$
DECLARE
    v_agent_id UUID;
    v_co_id UUID;
    v_first_names TEXT[] := ARRAY['Karan', 'Sneha', 'Vikram', 'Anjali', 'Deepak'];
    v_last_names TEXT[] := ARRAY['Malhotra', 'Kapoor', 'Singhania', 'Bose', 'Chopra'];
    v_cities TEXT[] := ARRAY['Gurgaon', 'Noida', 'Navi Mumbai', 'Thane', 'Chandigarh'];
    
    i INTEGER;
    j INTEGER;
    v_num_policies INTEGER;
    v_name TEXT;
    v_customer_id UUID;
    
    v_policy_type TEXT;
    v_premium NUMERIC;
    v_expiry_date DATE;
BEGIN
    -- 1. Identify the Agent (Using your specific email)
    SELECT id INTO v_agent_id FROM public.agents WHERE email = 'gptsharehub@gmail.com' LIMIT 1;

    IF v_agent_id IS NULL THEN
        RAISE EXCEPTION 'Agent with email gptsharehub@gmail.com not found.';
    END IF;

    -- Make sure we have a company to attach policies to
    SELECT id INTO v_co_id FROM public.companies LIMIT 1;
    IF v_co_id IS NULL THEN
        INSERT INTO public.companies (name, type) VALUES ('HDFC ERGO', 'General') RETURNING id INTO v_co_id;
    END IF;

    -- 2. Loop to insert exactly 5 users
    FOR i IN 1..5 LOOP
        v_name := v_first_names[i] || ' ' || v_last_names[i];

        -- Insert the customer (Trigger will generate PS-XXXX code)
        INSERT INTO public.customers (agent_id, name, email, phone, city, dob)
        VALUES (
            v_agent_id, 
            v_name, 
            lower(v_first_names[i]) || '.vip@example.com', 
            '987' || lpad((floor(random() * 9000000) + 1000000)::text, 7, '0'), 
            v_cities[i], 
            CURRENT_DATE - (INTERVAL '1 year' * (25 + i * 5))
        )
        RETURNING id INTO v_customer_id;

        -- 3. Give each customer 2 or 3 policies
        v_num_policies := 2 + mod(i, 2); -- Gives 2 or 3 depending on 'i'

        FOR j IN 1..v_num_policies LOOP
            
            -- Mix of policy types and dates
            IF j = 1 THEN v_policy_type := 'Car'; v_expiry_date := CURRENT_DATE + INTERVAL '100 days'; v_premium = 12000;
            ELSIF j = 2 THEN v_policy_type := 'Health'; v_expiry_date := CURRENT_DATE - INTERVAL '10 days'; v_premium = 18500; -- Expired
            ELSE v_policy_type := 'Life'; v_expiry_date := CURRENT_DATE + INTERVAL '5 years'; v_premium = 50000; 
            END IF;

            -- Insert the policy for this customer
            INSERT INTO public.policies (
                agent_id, customer_id, company_id, policy_number, policy_type, status, 
                premium_total, amount_paid, payment_status, expiry_date, 
                vehicle_reg_no, vehicle_make
            )
            VALUES (
                v_agent_id, v_customer_id, v_co_id, 
                'VIP-' || upper(substring(v_first_names[i], 1, 3)) || '-' || j || lpad(i::text, 3, '0'), 
                v_policy_type, 
                CASE WHEN v_expiry_date < CURRENT_DATE THEN 'Expired' ELSE 'Active' END, 
                v_premium, v_premium, 'paid', v_expiry_date,
                CASE WHEN v_policy_type = 'Car' THEN 'DL01C' || lpad((i*j)::text, 4, '0') ELSE 'N/A' END,
                CASE WHEN v_policy_type = 'Car' THEN 'Honda' ELSE NULL END
            );
        END LOOP;
        
    END LOOP;

END $$;
