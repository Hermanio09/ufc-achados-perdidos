const express = require('express');
const router = express.Router();
const {
  createItem,
  getFoundItems,
  getItem,
  claimItem,
  returnItem,
  getMyItems,
  deleteItem
} = require('../controllers/itemsController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Rotas públicas
router.get('/found', getFoundItems);
router.get('/:id', getItem);

// Rotas protegidas
router.post('/', protect, upload.single('image'), createItem);
router.get('/user/my-items', protect, getMyItems);
router.post('/:id/claim', protect, claimItem);
router.post('/:id/return', protect, returnItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
