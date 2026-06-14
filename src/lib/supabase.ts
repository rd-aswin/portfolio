import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== "your_supabase_project_url" && 
  supabaseAnonKey !== "your_supabase_anon_key";

// A mock Supabase client for graceful fallback in Demo Mode
const mockSupabaseClient = {
  from: (table: string) => ({
    insert: async (data: unknown[]) => {
      console.warn(`[Supabase Demo Mode] Attempted insert into table "${table}":`, data);
      // Simulate network request latency
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { data, error: null };
    },
    select: async () => {
      console.warn(`[Supabase Demo Mode] Attempted select from table "${table}"`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { data: [], error: null };
    }
  })
};

// Export active Supabase client or fallback mock
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (mockSupabaseClient as unknown as SupabaseClient);

export const isSupabaseDemoMode = !isConfigured;
