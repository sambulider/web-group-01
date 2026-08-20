import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { demoAccounts } from '../data/members';
import { Role, User } from '../types';

interface AuthContextValue {
  user: User | null;
  signIn: (role: Role) => User;
  signOut: () => void;
  dashboardPath: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const paths: Record<Role, string> = {
  student: '/dashboard/student',
  volunteer: '/dashboard/volunteer',
  admin: '/dashboard/admin'
};

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = useCallback((role: Role) => {
    const account = demoAccounts[role];
    setUser(account);
    return account;
  }, []);

  const signOut = useCallback(() => setUser(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, signIn, signOut, dashboardPath: user ? paths[user.role] : null }),
    [user, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export const rolePaths = paths;