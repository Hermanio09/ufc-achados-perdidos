import { useState, useEffect } from 'react';
import { ArrowLeft, Settings, LogOut, Package, CheckCircle, Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMyItems } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('perdidos');
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pegar dados reais do usuário logado
  const getUserData = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      const userName = parsedUser.name || 'Usuário';
      return {
        name: userName,
        email: parsedUser.email || 'email@ufc.br',
        matricula: parsedUser.matricula || 'N/A',
        curso: parsedUser.curso || 'N/A',
        semestre: parsedUser.semestre || 'N/A',
        reputation: parsedUser.reputation || 5.0,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=004C8C&color=fff&size=128`
      };
    }
    return {
      name: 'Usuário',
      email: 'email@ufc.br',
      matricula: 'N/A',
      curso: 'N/A',
      semestre: 'N/A',
      reputation: 5.0,
      avatar: 'https://ui-avatars.com/api/?name=Usuario&background=004C8C&color=fff&size=128'
    };
  };

  const user = getUserData();

  // Buscar itens do usuário da API
  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      setLoading(true);

      // Buscar itens perdidos
      const lostResponse = await getMyItems('lost');
      if (lostResponse.success) {
        setLostItems(lostResponse.data || []);
      }

      // Buscar itens encontrados
      const foundResponse = await getMyItems('found');
      if (foundResponse.success) {
        setFoundItems(foundResponse.data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar meus itens:', error);
      setLostItems([]);
      setFoundItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas reais
  const stats = {
    perdidos: lostItems.length,
    encontrados: foundItems.length,
    recuperados: lostItems.filter(item => item.status === 'returned').length
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': { text: 'Ativo', color: 'bg-blue-100 text-blue-800' },
      'claimed': { text: 'Reivindicado', color: 'bg-yellow-100 text-yellow-800' },
      'returned': { text: 'Devolvido', color: 'bg-green-100 text-green-800' },
      'archived': { text: 'Arquivado', color: 'bg-gray-100 text-gray-800' }
    };

    const badge = statusMap[status] || { text: 'Ativo', color: 'bg-blue-100 text-blue-800' };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recente';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-ufc-blue text-white shadow-lg">
        <div className="p-4 flex items-center justify-between">
          <button onClick={() => navigate('/home')} className="p-1">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-lg">Meu Perfil</h1>
          <button onClick={() => navigate('/home')} className="p-1 opacity-0">
            <Settings size={24} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm opacity-90">{user.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{user.reputation} (12 devoluções)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="opacity-75">Matrícula:</span>
                <span className="ml-2 font-medium">{user.matricula}</span>
              </div>
              <div>
                <span className="opacity-75">Curso:</span>
                <span className="ml-2 font-medium">{user.curso}</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="opacity-75">Semestre:</span>
              <span className="ml-2 font-medium">{user.semestre}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Estatísticas */}
      <div className="bg-white border-b shadow-sm">
        <div className="flex justify-around py-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-ufc-blue">{stats.perdidos}</div>
            <div className="text-xs text-gray-600">Perdidos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-ufc-blue">{stats.encontrados}</div>
            <div className="text-xs text-gray-600">Encontrei</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.recuperados}</div>
            <div className="text-xs text-gray-600">Recuperados</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('perdidos')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'perdidos'
                ? 'border-ufc-blue text-ufc-blue'
                : 'border-transparent text-gray-500'
            }`}
          >
            Meus Itens Perdidos
          </button>
          <button
            onClick={() => setActiveTab('encontrados')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'encontrados'
                ? 'border-ufc-blue text-ufc-blue'
                : 'border-transparent text-gray-500'
            }`}
          >
            Itens que Encontrei
          </button>
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ufc-blue"></div>
          </div>
        ) : (
          <>
            {activeTab === 'perdidos' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Meus Itens Perdidos ({lostItems.length})
                </h3>
                {lostItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                    <Package size={48} className="mx-auto mb-2 text-gray-300" />
                    <p className="font-medium text-gray-700">Nenhum item perdido</p>
                    <p className="text-sm mt-2">Registre itens que você perdeu</p>
                  </div>
                ) : (
                  lostItems.map(item => (
                    <div
                      key={item._id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/item/${item._id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600">
                            <span className="text-ufc-blue font-medium">{item.category}</span> • {formatDate(item.createdAt)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{item.location}</p>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                      {item.status === 'active' && (
                        <button className="mt-2 text-sm text-ufc-blue hover:underline flex items-center gap-1">
                          <Search size={14} />
                          Ver se alguém encontrou
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'encontrados' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Itens que Encontrei ({foundItems.length})
                </h3>
                {foundItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                    <Package size={48} className="mx-auto mb-2 text-gray-300" />
                    <p className="font-medium text-gray-700">Nenhum item encontrado</p>
                    <p className="text-sm mt-2">Registre itens que você encontrou</p>
                  </div>
                ) : (
                  foundItems.map(item => (
                    <div
                      key={item._id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/item/${item._id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600">
                            <span className="text-ufc-blue font-medium">{item.category}</span> • {formatDate(item.createdAt)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{item.location}</p>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                      {item.status === 'returned' && (
                        <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle size={14} />
                          <span>Obrigado por ajudar! +10 pontos de reputação</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Configurações */}
      <div className="p-4 space-y-2">
        <button
          onClick={() => alert('Funcionalidade em desenvolvimento')}
          className="w-full bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
        >
          <Settings className="text-gray-600" size={20} />
          <span className="text-gray-900 font-medium">Configurações</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-white border border-red-200 rounded-lg p-4 flex items-center gap-3 hover:bg-red-50 transition-colors text-red-600"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
