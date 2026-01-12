import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Search, Package } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMyConversations, getMessages, sendMessage as sendMessageAPI } from '../services/api';

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Pegar ID do usuário logado
  const getCurrentUserId = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      return parsedUser._id || parsedUser.id;
    }
    return null;
  };

  const currentUserId = getCurrentUserId();

  // Buscar conversas ao carregar
  useEffect(() => {
    fetchConversations();
  }, []);

  // Se veio de ItemDetails com conversationId, selecionar automaticamente
  useEffect(() => {
    if (location.state?.conversationId && conversations.length > 0) {
      const conv = conversations.find(c => c._id === location.state.conversationId);
      if (conv) {
        handleSelectConversation(conv);
      }
    }
  }, [location.state, conversations]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await getMyConversations();
      if (response.success) {
        setConversations(response.data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conv) => {
    setSelectedConversation(conv);
    setLoadingMessages(true);

    try {
      const response = await getMessages(conv._id);
      if (response.success) {
        setMessages(response.data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const formatTimestamp = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatConversationTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}min`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };

  const getOtherUser = (conv) => {
    return conv.participants.find(p => p._id !== currentUserId);
  };

  const filteredConversations = conversations.filter(conv => {
    const otherUser = getOtherUser(conv);
    return (
      otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.item?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSendMessage = async () => {
    if (message.trim() && selectedConversation) {
      const messageText = message.trim();
      setMessage(''); // Limpar input imediatamente

      try {
        const response = await sendMessageAPI(selectedConversation._id, messageText);
        if (response.success) {
          // Adicionar mensagem à lista local
          setMessages([...messages, response.data]);
        }
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        alert('Erro ao enviar mensagem. Tente novamente.');
        setMessage(messageText); // Restaurar mensagem em caso de erro
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-ufc-blue text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="p-1">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="font-bold text-lg">Mensagens</h1>
            <p className="text-xs opacity-90">
              {conversations.length} conversas
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Lista de Conversas - Sidebar */}
        <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col bg-white border-r border-gray-200`}>
          {/* Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar conversa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ufc-blue"
              />
            </div>
          </div>

          {/* Conversas */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ufc-blue"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-gray-500">
                <Package size={48} className="mb-3 text-gray-300" />
                <p className="text-center font-medium">Nenhuma conversa</p>
                <p className="text-sm text-center mt-2">As conversas sobre itens aparecerão aqui</p>
              </div>
            ) : (
              filteredConversations.map(conv => {
                const otherUser = getOtherUser(conv);
                const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'U')}&background=004C8C&color=fff`;

                return (
                  <button
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full p-4 border-b hover:bg-gray-50 transition-colors text-left ${
                      selectedConversation?._id === conv._id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={avatar}
                        alt={otherUser?.name}
                        className="w-12 h-12 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">
                            {otherUser?.name || 'Usuário'}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatConversationTime(conv.lastMessageAt)}
                          </span>
                        </div>
                        <p className="text-xs text-ufc-blue font-medium mb-1 truncate">
                          Item: {conv.item?.title || 'Item'}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Área de Chat */}
        <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
          {selectedConversation ? (
            <>
              {/* Header da Conversa */}
              <div className="bg-white border-b p-4 flex items-center gap-3 shadow-sm">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-1"
                >
                  <ArrowLeft size={20} />
                </button>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(getOtherUser(selectedConversation)?.name || 'U')}&background=004C8C&color=fff`}
                  alt={getOtherUser(selectedConversation)?.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {getOtherUser(selectedConversation)?.name || 'Usuário'}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {selectedConversation.item?.title || 'Item'}
                  </p>
                </div>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ufc-blue"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Nenhuma mensagem ainda. Envie a primeira!</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMyMessage = msg.sender._id === currentUserId;
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            isMyMessage
                              ? 'bg-ufc-blue text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <span className={`text-xs mt-1 block ${
                            isMyMessage ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTimestamp(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input de Mensagem */}
              <div className="bg-white border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite uma mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-ufc-blue"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-ufc-blue text-white p-3 rounded-full hover:bg-ufc-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <svg className="mx-auto mb-4 w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg font-medium">Selecione uma conversa</p>
                <p className="text-sm mt-2">Escolha uma conversa à esquerda para começar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
