'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { CldUploadWidget } from 'next-cloudinary'
import { CheckCircle, UploadCloud, AlertCircle, Clock, ShieldCheck, ChevronRight } from 'lucide-react'

const DOC_TYPES = [
  { id: 'ID_CARD', label: 'National ID / Passport', tip: 'Avoid glare from lights for faster approval.' },
  { id: 'CV', label: 'Technical Resume (CV)', tip: 'PDF format is preferred for readability.' },
  { id: 'CERT', label: 'Professional Certification', tip: 'Include recent industry certifications.' },
  { id: 'TAX', label: 'Tax Identification', tip: 'Ensure all numbers are clearly visible.' }
]

export default function ProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [userDocs, setUserDocs] = useState<any[]>([])

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

  // Calculate Progress
  const verifiedCount = userDocs.filter(d => d.status === 'verified').length
  const totalCount = DOC_TYPES.length
  const progressPercent = Math.round((userDocs.length / totalCount) * 100)
  const remainingSteps = totalCount - userDocs.length

  if (loading) return <div className="p-10 text-center animate-pulse">Initializing Verification Center...</div>

  return (
    <div className="p-6 pb-32 max-w-2xl mx-auto">
      {/* 1. PROGRESS CIRCLE & GAMIFICATION */}
      <section className="bg-gray-900 rounded-[3rem] p-8 mb-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-4">
            {/* Circular Progress Implementation */}
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * progressPercent) / 100}
                className="text-emerald-400 transition-all duration-1000 ease-out" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black">{progressPercent}%</span>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Verified</span>
            </div>
          </div>
          
          <h1 className="text-xl font-bold mb-1">The Trust Builder</h1>
          <p className="text-sm text-gray-400">
            {remainingSteps > 0 
              ? `Complete ${remainingSteps} more steps to unlock premium gigs.` 
              : "You're all set! Your profile is reaching maximum trust."}
          </p>
        </div>
        {/* Background Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
      </section>

      {/* 2. DYNAMIC STATUS CARDS */}
      <div className="space-y-4">
        {DOC_TYPES.map((doc) => {
          const docData = userDocs.find(d => d.document_type === doc.id)
          const isPending = docData?.status === 'pending'
          const isVerified = docData?.status === 'verified'
          
          // Logic for status-based colors
          const cardStyles = isVerified 
            ? 'bg-emerald-50 border-emerald-100' 
            : isPending 
              ? 'bg-amber-50 border-amber-100' 
              : 'bg-white border-gray-100'

          return (
            <div key={doc.id} className={`p-6 border rounded-[2.5rem] transition-all duration-300 shadow-sm ${cardStyles}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isVerified ? 'bg-emerald-500 text-white' : isPending ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isVerified ? <CheckCircle size={24} /> : isPending ? <Clock size={24} /> : <ShieldCheck size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight">{doc.label}</h3>
                    <p className={`text-[10px] uppercase font-black tracking-widest ${
                      isVerified ? 'text-emerald-600' : isPending ? 'text-amber-600' : 'text-gray-400'
                    }`}>
                      {isVerified ? 'Verified' : isPending ? 'Under Review' : 'Action Required'}
                    </p>
                  </div>
                </div>

                {!docData && (
                  <CldUploadWidget 
                    uploadPreset="middleman_docs"
                    onSuccess={(res) => handleUpload(res, doc.id)}
                    options={{ maxFiles: 1, resourceType: 'auto' }}
                  >
                    {({ open }) => (
                      <button 
                        onClick={() => open()}
                        className="bg-gray-900 text-white p-3 rounded-2xl active:scale-95 transition shadow-lg shadow-gray-200"
                      >
                        <UploadCloud size={20} />
                      </button>
                    )}
                  </CldUploadWidget>
                )}
              </div>

              {/* Instructional Micro-copy & Helpful Tips */}
              {!docData && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    {doc.tip}
                  </p>
                </div>
              )}

              {isPending && (
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-100/50 p-3 rounded-xl">
                  <Clock size={14} />
                  Typically reviewed within 24 hours.
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}