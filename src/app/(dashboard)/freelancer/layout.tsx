'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth' // Use your custom hook instead of raw Supabase
import { AdaptiveNav } from '@/components/adaptive-nav'

export default function FreelancerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (loading) return

    // Ensure user is logged in AND is a freelancer
    if (!user) {
      router.replace('/login')
    } else if (profile?.role !== 'freelancer' && profile?.role !== 'admin') {
      // Redirect companies or others away from the technician dashboard
      router.replace('/') 
    } else {
      setIsAuthorized(true)
    }
  }, [user, profile, loading, router])

  if (loading || !isAuthorized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Persistent Navigation optimized for Freelancers */}
      <AdaptiveNav mode="freelancer" />

      {/* Main Content Area with safe area padding for mobile (Capacitor) */}
      <main className="flex-1 overflow-y-auto relative pb-20 md:pb-0 safe-area-bottom">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}