'use client'
import { CldUploadWidget } from 'next-cloudinary'
import { useDocuments } from '@/hooks/useDocuments'
import { CheckCircle, Clock, Upload } from 'lucide-react'

interface Props {
  userId: string
  docType: 'ID_CARD' | 'CERTIFICATION' | 'RESUME'
  label: string
}

export default function DocUploader({ userId, docType, label }: Props) {
  const { documents, recordUpload, isUploading } = useDocuments(userId)

  const validateFile = (file: File): boolean => {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  
  if (file.size > MAX_SIZE) {
    throw new Error('File too large. Maximum size is 10MB');
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP, and PDF allowed');
  }
  
  return true;
};

// Add to upload handler
const handleUpload = async (file: File) => {
  validateFile(file);
  
  // Sanitize filename
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 100);
  
  // Check if this specific document type has already been uploaded
  const existingDoc = documents?.find(d => d.document_type === docType)

  return (
    <div className="flex items-center justify-between p-4 border rounded-2xl bg-white shadow-sm">
      <div>
        <p className="font-semibold text-gray-800">{label}</p>
        <div className="flex items-center gap-1 mt-1">
          {existingDoc ? (
            <span className="text-xs flex items-center gap-1 text-amber-600">
              <Clock size={12} /> Pending Review
            </span>
          ) : (
            <span className="text-xs text-gray-400">Not uploaded yet</span>
          )}
        </div>
      </div>

      {existingDoc ? (
        <CheckCircle className="text-green-500" size={24} />
      ) : (
        <CldUploadWidget 
          uploadPreset="middleman_unsigned" 
          onSuccess={(result: any) => {
            recordUpload({ docType, url: result.info.secure_url })
          }}
        >
          {({ open }) => (
            <button 
              onClick={() => open()}
              disabled={isUploading}
              className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Upload size={20} />
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  )
}