'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { CldUploadWidget } from 'next-cloudinary'
import { CheckCircle, UploadCloud, AlertCircle } from 'lucide-react'

const DOC_TYPES = [
  { id: 'ID_CARD', label: 'National ID / Passport' },
  { id: 'CV', label: 'Technical Resume (CV)' },
  { id: 'CERT', label: 'Professional Certification' },
  { id: 'TAX', label: 'Tax Identification' }
]

export default function ProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [userDocs, setUserDocs] = useState<any[]>([])

  // 1. Fetch existing docs on load
  useEffect(() => {
    const fetchDocs = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('documents')
          .select('document_type, status')
          .eq('user_id', user.id)
        setUserDocs(data || [])
      }
      setLoading(false)
    }
    fetchDocs()
  }, [])

  // 2. Handle successful Cloudinary Upload
  const handleUpload = async (result: any, docType: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('documents').insert({
      user_id: user.id,
      document_type: docType,
      file_url: result.info.secure_url,
      status: 'pending'
    })

    if (!error) {
      setUserDocs([...userDocs, { document_type: docType, status: 'pending' }])
    }
  }

  if (loading) return <div className="p-8">Loading profile...</div>

  return (
    <div className="max-w-2xl mx-auto p-6 pb-24">
      <h1 className="text-2xl font-bold mb-2">Verification Center</h1>
      <p className="text-gray-500 mb-8">Upload your documents to start accepting IT gigs.</p>

      <div className="space-y-4">
        {DOC_TYPES.map((doc) => {
          const isUploaded = userDocs.find(d => d.document_type === doc.id)
          
          return (
            <div key={doc.id} className="p-4 border rounded-xl flex items-center justify-between bg-white shadow-sm">
              <div className="flex items-center gap-3">
                {isUploaded ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <AlertCircle className="text-amber-500" />
                )}
                <div>
                  <p className="font-medium">{doc.label}</p>
                  <p className="text-xs text-gray-400">
                    {isUploaded ? `Status: ${isUploaded.status}` : 'Action Required'}
                  </p>
                </div>
              </div>

              {!isUploaded && (
                <CldUploadWidget 
                  uploadPreset="middleman_docs" // Ensure this is 'Unsigned' in Cloudinary Settings
                  onSuccess={(res) => handleUpload(res, doc.id)}
                  options={{ maxFiles: 1, resourceType: 'auto' }}
                >
                  {({ open }) => (
                    <button 
                      onClick={() => open()}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      <UploadCloud size={16} />
                      Upload
                    </button>
                  )}
                </CldUploadWidget>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}