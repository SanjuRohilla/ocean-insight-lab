-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  organization TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- Create uploaded_files table
CREATE TABLE public.uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own files"
  ON public.uploaded_files FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload files"
  ON public.uploaded_files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own files"
  ON public.uploaded_files FOR DELETE
  USING (auth.uid() = user_id);

-- Create analysis_results table
CREATE TABLE public.analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  taxa_count INTEGER DEFAULT 0,
  novel_species_count INTEGER DEFAULT 0,
  sequences_processed INTEGER DEFAULT 0,
  accuracy_rate DECIMAL(5,2) DEFAULT 0,
  processing_time_seconds INTEGER,
  summary JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own results"
  ON public.analysis_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create results"
  ON public.analysis_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create taxa_identified table
CREATE TABLE public.taxa_identified (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES public.analysis_results(id) ON DELETE CASCADE,
  kingdom TEXT NOT NULL,
  phylum TEXT,
  class TEXT,
  order_name TEXT,
  family TEXT,
  genus TEXT,
  species TEXT,
  confidence_score DECIMAL(5,2),
  sequence_count INTEGER DEFAULT 1,
  is_novel BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.taxa_identified ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view taxa from own analyses"
  ON public.taxa_identified FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.analysis_results
      WHERE analysis_results.id = taxa_identified.analysis_id
      AND analysis_results.user_id = auth.uid()
    )
  );

-- Create sequences table
CREATE TABLE public.sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL REFERENCES public.uploaded_files(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES public.analysis_results(id) ON DELETE CASCADE,
  sequence_data TEXT NOT NULL,
  quality_score DECIMAL(5,2),
  length INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sequences"
  ON public.sequences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.uploaded_files
      WHERE uploaded_files.id = sequences.file_id
      AND uploaded_files.user_id = auth.uid()
    )
  );

-- Create storage bucket for DNA sequence files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('dna-files', 'dna-files', false);

-- Storage policies for DNA files
CREATE POLICY "Users can upload own DNA files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'dna-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own DNA files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'dna-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own DNA files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'dna-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();