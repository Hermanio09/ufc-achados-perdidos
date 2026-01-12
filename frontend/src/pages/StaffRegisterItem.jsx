import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Shield } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { createItem } from '../services/api';

const StaffRegisterItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
    inPortaria: true // Staff items default to portaria
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Verificar se é staff
  const isStaff = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.role === 'staff' || user.role === 'admin';
    }
    return false;
  };

  // Redirecionar se não for staff
  if (!isStaff()) {
    navigate('/home');
    return null;
  }

  const categories = [
    'eletronicos',
    'documentos',
    'acessorios',
    'roupas',
    'livros',
    'outros'
  ];

  const categoryLabels = {
    eletronicos: 'Eletrônicos',
    documentos: 'Documentos',
    acessorios: 'Acessórios',
    roupas: 'Roupas',
    livros: 'Livros',
    outros: 'Outros'
  };

  const locations = [
    'Biblioteca',
    'Cantina',
    'Sala de Aula',
    'Laboratório',
    'Corredor',
    'Banheiro',
    'Estacionamento',
    'Portaria',
    'Quadra',
    'Outro'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validações
    if (!formData.title || !formData.category || !formData.location || !formData.description) {
      setError('Preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('location', formData.location);
      data.append('description', formData.description);
      data.append('type', 'found'); // Staff registra apenas itens encontrados
      data.append('inPortaria', formData.inPortaria);

      if (image) {
        data.append('image', image);
      }

      const response = await createItem(data);

      if (response.success) {
        alert('Item registrado com sucesso na portaria!');
        navigate('/staff/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registrar item');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-ufc-blue text-white p-4 flex items-center justify-between">
        <button onClick={() => navigate('/staff/dashboard')} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2">
            <Shield size={20} />
            <h1 className="font-semibold">Registrar Item (Staff)</h1>
          </div>
          <p className="text-xs opacity-90">Registro manual de item encontrado</p>
        </div>
        <div className="w-10"></div>
      </header>

      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Informação Staff */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Atenção:</strong> Este formulário é para registrar itens encontrados que foram
              entregues diretamente na portaria. O item será automaticamente marcado como "Na Portaria".
            </p>
          </div>

          {/* Foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto do Item (opcional)
            </label>
            <div className="relative">
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="photo"
                className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-ufc-blue transition-colors bg-white"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <Camera size={40} className="mx-auto text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Clique para adicionar foto</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Título */}
          <Input
            label="Título do Item *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Celular Samsung Galaxy"
            required
          />

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufc-blue"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryLabels[cat]}
                </option>
              ))}
            </select>
          </div>

          {/* Local */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Local onde foi encontrado *
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufc-blue"
              required
            >
              <option value="">Selecione o local</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição Detalhada *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o item com o máximo de detalhes possível: cor, modelo, marca, características específicas..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufc-blue min-h-[120px]"
              required
            />
          </div>

          {/* Checkbox: Item na portaria */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="inPortaria"
                checked={formData.inPortaria}
                onChange={handleCheckboxChange}
                className="mt-1 w-5 h-5 text-ufc-blue rounded focus:ring-2 focus:ring-ufc-blue"
              />
              <div>
                <span className="font-medium text-gray-900">Item está na portaria</span>
                <p className="text-sm text-gray-600 mt-1">
                  Marque se o item já foi recebido e está guardado na portaria
                </p>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <div className="space-y-3">
            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'REGISTRAR ITEM'}
            </Button>

            <button
              type="button"
              onClick={() => navigate('/staff/dashboard')}
              className="w-full py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffRegisterItem;
