import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BellIcon, LogOutIcon, MenuIcon, MoonIcon, SunIcon, XIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { notifications } from '../../data/members';
import { cn } from '../../utils/cn';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{className?: string;}>;
}

interface DashboardShellProps {
  title: string;
  subtitle: string;
  nav: NavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  children: React.ReactNode;
}

export function DashboardShell({
  title,
  subtitle,
  nav,
  activeId,
  onNavigate,
  children
}: DashboardShellProps) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileNav, setMobileNav] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const unread = notifications.filter((n) => n.unread).length;

  const navList =
  <ul className="grid gap-1">
      {nav.map((item) =>
    <li key={item.id}>
          <button
        type="button"
        onClick={() => {
          onNavigate(item.id);
          setMobileNav(false);
        }}
        aria-current={activeId === item.id ? 'page' : undefined}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ease-out',
          activeId === item.id ?
          'bg-primary-soft text-primary' :
          'text-muted hover:bg-elevated hover:text-ink'
        )}>
        
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </button>
        </li>
    )}
    </ul>;


  return (
    <div className="flex min-h-screen w-full bg-bg">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-surface px-4 py-5 lg:flex">
        <Link to="/" className="flex items-center gap-3 px-1">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-display text-xs font-extrabold text-white">
            AC
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-bold text-ink">American Corner</span>
            <span className="block text-xs text-muted">Batticaloa</span>
          </span>
        </Link>

        <nav aria-label="Dashboard" className="mt-7 flex-1">
          {navList}
        </nav>

        {user &&
        <div className="rounded-2xl border border-line bg-bg p-3">
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.memberId}</p>
              </div>
            </div>
            <button
            type="button"
            onClick={() => {
              signOut();
              navigate('/');
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-line py-2 text-xs font-semibold text-muted transition-colors duration-150 ease-out hover:text-secondary">
            
              <LogOutIcon className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        }
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-line glass">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMobileNav(true)}
              aria-label="Open dashboard menu"
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-ink lg:hidden">
              
              <MenuIcon className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate font-display text-lg font-bold text-ink">{title}</h1>
              <p className="truncate text-xs text-muted">{subtitle}</p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-muted transition-colors duration-150 ease-out hover:text-ink">
                
                {theme === 'light' ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifs((v) => !v)}
                  aria-label={`Notifications, ${unread} unread`}
                  aria-expanded={showNotifs}
                  className="relative grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-muted transition-colors duration-150 ease-out hover:text-ink">
                  
                  <BellIcon className="h-4 w-4" />
                  {unread > 0 &&
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-[10px] font-bold text-white">
                      {unread}
                    </span>
                  }
                </button>
                <AnimatePresence>
                  {showNotifs &&
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute right-0 top-12 w-80 overflow-hidden rounded-2xl border border-line bg-surface shadow-lift">
                    
                      <p className="border-b border-line px-4 py-3 font-display text-sm font-bold text-ink">
                        Notifications
                      </p>
                      <ul className="max-h-80 divide-y divide-line overflow-y-auto">
                        {notifications.map((n) =>
                      <li key={n.id} className="px-4 py-3">
                            <div className="flex items-start gap-2">
                              {n.unread &&
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          }
                              <div>
                                <p className="text-sm font-semibold text-ink">{n.title}</p>
                                <p className="mt-0.5 text-xs leading-relaxed text-muted">{n.body}</p>
                                <p className="mt-1 text-[11px] text-muted">{n.time}</p>
                              </div>
                            </div>
                          </li>
                      )}
                      </ul>
                    </motion.div>
                  }
                </AnimatePresence>
              </div>
              {user &&
              <img
                src={user.avatar}
                alt=""
                className="h-10 w-10 rounded-xl object-cover ring-1 ring-line" />

              }
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>

      <AnimatePresence>
        {mobileNav &&
        <div className="fixed inset-0 z-[70] lg:hidden">
            <motion.button
            aria-label="Close menu"
            className="absolute inset-0 bg-slate-950/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileNav(false)} />
          
            <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            className="absolute left-0 top-0 h-full w-72 border-r border-line bg-surface px-4 py-5">
            
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-ink">Dashboard menu</span>
                <button
                type="button"
                onClick={() => setMobileNav(false)}
                aria-label="Close menu"
                className="rounded-lg p-1.5 text-muted hover:bg-elevated">
                
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <nav aria-label="Dashboard mobile" className="mt-6">
                {navList}
              </nav>
              <Link
              to="/"
              className="mt-6 block rounded-xl border border-line px-3 py-2.5 text-center text-sm font-semibold text-ink">
              
                Back to website
              </Link>
            </motion.aside>
          </div>
        }
      </AnimatePresence>
    </div>);

}