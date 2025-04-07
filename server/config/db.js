const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuração do Sequelize com pool de conexões
const sequelize = new Sequelize(
  process.env.DB_NAME || 'sistema_chamados',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5, // número máximo de conexões no pool
      min: 0, // número mínimo de conexões no pool
      acquire: 30000, // tempo máximo em ms que o pool tentará obter conexão antes de lançar erro
      idle: 10000 // tempo máximo em ms que uma conexão pode ficar ociosa antes de ser liberada
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Função para testar a conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
};

// Função para sincronizar os modelos com o banco de dados
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Banco de dados sincronizado com sucesso.');
  } catch (error) {
    console.error('Erro ao sincronizar banco de dados:', error);
  }
};

// Função para otimizar consultas
const optimizeQuery = (query) => {
  // Adicionar índices para campos frequentemente consultados
  const indexes = {
    tickets: [
      { fields: ['status'] },
      { fields: ['priority'] },
      { fields: ['createdAt'] },
      { fields: ['assignedToId'] },
      { fields: ['companyId'] }
    ],
    users: [
      { fields: ['email'] },
      { fields: ['type'] }
    ],
    companies: [
      { fields: ['cnpj'] }
    ]
  };

  // Adicionar índices aos modelos
  Object.entries(indexes).forEach(([modelName, modelIndexes]) => {
    const model = sequelize.models[modelName];
    if (model) {
      modelIndexes.forEach(index => {
        model.addIndex(index);
      });
    }
  });

  return query;
};

// Função para cache de consultas
const cacheQuery = async (key, query, ttl = 300) => {
  // Implementar cache com Redis ou similar
  // Por enquanto, retorna a query sem cache
  return query;
};

testConnection();

module.exports = sequelize; 