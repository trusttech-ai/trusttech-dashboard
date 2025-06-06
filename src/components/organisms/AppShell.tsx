"use client";
import React  from 'react';


interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {

  return (
    <div className="flex h-screen bg-gray-100">

      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
