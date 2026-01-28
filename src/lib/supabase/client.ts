import { createBrowserClient } from '@supabase/ssr'
import { Capacitor } from '@capacitor/core'

export function createClient() {
  const isNative = Capacitor.isNativePlatform()

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // If native, we skip cookies and let Supabase handle tokens in LocalStorage
      // which is the only way to persist login on a phone app
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: isNative ? window.localStorage : undefined,
      }
    }
  )
}