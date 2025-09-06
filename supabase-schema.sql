-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE user_role AS ENUM ('contributor', 'learner', 'linguist', 'researcher', 'admin');
CREATE TYPE content_type AS ENUM ('audio', 'video', 'text', 'image');
CREATE TYPE privacy_setting AS ENUM ('public', 'community', 'research', 'private');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'flagged', 'rejected');

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  region TEXT,
  dialects TEXT[],
  avatar_url TEXT,
  role user_role DEFAULT 'contributor',
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges TEXT[] DEFAULT '{}',
  streak_days INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_terms BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contributions table
CREATE TABLE contributions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type content_type NOT NULL,
  file_url TEXT,
  file_size BIGINT,
  duration INTEGER, -- in seconds for audio/video
  dialect TEXT NOT NULL,
  region TEXT,
  tags TEXT[] DEFAULT '{}',
  privacy_setting privacy_setting DEFAULT 'public',
  verification_status verification_status DEFAULT 'pending',
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  transcript TEXT,
  translation TEXT,
  phonetic_notation TEXT,
  grammar_notes TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contribution_id UUID REFERENCES contributions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create likes table
CREATE TABLE likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contribution_id UUID REFERENCES contributions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(contribution_id, user_id)
);

-- Create comment_likes table
CREATE TABLE comment_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Create learning_progress table
CREATE TABLE learning_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  contribution_id UUID REFERENCES contributions(id) ON DELETE CASCADE,
  progress_type TEXT NOT NULL, -- 'quiz', 'flashcard', 'pronunciation'
  score INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create flashcards table
CREATE TABLE flashcards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contribution_id UUID REFERENCES contributions(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  difficulty_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contribution_id UUID REFERENCES contributions(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table (for chatbot)
CREATE TABLE conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  dialect TEXT NOT NULL,
  messages JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  contribution_id UUID REFERENCES contributions(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game_records table for tracking user game performance
CREATE TABLE game_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL, -- 'quiz', 'memory', 'pronunciation', etc.
  score INTEGER NOT NULL,
  total_questions INTEGER,
  time_taken INTEGER, -- in seconds
  difficulty_level TEXT DEFAULT 'medium',
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contributors_feed table for tracking top contributors
CREATE TABLE contributors_feed (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  contribution_count INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  last_contribution_date TIMESTAMP WITH TIME ZONE,
  rank INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_region ON profiles(region);
CREATE INDEX idx_contributions_user_id ON contributions(user_id);
CREATE INDEX idx_contributions_dialect ON contributions(dialect);
CREATE INDEX idx_contributions_type ON contributions(content_type);
CREATE INDEX idx_contributions_status ON contributions(verification_status);
CREATE INDEX idx_contributions_created_at ON contributions(created_at);
CREATE INDEX idx_contributions_search ON contributions USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_comments_contribution_id ON comments(contribution_id);
CREATE INDEX idx_likes_contribution_id ON likes(contribution_id);
CREATE INDEX idx_learning_progress_user_id ON learning_progress(user_id);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contributions_updated_at BEFORE UPDATE ON contributions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_progress_updated_at BEFORE UPDATE ON learning_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update contribution counts
CREATE OR REPLACE FUNCTION update_contribution_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE contributions 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.contribution_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE contributions 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.contribution_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create triggers for updating counts
CREATE TRIGGER update_likes_count 
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_contribution_counts();

CREATE TRIGGER update_comment_likes_count 
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW EXECUTE FUNCTION update_contribution_counts();

-- Create function to update comment counts
CREATE OR REPLACE FUNCTION update_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE contributions 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.contribution_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE contributions 
    SET comments_count = comments_count - 1 
    WHERE id = OLD.contribution_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comments_count 
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_comment_counts();

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributors_feed ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Contributions policies
CREATE POLICY "Public contributions are viewable by everyone" ON contributions
  FOR SELECT USING (privacy_setting = 'public');

CREATE POLICY "Community contributions are viewable by authenticated users" ON contributions
  FOR SELECT USING (privacy_setting = 'community' AND auth.role() = 'authenticated');

CREATE POLICY "Research contributions are viewable by researchers and admins" ON contributions
  FOR SELECT USING (
    privacy_setting = 'research' AND 
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('researcher', 'admin')
    )
  );

CREATE POLICY "Users can view their own contributions" ON contributions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert contributions" ON contributions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own contributions" ON contributions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contributions" ON contributions
  FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Likes are viewable by everyone" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert likes" ON likes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- Learning progress policies
CREATE POLICY "Users can view their own learning progress" ON learning_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning progress" ON learning_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning progress" ON learning_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Flashcards policies
CREATE POLICY "Flashcards are viewable by everyone" ON flashcards
  FOR SELECT USING (true);

-- Quizzes policies
CREATE POLICY "Quizzes are viewable by everyone" ON quizzes
  FOR SELECT USING (true);

-- Conversations policies
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- Analytics policies (admin only)
CREATE POLICY "Only admins can view analytics" ON analytics
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "System can insert analytics" ON analytics
  FOR INSERT WITH CHECK (true);

-- Game records policies
CREATE POLICY "Users can view their own game records" ON game_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game records" ON game_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all game records" ON game_records
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Contributors feed policies
CREATE POLICY "Contributors feed is viewable by everyone" ON contributors_feed
  FOR SELECT USING (true);

CREATE POLICY "System can update contributors feed" ON contributors_feed
  FOR ALL USING (true);

-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, full_name, accepted_terms)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'accepted_terms')::boolean, false)
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function for auto-deleting old content (15 days)
CREATE OR REPLACE FUNCTION auto_delete_old_content()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete contributions older than 15 days that are still pending or flagged
  DELETE FROM contributions
  WHERE created_at < NOW() - INTERVAL '15 days'
    AND verification_status IN ('pending', 'flagged');

  RETURN NULL;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create function to update contributors feed
