import { useState } from 'react';
import { ArrowLeft, Send, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - conversas
  const conversations = [
    {
      id: 1,
      userName: 'Jayelly Santos',
      itemTitle: 'Fone de ouvido preto',
      lastMessage: 'Sim! Perdi ele ontem na biblioteca!',
      timestamp: '14:32',
      unread: 2,
      avatar: 'https://ui-avatars.com/api/?name=Jayelly+Santos&background=004C8C&color=fff'
    },
    {
      id: 2,
      userName: 'Pedro Mendes',
      itemTitle: 'Calculadora HP',
      lastMessage: 'Pode me dar algum detalhe específico?',
      timestamp: '2h atrás',
      unread: 0,
      avatar: 'https://ui-avatars.com/api/?name=Pedro+Mendes&background=004C8C&color=fff'
    },
    {
      id: 3,
      userName: 'Maria Lima',
      itemTitle: 'Chave com chaveiro UFC',
      lastMessage: 'Obrigado por ajudar!',
      timestamp: '1d atrás',
      unread: 0,
      avatar: 'https://ui-avatars.com/api/?name=Maria+Lima&background=004C8C&color=fff'
    }
  ];

  // Mock data - mensagens da conversa selecionada
  const messages = selectedConversation ? [
    { id: 1, sender: 'other', text: 'Oi! Você disse que esse fone é seu?', timestamp: '14:30' },
    { id: 2, sender: 'me', text: 'Sim! Perdi ele ontem na biblioteca!', timestamp: '14:32' },
    { id: 3, sender: 'other', text: 'Pode me dizer algum detalhe específico pra confirmar?', timestamp: '14:33' },
    { id: 4, sender: 'me', text: 'Ele tem um pequeno arranhão na parte direita', timestamp: '14:34' },
    { id: 5, sender: 'other', text: 'Perfeito! É esse mesmo. Entreguei na portaria.', timestamp: '14:35' }
  ] : [];

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.itemTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (message.trim()) {
      // Aqui enviaria a mensagem para o backend
      console.log('Enviando mensagem:', message);
      setMessage('');
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
            {filteredConversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 border-b hover:bg-gray-50 transition-colors text-left ${
                  selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={conv.avatar}
                    alt={conv.userName}
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {conv.userName}
                      </h3>
                      <span className="text-xs text-gray-500">{conv.timestamp}</span>
                    </div>
                    <p className="text-xs text-ufc-blue font-medium mb-1 truncate">
                      Item: {conv.itemTitle}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                      {conv.unread > 0 && (
                        <span className="bg-ufc-blue text-white text-xs rounded-full px-2 py-1 ml-2">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
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
                  src={selectedConversation.avatar}
                  alt={selectedConversation.userName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {selectedConversation.userName}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {selectedConversation.itemTitle}
                  </p>
                </div>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        msg.sender === 'me'
                          ? 'bg-ufc-blue text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <span className={`text-xs mt-1 block ${
                        msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
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
