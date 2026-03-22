'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
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
  BarChart3,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'staff' | 'student';
}

export default function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && requiredRole && user?.role !== requiredRole) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router, requiredRole]);

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Synchronizing...</div>
          </div>
        </div>
      );
  }

  if (!user) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-10 border-b border-white/10 flex items-center gap-3">
        <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="text-xl font-black tracking-tight text-white leading-none">DGVC</div>
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Vaishnav Portal</div>
        </div>
      </div>

      <div className="p-4 mt-2">
        <div className="relative group">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          <input
            placeholder="Quick Find..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/50 border border-white/5 text-sm py-2.5 pl-10 rounded-xl text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-3 mb-3">Principal View</p>
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${
                isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 transition-transform group-hover:scale-110`} />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} className="opacity-50" />}
            </Link>
          );
        })}

        <div className="mt-10">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-3 mb-3">System Hub</p>
          <Link href={`/dashboard/${user.role}/settings`} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-800 text-slate-400 transition-all font-bold text-sm">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
          <Link href={`/dashboard/${user.role}/notifications`} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-800 text-slate-400 transition-all font-bold text-sm">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-2 bg-slate-800/40 rounded-2xl border border-white/5 ring-1 ring-white/5 shadow-inner">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-xs shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-black truncate text-white tracking-tight">{user.name}</p>
            <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest">{user.role}</p>
          </div>
          <button onClick={logout} className="p-2 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-400 transition-all transform active:scale-95">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <p className="text-center text-[8px] font-bold text-slate-700 mt-4 tracking-[0.3em] uppercase opacity-50">© DGVC Vaishnav 2026</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-slate-50 flex font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900 shadow-2xl z-40 relative">
         <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300">
           <div className="w-[85%] max-w-xs h-full bg-slate-900 shadow-2xl animate-in slide-in-from-left duration-300">
              <div className="absolute top-4 right-4 text-white">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X />
                </button>
              </div>
              <SidebarContent />
           </div>
        </div>
      )}

      <div className="flex-1 h-screen flex flex-col overflow-hidden relative">
        {/* Top header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 py-1">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors shadow-sm"
              >
                <Menu size={20} />
              </button>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:block italic">Attendance Command Center</div>
            </div>

            <div className="text-center hidden md:block">
              <h1 className="text-sm font-black tracking-widest text-slate-900 uppercase font-outfit leading-tight">
                Dwaraka Doss Goverdhan Doss Vaishnav College
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Operator</span>
                <span className="text-xs font-black text-slate-900">{user.name}</span>
              </div>
              <div className="h-10 w-[1px] bg-slate-100 mx-2 hidden lg:block"></div>
              <button
                onClick={logout}
                className="px-5 py-2.5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all hover:shadow-lg hover:shadow-red-600/20 active:scale-95 flex items-center gap-2"
              >
                <LogOut size={12} />
                <span className="hidden sm:inline">Terminate Session</span>
              </button>
            </div>
          </div>
        </header>

        <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>

        <main className="flex-1 overflow-auto p-4 md:p-8 scroll-smooth relative z-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
