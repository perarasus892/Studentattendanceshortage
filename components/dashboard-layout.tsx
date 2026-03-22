'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  CheckSquare,
  History,
  UserCircle,
  LogOut,
  Settings,
  Bell,
  Search,
  BookOpen,
  BarChart3
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'staff' | 'student';
}

export default function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && requiredRole && user?.role !== requiredRole) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router, requiredRole]);

  const navigationItems = {
    admin: [
      { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
      { label: 'Students', href: '/dashboard/admin/students', icon: Users },
      { label: 'Classes', href: '/dashboard/admin/classes', icon: GraduationCap },
      { label: 'Reports', href: '/dashboard/admin/reports', icon: FileText },
      { label: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
    ],
    staff: [
      { label: 'Dashboard', href: '/dashboard/staff', icon: LayoutDashboard },
      { label: 'Mark Attendance', href: '/dashboard/staff/mark', icon: CheckSquare },
      { label: 'History', href: '/dashboard/staff/history', icon: History },
      { label: 'Student List', href: '/dashboard/staff/students', icon: Users },
    ],
    student: [
      { label: 'Dashboard', href: '/dashboard/student', icon: LayoutDashboard },
      { label: 'My Attendance', href: '/dashboard/student/attendance', icon: BookOpen },
      { label: 'Profile', href: '/dashboard/student/profile', icon: UserCircle },
    ],
  };

  const navItems = user ? (navigationItems[user.role as keyof typeof navigationItems] || []) : [];
  const filteredItems = navItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <div className="text-slate-500 font-medium">Loading system...</div>
          </div>
        </div>
      );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen bg-slate-50 flex font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white shadow-xl h-screen sticky top-0">
        <div className="px-6 py-8 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="text-xl font-black tracking-tight text-white">DGVC</div>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border-none text-xs py-2 pl-9 rounded-md text-slate-300 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Main Menu</p>
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-blue-400 text-slate-400 transition-all font-medium text-sm group"
              >
                <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="mt-8">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">System</p>
            <Link href={`/dashboard/${user.role}/settings`} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-all font-medium text-sm">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
            <Link href={`/dashboard/${user.role}/notifications`} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-all font-medium text-sm">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 uppercase">{user.role}</p>
            </div>
            <button onClick={logout} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 h-screen flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
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

        <main className="flex-1 overflow-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
