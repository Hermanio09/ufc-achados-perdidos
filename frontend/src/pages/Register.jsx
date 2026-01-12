import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Hash, BookOpen, Calendar, GraduationCap, Briefcase, Key } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { register as apiRegister } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('student'); // 'student' ou 'staff'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    matricula: '',
    curso: '',
    semestre: '',
    codigoAcesso: '' // Para funcionários
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Código de acesso da portaria (fixo para apresentação)
  const CODIGO_PORTARIA = 'PORTARIA2024';

  // Lista de cursos do Campus Russas
  const cursos = [
    'Engenharia de Software',
    'Ciência da Computação',
    'Engenharia de Produção',
    'Engenharia Mecânica',
    'Engenharia Civil'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setError('');
    // Limpa campos ao trocar tipo
    if (type === 'staff') {
      setFormData({
        ...formData,
        matricula: '',
        curso: '',
        semestre: '',
        email: '' // Limpa email pois a validação é diferente
      });
    } else {
      setFormData({
        ...formData,
        codigoAcesso: '',
        email: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validações básicas
    if (!formData.name || !formData.email || !formData.password) {
      setError('Preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    // Validação de email baseada no tipo de usuário
    if (userType === 'student') {
      if (!formData.email.includes('@alu.ufc.br')) {
        setError('Estudantes devem usar email @alu.ufc.br');
        setLoading(false);
        return;
      }

      // Validações específicas para estudantes
      if (!formData.matricula || !formData.curso) {
        setError('Estudantes devem preencher matrícula e curso');
        setLoading(false);
        return;
      }
    } else {
      // Validações para funcionários
      if (!formData.email.includes('@ufc.br') || formData.email.includes('@alu.ufc.br')) {
        setError('Funcionários devem usar email institucional @ufc.br (não @alu.ufc.br)');
        setLoading(false);
        return;
      }

      if (!formData.codigoAcesso) {
        setError('Digite o código de acesso da portaria');
        setLoading(false);
        return;
      }

      if (formData.codigoAcesso !== CODIGO_PORTARIA) {
        setError('Código de acesso inválido. Contate o administrador.');
        setLoading(false);
        return;
      }
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        matricula: formData.matricula,
        curso: formData.curso,
        semestre: formData.semestre,
        role: userType === 'staff' ? 'staff' : 'student'
      };

      // Se for staff, enviar código de acesso
      if (userType === 'staff') {
        userData.accessCode = formData.codigoAcesso;
      }

      const response = await apiRegister(userData);

      if (response.success) {
        navigate('/home');
      } else {
        setError(response.message || 'Erro ao criar conta');
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{background: 'linear-gradient(to bottom, #004C8C, #0066CC)'}}>
      {/* Header */}
      <div className="pt-12 pb-6 text-center text-white">
        <GraduationCap size={40} className="mx-auto mb-3" />
        <h1 className="text-2xl font-bold">CRIAR CONTA</h1>
        <p className="text-sm mt-2 opacity-90">UFC Achados e Perdidos</p>
      </div>

      {/* Form Container */}
      <div className="flex-1 bg-white rounded-t-[2rem] p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">

          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3" style={{color: '#333333'}}>
              Tipo de usuário <span style={{color: '#DC3545'}}>*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleUserTypeChange('student')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  userType === 'student' ? 'border-blue-500 shadow-md' : 'border-gray-300'
                }`}
                style={{
                  backgroundColor: userType === 'student' ? '#E3F2FD' : 'white',
                  borderColor: userType === 'student' ? '#004C8C' : '#E0E0E0'
                }}
              >
                <GraduationCap size={24} className="mx-auto mb-2" style={{color: userType === 'student' ? '#004C8C' : '#666666'}} />
                <span className="text-sm font-medium" style={{color: userType === 'student' ? '#004C8C' : '#666666'}}>
                  Estudante
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleUserTypeChange('staff')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  userType === 'staff' ? 'border-blue-500 shadow-md' : 'border-gray-300'
                }`}
                style={{
                  backgroundColor: userType === 'staff' ? '#E3F2FD' : 'white',
                  borderColor: userType === 'staff' ? '#004C8C' : '#E0E0E0'
                }}
              >
                <Briefcase size={24} className="mx-auto mb-2" style={{color: userType === 'staff' ? '#004C8C' : '#666666'}} />
                <span className="text-sm font-medium" style={{color: userType === 'staff' ? '#004C8C' : '#666666'}}>
                  Funcionário
                </span>
              </button>
            </div>
          </div>

          <Input
            label="Nome completo"
            type="text"
            name="name"
            placeholder="João Silva"
            value={formData.name}
            onChange={handleChange}
            icon={User}
            required
          />

          <Input
            label={userType === 'student' ? 'Email institucional (@alu.ufc.br)' : 'Email institucional (@ufc.br)'}
            type="email"
            name="email"
            placeholder={userType === 'student' ? 'exemplo@alu.ufc.br' : 'exemplo@ufc.br'}
            value={formData.email}
            onChange={handleChange}
            icon={Mail}
            required
          />

          {/* Campos específicos para ESTUDANTES */}
          {userType === 'student' && (
            <>
              <Input
                label="Matrícula"
                type="text"
                name="matricula"
                placeholder="123456"
                value={formData.matricula}
                onChange={handleChange}
                icon={Hash}
                required
              />

              <div className="w-full">
                <label className="block text-sm font-medium mb-2" style={{color: '#333333'}}>
                  Curso <span style={{color: '#DC3545'}}>*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} style={{color: '#666666'}} />
                  <select
                    name="curso"
                    value={formData.curso}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 appearance-none"
                    style={{
                      borderColor: '#E0E0E0',
                      color: '#333333',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Selecione seu curso</option>
                    {cursos.map((curso) => (
                      <option key={curso} value={curso}>
                        {curso}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Semestre (opcional)"
                type="text"
                name="semestre"
                placeholder="5"
                value={formData.semestre}
                onChange={handleChange}
                icon={Calendar}
              />
            </>
          )}

          {/* Campos específicos para FUNCIONÁRIOS */}
          {userType === 'staff' && (
            <>
              <Input
                label="Código de acesso da portaria"
                type="password"
                name="codigoAcesso"
                placeholder="Digite o código fornecido"
                value={formData.codigoAcesso}
                onChange={handleChange}
                icon={Key}
                required
              />

              <div className="p-4 rounded-lg" style={{backgroundColor: '#FFF3CD', borderLeft: '4px solid #FFC107'}}>
                <p className="text-sm font-medium mb-1" style={{color: '#856404'}}>
                  Atenção Funcionários:
                </p>
                <ul className="text-xs space-y-1" style={{color: '#856404'}}>
                  <li>• Use seu email institucional @ufc.br</li>
                  <li>• Digite o código fornecido pela administração</li>
                  <li>• Em caso de dúvidas, contate o suporte</li>
                </ul>
              </div>
            </>
          )}

          <Input
            label="Senha"
            type="password"
            name="password"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={handleChange}
            icon={Lock}
            required
          />

          <Input
            label="Confirmar senha"
            type="password"
            name="confirmPassword"
            placeholder="Digite a senha novamente"
            value={formData.confirmPassword}
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
            {loading ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
          </Button>

          <div className="text-center pt-4">
            <span className="text-sm" style={{color: '#666666'}}>Já tem uma conta? </span>
            <Link
              to="/"
              className="text-sm font-medium hover:underline"
              style={{color: '#0066CC'}}
            >
              Fazer login
            </Link>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="bg-white text-center pb-4 text-xs" style={{color: '#666666'}}>
        <p>Projeto Acadêmico - Desenvolvimento Web</p>
        <p className="mt-1">UFC Campus Russas - 2026</p>
      </div>
    </div>
  );
};

export default Register;
