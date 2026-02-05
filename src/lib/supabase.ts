import { createBrowserClient } from '@supabase/ssr';
import { Capacitor } from '@capacitor/core';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file.'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: Capacitor.isNativePlatform() ? window.localStorage : undefined,
    },
  });
};


// Singleton instance for easy importing
export const supabase = createClient();
