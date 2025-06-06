'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '../components/atoms/Button';
import ThemeToggle from '../components/atoms/ThemeToggle';
import Logo from '../components/atoms/Logo';

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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-foreground">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Left side - Brand section (visible only on medium screens and up) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex-col items-center justify-center p-8">
        <div className="max-w-md mx-auto text-center">
          <Logo size="lg" className="mb-8" />
          <h1 className="text-4xl font-bold text-white mb-6">Bem-vindo de volta</h1>
          <p className="text-purple-200 text-lg mb-8">
            Acesse sua conta para gerenciar seus projetos e visualizar seus dados em tempo real.
          </p>
          <div className="mt-8 bg-purple-800/30 p-6 rounded-lg border border-purple-700/50">
            <p className="text-white/80 italic">&ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&rdquo;</p>
            <p className="text-purple-300 mt-4">— Equipe Lorem Ipsum</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-12 bg-gray-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-purple-700 blur-3xl"></div>
          <div className="absolute right-10 bottom-32 w-64 h-64 rounded-full bg-purple-700 blur-3xl"></div>
          <div className="absolute left-1/2 top-1/3 w-32 h-32 rounded-full bg-purple-500 blur-3xl"></div>
        </div>
        
        <div className="w-full max-w-md relative z-10">
          {/* Logo for mobile view */}
          <div className="md:hidden mb-8 text-center">
            <Logo size="md" className="inline-block" />
          </div>
          
          <form onSubmit={handleSubmit} className="bg-gray-800/50 border border-purple-900/30 p-8 rounded-xl shadow-lg w-full backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
              <span className="bg-purple-600 h-8 w-1 mr-3 rounded-full"></span>
              Entrar
            </h2>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700/50 text-white border border-purple-900/30 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
                placeholder="seu@email.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 text-sm font-medium">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700/50 text-white border border-purple-900/30 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 text-sm font-medium"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-700 to-purple-500 text-white py-3 rounded-md hover:from-purple-600 hover:to-purple-400 transition-all duration-300 font-medium"
            >
              Entrar
            </Button>
            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200">
                Esqueceu sua senha?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default LoginPage;
