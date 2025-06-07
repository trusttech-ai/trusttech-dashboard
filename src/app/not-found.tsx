'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="max-w-md text-center">
        <h2 className="text-3xl font-bold mb-2">404</h2>
        <h3 className="text-xl font-semibold mb-4">Página não encontrada</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Button asChild>
          <Link href="/dashboard">
            Voltar para o Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
