const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const companyController = require('../controllers/companyController');
const { auth, checkUserType } = require('../config/auth');

// @route   GET api/companies
// @desc    Obter todas as empresas
// @access  Private (Admin)
router.get('/', auth, checkUserType(['admin']), companyController.getCompanies);

// @route   GET api/companies/:id
// @desc    Obter uma empresa específica
// @access  Private (Admin)
router.get('/:id', auth, checkUserType(['admin']), companyController.getCompany);

// @route   POST api/companies
// @desc    Criar uma nova empresa
// @access  Private (Admin)
router.post(
  '/',
  [
    auth,
    checkUserType(['admin']),
    [
      check('name', 'Nome é obrigatório').not().isEmpty(),
      check('cnpj', 'CNPJ é obrigatório e deve ter 14 dígitos').isLength({ min: 14, max: 14 }),
      check('address', 'Endereço é obrigatório').not().isEmpty(),
      check('phone', 'Telefone é obrigatório').not().isEmpty(),
      check('email', 'Email é obrigatório e deve ser válido').isEmail()
    ]
  ],
  companyController.createCompany
);

// @route   PUT api/companies/:id
// @desc    Atualizar uma empresa
// @access  Private (Admin)
router.put(
  '/:id',
  [
    auth,
    checkUserType(['admin']),
    [
      check('name', 'Nome é obrigatório').not().isEmpty(),
      check('cnpj', 'CNPJ é obrigatório e deve ter 14 dígitos').isLength({ min: 14, max: 14 }),
      check('address', 'Endereço é obrigatório').not().isEmpty(),
      check('phone', 'Telefone é obrigatório').not().isEmpty(),
      check('email', 'Email é obrigatório e deve ser válido').isEmail()
    ]
  ],
  companyController.updateCompany
);

// @route   DELETE api/companies/:id
// @desc    Desativar uma empresa
// @access  Private (Admin)
router.delete('/:id', auth, checkUserType(['admin']), companyController.deleteCompany);

module.exports = router; 