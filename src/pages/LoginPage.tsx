'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '../components/atoms/Button';
import ThemeToggle from '../components/atoms/ThemeToggle';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
    
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors duration-200">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <form onSubmit={handleSubmit} className="bg-card-bg border border-card-border p-6 rounded-lg shadow-md w-full max-w-sm transition-colors duration-200">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Entrar</h2>
        <div className="mb-4">
          <label className="block text-foreground mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-input-bg text-input-text border border-input-border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-foreground mb-1">Senha</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-input-bg text-input-text border border-input-border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
              required
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full bg-button-bg text-button-text hover:bg-opacity-90 transition-colors duration-200">Entrar</Button>
      </form>
    </div>
  );
};


export default LoginPage;
