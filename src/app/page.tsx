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
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to Middleman</h1>
        <p className="text-lg text-gray-600">
          Next.js 15 + Capacitor 8 Mobile-First App
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard/"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
