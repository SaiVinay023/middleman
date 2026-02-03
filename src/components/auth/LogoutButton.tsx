'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { LogOut } from 'lucide-react'

export default function LogoutButton({ isMobile }: { isMobile?: boolean }) {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    // Redirection is handled by the DashboardLayout guardian
  }

  if (isMobile) {
    return (
      <button onClick={handleLogout} className="flex flex-col items-center justify-center text-gray-400">
        <LogOut size={24} className={loading ? 'animate-pulse' : ''} />
        <span className="text-xs">Exit</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-gray-800 rounded-lg transition-colors font-medium"
    >
      <LogOut size={20} />
      <span>{loading ? 'Leaving...' : 'Logout'}</span>
    </button>
  )
}