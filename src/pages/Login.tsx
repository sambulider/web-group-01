import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  GraduationCapIcon,
  HandHeartIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
  ShieldCheckIcon } from
'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { demoAccounts } from '../data/members';
import { Role } from '../types';
import { btnPrimary } from '../components/ui/Primitives';
import { cn } from '../utils/cn';

const roleCards: Array<{role: Role;label: string;blurb: string;icon: typeof GraduationCapIcon;}> = [
{
  role: 'student',
  label: 'Student',
  blurb: 'QR pass, attendance, enrolled programmes and progress',
  icon: GraduationCapIcon
},
{
  role: 'volunteer',
  label: 'Volunteer',
  blurb: 'Assigned activities, logged hours and schedule',
  icon: HandHeartIcon
},
{
  role: 'admin',
  label: 'Administrator',
  blurb: 'Analytics, members, attendance, CMS and reports',
  icon: ShieldCheckIcon
}];


export function Login() {
  const [role, setRole] = useState<Role>('student');
  const [email, setEmail] = useState(demoAccounts.student.email);
  const [password, setPassword] = useState('demo-access');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      const account = signIn(role);
      setLoading(false);
      toast.success(`Welcome back, ${account.name.split(' ')[0]}`);
      navigate(
        role === 'student' ?
        '/dashboard/student' :
        role === 'volunteer' ?
        '/dashboard/volunteer' :
        '/dashboard/admin'
      );
    }, 700);
  };

  return (
    <section className="mx-auto grid max-w-page gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20 lg:px-8 lg:py-24">
      <div>
        <p className="font-display text-sm font-bold text-primary">Member access</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl">
          Sign in to your American Corner dashboard.
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
          Members use their dashboard for the digital QR attendance pass, programme progress and
          notifications. Administrators manage programmes, attendance and reporting.
        </p>
        <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
          <p className="text-sm font-semibold text-ink">Demonstration environment</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            This build uses mock data with no backend. Pick a role below and sign in with the
            pre-filled credentials to explore that experience.
          </p>
        </div>
      </div>

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8">
        
        <fieldset>
          <legend className="text-sm font-semibold text-ink">Sign in as</legend>
          <div className="mt-3 grid gap-2.5">
            {roleCards.map((card) =>
            <label
              key={card.role}
              className={cn(
                'flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 transition-[border-color,background-color] duration-150 ease-out',
                role === card.role ?
                'border-primary bg-primary-soft/60' :
                'border-line hover:bg-elevated'
              )}>
              
                <input
                type="radio"
                name="role"
                value={card.role}
                checked={role === card.role}
                onChange={() => {
                  setRole(card.role);
                  setEmail(demoAccounts[card.role].email);
                  setPassword('demo-access');
                }}
                className="sr-only" />
              
                <span
                className={cn(
                  'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
                  role === card.role ? 'bg-primary text-white' : 'bg-elevated text-muted'
                )}>
                
                  <card.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display text-sm font-bold text-ink">
                    {card.label}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">{card.blurb}</span>
                </span>
              </label>
            )}
          </div>
        </fieldset>

        <div className="mt-6 grid gap-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" />
            
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Password
            </label>
            <div className="relative mt-1.5">
              <LockIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-xl border border-line bg-bg pl-9 pr-11 text-sm text-ink" />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink">
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
              
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className={cn(btnPrimary, 'mt-6 w-full h-11')}>
          {loading ?
          <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Signing in…
            </> :

          'Sign in'
          }
        </button>

        <p className="mt-4 text-center text-xs text-muted">
          Not a member yet?{' '}
          <Link to="/apply" className="font-semibold text-primary">
            Apply to a programme
          </Link>{' '}
          — registration creates your account.
        </p>
      </motion.form>
    </section>);

}