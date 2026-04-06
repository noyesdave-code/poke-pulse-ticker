CREATE POLICY "Allow public uploads to investor-assets"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'investor-assets');

CREATE POLICY "Allow public updates to investor-assets"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'investor-assets')
WITH CHECK (bucket_id = 'investor-assets');