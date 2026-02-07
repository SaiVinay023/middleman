import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // 1. Session Listener (Crucial for Guarding)
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 2. Action Handler (For Login/Register buttons)
 /* const handleAction = async (action: () => Promise<any>, redirectPath?: string) => {
    setLoading(true)
    setError(null)
    try {
      await action()
      if (redirectPath) router.push(redirectPath)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  } */
  const signIn = async (email: string, password: string) => {
  setIsLoading(true)
  setError(null)
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  } catch (err: any) {
    setError(err.message)
  } finally {
    setIsLoading(false)
  }
 }
  const signOut = async () => {
  await supabase.auth.signOut()
  router.push('/auth/login')
 }


  return { 
    user,           // Now AdminGuard can see the user!
    isLoading,      // Combined loading state for session check
    loading,        // Specific loading for buttons
    error, 
    //handleAction 
    signIn,
    signOut
  }
}