import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, MapPin, Calendar, CheckCircle, MessageCircle, Star, MoreVertical } from 'lucide-react';
import Button from '../components/Button';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dados mockados (depois virão da API)
  const item = {
    id: 1,
    title: 'Fone de Ouvido Bluetooth',
    category: 'Eletrônicos',
    location: 'Biblioteca - 2º andar',
    date: '03/01/2026',
    status: 'Na portaria',
    description: 'Fone de ouvido Bluetooth, cor preta com detalhes em vermelho, encontrado na mesa próxima à janela da biblioteca.',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
    foundBy: {
      name: 'Jayelly S.',
      rating: 4.8,
      returns: 12
    }
  };

  const handleClaim = () => {
    // Lógica para reivindicar o item
    navigate(`/reivindicar/${id}`);
  };

  const handleMessage = () => {
    // Lógica para enviar mensagem
    navigate(`/chat/${item.foundBy.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-semibold">Detalhes do Item</h1>
        <button className="p-2">
          <MoreVertical size={24} />
        </button>
      </header>

      {/* Image */}
      <div className="bg-white">
        <img
          src={item.image}
          alt={item.title}
          className="w-full aspect-square object-cover"
        />
      </div>

      {/* Content */}
      <div className="bg-white mt-1 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h2>

        {/* Info Grid */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-700">
            <Tag size={20} className="mr-3 text-ufc-blue" />
            <div>
              <span className="text-sm text-gray-500">Categoria:</span>
              <span className="ml-2 font-medium">{item.category}</span>
            </div>
          </div>

          <div className="flex items-center text-gray-700">
            <MapPin size={20} className="mr-3 text-ufc-blue" />
            <div>
              <span className="text-sm text-gray-500">Local:</span>
              <span className="ml-2 font-medium">{item.location}</span>
            </div>
          </div>

          <div className="flex items-center text-gray-700">
            <Calendar size={20} className="mr-3 text-ufc-blue" />
            <div>
              <span className="text-sm text-gray-500">Encontrado:</span>
              <span className="ml-2 font-medium">{item.date}</span>
            </div>
          </div>

          <div className="flex items-center text-gray-700">
            <CheckCircle size={20} className="mr-3 text-success" />
            <div>
              <span className="text-sm text-gray-500">Status:</span>
              <span className="ml-2 font-medium text-success">{item.status}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
          <p className="text-gray-600 leading-relaxed">{item.description}</p>
        </div>

        {/* Found By */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-ufc-blue rounded-full flex items-center justify-center text-white font-semibold">
                {item.foundBy.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{item.foundBy.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star size={14} className="text-warning fill-warning" />
                  <span>{item.foundBy.rating}</span>
                  <span>({item.foundBy.returns} devoluções)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleClaim}
            fullWidth
            size="lg"
          >
            👍 ESSE É MEU!
          </Button>

          <Button
            onClick={handleMessage}
            variant="secondary"
            fullWidth
            size="lg"
          >
            <MessageCircle size={20} className="mr-2" />
            ENVIAR MENSAGEM
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
