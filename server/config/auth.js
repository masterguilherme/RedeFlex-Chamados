const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'sistema_chamados_secret_key';

// Gerar token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '24h' });
};

// Middleware de autenticação
const auth = (req, res, next) => {
  // Obter token do header
  const token = req.header('x-auth-token');

  // Verificar se não há token
  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado. Token não fornecido.' });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Adicionar usuário ao request
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};

// Middleware para verificar tipo de usuário
const checkUserType = (types) => {
  return async (req, res, next) => {
    try {
      const User = require('../models/User');
      const user = await User.findByPk(req.user.id);
      
      if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado' });
      }
      
      if (!types.includes(user.userType)) {
        return res.status(403).json({ 
          msg: 'Acesso negado. Você não tem permissão para acessar este recurso.' 
        });
      }
      
      next();
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Erro no servidor' });
    }
  };
};

module.exports = { generateToken, auth, checkUserType }; 