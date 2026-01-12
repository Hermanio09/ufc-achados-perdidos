// Middleware para verificar se usuário é staff ou admin
exports.isStaff = (req, res, next) => {
  if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas funcionários podem acessar esta rota.'
    });
  }
};

// Middleware para verificar se usuário é admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores podem acessar esta rota.'
    });
  }
};
