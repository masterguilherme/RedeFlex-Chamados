const Company = require('../models/Company');
const { validationResult } = require('express-validator');

// @route   GET api/companies
// @desc    Obter todas as empresas
// @access  Private (Admin)
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      where: { active: true },
      order: [['name', 'ASC']]
    });
    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   GET api/companies/:id
// @desc    Obter uma empresa específica
// @access  Private (Admin)
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    
    if (!company) {
      return res.status(404).json({ msg: 'Empresa não encontrada' });
    }
    
    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   POST api/companies
// @desc    Criar uma nova empresa
// @access  Private (Admin)
exports.createCompany = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, cnpj, address, phone, email } = req.body;

    // Verificar se já existe uma empresa com o mesmo CNPJ
    let company = await Company.findOne({ where: { cnpj } });
    if (company) {
      return res.status(400).json({ msg: 'Já existe uma empresa cadastrada com este CNPJ' });
    }

    // Criar nova empresa
    company = await Company.create({
      name,
      cnpj,
      address,
      phone,
      email
    });

    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   PUT api/companies/:id
// @desc    Atualizar uma empresa
// @access  Private (Admin)
exports.updateCompany = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, cnpj, address, phone, email } = req.body;
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({ msg: 'Empresa não encontrada' });
    }

    // Verificar se o novo CNPJ já existe em outra empresa
    if (cnpj !== company.cnpj) {
      const existingCompany = await Company.findOne({ where: { cnpj } });
      if (existingCompany) {
        return res.status(400).json({ msg: 'Já existe uma empresa cadastrada com este CNPJ' });
      }
    }

    // Atualizar empresa
    await company.update({
      name,
      cnpj,
      address,
      phone,
      email
    });

    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   DELETE api/companies/:id
// @desc    Desativar uma empresa
// @access  Private (Admin)
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({ msg: 'Empresa não encontrada' });
    }

    // Desativar empresa (soft delete)
    await company.update({ active: false });

    res.json({ msg: 'Empresa desativada com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
}; 