import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type AppRole = "admin" | "author" | "reader";

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

// Sign up with email and password
export async function signUp(email: string, password: string, fullName?: string) {
  const redirectUrl = `${window.location.origin}/`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName,
      },
    },
  });

  return { data, error };
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Get current session
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

// Get current user
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
}

// Check if user is admin (using profiles.is_admin - legacy approach)
// TODO: Migrate to user_roles table after running migration
export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error checking admin status:", error);
    return false;
  }

  return data?.is_admin === true;
}

// Alias for backward compatibility
export const isAdminLegacy = isAdmin;

// Check if user has a specific role
// TODO: Implement after user_roles migration
export async function hasRole(userId: string, role: AppRole): Promise<boolean> {
  if (role === "admin") {
    return isAdmin(userId);
  }
  // For now, all authenticated users have reader role
  return role === "reader";
}

// Get all roles for a user
// TODO: Implement after user_roles migration
export async function getUserRoles(userId: string): Promise<AppRole[]> {
  const adminStatus = await isAdmin(userId);
  if (adminStatus) {
    return ["admin", "reader"];
  }
  return ["reader"];
}

// Subscribe to auth state changes
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

// Demo mode check (for development only)
export const DEMO_MODE = import.meta.env.DEV;

export function isDemoMode(): boolean {
  return DEMO_MODE;
}
