'use client'
import { useGigs } from '@/hooks/useGigs'
import { useAuth } from '@/hooks/useAuth' // Use this to get real techId

export default function GigsPage() {
  // 1. Get real user session
  const { user } = useAuth()
  
  // 2. Destructure the hook correctly based on its return shape
  const { available, claimGig, isClaiming } = useGigs(user?.id)

  // 3. Use available.isLoading
  if (available.isLoading) return <div className="p-8 text-center">Loading available jobs...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Marketplace</h1>
      
      <div className="grid gap-4">
        {/* 4. Map over available.data */}
        {available.data?.map((gig: any) => (
          <div key={gig.id} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex justify-between items-center">
            <div>
              <h2 className="font-bold text-gray-900">{gig.title}</h2>
              <p className="text-sm text-gray-500">${gig.pay_amount}</p>
            </div>
            
            <button 
              // 5. Pass real user ID and use isClaiming for loading state
              onClick={() => claimGig({ gigId: gig.id, techId: user?.id! })}
              disabled={isClaiming || !user}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold disabled:bg-gray-300"
            >
              {isClaiming ? 'Processing...' : 'Accept Gig'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}