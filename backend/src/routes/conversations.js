const express = require('express');
const router = express.Router();
const {
  createOrGetConversation,
  getMyConversations,
  getMessages,
  sendMessage
} = require('../controllers/conversationsController');
const { protect } = require('../middleware/auth');

// Todas as rotas são protegidas
router.post('/', protect, createOrGetConversation);
router.get('/', protect, getMyConversations);
router.get('/:id/messages', protect, getMessages);
router.post('/:id/messages', protect, sendMessage);

module.exports = router;
