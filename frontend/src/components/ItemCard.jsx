import { MapPin, Calendar, Package } from 'lucide-react';

const ItemCard = ({ item, onClick }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Na portaria': 'bg-success',
      'Aguardando': 'bg-warning',
      'Devolvido': 'bg-gray-400'
    };
    return colors[status] || 'bg-gray-300';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
    >
      <div className="aspect-square bg-gray-100 relative">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={64} className="text-gray-300" />
          </div>
        )}
        <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-white text-xs font-medium ${getStatusColor(item.status)}`}>
          {item.status}
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
            <span>{item.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
