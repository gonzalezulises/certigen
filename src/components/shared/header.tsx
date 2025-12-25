'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Award, FileCheck, Home, Settings, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const baseNavigation = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Generar', href: '/generate', icon: Award },
  { name: 'Validar', href: '/validate', icon: FileCheck },
];

export function Header() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Award className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">CertiGen</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {baseNavigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600',
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}

            {/* Auth-dependent navigation */}
            {!loading && (
              user ? (
                <>
                  <Link
                    href="/admin"
                    className={cn(
                      'flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600',
                      pathname.startsWith('/admin') ? 'text-blue-600' : 'text-gray-600'
                    )}
                  >
                    <Settings className="h-4 w-4" />
                    Admin
                  </Link>
                  <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {user.email?.split('@')[0]}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/admin/auth"
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600',
                    pathname.startsWith('/admin') ? 'text-blue-600' : 'text-gray-600'
                  )}
                >
                  <LogIn className="h-4 w-4" />
                  Iniciar Sesion
                </Link>
              )
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {baseNavigation.slice(1).map((item) => {
        const isActive = pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <Icon className="h-5 w-5" />
          </Link>
        );
      })}

      {/* Auth buttons for mobile */}
      {!loading && (
        user ? (
          <>
            <Link
              href="/admin"
              className={cn(
                'p-2 rounded-lg transition-colors',
                pathname.startsWith('/admin') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Settings className="h-5 w-5" />
            </Link>
            <button
              onClick={() => signOut()}
              className="p-2 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </>
        ) : (
          <Link
            href="/admin/auth"
            className={cn(
              'p-2 rounded-lg transition-colors',
              pathname.startsWith('/admin') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <LogIn className="h-5 w-5" />
          </Link>
        )
      )}
    </div>
  );
}
