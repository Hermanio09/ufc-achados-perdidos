const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: ['Eletrônicos', 'Documentos', 'Chaves', 'Acessórios', 'Roupas', 'Livros', 'Outros']
  },
  type: {
    type: String,
    required: true,
    enum: ['lost', 'found']
  },
  status: {
    type: String,
    enum: ['active', 'claimed', 'returned', 'archived'],
    default: 'active'
  },
  location: {
    type: String,
    required: [true, 'Local é obrigatório']
  },
  image: {
    type: String
  },
  inPortaria: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  claimedAt: {
    type: Date
  },
  returnedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para melhor performance
itemSchema.index({ type: 1, status: 1, createdAt: -1 });
itemSchema.index({ category: 1 });
itemSchema.index({ user: 1 });

module.exports = mongoose.model('Item', itemSchema);
