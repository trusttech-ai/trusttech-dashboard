import React from 'react';
import TableHeader from '../molecules/TableHeader';
import TableRow from '../molecules/TableRow';

interface RecentConversationsTableProps {
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

const RecentConversationsTable: React.FC<RecentConversationsTableProps> = ({
  conversations
}) => {
  const columns = ['Cliente', 'Última mensagem', 'Status', 'Data'];
  
  return (
    <div className="hidden sm:block">
      <div className="mt-2 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <TableHeader columns={columns} />
                <tbody className="bg-white divide-y divide-gray-200">
                  {conversations.map((conversation, index) => (
                    <TableRow 
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentConversationsTable;
