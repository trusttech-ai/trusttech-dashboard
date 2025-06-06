import React from 'react';
import MobileListItem from '../molecules/MobileListItem';

interface RecentConversationsListProps {
  conversations: {
    avatar?: string;
    name: string;
    subtitle?: string;
    message: string;
    status: 'Respondido' | 'Aguardando' | 'Não lido';
    time: string;
    actionLink: string;
  }[];
}

const RecentConversationsList: React.FC<RecentConversationsListProps> = ({
  conversations
}) => {
  return (
    <div className="mt-4 sm:hidden">
      <div className="space-y-4">
        {conversations.map((conversation, index) => (
          <MobileListItem 
            key={index}
            avatar={conversation.avatar}
            name={conversation.name}
            subtitle={conversation.subtitle}
            message={conversation.message}
            status={conversation.status}
            time={conversation.time}
            actionLink={conversation.actionLink}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentConversationsList;
