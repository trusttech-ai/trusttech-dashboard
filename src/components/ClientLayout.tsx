"use client";
import React from 'react';
import { usePathname } from 'next/navigation';

import AppShell from './organisms/AppShell';
import { ThemeProvider } from '@/context/ThemeContext';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  
  if (pathname === '/' || pathname === '/login') {
    return <ThemeProvider>{children}</ThemeProvider>;
  }
  
  return (
    <ThemeProvider>
      <AppShell>{children}</AppShell>
    </ThemeProvider>
  );
}
