const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// @route   GET api/users
// @desc    Obter todos os usuários
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   GET api/users/:id
// @desc    Obter usuário por ID
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    res.status(500).send('Erro no servidor');
  }
};

// @route   POST api/users
// @desc    Criar um usuário
// @access  Private/Admin
exports.createUser = async (req, res) => {
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

    // Retornar usuário sem a senha
    const userResponse = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json(userResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   PUT api/users/:id
// @desc    Atualizar um usuário
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, userType, company } = req.body;

  try {
    // Verificar se o usuário existe
    let user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    // Verificar se o email já está em uso por outro usuário
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email já está em uso' });
      }
    }

    // Atualizar campos
    const updateData = {
      name: name || user.name,
      email: email || user.email,
      userType: userType || user.userType,
      company: company !== undefined ? company : user.company
    };

    // Atualizar senha apenas se fornecida
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Atualizar usuário
    await user.update(updateData);

    // Retornar usuário atualizado sem a senha
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    res.status(500).send('Erro no servidor');
  }
};

// @route   DELETE api/users/:id
// @desc    Excluir um usuário
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    // Verificar se o usuário existe
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    // Não permitir que um usuário exclua a si mesmo
    if (user.id === req.user.id) {
      return res.status(400).json({ msg: 'Não é possível excluir seu próprio usuário' });
    }

    // Excluir usuário
    await user.destroy();

    res.json({ msg: 'Usuário removido' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    res.status(500).send('Erro no servidor');
  }
}; 