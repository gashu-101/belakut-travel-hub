
-- Create storage bucket for experience images
INSERT INTO storage.buckets (id, name, public)
VALUES ('experience-images', 'experience-images', true);

-- Create policy to allow anyone to view experience images
CREATE POLICY "Anyone can view experience images" ON storage.objects
FOR SELECT USING (bucket_id = 'experience-images');

-- Create policy to allow authenticated users to upload experience images
CREATE POLICY "Authenticated users can upload experience images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'experience-images' AND auth.role() = 'authenticated');

-- Create policy to allow users to update their own experience images
CREATE POLICY "Users can update their own experience images" ON storage.objects
FOR UPDATE USING (bucket_id = 'experience-images' AND auth.role() = 'authenticated');

-- Create policy to allow users to delete their own experience images
CREATE POLICY "Users can delete their own experience images" ON storage.objects
FOR DELETE USING (bucket_id = 'experience-images' AND auth.role() = 'authenticated');

-- Add owner_id column to experiences table to track who created each experience
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- Add description column to experiences table
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS description TEXT;

-- Enable RLS on experiences table
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view experiences
CREATE POLICY "Anyone can view experiences" ON experiences
FOR SELECT USING (true);

-- Create policy to allow authenticated users to create experiences
CREATE POLICY "Authenticated users can create experiences" ON experiences
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND owner_id = auth.uid());

-- Create policy to allow users to update their own experiences
CREATE POLICY "Users can update their own experiences" ON experiences
FOR UPDATE USING (owner_id = auth.uid());

-- Create policy to allow users to delete their own experiences
CREATE POLICY "Users can delete their own experiences" ON experiences
FOR DELETE USING (owner_id = auth.uid());
