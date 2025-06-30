import React, { useState } from 'react';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  title: string;
  actionType: 'APPROVE' | 'REJECTED';
}

const CommentModal: React.FC<CommentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title,
  actionType 
}) => {
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(comment);
    setComment('');
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-700/50">
        <div className="px-6 py-4 border-b border-gray-700/50">
          <h3 className="text-lg font-medium text-white">
            {title}
          </h3>
        </div>
        <div className="p-6">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
            Adicione um comentário
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Motivo da decisão..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="px-6 py-4 border-t border-gray-700/50 flex justify-end space-x-3">
          <button
            type="button"
            className="px-3 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={`px-3 py-2 rounded-md text-white ${
              actionType === 'APPROVE' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
            onClick={handleSubmit}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;