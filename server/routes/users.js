const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { auth, checkUserType } = require('../config/auth');

// @route   GET api/users
// @desc    Obter todos os usuários
// @access  Private/Admin
router.get('/', [auth, checkUserType(['admin'])], userController.getUsers);

// @route   GET api/users/:id
// @desc    Obter usuário por ID
// @access  Private/Admin
router.get('/:id', [auth, checkUserType(['admin'])], userController.getUserById);

// @route   POST api/users
// @desc    Criar um usuário
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    checkUserType(['admin']),
    check('name', 'Nome é obrigatório').not().isEmpty(),
    check('email', 'Por favor, inclua um email válido').isEmail(),
    check('password', 'Por favor, digite uma senha com 6 ou mais caracteres').isLength({ min: 6 })
  ],
  userController.createUser
);

// @route   PUT api/users/:id
// @desc    Atualizar um usuário
// @access  Private/Admin
router.put(
  '/:id',
  [
    auth,
    checkUserType(['admin']),
    check('name', 'Nome é obrigatório').not().isEmpty(),
    check('email', 'Por favor, inclua um email válido').isEmail()
  ],
  userController.updateUser
);

// @route   DELETE api/users/:id
// @desc    Excluir um usuário
// @access  Private/Admin
router.delete('/:id', [auth, checkUserType(['admin'])], userController.deleteUser);

module.exports = router; 