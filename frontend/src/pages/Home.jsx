import { useState } from 'react';
import { Search, Bell, Menu, Home as HomeIcon, MessageCircle, User, Plus, MapPin } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Dados mockados dos itens (depois virão da API)
  const items = [
    {
      id: 1,
      title: 'Fone JBL Preto',
      category: 'Eletrônicos',
      location: 'Biblioteca - 2º andar',
      date: '2h atrás',
      status: 'Na portaria',
      image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400'
    },
    {
      id: 2,
      title: 'Calculadora HP',
      category: 'Eletrônicos',
      location: 'Sala 101',
      date: '5h atrás',
      status: 'Na portaria',
      image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400'
    },
    {
      id: 3,
      title: 'Chave c/ chaveiro UFC',
      category: 'Chaves',
      location: '3º andar',
      date: '1d atrás',
      status: 'Na portaria',
      image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400'
    },
    {
      id: 4,
      title: 'Garrafa de água',
      category: 'Acessórios',
      location: 'Cantina',
      date: '2h atrás',
      status: 'Na portaria',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400'
    },
    {
      id: 5,
      title: 'Fone de ouvido',
      category: 'Eletrônicos',
      location: 'Biblioteca',
      date: '3h atrás',
      status: 'Na portaria',
      image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400'
    },
    {
      id: 6,
      title: 'Celular',
      category: 'Eletrônicos',
      location: 'Quadra',
      date: '1d atrás',
      status: 'Na portaria',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
    }
  ];

  const categories = ['Todos', 'Eletrônicos', 'Documentos', 'Chaves', 'Acessórios'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesLocation = !selectedLocation || item.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-ufc-blue text-white p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2">
            <Menu size={24} />
          </button>
          <div className="text-center flex-1">
            <h1 className="font-bold text-lg">UFC ACHADOS E PERDIDOS</h1>
            <p className="text-xs opacity-90">Campus Russas</p>
          </div>
          <button className="p-2 relative">
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
          Encontrados Recentemente
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => navigate(`/item/${item.id}`)}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Nenhum item encontrado</p>
            <p className="text-sm mt-2">Tente buscar com outros termos</p>
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
