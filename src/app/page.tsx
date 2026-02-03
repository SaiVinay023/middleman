'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Middleman</h1>
        <p className="text-lg text-gray-600">
          Next.js 15 + Capacitor 8 Mobile-First App
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Point to the specific login page */}
          <Link
            href="/auth/login" 
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition active:scale-95"
          >
            Sign In
          </Link>
          
          {/* Point to the specific signup page */}
          <Link
            href="/auth/signup" 
            className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-xl font-bold hover:bg-blue-50 transition active:scale-95"
          >
            Create Account
          </Link>

          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-gray-200 transition active:scale-95"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}