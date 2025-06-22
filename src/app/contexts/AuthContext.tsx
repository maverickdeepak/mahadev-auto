"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient, User, Session } from "@supabase/supabase-js";
import toast from "react-hot-toast";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          // Clear invalid session
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);

          // Check if session is about to expire (within 5 minutes)
          if (session?.expires_at) {
            const expiresAt = new Date(session.expires_at * 1000);
            const now = new Date();
            const timeUntilExpiry = expiresAt.getTime() - now.getTime();

            // If session expires in less than 5 minutes, refresh it
            if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
              console.log("Session expiring soon, refreshing...");
              await refreshSession();
            }
          }
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
      } else if (event === "TOKEN_REFRESHED") {
        setSession(session);
        setUser(session?.user ?? null);
      } else if (event === "SIGNED_IN") {
        setSession(session);
        setUser(session?.user ?? null);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Signing out...");

      // Clear local state immediately
      setSession(null);
      setUser(null);

      // Use Supabase's built-in signOut method
      const { error } = await supabase.auth.signOut();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (error) {
        console.error("Sign out error:", error);
        toast.error(
          "Error during sign out, but you have been logged out locally"
        );
      } else {
        toast.success("Logged out successfully");
      }

      // Force redirect to login page after ensuring session is cleared
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 100);
    } catch (error) {
      console.error("Sign out error:", error);
      toast.success("Logged out successfully");
      // Force redirect to login page
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 100);
    }
  };

  const refreshSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession();

      if (error) {
        console.error("Session refresh error:", error);
        // If refresh fails, clear the session
        setSession(null);
        setUser(null);
        toast.error("Session expired. Please log in again.");
        window.location.href = "/admin/login";
      } else {
        setSession(session);
        setUser(session?.user ?? null);
        console.log("Session refreshed successfully");
      }
    } catch (error) {
      console.error("Session refresh error:", error);
      setSession(null);
      setUser(null);
      toast.error("Session expired. Please log in again.");
      window.location.href = "/admin/login";
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
