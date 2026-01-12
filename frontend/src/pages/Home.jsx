import { useState, useEffect } from 'react';
import { Search, Bell, Menu, Home as HomeIcon, MessageCircle, User, Plus, MapPin } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { getFoundItems } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscar itens encontrados da API
  useEffect(() => {
    fetchItems();
  }, [selectedCategory, searchTerm]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const filters = {};

      if (selectedCategory !== 'Todos') {
        filters.category = selectedCategory;
      }

      if (searchTerm) {
        filters.search = searchTerm;
      }

      const response = await getFoundItems(filters);

      if (response.success) {
        setItems(response.data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Todos', 'Eletrônicos', 'Documentos', 'Chaves', 'Acessórios', 'Roupas', 'Livros', 'Carteiras', 'Outros'];

  const filteredItems = selectedLocation
    ? items.filter(item => item.location?.toLowerCase().includes(selectedLocation.toLowerCase()))
    : items;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header */}
      <header className="bg-ufc-blue text-white p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded transition-colors">
            <Menu size={24} />
          </button>
          <div className="text-center flex-1">
            <h1 className="font-bold text-lg">UFC ACHADOS E PERDIDOS</h1>
            <p className="text-xs opacity-90">Campus Russas</p>
          </div>
          <button
            onClick={() => navigate('/notificacoes')}
            className="p-2 relative hover:bg-white/10 rounded transition-colors"
          >
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full"></span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-ufc-blue-light"
          />
        </div>
      </header>

      {/* Categories */}
      <div className="bg-white p-4 shadow-sm overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-ufc-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="px-4 py-3 bg-white border-b">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-ufc-blue" />
          <input
            type="text"
            placeholder="Filtrar por local..."
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="flex-1 text-sm focus:outline-none text-ufc-blue"
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Encontrados Recentemente ({filteredItems.length})
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ufc-blue"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
            <p className="font-medium text-gray-700">Nenhum item encontrado</p>
            <p className="text-sm mt-2">Tente buscar com outros termos ou registre um item encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map(item => (
              <ItemCard
                key={item._id || item.id}
                item={{
                  ...item,
                  id: item._id || item.id
                }}
                onClick={() => navigate(`/item/${item._id || item.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center gap-1 text-ufc-blue">
            <HomeIcon size={24} />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => navigate('/registrar')}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-ufc-blue"
          >
            <div className="bg-ufc-blue text-white p-2 rounded-full">
              <Plus size={24} />
            </div>
            <span className="text-xs font-medium">Registrar</span>
          </button>

          <button
            onClick={() => navigate('/chat')}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-ufc-blue"
          >
            <MessageCircle size={24} />
            <span className="text-xs">Chat</span>
          </button>

          <button
            onClick={() => navigate('/perfil')}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-ufc-blue"
          >
            <User size={24} />
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Home;
