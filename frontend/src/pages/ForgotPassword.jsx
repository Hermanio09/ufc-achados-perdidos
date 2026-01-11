import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validação
    if (!email) {
      setError('Digite seu email');
      setLoading(false);
      return;
    }

    if (!email.includes('@alu.ufc.br')) {
      setError('Use seu email institucional (@alu.ufc.br)');
      setLoading(false);
      return;
    }

    try {
      // Aqui será feita a chamada para a API
      // Por enquanto, simula envio
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Erro ao enviar email. Tente novamente.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col" style={{background: 'linear-gradient(to bottom, #004C8C, #0066CC)'}}>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <CheckCircle size={64} className="mx-auto" style={{color: '#28A745'}} />
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{color: '#333333'}}>Email Enviado!</h2>
            <p className="mb-6" style={{color: '#666666'}}>
              Enviamos um link de recuperação para <strong>{email}</strong>
            </p>
            <p className="text-sm mb-8" style={{color: '#666666'}}>
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
            <Link to="/">
              <Button fullWidth>
                VOLTAR PARA LOGIN
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{background: 'linear-gradient(to bottom, #004C8C, #0066CC)'}}>
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Voltar</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-t-[2rem] p-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2" style={{color: '#333333'}}>Esqueceu sua senha?</h1>
            <p className="text-sm" style={{color: '#666666'}}>
              Digite seu email institucional e enviaremos um link para recuperação de senha.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email institucional"
              type="email"
              name="email"
              placeholder="exemplo@alu.ufc.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
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
              {loading ? 'ENVIANDO...' : 'ENVIAR LINK DE RECUPERAÇÃO'}
            </Button>
          </form>

          <div className="mt-8 p-4 rounded-lg" style={{backgroundColor: '#E3F2FD'}}>
            <p className="text-sm" style={{color: '#333333'}}>
              <strong>Dica:</strong> Se não receber o email em alguns minutos, verifique sua pasta de spam.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white text-center pb-6 text-xs" style={{color: '#666666'}}>
        <p>Projeto Acadêmico - Desenvolvimento Web</p>
        <p className="mt-1">UFC Campus Russas - 2026</p>
      </div>
    </div>
  );
};

export default ForgotPassword;
