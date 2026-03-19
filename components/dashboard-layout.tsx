'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'staff' | 'student';
}

export default function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && requiredRole && user?.role !== requiredRole) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navigationItems = {
    admin: [
      { label: 'Dashboard', href: '/dashboard/admin' },
      { label: 'Students', href: '/dashboard/admin/students' },
      { label: 'Reports', href: '/dashboard/admin/reports' },
    ],
    staff: [
      { label: 'Dashboard', href: '/dashboard/staff' },
      { label: 'Mark Attendance', href: '/dashboard/staff/mark' },
    ],
    student: [
      { label: 'Dashboard', href: '/dashboard/student' },
      { label: 'My Attendance', href: '/dashboard/student/attendance' },
    ],
  };

  const items = navigationItems[user.role as keyof typeof navigationItems] || [];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-slate-800 text-white">
        <div className="px-6 py-6 border-b border-slate-700">
          <div className="text-lg font-bold">DDGDVC</div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-700 transition"
            >
              <span className="w-6 h-6 bg-slate-600 rounded" />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 min-h-screen flex flex-col">
        {/* Top header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 bg-slate-100 rounded">☰</button>
              <div className="text-sm text-slate-600">Attendance System</div>
            </div>

            <div className="text-center flex-1">
              <h2 className="text-lg md:text-xl font-bold">DWARAKA DOSS GOVERDHAN DOSS VAISHNAV COLLEGE</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">Welcome to {user.name}</div>
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
              >
                Log out
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
