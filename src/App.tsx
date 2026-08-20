import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Programs } from './pages/Programs';
import { Apply } from './pages/Apply';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Scanner } from './pages/Scanner';
import { StudentDashboard } from './pages/dashboard/StudentDashboard';
import { VolunteerDashboard } from './pages/dashboard/VolunteerDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/dashboard/student" element={<StudentDashboard />} />
            <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/scanner" element={<Scanner />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgb(var(--surface))',
                border: '1px solid rgb(var(--line))',
                color: 'rgb(var(--ink))'
              }
            }} />
          
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>);

}