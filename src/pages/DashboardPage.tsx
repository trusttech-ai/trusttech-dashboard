"use client"; 
import React, { useState } from 'react';

import Sidebar from  '../components/organisms/Sidebar';
import MobileHeader from  '../components/molecules/MobileHeader';
import PageHeader from  '../components/organisms/PageHeader';
import InfoCardGrid from  '../components/organisms/InfoCardGrid';
import RecentConversationsTable from  '../components/organisms/RecentConversationsTable';
import RecentConversationsList from  '../components/organisms/RecentConversationsList';

const DashboardPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    console.log('Toggling mobile menu', !mobileMenuOpen);
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const infoCards = [
    {
      icon: 'message',
      title: 'Mensagens de hoje',
      value: 34,
      linkText: 'Ver todas',
      linkHref: '#',
      iconColor: 'bg-indigo-500',
      linkColor: 'text-indigo-600 hover:text-indigo-500'
    },
    {
      icon: 'calendar',
      title: 'Agendamentos hoje',
      value: 12,
      linkText: 'Ver todos',
      linkHref: '#',
      iconColor: 'bg-green-500',
      linkColor: 'text-green-600 hover:text-green-500'
    },
    {
      icon: 'users',
      title: 'Clientes ativos',
      value: 87,
      linkText: 'Ver todos',
      linkHref: '#',
      iconColor: 'bg-blue-500',
      linkColor: 'text-blue-600 hover:text-blue-500'
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        mobileMenuOpen={mobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
      />
      <div className="flex flex-col flex-1 ">
        <MobileHeader 
          title="Trusttech" 
          onMenuToggle={toggleMobileMenu} 
        />
        
        <main className="flex-1">
          <div className="py-6">
            <PageHeader title="Dashboard" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <InfoCardGrid cards={infoCards} />

              <div className="mt-8">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Conversas recentes</h2>
                
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
