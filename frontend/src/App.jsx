import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import ItemDetails from './pages/ItemDetails';
import RegisterChoice from './pages/RegisterChoice';
import RegisterFound from './pages/RegisterFound';

function App() {
  // Simples verificação de autenticação
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Componente para proteger rotas
  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Login />} />

        {/* Rotas protegidas */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/item/:id"
          element={
            <PrivateRoute>
              <ItemDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/registrar"
          element={
            <PrivateRoute>
              <RegisterChoice />
            </PrivateRoute>
          }
        />
        <Route
          path="/registrar/encontrei"
          element={
            <PrivateRoute>
              <RegisterFound />
            </PrivateRoute>
          }
        />

        {/* Redirecionar para home se autenticado */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated() ? '/home' : '/'} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
