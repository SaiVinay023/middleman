'use client'
import { useAdminVerify } from '@/hooks/useAdminVerify'
import { Check, X, ExternalLink } from 'lucide-react'

export default function AdminVerifyPage() {
  const { pendingDocs, isLoading, updateStatus, isProcessing } = useAdminVerify()

  if (isLoading) return <div className="p-10 text-center">Loading verification queue...</div>

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Technician Verification</h1>

      <div className="grid gap-4">
        {pendingDocs?.length === 0 && <p className="text-gray-500">No pending documents to review.</p>}
        
        {pendingDocs?.map((doc: any) => (
          <div key={doc.id} className="bg-white border rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="font-bold text-lg">{doc.technicians?.full_name}</p>
              <p className="text-sm text-gray-500">{doc.document_type} - {doc.technicians?.email}</p>
              <a 
                href={doc.file_url} 
                target="_blank" 
                className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
              >
                View Document <ExternalLink size={14} />
              </a>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => updateStatus({ docId: doc.id, userId: doc.user_id, status: 'rejected' })}
                disabled={isProcessing}
                className="p-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                <X size={20} />
              </button>
              <button 
                onClick={() => updateStatus({ docId: doc.id, userId: doc.user_id, status: 'approved' })}
                disabled={isProcessing}
                className="p-3 text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors"
              >
                <Check size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}