import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Tag, MapPin, Calendar, CheckCircle, MessageCircle, Star, MoreVertical, Package, Shield } from 'lucide-react';
import Button from '../components/Button';
import { getItem, claimItem, createOrGetConversation, markItemAsPortaria, confirmItemReturn } from '../services/api';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await getItem(id);
      if (response.success) {
        setItem(response.data);
      } else {
        setError('Item não encontrado');
      }
    } catch (err) {
      console.error('Erro ao buscar item:', err);
      setError('Erro ao carregar item');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    try {
      const response = await claimItem(id);
      if (response.success) {
        alert('Item reivindicado com sucesso! Entre em contato com quem encontrou para combinar a devolução.');
        // Atualizar o item local
        setItem({ ...item, status: 'claimed' });
      }
    } catch (error) {
      console.error('Erro ao reivindicar item:', error);
      alert(error.response?.data?.message || 'Erro ao reivindicar item. Tente novamente.');
    }
  };

  const handleMessage = async () => {
    try {
      // Criar ou buscar conversa existente
      const response = await createOrGetConversation(id);
      if (response.success) {
        // Redirecionar para chat com a conversa selecionada
        navigate('/chat', { state: { conversationId: response.data._id } });
      }
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      alert(error.response?.data?.message || 'Erro ao iniciar conversa. Tente novamente.');
    }
  };

  // Verificar se usuário é staff
  const isStaff = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.role === 'staff' || user.role === 'admin';
    }
    return false;
  };

  // Handler para marcar item como recebido na portaria (staff only)
  const handleMarkAsPortaria = async () => {
    if (!window.confirm('Marcar este item como recebido na portaria?')) {
      return;
    }

    try {
      const response = await markItemAsPortaria(id);
      if (response.success) {
        alert('Item marcado como recebido na portaria!');
        fetchItem(); // Recarregar dados do item
      }
    } catch (error) {
      console.error('Erro ao marcar item:', error);
      alert(error.response?.data?.message || 'Erro ao marcar item. Tente novamente.');
    }
  };

  // Handler para confirmar devolução (staff only)
  const handleConfirmReturn = async () => {
    if (!window.confirm('Confirmar a devolução deste item? Isso atualizará a reputação do usuário.')) {
      return;
    }

    try {
      const response = await confirmItemReturn(id);
      if (response.success) {
        alert('Devolução confirmada com sucesso!');
        fetchItem(); // Recarregar dados do item
      }
    } catch (error) {
      console.error('Erro ao confirmar devolução:', error);
      alert(error.response?.data?.message || 'Erro ao confirmar devolução. Tente novamente.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recente';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusText = (status, inPortaria) => {
    if (status === 'returned') return 'Devolvido';
    if (status === 'claimed') return 'Reivindicado';
    if (inPortaria) return 'Na portaria';
    return 'Disponível';
  };

  const imageUrl = item?.image?.startsWith('http')
    ? item.image
    : item?.image
    ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}${item.image}`
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ufc-blue"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-ufc-blue text-white p-4 flex items-center">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-semibold ml-2">Detalhes do Item</h1>
        </header>
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Package size={64} className="text-gray-300 mb-4" />
          <p className="text-gray-600 text-center">{error || 'Item não encontrado'}</p>
          <button
            onClick={() => navigate('/home')}
            className="mt-4 text-ufc-blue hover:underline"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-ufc-blue text-white p-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-semibold">Detalhes do Item</h1>
        <button className="p-2 opacity-0">
          <MoreVertical size={24} />
        </button>
      </header>

      {/* Image */}
      <div className="bg-white">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full aspect-square object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.querySelector('.placeholder')?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-full aspect-square flex items-center justify-center bg-gray-100 ${imageUrl ? 'hidden' : ''} placeholder`}>
          <Package size={64} className="text-gray-300" />
        </div>
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
              <span className="text-sm text-gray-500">
                {item.type === 'lost' ? 'Perdido em:' : 'Encontrado em:'}
              </span>
              <span className="ml-2 font-medium">{formatDate(item.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center text-gray-700">
            <CheckCircle size={20} className="mr-3 text-success" />
            <div>
              <span className="text-sm text-gray-500">Status:</span>
              <span className="ml-2 font-medium text-success">{getStatusText(item.status, item.inPortaria)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
          <p className="text-gray-600 leading-relaxed">{item.description}</p>
        </div>

        {/* Found/Posted By */}
        {item.user && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ufc-blue rounded-full flex items-center justify-center text-white font-semibold">
                  {item.user.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.user.name || 'Usuário'}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star size={14} className="text-warning fill-warning" />
                    <span>{item.user.reputation || 5.0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Staff Actions */}
        {isStaff() && item.type === 'found' && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={18} className="text-ufc-blue" />
              <h3 className="font-semibold text-gray-900">Ações de Staff</h3>
            </div>
            <div className="space-y-2">
              {!item.inPortaria && item.status === 'active' && (
                <button
                  onClick={handleMarkAsPortaria}
                  className="w-full py-2.5 px-4 bg-ufc-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  Receber na Portaria
                </button>
              )}

              {item.status === 'claimed' && (
                <button
                  onClick={handleConfirmReturn}
                  className="w-full py-2.5 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                >
                  Confirmar Devolução
                </button>
              )}

              {item.inPortaria && item.status === 'active' && (
                <div className="py-2 px-4 bg-blue-100 text-blue-700 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2">
                  <CheckCircle size={16} />
                  Item na Portaria
                </div>
              )}

              {item.status === 'returned' && (
                <div className="py-2 px-4 bg-green-100 text-green-700 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2">
                  <CheckCircle size={16} />
                  Item Devolvido
                </div>
              )}
            </div>
          </div>
        )}

        {/* Regular Actions */}
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
