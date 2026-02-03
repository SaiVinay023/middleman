'use client';

import { useCamera } from '@/hooks/useCamera';
import { useHaptics } from '@/hooks/useHaptics';
import { useGigs } from '@/hooks/useGigs';
import { useAuth } from '@/hooks/useAuth';
import { Briefcase, DollarSign, Camera, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { takePicture } = useCamera();
  const { triggerHaptic } = useHaptics();

  // Use our "Safe" hook to get real data from Supabase
  const { available, mine } = useGigs(user?.id);

  // Logic: Calculate earnings from accepted gigs
  const earnings = mine.data?.reduce((sum: number, gig: any) => sum + (gig.pay_amount || 0), 0) || 0;

  const handleCameraClick = async () => {
    await triggerHaptic();
    await takePicture();
  };

  // Shared loading state
  const isDataLoading = available.isLoading || mine.isLoading;

  return (
    <div className="p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Status</h1>
        <p className="text-gray-500">Real-time overview of your technician activity.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Real Stats Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <TrendingUp size={24} />
            <h2 className="text-xl font-bold text-gray-800">Performance</h2>
          </div>
          
          {isDataLoading ? (
             <div className="animate-pulse space-y-3">
               <div className="h-6 bg-gray-100 rounded w-full"></div>
               <div className="h-6 bg-gray-100 rounded w-full"></div>
               <div className="h-6 bg-gray-100 rounded w-full"></div>
             </div>
          ) : (
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span className="text-gray-500">Available Jobs</span>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold text-sm">
                  {available.data?.length || 0}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-500">Active Contracts</span>
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold text-sm">
                  {mine.data?.length || 0}
                </span>
              </li>
              <li className="flex justify-between items-center border-t pt-4">
                <span className="text-gray-500 font-medium">Total Earnings</span>
                <strong className="text-xl text-gray-900">${earnings}</strong>
              </li>
            </ul>
          )}
        </div>

        {/* Recent Activity (Can be connected to a 'logs' table later) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4 text-gray-800">
            <Briefcase size={24} />
            <h2 className="text-xl font-bold">Recent History</h2>
          </div>
          <ul className="space-y-4">
             {mine.data?.slice(0, 3).map((gig: any) => (
               <li key={gig.id} className="text-sm text-gray-600 border-l-4 border-blue-500 pl-4 py-1 bg-gray-50 rounded-r-lg">
                 Accepted <strong>{gig.title}</strong>
               </li>
             ))}
             {(!mine.data || mine.data.length === 0) && (
               <p className="text-sm text-gray-400 italic">No recent activity found.</p>
             )}
          </ul>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <Camera size={24} />
              <h2 className="text-xl font-bold text-gray-800">Identity</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Upload site photos or documents to verify your completed gigs.
            </p>
          </div>
          <button
            onClick={handleCameraClick}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Camera size={20} />
            Capture Document
          </button>
        </div>

      </div>
    </div>
  );
}