
-- Add date_of_birth to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS chat_age_verified boolean NOT NULL DEFAULT false;

-- Create chat messages table
CREATE TABLE public.arena_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  channel text NOT NULL DEFAULT 'lobby',
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.arena_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read chat"
ON public.arena_chat_messages FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can send messages"
ON public.arena_chat_messages FOR INSERT TO authenticated
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can delete own messages"
ON public.arena_chat_messages FOR DELETE TO authenticated
USING (auth.uid() = sender_id);

-- Index for fast channel queries
CREATE INDEX idx_chat_channel_created ON public.arena_chat_messages (channel, created_at DESC);

ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_chat_messages;
