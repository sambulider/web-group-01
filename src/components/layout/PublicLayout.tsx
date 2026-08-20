import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Chatbot } from '../Chatbot';

export function PublicLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full flex-col bg-bg">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="flex-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}>
          
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <Chatbot />
    </div>);

}