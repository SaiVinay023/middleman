'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const protectRoutes = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If no session and trying to access dashboard, redirect to login
      if (!session && pathname.startsWith('/dashboard')) {
        router.push('/login');
      }
    };
    protectRoutes();
  }, [pathname, router]);

  return (
    <html lang="en">
      <head>
        {/* Prevents UI from being hidden under the iPhone notch */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="antialiased safe-area-bottom">
        {children}
      </body>
    </html>
  );
}