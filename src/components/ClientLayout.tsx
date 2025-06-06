"use client";
import React from 'react';
import { usePathname } from 'next/navigation';

import AppShell from './organisms/AppShell';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  
  if (pathname === '/' || pathname === '/login') {
    return <>{children}</>;
  }
  
  return <AppShell>{children}</AppShell>;
}
