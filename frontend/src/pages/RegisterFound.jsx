import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Image, Settings } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const RegisterFound = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
    inPortaria: true
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    'Eletrônicos',
    'Documentos',
    'Chaves',
    'Acessórios',
    'Roupas',
    'Livros',
    'Outros'
  ];

  const locations = [
    'Biblioteca',
    'Cantina',
    'Sala de Aula',
    'Laboratório',
    'Corredor',
    'Banheiro',
    'Quadra',
    'Estacionamento',
    'Outro'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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

    if (!image) {
      alert('Por favor, adicione uma foto do item!');
      return;
    }

    // Aqui será feita a chamada para a API
    console.log('Registrando item:', formData, image);

    // Simula sucesso e redireciona
    navigate('/registro-sucesso');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-semibold">Encontrei algo</h1>
        <button className="p-2">
          <Settings size={24} />
        </button>
      </header>

      <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto">
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto do item <span className="text-danger">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-ufc-blue transition-colors">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-danger text-white p-2 rounded-full hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div>
                <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Adicionar foto do item</p>
                <p className="text-sm text-gray-500">Se tiver foto do item, ajuda na identificação</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            {!imagePreview && (
              <div className="mt-4 flex gap-4 justify-center">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex items-center gap-2 text-ufc-blue hover:text-ufc-blue-light"
                >
                  <Camera size={20} />
                  <span>Câmera</span>
                </label>
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex items-center gap-2 text-ufc-blue hover:text-ufc-blue-light"
                >
                  <Image size={20} />
                  <span>Galeria</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <Input
          label="O que você encontrou?"
          name="title"
          placeholder="Ex: Fone de ouvido JBL preto"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria <span className="text-danger">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufc-blue focus:border-transparent"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Onde encontrou? <span className="text-danger">*</span>
          </label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufc-blue focus:border-transparent"
            required
          >
            <option value="">Selecione o local</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Características específicas
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descreva detalhes que podem ajudar na identificação..."
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufc-blue focus:border-transparent resize-none"
          />
        </div>

        {/* Checkbox */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.inPortaria}
              onChange={(e) => setFormData({ ...formData, inPortaria: e.target.checked })}
              className="w-5 h-5 text-ufc-blue border-gray-300 rounded focus:ring-ufc-blue"
            />
            <span className="text-gray-700">Entreguei na portaria</span>
          </label>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>Notificação automática:</strong> Quando item similar for cadastrado como perdido, você será notificado!
          </p>
        </div>

        {/* Submit Button */}
        <Button type="submit" fullWidth size="lg">
          ✅ REGISTRAR ITEM
        </Button>
      </form>
    </div>
  );
};

export default RegisterFound;
