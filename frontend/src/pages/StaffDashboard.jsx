import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Package, CheckCircle, MapPin, User, Award, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllItemsAdmin, markItemAsPortaria, confirmItemReturn } from '../services/api';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    category: '',
    search: ''
  });

  useEffect(() => {
    fetchAllItems();
  }, [filters]);

  const fetchAllItems = async () => {
    try {
      setLoading(true);
      const response = await getAllItemsAdmin(filters);
      if (response.success) {
        setItems(response.data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
      if (error.response?.status === 403) {
        alert('Você não tem permissão para acessar esta página.');
        navigate('/home');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPortaria = async (itemId) => {
    if (!window.confirm('Marcar este item como recebido na portaria?')) {
      return;
    }

    try {
      const response = await markItemAsPortaria(itemId);
      if (response.success) {
        alert('Item marcado como recebido na portaria!');
        fetchAllItems();
      }
    } catch (error) {
      console.error('Erro ao marcar item:', error);
      alert('Erro ao marcar item. Tente novamente.');
    }
  };

  const handleConfirmReturn = async (itemId) => {
    if (!window.confirm('Confirmar a devolução deste item? Isso atualizará a reputação do usuário.')) {
      return;
    }

    try {
      const response = await confirmItemReturn(itemId);
      if (response.success) {
        alert('Devolução confirmada com sucesso!');
        fetchAllItems();
      }
    } catch (error) {
      console.error('Erro ao confirmar devolução:', error);
      alert('Erro ao confirmar devolução. Tente novamente.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Ativo', className: 'bg-green-100 text-green-800' },
      claimed: { text: 'Reivindicado', className: 'bg-yellow-100 text-yellow-800' },
      returned: { text: 'Devolvido', className: 'bg-blue-100 text-blue-800' },
      archived: { text: 'Arquivado', className: 'bg-gray-100 text-gray-800' }
    };
    const badge = badges[status] || badges.active;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  const getCategoryLabel = (category) => {
    const categories = {
      eletronicos: 'Eletrônicos',
      documentos: 'Documentos',
      acessorios: 'Acessórios',
      roupas: 'Roupas',
      livros: 'Livros',
      outros: 'Outros'
    };
    return categories[category] || category;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-ufc-blue text-white shadow-lg sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/home')} className="p-1">
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-xl">Dashboard Staff</h1>
              <p className="text-xs opacity-90">Gerenciar todos os itens</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="space-y-2">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por título ou descrição..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Filtros rápidos */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="px-3 py-1 rounded-full text-sm bg-white/20 text-white border border-white/30 focus:outline-none"
              >
                <option value="">Todos os tipos</option>
                <option value="found">Encontrados</option>
                <option value="lost">Perdidos</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-1 rounded-full text-sm bg-white/20 text-white border border-white/30 focus:outline-none"
              >
                <option value="">Todos os status</option>
                <option value="active">Ativo</option>
                <option value="claimed">Reivindicado</option>
                <option value="returned">Devolvido</option>
                <option value="archived">Arquivado</option>
              </select>

              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-3 py-1 rounded-full text-sm bg-white/20 text-white border border-white/30 focus:outline-none"
              >
                <option value="">Todas categorias</option>
                <option value="eletronicos">Eletrônicos</option>
                <option value="documentos">Documentos</option>
                <option value="acessorios">Acessórios</option>
                <option value="roupas">Roupas</option>
                <option value="livros">Livros</option>
                <option value="outros">Outros</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Lista de Itens */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando itens...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Nenhum item encontrado</p>
            <p className="text-sm text-gray-500 mt-2">Tente ajustar os filtros</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {items.length} item{items.length !== 1 ? 'ns' : ''} encontrado{items.length !== 1 ? 's' : ''}
            </p>

            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Imagem e Info Principal */}
                <div className="flex gap-3 p-4">
                  {item.image ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${item.image}`}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package size={32} className="text-gray-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        className="font-semibold text-gray-900 cursor-pointer hover:text-ufc-blue"
                        onClick={() => navigate(`/item/${item._id}`)}
                      >
                        {item.title}
                      </h3>
                      {getStatusBadge(item.status)}
                    </div>

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>

                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Package size={12} />
                        {getCategoryLabel(item.category)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {item.location}
                      </span>
                      {item.inPortaria && (
                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                          <CheckCircle size={12} />
                          Na Portaria
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded ${item.type === 'found' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {item.type === 'found' ? 'Encontrado' : 'Perdido'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dados do Usuário */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-gray-400" />
                      <span className="font-medium text-gray-700">{item.user?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-yellow-600">
                      <Award size={14} />
                      <span className="font-medium">{item.user?.reputation?.toFixed(1) || '5.0'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Email:</span> {item.user?.email || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Matrícula:</span> {item.user?.matricula || 'N/A'}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Curso:</span> {item.user?.curso || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Ações Staff */}
                {item.type === 'found' && (
                  <div className="px-4 py-3 bg-white border-t border-gray-200 flex gap-2">
                    {!item.inPortaria && item.status === 'active' && (
                      <button
                        onClick={() => handleMarkAsPortaria(item._id)}
                        className="flex-1 py-2 px-4 bg-ufc-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                      >
                        Receber na Portaria
                      </button>
                    )}

                    {item.status === 'claimed' && (
                      <button
                        onClick={() => handleConfirmReturn(item._id)}
                        className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                      >
                        Confirmar Devolução
                      </button>
                    )}

                    {item.status === 'returned' && (
                      <div className="flex-1 py-2 px-4 bg-green-100 text-green-700 rounded-lg font-medium text-center text-sm flex items-center justify-center gap-2">
                        <CheckCircle size={16} />
                        Item Devolvido
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
