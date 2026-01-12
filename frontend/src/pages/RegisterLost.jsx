import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Calendar, MapPin, Package, FileText, Upload } from 'lucide-react';
import { createItem } from '../services/api';

const RegisterLost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    lostDate: '',
    lostLocation: '',
    image: null
  });

  const categories = [
    'Eletrônicos',
    'Documentos',
    'Acessórios',
    'Roupas',
    'Livros',
    'Chaves',
    'Carteiras',
    'Outros'
  ];

  const locations = [
    'Sala de Aula',
    'Biblioteca',
    'Cantina',
    'Banheiro',
    'Laboratório',
    'Pátio',
    'Estacionamento',
    'Outro'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('A imagem deve ter no máximo 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validações
    if (!formData.title || !formData.category || !formData.description) {
      setError('Preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('type', 'lost'); // Tipo: perdido

      if (formData.lostDate) {
        data.append('lostDate', formData.lostDate);
      }
      if (formData.lostLocation) {
        data.append('lostLocation', formData.lostLocation);
      }
      if (formData.image) {
        data.append('image', formData.image);
      }

      await createItem(data);

      setSuccess(true);
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registrar item perdido');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Registrado!</h2>
          <p className="text-gray-600 mb-4">
            Seu item perdido foi cadastrado com sucesso. Você será notificado se alguém encontrá-lo.
          </p>
          <div className="text-sm text-gray-500">
            Redirecionando para a página inicial...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-ufc-blue text-white shadow-lg">
        <div className="p-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-lg">Registrar Item Perdido</h1>
          <div className="w-8"></div>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto space-y-6">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título do item <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Fone JBL Preto"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufc-blue"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufc-blue appearance-none"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descreva as características do item (cor, marca, modelo, etc.)"
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufc-blue resize-none"
            required
          />
        </div>

        {/* Lost Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data em que perdeu (opcional)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              name="lostDate"
              value={formData.lostDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufc-blue"
            />
          </div>
        </div>

        {/* Lost Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Onde perdeu? (opcional)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              name="lostLocation"
              value={formData.lostLocation}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufc-blue appearance-none"
            >
              <option value="">Selecione um local</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto do item (opcional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-ufc-blue transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              {formData.image ? (
                <div>
                  <Camera className="mx-auto text-green-600 mb-2" size={32} />
                  <p className="text-sm text-gray-700 font-medium">{formData.image.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Clique para trocar</p>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-700 font-medium">Clique para adicionar foto</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ufc-blue text-white py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'REGISTRANDO...' : 'REGISTRAR ITEM PERDIDO'}
        </button>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Dica:</strong> Quanto mais detalhada a descrição, maiores as chances de recuperar seu item!
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterLost;
