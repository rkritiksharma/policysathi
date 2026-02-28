-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('policy-documents', 'policy-documents', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Create policies for the policy-documents bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'policy-documents');

CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'policy-documents');

CREATE POLICY "Users can update their own documents" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'policy-documents' AND (EXISTS (
  SELECT 1 FROM auth.users WHERE auth.users.id = owner
)));

CREATE POLICY "Users can delete their own documents" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'policy-documents' AND (EXISTS (
  SELECT 1 FROM auth.users WHERE auth.users.id = owner
)));
