'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

import Button from '../atoms/Button';
import Logo from '../atoms/Logo';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberEmail, setRememberEmail] = useState(false);
  
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    if (rememberEmail) {
      localStorage.setItem('savedEmail', email);
    } else {
      localStorage.removeItem('savedEmail');
    }
    
    try {
      await login(email, password);
      router.push('/approval');
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err.message || 'Falha na autenticação. Por favor, verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-foreground w-[100vw] max-w-[100vw] overflow-x-hidden">
      {/* Left side - Brand section (visible only on medium screens and up) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex-col items-center justify-center p-8">
        <div className="max-w-md mx-auto text-center">
          <Logo size="lg" className="mb-8" />
          <h1 className="text-4xl font-bold text-white mb-6">Bem-vindo!</h1>
          <p className="text-purple-200 text-lg mb-8">
            Acesse sua conta para gerenciar seus projetos e visualizar seus dados em tempo real.
          </p>
          <div className="mt-8 bg-purple-800/30 p-6 rounded-lg border border-purple-700/50">
            <p className="text-white/80 italic">&ldquo;A IA não substitui talentos. Ela amplia possibilidades.&rdquo;</p>
            <p className="text-purple-300 mt-4">— Equipe Trusttech</p>
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
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-200 text-sm">
                <p>{error}</p>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700/50 text-white border border-purple-900/30 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 text-sm font-medium">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700/50 text-white border border-purple-900/30 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                  placeholder="*******"
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 text-sm font-medium"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {/* <div className="flex justify-end mt-1">
                <Link 
                  href="/forgotPassword" 
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Esqueceu sua senha?
                </Link>
              </div> */}
            </div>
            
            <div className="mb-6">
              <label className="flex items-center text-sm text-gray-300">
                <input 
                  type="checkbox" 
                  checked={rememberEmail}
                  onChange={(e) => setRememberEmail(e.target.checked)}
                  className="rounded bg-gray-700/70 border-purple-900/30 text-purple-600 focus:ring-purple-500 mr-2 h-4 w-4"
                />
                Lembrar meu email
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-700 to-purple-500 text-white py-3 rounded-md hover:from-purple-600 hover:to-purple-400 transition-all duration-300 font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="flex-grow h-px bg-gray-700"></div>
                <span className="mx-4 text-sm text-gray-400">ou</span>
                <div className="flex-grow h-px bg-gray-700"></div>
              </div>
              
              <Button 
                type="button" 
                onClick={handleCreateAccount}
                className="w-full border border-purple-500 bg-transparent text-purple-400 py-2.5 rounded-md hover:bg-purple-900/20 transition-all duration-300 font-medium"
                disabled={isLoading}
              >
                Criar nova conta
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
