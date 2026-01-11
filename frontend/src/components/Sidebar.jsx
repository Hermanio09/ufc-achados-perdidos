import { X, Home, User, MessageCircle, PlusCircle, Info, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    onClose();
  };

  const menuItems = [
    { icon: Home, label: 'Início', path: '/home' },
    { icon: PlusCircle, label: 'Registrar Item', path: '/registrar' },
    { icon: MessageCircle, label: 'Mensagens', path: '/chat' },
    { icon: User, label: 'Meu Perfil', path: '/perfil' },
    { icon: Info, label: 'Sobre', path: '#' }
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header do Sidebar */}
        <div className="bg-ufc-blue text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 mt-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <p className="font-semibold">Lucas Olivera</p>
              <p className="text-sm opacity-90">lucas.olivera@alu.ufc.br</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    if (item.path === '#') {
                      alert('Funcionalidade em desenvolvimento');
                      onClose();
                    } else {
                      handleNavigation(item.path);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-ufc-blue/10 hover:text-ufc-blue rounded-lg transition-colors group"
                >
                  <item.icon className="text-gray-600 group-hover:text-ufc-blue" size={22} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer - Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={22} />
            <span className="font-medium">Sair</span>
          </button>
        </div>

        {/* App Info */}
        <div className="absolute bottom-20 left-0 right-0 px-4 text-center text-xs text-gray-500">
          <p>UFC Achados e Perdidos</p>
          <p>Campus Russas - v1.0</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
