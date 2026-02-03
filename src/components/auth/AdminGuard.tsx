'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile(user?.id || '');
  const router = useRouter();
  
  // Hydration fix: Don't do anything until the component has mounted on the client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || authLoading || profileLoading) return;

    // 1. No user? Go to login
    if (!user) {
      router.replace('/auth/login');
      return;
    }

    // 2. Profile loaded but NOT an admin? Go to dashboard
    if (profile && profile.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [user, profile, authLoading, profileLoading, router, mounted]);

  // Show nothing while mounting or loading to prevent hydration flicker
  if (!mounted || authLoading || profileLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white font-black uppercase text-xs tracking-widest">
        Verifying Security Clearence...
      </div>
    );
  }

  // Only render children if the user is definitely an admin
  if (user && profile?.role === 'admin') {
    return <>{children}</>;
  }

  return null;
}