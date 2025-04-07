const User = require('../models/User');
const { generateToken } = require('../config/auth');
const { validationResult } = require('express-validator');

// @route   POST api/auth/register
// @desc    Registrar um usuário
// @access  Public
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, userType, company } = req.body;

  try {
    // Verificar se o usuário já existe
    let user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }

    // Criar novo usuário
    user = await User.create({
      name,
      email,
      password,
      userType: userType || 'solicitante',
      company
    });

    // Gerar token JWT
    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   POST api/auth/login
// @desc    Autenticar usuário e obter token
// @access  Public
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    // Verificar se o usuário está ativo
    if (!user.active) {
      return res.status(400).json({ msg: 'Usuário desativado. Contate o administrador.' });
    }

    // Verificar senha
    const isMatch = await user.checkPassword(password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   GET api/auth/user
// @desc    Obter dados do usuário atual
// @access  Private
exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
}; 