const Notification = require('../models/Notification');

// @desc    Criar notificação (função auxiliar)
exports.createNotification = async (userId, type, title, message, item = null, conversation = null) => {
  try {
    await Notification.create({
      user: userId,
      type,
      title,
      message,
      item,
      conversation
    });
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
  }
};

// @desc    Listar notificações do usuário
// @route   GET /api/notifications
// @access  Private
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate('item', 'title category')
      .populate('conversation')
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      read: false
    });

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar notificações',
      error: error.message
    });
  }
};

// @desc    Marcar notificação como lida
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificação não encontrada'
      });
    }

    // Verificar se a notificação pertence ao usuário
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    notification.read = true;
    await notification.save();

    res.json({
      success: true,
      message: 'Notificação marcada como lida',
      data: notification
    });
  } catch (error) {
    console.error('Erro ao marcar notificação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao marcar notificação',
      error: error.message
    });
  }
};

// @desc    Marcar todas como lidas
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'Todas as notificações foram marcadas como lidas'
    });
  } catch (error) {
    console.error('Erro ao marcar notificações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao marcar notificações',
      error: error.message
    });
  }
};

// @desc    Deletar notificação
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificação não encontrada'
      });
    }

    // Verificar se a notificação pertence ao usuário
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Notificação removida'
    });
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar notificação',
      error: error.message
    });
  }
};
