import { createClient } from '@supabase/supabase-js';

// Use a singleton pattern to ensure only one instance is created
let supabaseInstance = null;

const getSupabase = () => {
  if (!supabaseInstance) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase configuration. Please check your environment variables.');
      return null;
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  
  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabase();
