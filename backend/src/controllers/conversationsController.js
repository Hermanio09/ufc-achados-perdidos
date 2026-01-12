const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Item = require('../models/Item');

// @desc    Criar ou buscar conversa existente
// @route   POST /api/conversations
// @access  Private
exports.createOrGetConversation = async (req, res) => {
  try {
    const { itemId } = req.body;
    const currentUserId = req.user.id;

    // Buscar o item
    const item = await Item.findById(itemId).populate('user', 'name email');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item não encontrado'
      });
    }

    const itemOwnerId = item.user._id.toString();

    // Não permitir conversa consigo mesmo
    if (currentUserId === itemOwnerId) {
      return res.status(400).json({
        success: false,
        message: 'Você não pode conversar consigo mesmo'
      });
    }

    // Ordenar participantes para garantir consistência
    const participants = [currentUserId, itemOwnerId].sort();

    // Buscar conversa existente
    let conversation = await Conversation.findOne({
      participants: { $all: participants },
      item: itemId
    })
      .populate('participants', 'name email reputation')
      .populate('item', 'title category');

    // Se não existe, criar nova
    if (!conversation) {
      conversation = await Conversation.create({
        participants,
        item: itemId,
        lastMessage: 'Nova conversa iniciada',
        lastMessageAt: Date.now()
      });

      // Popular os campos
      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email reputation')
        .populate('item', 'title category');
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Erro ao criar/buscar conversa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar conversa',
      error: error.message
    });
  }
};

// @desc    Listar conversas do usuário
// @route   GET /api/conversations
// @access  Private
exports.getMyConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate('participants', 'name email reputation')
      .populate('item', 'title category')
      .sort({ lastMessageAt: -1 });

    res.json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar conversas',
      error: error.message
    });
  }
};

// @desc    Listar mensagens de uma conversa
// @route   GET /api/conversations/:id/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const conversationId = req.params.id;

    // Verificar se o usuário faz parte da conversa
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversa não encontrada'
      });
    }

    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem acesso a esta conversa'
      });
    }

    // Buscar mensagens
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 }); // Ordenar do mais antigo para o mais recente

    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar mensagens',
      error: error.message
    });
  }
};

// @desc    Enviar mensagem
// @route   POST /api/conversations/:id/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Texto da mensagem é obrigatório'
      });
    }

    // Verificar se o usuário faz parte da conversa
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversa não encontrada'
      });
    }

    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem acesso a esta conversa'
      });
    }

    // Criar mensagem
    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      text: text.trim()
    });

    // Atualizar última mensagem na conversa
    conversation.lastMessage = text.trim().substring(0, 100); // Limitar a 100 caracteres
    conversation.lastMessageAt = Date.now();
    await conversation.save();

    // Popular dados do sender
    await message.populate('sender', 'name email');

    res.status(201).json({
      success: true,
      message: 'Mensagem enviada com sucesso',
      data: message
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar mensagem',
      error: error.message
    });
  }
};
