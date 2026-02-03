'use client'
import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/lib/supabase'

export default function ProfileSettings({ userId }: { userId: string }) {
  const { profile, updateProfile, isUpdating, isLoading } = useProfile(userId)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')

  // Sync local state when profile data loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setBio(profile.bio || '')
    }
  }, [profile])

  const onSave = () => {
    updateProfile({ full_name: fullName, bio: bio })
  }

  if (isLoading) return <div className="p-6">Loading profile...</div>

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Display Name</label>
          <input 
            type="text"
            className="w-full mt-1 p-3 border rounded-xl bg-white"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Bio / Skills</label>
          <textarea 
            rows={4}
            className="w-full mt-1 p-3 border rounded-xl bg-white"
            placeholder="Tell us about your IT expertise..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <button 
          onClick={onSave}
          disabled={isUpdating}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold disabled:bg-blue-300"
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}