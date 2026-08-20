import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  XIcon } from
'lucide-react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { btnPrimary } from '../ui/Primitives';

const links = [
{ to: '/', label: 'Home' },
{ to: '/about', label: 'About' },
{ to: '/programs', label: 'Programs' },
{ to: '/apply', label: 'Apply' },
{ to: '/gallery', label: 'Gallery' },
{ to: '/contact', label: 'Contact' }];


export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, dashboardPath } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-200 ease-out',
        scrolled ? 'glass border-b border-line shadow-soft' : 'border-b border-transparent'
      )}>
      
      <div className="mx-auto flex h-16 max-w-page items-center gap-3 px-4 sm:h-[68px] sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="/assets/us-flag-logo.png" 
            alt="American Corner Logo" 
            className="h-10 w-10 object-contain"
          />
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-bold text-ink">
              American Corner
            </span>
            <span className="block text-xs font-medium text-muted">Batticaloa · Sri Lanka</span>
          </span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map((link) =>
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
            cn(
              'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out',
              isActive ? 'text-primary' : 'text-muted hover:text-ink'
            )
            }>
            
              {({ isActive }) =>
            <>
                  {link.label}
                  {isActive &&
              <motion.span
                layoutId="nav-underline"
                className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary"
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} />

              }
                </>
            }
            </NavLink>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-4">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-muted transition-colors duration-150 ease-out hover:text-ink">
            
            {theme === 'light' ?
            <MoonIcon className="h-4 w-4" /> :

            <SunIcon className="h-4 w-4" />
            }
          </button>

          {user ?
          <div className="hidden items-center gap-2 sm:flex">
              <Link
              to={dashboardPath ?? '/login'}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:bg-elevated">
              
                <LayoutDashboardIcon className="h-4 w-4 text-primary" />
                Dashboard
              </Link>
              <button
              type="button"
              onClick={() => {
                signOut();
                navigate('/');
              }}
              aria-label="Sign out"
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-muted transition-colors duration-150 ease-out hover:text-secondary">
              
                <LogOutIcon className="h-4 w-4" />
              </button>
            </div> :

          <Link to="/login" className={cn(btnPrimary, 'hidden sm:inline-flex')}>
              Member sign in
            </Link>
          }

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-ink lg:hidden">
            
            {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="overflow-hidden border-t border-line glass lg:hidden">
          
            <nav aria-label="Mobile" className="mx-auto max-w-page px-4 py-3 sm:px-6">
              <ul className="grid gap-1">
                {links.map((link) =>
              <li key={link.to}>
                    <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                  cn(
                    'block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                    isActive ?
                    'bg-primary-soft text-primary' :
                    'text-ink hover:bg-elevated'
                  )
                  }>
                  
                      {link.label}
                    </NavLink>
                  </li>
              )}
              </ul>
              <div className="mt-3 grid gap-2 border-t border-line pt-3">
                {user ?
              <>
                    <Link to={dashboardPath ?? '/login'} className={btnPrimary}>
                      Go to dashboard
                    </Link>
                    <button
                  type="button"
                  className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink"
                  onClick={() => {
                    signOut();
                    navigate('/');
                  }}>
                  
                      Sign out
                    </button>
                  </> :

              <Link to="/login" className={btnPrimary}>
                    Member sign in
                  </Link>
              }
              </div>
            </nav>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}