const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    logging: config.db.logging,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Importar modelos
const User = require('../models/User');
const Company = require('../models/Company');
const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

// Definir relacionamentos
User.hasMany(Ticket, { foreignKey: 'requesterId' });
User.hasMany(Ticket, { foreignKey: 'assignedToId' });
User.hasMany(Comment, { foreignKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId' });

Company.hasMany(User);
Company.hasMany(Ticket);

Ticket.belongsTo(User, { as: 'requester', foreignKey: 'requesterId' });
Ticket.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });
Ticket.belongsTo(Company);
Ticket.hasMany(Comment);

Comment.belongsTo(User);
Comment.belongsTo(Ticket);

Notification.belongsTo(User);

module.exports = sequelize; 