CREATE OR REPLACE FUNCTION update_contributors_feed()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert contributor stats
  INSERT INTO contributors_feed (user_id, contribution_count, total_likes, total_views, last_contribution_date, updated_at)
  SELECT
    c.user_id,
    COUNT(c.id) as contribution_count,
    COALESCE(SUM(c.likes_count), 0) as total_likes,
    COALESCE(SUM(c.views_count), 0) as total_views,
    MAX(c.created_at) as last_contribution_date,
    NOW() as updated_at
  FROM contributions c
  WHERE c.verification_status = 'verified'
  GROUP BY c.user_id
  ON CONFLICT (user_id)
  DO UPDATE SET
    contribution_count = EXCLUDED.contribution_count,
    total_likes = EXCLUDED.total_likes,
    total_views = EXCLUDED.total_views,
    last_contribution_date = EXCLUDED.last_contribution_date,
    updated_at = EXCLUDED.updated_at;

  -- Update ranks based on contribution count
  WITH ranked_contributors AS (
    SELECT
      id,
      ROW_NUMBER() OVER (ORDER BY contribution_count DESC, total_likes DESC) as new_rank
    FROM contributors_feed
  )
  UPDATE contributors_feed
  SET rank = ranked_contributors.new_rank
  FROM ranked_contributors
  WHERE contributors_feed.id = ranked_contributors.id;

  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger for updating contributors feed
CREATE TRIGGER update_contributors_feed_trigger
  AFTER INSERT OR UPDATE OR DELETE ON contributions
  FOR EACH STATEMENT EXECUTE FUNCTION update_contributors_feed();

-- Create a scheduled job for auto-deletion (this would need to be set up in Supabase)
-- For now, we'll create a function that can be called manually or via cron
CREATE OR REPLACE FUNCTION cleanup_old_content()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete contributions older than 15 days that are still pending or flagged
  DELETE FROM contributions
  WHERE created_at < NOW() - INTERVAL '15 days'
    AND verification_status IN ('pending', 'flagged');

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ language 'plpgsql' SECURITY DEFINER;
