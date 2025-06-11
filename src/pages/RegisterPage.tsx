'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Button from '../components/atoms/Button';
import Logo from '../components/atoms/Logo';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cpf: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "Primeiro nome é obrigatório";
    if (!formData.lastName.trim()) newErrors.lastName = "Último nome é obrigatório";
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    
    // Validação simples de CPF (poderia ser mais robusta em produção)
    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (!/^\d{11}$/.test(formData.cpf.replace(/[^\d]/g, ''))) {
      newErrors.cpf = "CPF inválido";
    }
    
    // Validação simples de telefone
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/[^\d]/g, ''))) {
      newErrors.phone = "Telefone inválido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 8) {
      newErrors.password = "Senha deve ter pelo menos 8 caracteres";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (formStep === 1 && validateStep1()) {
      setFormStep(2);
    }
  };

  const prevStep = () => {
    setFormStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formStep === 1) {
      nextStep();
      return;
    }
    
    if (validateStep2()) {
      try {
        // Preparar os dados de acordo com seu schema
        const userData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          role: "USER"
        };

        // Fazer requisição para sua API de registro
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        // Processar a resposta
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao criar conta');
        }
        
        // Feedback de sucesso
        alert("Conta criada com sucesso! Você será redirecionado para o login.");
        router.push('/login');
      } catch (err) {
        const error = err as Error;
        console.error('Erro no registro:', error);
        alert(error.message || 'Ocorreu um erro ao criar sua conta. Por favor, tente novamente.');
      }
    }
  };

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatCPF(value);
    setFormData(prev => ({...prev, cpf: formattedValue}));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatPhone(value);
    setFormData(prev => ({...prev, phone: formattedValue}));
  };

  return (
    // Remova margem e padding extras e defina width: 100vw para remover a barra branca
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-foreground w-[100vw] max-w-[100vw] overflow-x-hidden">
      {/* Left side - Brand section (visible only on medium screens and up) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex-col items-center justify-center p-8">
        <div className="max-w-md mx-auto text-center">
          <Logo size="lg" className="mb-8" />
          <h1 className="text-4xl font-bold text-white mb-6">Junte-se a nós!</h1>
          <p className="text-purple-200 text-lg mb-8">
            Crie sua conta para acessar todas as funcionalidades e serviços disponíveis na plataforma Trusttech.
          </p>
          <div className="mt-8 bg-purple-800/30 p-6 rounded-lg border border-purple-700/50">
            <p className="text-white/80 italic">&ldquo;A confiança é a base de todos os relacionamentos bem-sucedidos.&rdquo;</p>
            <p className="text-purple-300 mt-4">— Equipe Trusttech</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Registration form */}
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
              {formStep === 1 ? 'Criar Conta' : 'Defina sua Senha'}
            </h2>
            
            {formStep === 1 ? (
              <>
                {/* Formulário passo 1 */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-2 text-sm font-medium">Primeiro Nome</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full bg-gray-700/50 text-white border ${errors.firstName ? 'border-red-500' : 'border-purple-900/30'} px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                      required
                      placeholder="João"
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                  </div>
                  
                  <div className="col-span-1">
                    <label className="block text-gray-300 mb-2 text-sm font-medium">Último Nome</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full bg-gray-700/50 text-white border ${errors.lastName ? 'border-red-500' : 'border-purple-900/30'} px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                      required
                      placeholder="Silva"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-gray-700/50 text-white border ${errors.email ? 'border-red-500' : 'border-purple-900/30'} px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                    required
                    placeholder="seu@email.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 text-sm font-medium">CPF</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    className={`w-full bg-gray-700/50 text-white border ${errors.cpf ? 'border-red-500' : 'border-purple-900/30'} px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                    required
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                  {errors.cpf && <p className="mt-1 text-sm text-red-500">{errors.cpf}</p>}
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2 text-sm font-medium">Número de Telefone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full bg-gray-700/50 text-white border ${errors.phone ? 'border-red-500' : 'border-purple-900/30'} px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                    required
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>
              </>
            ) : (
              <>
                {/* Formulário passo 2 */}
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 text-sm font-medium">Senha</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full bg-gray-700/50 text-white border ${errors.password ? 'border-red-500' : 'border-purple-900/30'} px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                      required
                      placeholder="********"
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 text-sm font-medium"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                  <p className="mt-1 text-xs text-gray-400">A senha deve ter pelo menos 8 caracteres</p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2 text-sm font-medium">Confirmar Senha</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full bg-gray-700/50 text-white border ${errors.confirmPassword ? 'border-red-500' : 'border-purple-900/30'} px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                    required
                    placeholder="********"
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              </>
            )}
            
            <div className="flex space-x-4">
              {formStep === 2 && (
                <Button 
                  type="button" 
                  onClick={prevStep}
                  className="flex-1 border border-purple-500 bg-transparent text-purple-400 py-2.5 rounded-md hover:bg-purple-900/20 transition-all duration-300 font-medium"
                >
                  Voltar
                </Button>
              )}
              
              <Button 
                type={formStep === 2 ? "submit" : "button"}
                onClick={formStep === 1 ? nextStep : undefined}
                className="flex-1 bg-gradient-to-r from-purple-700 to-purple-500 text-white py-3 rounded-md hover:from-purple-600 hover:to-purple-400 transition-all duration-300 font-medium"
              >
                {formStep === 1 ? 'Próximo' : 'Criar Conta'}
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Já possui uma conta?{' '}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Entrar
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;