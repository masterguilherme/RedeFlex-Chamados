const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  /**
   * Cria uma notificação para um usuário específico
   * @param {Object} data - Dados da notificação
   * @param {number} data.userId - ID do usuário destinatário
   * @param {string} data.title - Título da notificação
   * @param {string} data.message - Mensagem da notificação
   * @param {string} data.type - Tipo da notificação (info, success, warning, error)
   * @param {string} [data.link] - Link opcional para navegação
   * @returns {Promise<Notification>}
   */
  static async createNotification(data) {
    const { userId, title, message, type = 'info', link } = data;

    return await Notification.create({
      userId,
      title,
      message,
      type,
      link
    });
  }

  /**
   * Cria notificações para múltiplos usuários
   * @param {Object} data - Dados da notificação
   * @param {number[]} data.userIds - IDs dos usuários destinatários
   * @param {string} data.title - Título da notificação
   * @param {string} data.message - Mensagem da notificação
   * @param {string} data.type - Tipo da notificação
   * @param {string} [data.link] - Link opcional para navegação
   * @returns {Promise<Notification[]>}
   */
  static async createNotificationForUsers(data) {
    const { userIds, title, message, type = 'info', link } = data;

    const notifications = await Promise.all(
      userIds.map(userId =>
        Notification.create({
          userId,
          title,
          message,
          type,
          link
        })
      )
    );

    return notifications;
  }

  /**
   * Cria notificação para todos os administradores
   * @param {Object} data - Dados da notificação
   * @param {string} data.title - Título da notificação
   * @param {string} data.message - Mensagem da notificação
   * @param {string} data.type - Tipo da notificação
   * @param {string} [data.link] - Link opcional para navegação
   * @returns {Promise<Notification[]>}
   */
  static async notifyAdmins(data) {
    const { title, message, type = 'info', link } = data;

    const admins = await User.findAll({
      where: { userType: 'admin' }
    });

    const adminIds = admins.map(admin => admin.id);

    return await this.createNotificationForUsers({
      userIds: adminIds,
      title,
      message,
      type,
      link
    });
  }

  /**
   * Cria notificação para todos os prestadores de serviço
   * @param {Object} data - Dados da notificação
   * @param {string} data.title - Título da notificação
   * @param {string} data.message - Mensagem da notificação
   * @param {string} data.type - Tipo da notificação
   * @param {string} [data.link] - Link opcional para navegação
   * @returns {Promise<Notification[]>}
   */
  static async notifyProviders(data) {
    const { title, message, type = 'info', link } = data;

    const providers = await User.findAll({
      where: { userType: 'provider' }
    });

    const providerIds = providers.map(provider => provider.id);

    return await this.createNotificationForUsers({
      userIds: providerIds,
      title,
      message,
      type,
      link
    });
  }

  /**
   * Marca uma notificação como lida
   * @param {number} notificationId - ID da notificação
   * @param {number} userId - ID do usuário
   * @returns {Promise<Notification>}
   */
  static async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      throw new Error('Notificação não encontrada');
    }

    notification.read = true;
    await notification.save();

    return notification;
  }

  /**
   * Marca todas as notificações de um usuário como lidas
   * @param {number} userId - ID do usuário
   * @returns {Promise<number>} - Número de notificações atualizadas
   */
  static async markAllAsRead(userId) {
    const [updatedCount] = await Notification.update(
      { read: true },
      {
        where: {
          userId,
          read: false
        }
      }
    );

    return updatedCount;
  }

  /**
   * Remove uma notificação
   * @param {number} notificationId - ID da notificação
   * @param {number} userId - ID do usuário
   * @returns {Promise<boolean>}
   */
  static async deleteNotification(notificationId, userId) {
    const deleted = await Notification.destroy({
      where: {
        id: notificationId,
        userId
      }
    });

    return deleted > 0;
  }

  /**
   * Obtém todas as notificações de um usuário
   * @param {number} userId - ID do usuário
   * @returns {Promise<Notification[]>}
   */
  static async getUserNotifications(userId) {
    return await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Obtém as notificações não lidas de um usuário
   * @param {number} userId - ID do usuário
   * @returns {Promise<Notification[]>}
   */
  static async getUnreadNotifications(userId) {
    return await Notification.findAll({
      where: {
        userId,
        read: false
      },
      order: [['createdAt', 'DESC']]
    });
  }
}

module.exports = NotificationService; 