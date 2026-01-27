'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/dashboard/', icon: '📊' },
  { name: 'Profile', href: '/profile/', icon: '👤' },
  { name: 'Settings', href: '/settings/', icon: '⚙️' },
];

export function AdaptiveNav() {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop Sidebar
  if (!isMobile) {
    return (
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Middleman</h2>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                pathname === item.href
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    );
  }

  // Mobile Bottom Navigation
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white border-t border-gray-800 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-full transition ${
              pathname === item.href
                ? 'text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
