'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Button from '../components/atoms/Button';
import Logo from '../components/atoms/Logo';
import { uploadFile } from '../lib/uploadFile';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    document: '',
    documentType: 'cpf',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  // Função handleImageUpload modificada
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar se é um arquivo gigante
    const isHugeFile = file.size > 100 * 1024 * 1024; // > 100MB
    
    // Limpar erro se existir
    if (errors.profileImage) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.profileImage;
        return newErrors;
      });
    }

    // Definir arquivo para upload
    setProfileImage(file);
    
    // Para arquivos enormes, mostrar informações em vez de preview
    if (isHugeFile) {
      // Não tentar criar preview para arquivos gigantes
      setPreviewImage(null);
      
      // Mostrar feedback ao usuário sobre o arquivo grande
      alert(`Arquivo grande selecionado (${(file.size / (1024 * 1024)).toFixed(2)}MB). O upload pode levar vários minutos.`);
      
      // Informação de arquivo grande
      const fileInfo = document.createElement('div');
      fileInfo.className = 'flex items-center justify-center flex-col';
      const icon = document.createElement('div');
      
      // Mostrar ícone específico baseado no tipo de arquivo
      if (file.type.startsWith('video/')) {
        icon.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        `;
      } else {
        icon.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        `;
      }
      
      return;
    }
    
    // Para arquivos normais, criar preview como antes
    try {
      // Criar preview da imagem somente para arquivos de tamanho razoável
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.onerror = () => {
        console.error('Erro ao ler arquivo para preview');
        setPreviewImage(null);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao processar arquivo para preview:', error);
      setPreviewImage(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setProfileImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
    
    // Validação de documento (CPF ou CNPJ)
    if (!formData.document.trim()) {
      newErrors.document = "Documento é obrigatório";
    } else {
      const cleanDocument = formData.document.replace(/\D/g, '');
      
      if (formData.documentType === 'cpf' && cleanDocument.length !== 11) {
        newErrors.document = "CPF inválido";
      } else if (formData.documentType === 'cnpj' && cleanDocument.length !== 14) {
        newErrors.document = "CNPJ inválido";
      }
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
        setIsUploading(true);
        
        // Preparar os dados
        const userData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          document: formData.document.replace(/\D/g, ''), // Enviar documento sem formatação
          password: formData.password,
          role: "USER",
          profileImage: '',
        };

        // Se tiver uma imagem, fazer upload primeiro
        let profileImageUrl: string;
        if (profileImage) {
          // Usar a nova função de upload que suporta arquivos grandes
          setUploadProgress(0);
          console.log("test")
          profileImageUrl = await uploadFile(profileImage,  (progress) => {
            setUploadProgress(progress);
          });
        }

        // Adicionar a URL da imagem aos dados do usuário, se disponível
        if (profileImageUrl) {
          userData.profileImage = profileImageUrl;
        }

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
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const formatDocument = (value: string) => {
    const digits = value.replace(/\D/g, '');
    
    if (formData.documentType === 'cpf') {
      // Formatação de CPF: 000.000.000-00
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
      if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
    } else {
      // Formatação de CNPJ: 00.000.000/0000-00
      if (digits.length <= 2) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
      if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
      if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
      return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const maxLength = formData.documentType === 'cpf' ? 14 : 18; // Incluindo pontos e traços
    
    if (value.length <= maxLength) {
      const formattedValue = formatDocument(value);
      setFormData(prev => ({...prev, document: formattedValue}));
    }
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
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
              {formStep === 1 ? 'Criar Conta' : 'Complete seu Perfil'}
            </h2>
            
            {formStep === 1 ? (
              <>
                {/* Formulário passo 1 - dados pessoais */}
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-gray-300 text-sm font-medium">Documento</label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="cpf"
                          name="documentType"
                          value="cpf"
                          checked={formData.documentType === 'cpf'}
                          onChange={() => setFormData(prev => ({...prev, documentType: 'cpf', document: ''}))}
                          className="mr-1 h-3.5 w-3.5 accent-purple-500"
                        />
                        <label htmlFor="cpf" className="text-sm text-gray-300">CPF</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="cnpj"
                          name="documentType"
                          value="cnpj"
                          checked={formData.documentType === 'cnpj'}
                          onChange={() => setFormData(prev => ({...prev, documentType: 'cnpj', document: ''}))}
                          className="mr-1 h-3.5 w-3.5 accent-purple-500"
                        />
                        <label htmlFor="cnpj" className="text-sm text-gray-300">CNPJ</label>
                      </div>
                    </div>
                  </div>

                  <input
                    type="text"
                    name="document"
                    value={formData.document}
                    onChange={handleDocumentChange}
                    className={`w-full bg-gray-700/50 text-white border ${errors.document ? 'border-red-500' : 'border-purple-900/30'} px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                    required
                    placeholder={formData.documentType === 'cpf' ? "000.000.000-00" : "00.000.000/0000-00"}
                    maxLength={formData.documentType === 'cpf' ? 14 : 18}
                  />
                  {errors.document && <p className="mt-1 text-sm text-red-500">{errors.document}</p>}
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
                {/* Formulário passo 2 - foto de perfil e senha */}
                
                {/* Seção de upload de foto */}
                <div className="mb-6">
                  <label className="block text-gray-300 mb-3 text-sm font-medium">Foto de Perfil</label>
                  
                  {/* Substituir a seção de preview de imagem no formulário */}
                  <div className="flex items-center justify-center mb-4">
                    {previewImage ? (
                      <div className="relative">
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-32 h-32 rounded-full object-cover border-2 border-purple-500"
                        />
                        <button 
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-gray-800 text-red-400 rounded-full p-1 hover:bg-gray-700 transition-colors"
                          aria-label="Remover imagem"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : profileImage ? (
                      // Preview alternativo para arquivos grandes
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gray-700 border-2 border-purple-500 flex flex-col items-center justify-center">
                          {profileImage.type.startsWith('video/') ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          )}
                          <span className="text-xs text-center text-gray-300 mt-2 px-1 line-clamp-1">
                            {profileImage.name.length > 15 ? profileImage.name.substring(0, 12) + '...' : profileImage.name}
                          </span>
                          <span className="text-xs text-center text-gray-400">
                            {(profileImage.size / (1024 * 1024)).toFixed(1)} MB
                          </span>
                        </div>
                        <button 
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-gray-800 text-red-400 rounded-full p-1 hover:bg-gray-700 transition-colors"
                          aria-label="Remover arquivo"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={triggerFileInput}
                        className="w-32 h-32 rounded-full bg-gray-700/50 border-2 border-dashed border-purple-500/50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/70 hover:border-purple-500 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs text-gray-300">Adicionar arquivo</span>
                      </div>
                    )}
                    
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  
                  {/* Mostrar indicador especial para arquivos grandes */}
                  {profileImage && profileImage.size > 100 * 1024 * 1024 && (
                    <div className="mt-2 mb-4 p-2 bg-blue-900/30 border border-blue-500/30 rounded-md">
                      <p className="text-xs text-center text-blue-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Arquivo grande detectado. O upload pode levar vários minutos. Por favor, seja paciente.
                      </p>
                    </div>
                  )}

                  {errors.profileImage && <p className="mt-1 text-sm text-red-500 text-center">{errors.profileImage}</p>}
                  <p className="text-xs text-gray-400 text-center">
                    {profileImage?.type.startsWith('video/') 
                      ? 'Formatos de vídeo suportados: MP4, WebM, MOV' 
                      : 'Formatos suportados: JPG, PNG, PDF, MP4 e outros'}
                  </p>
                </div>
                
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
                disabled={isUploading}
              >
                {formStep === 1 ? 'Próximo' : isUploading ? 'Enviando...' : 'Criar Conta'}
              </Button>
            </div>
            
            {isUploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-center text-gray-400 mt-1">
                  Enviando arquivo: {uploadProgress}%
                </p>
              </div>
            )}
            
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