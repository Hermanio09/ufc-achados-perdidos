import { ArrowLeft, Check, AlertTriangle, CheckCircle, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'match',
      title: 'Possível match!',
      message: 'Um fone de ouvido similar ao que você perdeu foi encontrado na Biblioteca.',
      timestamp: '2h atrás',
      read: false,
      icon: AlertTriangle,
      iconColor: 'text-warning',
      bgColor: 'bg-yellow-50',
      itemId: 1
    },
    {
      id: 2,
      type: 'message',
      title: 'Nova mensagem',
      message: 'Jayelly Santos enviou: "Pode me dar algum detalhe específico?"',
      timestamp: '5h atrás',
      read: false,
      icon: MessageCircle,
      iconColor: 'text-ufc-blue',
      bgColor: 'bg-blue-50',
      chatId: 1
    },
    {
      id: 3,
      type: 'claimed',
      title: 'Alguém reivindicou seu item',
      message: 'Pedro Mendes disse que a calculadora HP é dele. Verifique as informações.',
      timestamp: '1d atrás',
      read: true,
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      itemId: 2
    },
    {
      id: 4,
      type: 'returned',
      title: 'Item devolvido!',
      message: 'Obrigado por ajudar! Você ganhou +10 pontos de reputação.',
      timestamp: '2d atrás',
      read: true,
      icon: CheckCircle,
      iconColor: 'text-success',
      bgColor: 'bg-green-50',
      itemId: 3
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    // Navegar baseado no tipo
    if (notification.type === 'match' && notification.itemId) {
      navigate(`/item/${notification.itemId}`);
    } else if (notification.type === 'message' && notification.chatId) {
      navigate('/chat');
    } else if (notification.type === 'claimed' && notification.itemId) {
      navigate(`/item/${notification.itemId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-ufc-blue text-white shadow-lg sticky top-0 z-10">
        <div className="p-4 flex items-center justify-between">
          <button onClick={() => navigate('/home')} className="p-1">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 text-center">
            <h1 className="font-bold text-lg">Notificações</h1>
            {unreadCount > 0 && (
              <p className="text-xs opacity-90">{unreadCount} não lida{unreadCount > 1 ? 's' : ''}</p>
            )}
          </div>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-xs px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={18} />
          </button>
        </div>
      </header>

      {/* Notificações */}
      <div className="p-4">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">Nenhuma notificação</p>
            <p className="text-sm text-gray-500 mt-2">Você está em dia!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Hoje */}
            <div className="text-xs font-semibold text-gray-500 mb-2 mt-4">Hoje</div>
            {notifications
              .filter(n => n.timestamp.includes('h'))
              .map(notification => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                />
              ))}

            {/* Anteriores */}
            {notifications.some(n => n.timestamp.includes('d')) && (
              <>
                <div className="text-xs font-semibold text-gray-500 mb-2 mt-6">Anteriores</div>
                {notifications
                  .filter(n => n.timestamp.includes('d'))
                  .map(notification => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onClick={() => handleNotificationClick(notification)}
                    />
                  ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const NotificationCard = ({ notification, onClick }) => {
  const Icon = notification.icon;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border transition-all hover:shadow-md ${
        notification.read
          ? 'bg-white border-gray-200'
          : 'bg-white border-ufc-blue shadow-sm'
      }`}
    >
      <div className="p-4 flex gap-3">
        {/* Ícone */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.bgColor}`}>
          <Icon className={notification.iconColor} size={20} />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`font-semibold text-sm ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
              {notification.title}
            </h3>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {notification.timestamp}
            </span>
          </div>
          <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
            {notification.message}
          </p>
        </div>

        {/* Indicador não lido */}
        {!notification.read && (
          <div className="flex-shrink-0 w-2 h-2 bg-ufc-blue rounded-full mt-2"></div>
        )}
      </div>
    </button>
  );
};

export default Notifications;
