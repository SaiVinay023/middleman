import { createBrowserClient } from '@supabase/ssr';
import { Capacitor } from '@capacitor/core';

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Essential for Mobile: persists session in the phone's storage
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: Capacitor.isNativePlatform() ? window.localStorage : undefined,
      },
    }
  );
};