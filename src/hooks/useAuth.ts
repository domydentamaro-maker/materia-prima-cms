import { useState, useEffect, useCallback } from "react";
import type { User, Session } from "@supabase/supabase-js";
import {
  onAuthStateChange,
  getSession,
  isAdminLegacy,
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  isDemoMode,
  type AppRole,
} from "@/services/auth";

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status
  const checkAdminStatus = useCallback(async (userId: string) => {
    const adminStatus = await isAdminLegacy(userId);
    setIsAdmin(adminStatus);
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      // Check admin status when user changes
      if (newSession?.user) {
        // Use setTimeout to avoid Supabase deadlock
        setTimeout(() => {
          checkAdminStatus(newSession.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });

    // THEN check for existing session
    getSession().then(({ session: existingSession }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        checkAdminStatus(existingSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [checkAdminStatus]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await authSignIn(email, password);
    return { error: error as Error | null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    const { error } = await authSignUp(email, password, fullName);
    return { error: error as Error | null };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await authSignOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    }
    return { error: error as Error | null };
  }, []);

  return {
    user,
    session,
    isLoading,
    isAdmin,
    isAuthenticated: !!user,
    isDemoMode: isDemoMode(),
    signIn,
    signUp,
    signOut,
  };
}
