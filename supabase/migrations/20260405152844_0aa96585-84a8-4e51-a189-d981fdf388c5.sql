INSERT INTO storage.buckets (id, name, public) VALUES ('investor-assets', 'investor-assets', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Investor assets are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'investor-assets');

CREATE POLICY "Authenticated users can upload investor assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'investor-assets' AND auth.uid() IS NOT NULL);