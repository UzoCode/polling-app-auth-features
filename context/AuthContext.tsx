// context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { supabase } from "../lib/supabaseClient";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { AuthResult } from "./auth";

// Types for our AuthContext
export interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ----------------------
// Supabase Implementation
// ----------------------
function useSupabaseAuth(): AuthContextValue {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (ignore) return;
      const s = data.session;
      setUser(s?.user ? { id: s.user.id, email: s.user.email ?? "" } : null);
      setLoading(false);
    }

    loadSession();

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(
          session?.user ? { id: session.user.id, email: session.user.email ?? "" } : null
        );
      }
    );

    return () => {
      ignore = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    []
  );

  const signUp = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { user, loading, signIn, signUp, signOut };
}

// ----------------------
// Mock Implementation (fallback when Supabase is missing)
// ----------------------
const MOCK_KEY = "mock-user";

function useMockAuth(): AuthContextValue {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async (): Promise<AuthResult> => {
    return { ok: true };
  }, []);

  const signUp = useCallback(async (email: string): Promise<AuthResult> => {
    const u = { id: "mock-uid", email };
    localStorage.setItem(MOCK_KEY, JSON.stringify(u));
    setUser(u);
    return { ok: true };
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(MOCK_KEY);
    setUser(null);
  }, []);

  return { user, loading, signIn, signUp, signOut };
}

// ----------------------
// Auth Provider
// ----------------------
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const impl = hasSupabase ? useSupabaseAuth() : useMockAuth();

  const value = useMemo<AuthContextValue>(() => impl, [impl]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
