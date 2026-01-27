'use client';

import { useState, useEffect } from 'react';
import { AdaptiveNav } from '@/components/adaptive-nav';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export default function Profile() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUserStore();

  useEffect(() => {
    setMounted(true);
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push('/auth/');
      }
    });
  }, [router, setUser]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/auth/');
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen">
      <AdaptiveNav />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{user?.email || 'Not signed in'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <p className="mt-1 text-gray-900 text-sm break-all">
                {user?.id || 'N/A'}
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
