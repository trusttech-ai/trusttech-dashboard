'use client';
 
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <html>
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Erro no aplicativo</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Ocorreu um erro grave no aplicativo. Por favor, tente novamente.
            </p>
            <Button
              onClick={reset}
              className="px-6 py-2"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
