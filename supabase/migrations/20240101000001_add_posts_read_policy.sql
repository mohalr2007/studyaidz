-- AI FIX: This migration fixes the community page error by allowing users to read posts.
-- 1. Enable Row-Level Security on the 'posts' table.
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy that allows any authenticated user to view all posts.
CREATE POLICY "Allow authenticated users to read posts"
ON public.posts
FOR SELECT
TO authenticated
USING (true);
