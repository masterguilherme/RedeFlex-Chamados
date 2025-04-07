const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../config/auth');

// @route   POST api/auth/register
// @desc    Registrar um usuário
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Nome é obrigatório').not().isEmpty(),
    check('email', 'Por favor, inclua um email válido').isEmail(),
    check('password', 'Por favor, digite uma senha com 6 ou mais caracteres').isLength({ min: 6 })
  ],
  authController.register
);

// @route   POST api/auth/login
// @desc    Autenticar usuário e obter token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Por favor, inclua um email válido').isEmail(),
    check('password', 'Senha é obrigatória').exists()
  ],
  authController.login
);

// @route   GET api/auth/user
// @desc    Obter dados do usuário atual
// @access  Private
router.get('/user', auth, authController.getUser);

module.exports = router; 