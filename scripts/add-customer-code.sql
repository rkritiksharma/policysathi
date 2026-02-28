-- 1. Add column if it doesn't exist
ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_code TEXT UNIQUE;

-- 2. Create Sequence for the auto-incrementing number
CREATE SEQUENCE IF NOT EXISTS customer_code_seq START 1;

-- 3. Create Function that generates the code 'PS-0001'
CREATE OR REPLACE FUNCTION generate_customer_code()
RETURNS TRIGGER AS $$
BEGIN
  -- If customer_code is not provided, generate one
  IF NEW.customer_code IS NULL THEN
    NEW.customer_code := 'PS-' || LPAD(nextval('customer_code_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create Trigger to run BEFORE every INSERT
DROP TRIGGER IF EXISTS set_customer_code ON customers;
CREATE TRIGGER set_customer_code
BEFORE INSERT ON customers
FOR EACH ROW
EXECUTE FUNCTION generate_customer_code();

-- 5. Backfill existing customers who don't have a code yet
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN SELECT id FROM customers WHERE customer_code IS NULL ORDER BY created_at ASC
    LOOP
        UPDATE customers 
        SET customer_code = 'PS-' || LPAD(nextval('customer_code_seq')::TEXT, 4, '0')
        WHERE id = rec.id;
    END LOOP;
END;
$$;
