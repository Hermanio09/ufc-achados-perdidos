const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para melhor performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ item: 1 });
conversationSchema.index({ lastMessageAt: -1 });

// Garantir que uma conversa seja única entre 2 usuários sobre 1 item
conversationSchema.index({ participants: 1, item: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);
