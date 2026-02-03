'use client'
import { useGigs } from '@/hooks/useGigs'
import { useAuth } from '@/hooks/useAuth'
import { Briefcase, Clock, MapPin } from 'lucide-react'

export default function MyWorkPage() {
  const { user } = useAuth()
  
  // We pass the user.id to the hook so it knows whose gigs to fetch
  const { mine } = useGigs(user?.id)

  if (mine.isLoading) return <div className="p-10 text-center">Loading your schedule...</div>

  return (
    <div className="p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Work</h1>
        <p className="text-gray-500">Gigs you have accepted and are currently active.</p>
      </header>

      {mine.data?.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
          <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-medium">No active gigs found.</p>
          <p className="text-sm text-gray-400">Head over to the Marketplace to find work.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mine.data?.map((gig: any) => (
            <div key={gig.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-gray-800">{gig.title}</h2>
                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold uppercase">
                  {gig.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} />
                  <span>{gig.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>Assigned: {new Date(gig.updated_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm transition active:scale-95">
                  View Instructions
                </button>
                <button className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm transition active:scale-95">
                  Message Client
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}