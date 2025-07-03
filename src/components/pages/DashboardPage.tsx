"use client"; 
import React, { useState } from 'react';

import Sidebar from  '../organisms/Sidebar';
import MobileHeader from  '../molecules/MobileHeader';
import PageHeader from  '../organisms/PageHeader';
import InfoCardGrid from  '../organisms/InfoCardGrid';
import RecentConversationsTable from  '../organisms/RecentConversationsTable';
import RecentConversationsList from  '../organisms/RecentConversationsList';

const DashboardPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const infoCards = [
    {
      icon: 'message',
      title: 'Mensagens de hoje',
      value: 34,
      linkText: 'Ver todas',
      linkHref: '#',
      iconColor: 'bg-purple-600',
      linkColor: 'text-purple-400 hover:text-purple-500'
    },
    {
      icon: 'calendar',
      title: 'Agendamentos hoje',
      value: 12,
      linkText: 'Ver todos',
      linkHref: '#',
      iconColor: 'bg-green-500',
      linkColor: 'text-green-400 hover:text-green-500'
    },
    {
      icon: 'users',
      title: 'Clientes ativos',
      value: 87,
      linkText: 'Ver todos',
      linkHref: '#',
      iconColor: 'bg-blue-500',
      linkColor: 'text-blue-400 hover:text-blue-500'
    }
  ];

  const conversations = [
    {
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
      name: 'Virginia Novamente',
      subtitle: '+55 83 9304-9259',
      message: 'Oi, aqui é a Virginia novamente! Só passando para...',
      status: 'Respondido' as const,
      time: 'Ontem',
      actionLink: '#'
    },
        {
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
      name: 'Virginia Novamente',
      subtitle: '+55 83 9304-9259',
      message: 'Oi, aqui é a Virginia novamente! Só passando para...',
      status: 'Respondido' as const,
      time: 'Ontem',
      actionLink: '#'
    },
        {
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
      name: 'Virginia Novamente',
      subtitle: '+55 83 9304-9259',
      message: 'Oi, aqui é a Virginia novamente! Só passando para...',
      status: 'Respondido' as const,
      time: 'Ontem',
      actionLink: '#'
    },
        {
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
      name: 'Virginia Novamente',
      subtitle: '+55 83 9304-9259',
      message: 'Oi, aqui é a Virginia novamente! Só passando para...',
      status: 'Respondido' as const,
      time: 'Ontem',
      actionLink: '#'
    },
        {
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
      name: 'Virginia Novamente',
      subtitle: '+55 83 9304-9259',
      message: 'Oi, aqui é a Virginia novamente! Só passando para...',
      status: 'Respondido' as const,
      time: 'Ontem',
      actionLink: '#'
    },
        {
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
      name: 'Virginia Novamente',
      subtitle: '+55 83 9304-9259',
      message: 'Oi, aqui é a Virginia novamente! Só passando para...',
      status: 'Respondido' as const,
      time: 'Ontem',
      actionLink: '#'
    },
    {
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
      name: 'Ryan Basque',
      subtitle: '+55 82 8848-1451',
      message: 'Você sabia que posso agendar compromissos...',
      status: 'Respondido' as const,
      time: '00:48',
      actionLink: '#'
    },
    {
      avatar: undefined,
      name: 'Trusttech - Avisos',
      subtitle: 'Sistema',
      message: 'Aguardando mensagem. Essa ação pode levar...',
      status: 'Aguardando' as const,
      time: 'Ontem',
      actionLink: '#'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white transition-colors duration-200">
      <Sidebar 
        mobileMenuOpen={mobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
      />
      <div className="flex-1 flex flex-col relative overflow-y-auto pt-16 md:pt-0 transition-all duration-300 ease-in-out">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-purple-900/20 blur-3xl"></div>
          <div className="absolute left-1/4 bottom-1/4 w-80 h-80 rounded-full bg-purple-800/10 blur-3xl"></div>
          <div className="absolute right-1/3 top-1/2 w-40 h-40 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>
        
        <div className="fixed top-0 left-0 right-0 z-30 md:hidden bg-gray-900 shadow-lg">
          <MobileHeader 
            title="Trusttech" 
            onMenuToggle={toggleMobileMenu} 
          />
        </div>
        
        <main className="flex-1 relative z-10">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
              <PageHeader title="Dashboard" />
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <InfoCardGrid cards={infoCards} />

              <div className="mt-10">
                <div className="flex items-center mb-4">
                  <div className="h-6 w-1 bg-purple-600 rounded-full mr-3"></div>
                  <h2 className="text-xl font-semibold text-white">Conversas recentes</h2>
                </div>
                
                <RecentConversationsTable conversations={conversations} />

                <RecentConversationsList conversations={conversations} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
