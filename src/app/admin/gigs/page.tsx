'use client'
import { useAdminGigs } from '@/hooks/useAdminGigs'
import { Trash2, Plus } from 'lucide-react'

export default function AdminGigsPage() {
  const { gigs, isLoading, deleteGig, createGig, isCreating } = useAdminGigs()

  const handleAddTestGig = () => {
    createGig({
      title: 'Fiber Optic Repair',
      description: 'Repair broken line at Main St.',
      pay_amount: 150,
      location: 'Downtown'
    })
  }

  if (isLoading) return <div className="p-10 text-center">Loading admin panel...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Gigs</h1>
        <button 
          onClick={handleAddTestGig}
          disabled={isCreating}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} /> Add New Gig
        </button>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Pay</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {gigs?.map((gig) => (
              <tr key={gig.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">{gig.title}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    gig.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {gig.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">${gig.pay_amount}</td>
                <td className="p-4">
                  <button 
                    onClick={() => deleteGig(gig.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}