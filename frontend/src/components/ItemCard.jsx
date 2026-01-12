import { MapPin, Calendar, Package } from 'lucide-react';

const ItemCard = ({ item, onClick }) => {
  const getStatusBadge = (status, inPortaria) => {
    if (status === 'returned') {
      return { text: 'Devolvido', color: 'bg-gray-400' };
    }
    if (status === 'claimed') {
      return { text: 'Reivindicado', color: 'bg-yellow-500' };
    }
    if (inPortaria) {
      return { text: 'Na portaria', color: 'bg-green-500' };
    }
    return { text: 'Disponível', color: 'bg-blue-500' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recente';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}min atrás`;
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else if (diffDays < 7) {
      return `${diffDays}d atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const badge = getStatusBadge(item.status, item.inPortaria);
  const imageUrl = item.image?.startsWith('http')
    ? item.image
    : item.image
    ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}${item.image}`
    : null;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
    >
      <div className="aspect-square bg-gray-100 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.querySelector('.placeholder')?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center ${imageUrl ? 'hidden' : ''} placeholder`}>
          <Package size={64} className="text-gray-300" />
        </div>
        <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-white text-xs font-medium ${badge.color}`}>
          {badge.text}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-1">
          {item.title}
        </h3>

        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <Package size={14} className="mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{item.category}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={14} className="mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{item.location}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={14} className="mr-2 flex-shrink-0" />
            <span>{formatDate(item.createdAt || item.date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
