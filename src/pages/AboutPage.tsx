"use client"; 
import React, { useState } from 'react';

import PageHeader from '@/components/organisms/PageHeader';
import TeamMember from '@/components/atoms/TeamMember';
import Milestone from '@/components/atoms/Milestone';


const AboutPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const teamMembers = [
    {
      name: "Ryan Basque",
      role: "CEO & Fundador",
      bio: "Desenvolvedor apaixonado por criar soluções inovadoras, com ampla experiência em empresas de tecnologia."
    },
    {
      name: "Manolo Prieto",
      role: "CTO",
      bio: "Especialista em IA e machine learning, com formação em ciência da computação e liderança em projetos de grande escala."
    },
    {
      name: "Pedro Carvalho",
      role: "Diretor de Operações",
      bio: "Profissional com vasta experiência em gestão de projetos e operações de empresas de tecnologia."
    },
  ];

  const milestones = [
    {
      year: "2025",
      title: "Expansão Internacional",
      description: "Trusttech começa operações em Portugal e Espanha, ampliando sua presença no mercado internacional."
    },
    {
      year: "2024",
      title: "Lançamento da Plataforma Trusttech.AI",
      description: "Lançamento da versão 2.0 da plataforma com recursos avançados de automação e inteligência artificial."
    },
    {
      year: "2023",
      title: "Rodada de Investimento Série A",
      description: "Captamos R$10 milhões em investimentos para acelerar o desenvolvimento de produtos e expansão de mercado."
    },
    {
      year: "2022",
      title: "Fundação da Trusttech",
      description: "A empresa foi fundada com a missão de transformar a comunicação e gestão de relacionamento através da tecnologia."
    }
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white transition-colors duration-200">
      <div className="flex-1 flex flex-col relative overflow-y-auto pt-16 md:pt-0 transition-all duration-300 ease-in-out">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-purple-900/20 blur-3xl"></div>
          <div className="absolute left-1/4 bottom-1/4 w-80 h-80 rounded-full bg-purple-800/10 blur-3xl"></div>
          <div className="absolute right-1/3 top-1/2 w-40 h-40 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>
        
        {/* Header para dispositivos móveis */}
        <header className="fixed top-0 left-0 right-0 z-30 md:hidden bg-gray-800/95 backdrop-blur-sm h-16 border-b border-gray-700 shadow-lg">
          <div className="flex justify-between items-center px-4 h-full">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-300 hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-white font-bold text-lg">Trusttech</span>
            <div className="w-10"></div> {/* Espaçador para centralizar o título */}
          </div>
        </header>
        
        <main className="flex-1 relative z-10">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
              <PageHeader title="Sobre Nós" />
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <section className="mb-12">
                <div className="bg-gradient-to-br from-gray-800/50 to-purple-900/20 p-8 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-white mb-4">Nossa Missão</h2>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Na Trusttech, nossa missão é capacitar empresas de todos os tamanhos com tecnologias de comunicação inteligente, 
                    proporcionando uma experiência de atendimento excepcional que constrói confiança e fortalece relacionamentos 
                    com os clientes.
                  </p>
                  <h2 className="text-2xl font-bold text-white mb-4">Nossa Visão</h2>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Ser a plataforma de referência em comunicação inteligente, onde tecnologia e relacionamento humano se encontram 
                    para criar conexões mais significativas entre empresas e clientes.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-white">Confiança</h3>
                      <p className="text-gray-300">Construímos produtos nos quais nossos clientes podem confiar 100% do tempo.</p>
                    </div>
                    <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-white">Inovação</h3>
                      <p className="text-gray-300">Buscamos constantemente novas formas de resolver problemas complexos.</p>
                    </div>
                    <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-white">Pessoas</h3>
                      <p className="text-gray-300">Valorizamos relações humanas genuínas, dentro e fora da empresa.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <div className="flex items-center mb-8">
                  <div className="h-6 w-1 bg-purple-600 rounded-full mr-3"></div>
                  <h2 className="text-2xl font-semibold text-white">Nossa História</h2>
                </div>
                
                <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700 backdrop-blur-sm">
                  {milestones.map((milestone, index) => (
                    <Milestone 
                      key={index}
                      year={milestone.year}
                      title={milestone.title}
                      description={milestone.description}
                    />
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <div className="flex items-center mb-8">
                  <div className="h-6 w-1 bg-purple-600 rounded-full mr-3"></div>
                  <h2 className="text-2xl font-semibold text-white">Nossa Equipe</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {teamMembers.map((member, index) => (
                    <TeamMember 
                      key={index}
                      name={member.name}
                      role={member.role}
                      bio={member.bio}
                    />
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <div className="flex items-center mb-8">
                  <div className="h-6 w-1 bg-purple-600 rounded-full mr-3"></div>
                  <h2 className="text-2xl font-semibold text-white">Contato</h2>
                </div>
                
                <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700 backdrop-blur-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Informações de Contato</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-6 text-purple-400 mt-1">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="ml-3 text-gray-300">
                            <p>Av. Paulista, 1000</p>
                            <p>São Paulo, SP - Brasil</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-6 text-purple-400 mt-1">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="ml-3 text-purple-400 hover:text-purple-300">
                            <a href="mailto:contato@trusttech.ai">contato@trusttech.ai</a>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-6 text-purple-400 mt-1">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div className="ml-3 text-gray-300">
                            <p>+55 (11) 3456-7890</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <h4 className="text-lg font-medium text-white mb-4">Redes Sociais</h4>
                        <div className="flex space-x-4">
                          <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                            <span className="sr-only">LinkedIn</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                          <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                            <span className="sr-only">Twitter</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </a>
                          <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                            <span className="sr-only">GitHub</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </a>
                          <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                            <span className="sr-only">Instagram</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Envie uma mensagem</h3>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                          <input 
                            type="text" 
                            className="w-full bg-gray-700/50 text-white border border-purple-900/30 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            placeholder="Seu nome"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                          <input 
                            type="email" 
                            className="w-full bg-gray-700/50 text-white border border-purple-900/30 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            placeholder="seu@email.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Mensagem</label>
                          <textarea 
                            className="w-full bg-gray-700/50 text-white border border-purple-900/30 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            placeholder="Como podemos ajudar?"
                            rows={4}
                          ></textarea>
                        </div>
                        <div>
                          <button 
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-700 to-purple-500 text-white py-2 rounded-md hover:from-purple-600 hover:to-purple-400 transition-all duration-300 font-medium"
                          >
                            Enviar mensagem
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AboutPage;