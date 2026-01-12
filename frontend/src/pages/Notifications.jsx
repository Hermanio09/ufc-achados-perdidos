import { ArrowLeft, Check, AlertTriangle, CheckCircle, MessageCircle, Package, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      if (response.success) {
        setNotifications(response.data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications(notifications.map(n =>
        n._id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Erro ao marcar notificação:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Erro ao marcar todas notificações:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    handleMarkAsRead(notification._id);

    // Navegar baseado no tipo
    if (notification.item) {
      navigate(`/item/${notification.item._id || notification.item}`);
    } else if (notification.conversation) {
      navigate('/chat', { state: { conversationId: notification.conversation._id || notification.conversation } });
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      match: AlertTriangle,
      message: MessageCircle,
      claim: AlertTriangle,
      return: CheckCircle,
      portaria: Package,
      system: Bell
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (type) => {
    const colors = {
      match: { icon: 'text-yellow-600', bg: 'bg-yellow-50' },
      message: { icon: 'text-ufc-blue', bg: 'bg-blue-50' },
      claim: { icon: 'text-orange-600', bg: 'bg-orange-50' },
      return: { icon: 'text-green-600', bg: 'bg-green-50' },
      portaria: { icon: 'text-blue-600', bg: 'bg-blue-50' },
      system: { icon: 'text-gray-600', bg: 'bg-gray-50' }
    };
    return colors[type] || colors.system;
  };

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const groupNotifications = () => {
    const today = [];
    const earlier = [];

    notifications.forEach(notification => {
      const timestamp = formatTimestamp(notification.createdAt);
      if (timestamp.includes('h') || timestamp.includes('min') || timestamp === 'Agora') {
        today.push(notification);
      } else {
        earlier.push(notification);
      }
    });

    return { today, earlier };
  };

  const { today, earlier } = groupNotifications();

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
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="text-xs px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={18} />
          </button>
        </div>
      </header>

      {/* Notificações */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando notificações...</p>
          </div>
        ) : notifications.length === 0 ? (
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
            {today.length > 0 && (
              <>
                <div className="text-xs font-semibold text-gray-500 mb-2 mt-4">Hoje</div>
                {today.map(notification => (
                  <NotificationCard
                    key={notification._id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                    getIcon={getNotificationIcon}
                    getColor={getNotificationColor}
                    formatTime={formatTimestamp}
                  />
                ))}
              </>
            )}

            {/* Anteriores */}
            {earlier.length > 0 && (
              <>
                <div className="text-xs font-semibold text-gray-500 mb-2 mt-6">Anteriores</div>
                {earlier.map(notification => (
                  <NotificationCard
                    key={notification._id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                    getIcon={getNotificationIcon}
                    getColor={getNotificationColor}
                    formatTime={formatTimestamp}
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

const NotificationCard = ({ notification, onClick, getIcon, getColor, formatTime }) => {
  const Icon = getIcon(notification.type);
  const colors = getColor(notification.type);

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
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colors.bg}`}>
          <Icon className={colors.icon} size={20} />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`font-semibold text-sm ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
              {notification.title}
            </h3>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatTime(notification.createdAt)}
            </span>
          </div>
          <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
            {notification.message}
          </p>
          {notification.item?.title && (
            <p className="text-xs text-gray-400 mt-1">
              Item: {notification.item.title}
            </p>
          )}
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
