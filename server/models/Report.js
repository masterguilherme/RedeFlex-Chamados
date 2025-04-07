const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('ticket', 'performance', 'satisfaction', 'custom'),
    allowNull: false
  },
  format: {
    type: DataTypes.ENUM('csv', 'excel', 'pdf'),
    allowNull: false
  },
  filters: {
    type: DataTypes.JSON,
    allowNull: true
  },
  fields: {
    type: DataTypes.JSON,
    allowNull: true
  },
  schedule: {
    type: DataTypes.JSON,
    allowNull: true
  },
  recipients: {
    type: DataTypes.JSON,
    allowNull: true
  },
  lastGenerated: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'reports',
  timestamps: true,
  indexes: [
    {
      fields: ['type']
    },
    {
      fields: ['createdBy']
    },
    {
      fields: ['active']
    }
  ]
});

module.exports = Report; 