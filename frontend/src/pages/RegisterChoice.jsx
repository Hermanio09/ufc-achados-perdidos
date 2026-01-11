import { useNavigate } from 'react-router-dom';
import { Frown, PartyPopper, Bell } from 'lucide-react';

const RegisterChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-ufc-blue text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="font-bold text-lg">UFC ACHADOS E PERDIDOS</h1>
            <p className="text-xs opacity-90">Campus Russas</p>
          </div>
          <button className="p-2">
            <Bell size={24} />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">O que você deseja fazer?</h2>
        <p className="text-gray-600 mb-8">Escolha uma das opções abaixo</p>

        {/* Lost Item Card */}
        <button
          onClick={() => navigate('/registrar/perdi')}
          className="w-full bg-white rounded-xl shadow-md p-8 mb-4 hover:shadow-lg transition-all duration-200 text-left"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <Frown size={32} className="text-ufc-blue" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">PERDI ALGO</h3>
              <p className="text-gray-600 text-sm">
                Cadastre o item que você perdeu e seja notificado quando for encontrado
              </p>
            </div>
          </div>
        </button>

        {/* Found Item Card */}
        <button
          onClick={() => navigate('/registrar/encontrei')}
          className="w-full bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-200 text-left"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
              <PartyPopper size={32} className="text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">ENCONTREI ALGO</h3>
              <p className="text-gray-600 text-sm">
                Registre o item encontrado e ajude alguém a recuperá-lo
              </p>
            </div>
          </div>
        </button>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Dica:</strong> Tire uma foto clara do item para facilitar a identificação!
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterChoice;
