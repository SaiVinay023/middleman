import { useState } from 'react'
import { AuthService } from '@/services/authService'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAction = async (action: () => Promise<any>, redirectPath?: string) => {
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
  }

  return { loading, error, handleAction }
}