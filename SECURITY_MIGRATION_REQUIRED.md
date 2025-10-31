# ⚠️ CRITICAL SECURITY MIGRATION REQUIRED

## Overview
To complete the security fixes, you need to apply a database migration that:
1. Creates a secure user roles system (fixes admin privilege escalation vulnerability)
2. Migrates existing admin users from profiles table to the new user_roles table
3. Updates all RLS policies to use a SECURITY DEFINER function

## How to Apply

### Option 1: Via Backend Interface (Recommended)
1. Click the button below to open your backend:
   <lov-actions>
     <lov-open-backend>Open Backend</lov-open-backend>
   </lov-actions>

2. Navigate to the SQL Editor
3. Copy and paste the SQL below
4. Execute it

### Option 2: Manual Migration File
If you have direct database access, save this as a migration file and apply it.

## Migration SQL

```sql
-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- No public policies on user_roles - only accessed via SECURITY DEFINER functions

-- Create SECURITY DEFINER function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Migrate existing admin users from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM public.profiles
WHERE is_admin = true
ON CONFLICT (user_id, role) DO NOTHING;

-- Drop the RLS policies that reference profiles.is_admin (to avoid errors)
DROP POLICY IF EXISTS "Admins can view all articles" ON public.articles;
DROP POLICY IF EXISTS "Only admins can create articles" ON public.articles;
DROP POLICY IF EXISTS "Only admins can delete articles" ON public.articles;
DROP POLICY IF EXISTS "Only admins can update articles" ON public.articles;
DROP POLICY IF EXISTS "Only admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Only admins can manage tags" ON public.tags;
DROP POLICY IF EXISTS "Only admins can manage article tags" ON public.article_tags;

-- Recreate policies using has_role() function
CREATE POLICY "Admins can view all articles" 
  ON public.articles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can create articles" 
  ON public.articles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete articles" 
  ON public.articles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update articles" 
  ON public.articles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage categories" 
  ON public.categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage tags" 
  ON public.tags FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage article tags" 
  ON public.article_tags FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop is_admin column from profiles (no longer needed)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_admin;
```

## After Migration

Once you've applied the migration:
1. The TypeScript error in Admin.tsx will resolve (types will regenerate)
2. All existing admins will automatically work with the new system
3. The XSS vulnerability is already fixed with DOMPurify sanitization

## What Was Fixed

✅ **Admin Role Architecture** - Roles now stored in separate user_roles table with no public access
✅ **XSS Vulnerability** - Article content is now sanitized with DOMPurify before rendering
✅ **Infinite Recursion Risk** - RLS policies now use SECURITY DEFINER function instead of direct queries
✅ **Client-Side Auth** - Admin checks now use server-side has_role() function

## Security Improvements

- Admin roles are no longer readable by users
- RLS policies are more efficient and safer
- HTML content is sanitized against XSS attacks
- Defense in depth with multiple security layers
