const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TicketHistory = sequelize.define('TicketHistory', {
  ticket: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Tickets',
      key: 'id'
    }
  },
  field: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  oldValue: {
    type: DataTypes.STRING,
    allowNull: true
  },
  newValue: {
    type: DataTypes.STRING,
    allowNull: true
  },
  changedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  changeType: {
    type: DataTypes.ENUM('create', 'update', 'delete', 'status_change', 'assignment'),
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = TicketHistory; 