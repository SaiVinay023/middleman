'use client';

import { useState, useEffect } from 'react';
import { AdaptiveNav } from '@/components/adaptive-nav';
import { useCamera } from '@/hooks/useCamera';
import { useHaptics } from '@/hooks/useHaptics';
import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { takePicture } = useCamera();
  const { triggerHaptic } = useHaptics();

  // Example TanStack Query for client-side data fetching
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      // Replace with your actual API call
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: mounted,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCameraClick = async () => {
    await triggerHaptic();
    await takePicture();
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen">
      <AdaptiveNav />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Stats</h2>
            <p className="text-gray-600">Your performance metrics</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
            <p className="text-gray-600">
              {isLoading ? 'Loading...' : 'Activity feed'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
            <button
              onClick={handleCameraClick}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Take Photo
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
