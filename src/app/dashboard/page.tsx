'use client';

import { useState, useEffect } from 'react';
import { AdaptiveNav } from '@/components/adaptive-nav';
import { useCamera } from '@/hooks/useCamera';
import { useHaptics } from '@/hooks/useHaptics';
import { useQuery } from '@tanstack/react-query';

type DashboardData = {
  stats: {
    totalJobs: number;
    activeContracts: number;
    earningsThisMonth: number;
  };
  recentActivity: string[];
};

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { takePicture } = useCamera();
  const { triggerHaptic } = useHaptics();

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      // DEMO DATA – replace with real API later
      await new Promise((r) => setTimeout(r, 500));
      return {
        stats: {
          totalJobs: 12,
          activeContracts: 3,
          earningsThisMonth: 2450,
        },
        recentActivity: [
          'You accepted a new job from ACME Corp.',
          'Invoice #1023 was paid.',
          'You updated your profile availability.',
        ],
      };
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
            {isLoading || !data ? (
              <p className="text-gray-600">Loading...</p>
            ) : (
              <ul className="space-y-1 text-gray-700">
                <li>Total jobs: {data.stats.totalJobs}</li>
                <li>Active contracts: {data.stats.activeContracts}</li>
                <li>Earnings this month: ${data.stats.earningsThisMonth}</li>
              </ul>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
            {isLoading || !data ? (
              <p className="text-gray-600">Loading...</p>
            ) : (
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {data.recentActivity.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
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
