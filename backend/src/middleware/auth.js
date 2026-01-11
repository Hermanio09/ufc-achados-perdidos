const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Pegar token do header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key-dev');

      // Buscar usuário pelo ID do token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      next();
    } catch (error) {
      console.error('Erro na autenticação:', error);
      return res.status(401).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acesso negado. Token não fornecido'
    });
  }
};

// Middleware para verificar se é admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores'
    });
  }
};

// Middleware para verificar se é staff (portaria)
const staff = (req, res, next) => {
  if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas funcionários da portaria'
    });
  }
};

module.exports = { protect, admin, staff };
