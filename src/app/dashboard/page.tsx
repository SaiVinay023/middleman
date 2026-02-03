'use client';

import { useCamera } from '@/hooks/useCamera';
import { useHaptics } from '@/hooks/useHaptics';
import { useGigs } from '@/hooks/useGigs';
import { useAuth } from '@/hooks/useAuth';
import { Briefcase, DollarSign, Camera, TrendingUp, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const { takePicture } = useCamera();
  const { triggerHaptic } = useHaptics();

  const { available, mine } = useGigs(user?.id);

  const earnings = mine.data?.reduce((sum: number, gig: any) => sum + (gig.pay_amount || 0), 0) || 0;
  const weeklyGoal = 1000; // Hardcoded for now, can be a user setting later
  const progress = Math.min((earnings / weeklyGoal) * 100, 100);

  const handleCameraClick = async () => {
    await triggerHaptic();
    await takePicture();
  };

  const isDataLoading = available.isLoading || mine.isLoading;

  return (
    <div className="pb-24 lg:pb-10">
      {/* 1. PULSE HEADER: What do I do right now? */}
      <div className="bg-gray-900 text-white p-6 pt-12 rounded-b-[3rem] shadow-2xl mb-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
          <p className="text-gray-400 text-sm">Real-time overview of your activity</p>
        </header>

        {/* Visual Progress: Weekly Goal Gamification */}
        <div className="bg-white/10 p-5 rounded-3xl border border-white/10 backdrop-blur-md">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Weekly Goal</p>
              <h2 className="text-3xl font-black">${earnings} <span className="text-lg text-gray-500 font-normal">/ ${weeklyGoal}</span></h2>
            </div>
            <div className="text-right">
              <span className="text-emerald-400 font-bold">{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8">
        {/* 2. METRIC BUBBLES: Horizontal Scroll on Mobile, Grid on Desktop */}
        <section>
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 px-1">Performance Pulse</h3>
          <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar snap-x snap-mandatory lg:grid lg:grid-cols-2 lg:overflow-visible">
            
            {/* Bubble: Available Jobs */}
            <Link href="/dashboard/gigs" className="flex-shrink-0 w-40 h-40 bg-blue-50 rounded-[2.5rem] p-6 flex flex-col justify-between snap-center border border-blue-100 active:scale-95 transition">
              <div className="bg-blue-600 w-10 h-10 rounded-2xl flex items-center justify-center text-white">
                <Search size={20} />
              </div>
              <div>
                <p className="text-3xl font-black text-blue-900">{available.data?.length || 0}</p>
                <p className="text-xs font-bold text-blue-700 uppercase">Available</p>
              </div>
            </Link>

            {/* Bubble: Active Contracts */}
            <Link href="/dashboard/my-gigs" className="flex-shrink-0 w-40 h-40 bg-emerald-50 rounded-[2.5rem] p-6 flex flex-col justify-between snap-center border border-emerald-100 active:scale-95 transition">
              <div className="bg-emerald-600 w-10 h-10 rounded-2xl flex items-center justify-center text-white">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-3xl font-black text-emerald-900">{mine.data?.length || 0}</p>
                <p className="text-xs font-bold text-emerald-700 uppercase">Active</p>
              </div>
            </Link>
          </div>
        </section>

        {/* 3. RECENT HISTORY: The "Empty State" Opportunity */}
        <section className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <TrendingUp className="text-gray-300" size={20} />
          </div>
          
          <div className="space-y-4">
            {mine.data && mine.data.length > 0 ? (
              mine.data.slice(0, 3).map((gig: any) => (
                <div key={gig.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <p className="text-sm text-gray-700 flex-1 font-medium">{gig.title}</p>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-400 italic mb-4">No recent activity found.</p>
                <Link 
                  href="/dashboard/gigs"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-sm active:scale-95 transition"
                >
                  <Search size={16} />
                  Browse Marketplace
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 4. IDENTITY: Secondary Section (Lower Priority) */}
        <section className="bg-amber-50 p-6 rounded-[2.5rem] border border-amber-100 flex items-center gap-5">
          <div className="bg-amber-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
            <Camera size={28} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-amber-900">Identity Verification</h4>
            <p className="text-xs text-amber-700 mb-3">Keep your documents up to date to access high-pay gigs.</p>
            <button
              onClick={handleCameraClick}
              className="bg-white text-amber-900 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-sm active:scale-95 transition"
            >
              Verify Now
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}