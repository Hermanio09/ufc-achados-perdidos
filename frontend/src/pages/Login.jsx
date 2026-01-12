import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, GraduationCap } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { login as apiLogin } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validação básica
    if (!formData.email || !formData.password) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@alu.ufc.br')) {
      setError('Use seu email institucional (@alu.ufc.br)');
      setLoading(false);
      return;
    }

    try {
      const response = await apiLogin({
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        navigate('/home');
      } else {
        setError(response.message || 'Erro ao fazer login');
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{background: 'linear-gradient(to bottom, #004C8C, #0066CC)'}}>
      {/* Header */}
      <div className="pt-16 pb-8 text-center text-white">
        <GraduationCap size={48} className="mx-auto mb-4" />
        <h1 className="text-3xl font-bold">UFC ACHADOS E PERDIDOS</h1>
        <p className="text-sm mt-2 opacity-90">Campus Russas</p>
      </div>

      {/* Form Container */}
      <div className="flex-1 bg-white rounded-t-[2rem] p-8">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          <Input
            label="Email institucional"
            type="email"
            name="email"
            placeholder="exemplo@alu.ufc.br"
            value={formData.email}
            onChange={handleChange}
            icon={Mail}
            required
          />

          <Input
            label="Senha"
            type="password"
            name="password"
            placeholder="••••••••••"
            value={formData.password}
            onChange={handleChange}
            icon={Lock}
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 px-4 py-3 rounded-lg text-sm" style={{color: '#DC3545'}}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'ENTRAR'}
          </Button>

          <div className="text-center">
            <Link
              to="/recuperar-senha"
              className="text-sm hover:underline"
              style={{color: '#0066CC'}}
            >
              Esqueci minha senha
            </Link>
          </div>
        </form>

        <div className="max-w-md mx-auto mt-6">
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <Link to="/cadastro">
            <Button type="button" variant="secondary" fullWidth>
              CRIAR CONTA
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white text-center pb-6 text-xs text-gray-500">
        <p>Projeto Acadêmico - Desenvolvimento Web</p>
        <p className="mt-1">UFC Campus Russas - 2026</p>
      </div>
    </div>
  );
};

export default Login;
