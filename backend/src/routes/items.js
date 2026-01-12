const express = require('express');
const router = express.Router();
const {
  createItem,
  getFoundItems,
  getItem,
  claimItem,
  returnItem,
  getMyItems,
  deleteItem,
  getAllItems,
  markAsPortaria,
  confirmReturn
} = require('../controllers/itemsController');
const { protect } = require('../middleware/auth');
const { isStaff } = require('../middleware/checkRole');
const upload = require('../middleware/upload');

// Rotas públicas
router.get('/found', getFoundItems);
router.get('/:id', getItem);

// Rotas protegidas (usuários logados)
router.post('/', protect, upload.single('image'), createItem);
router.get('/user/my-items', protect, getMyItems);
router.post('/:id/claim', protect, claimItem);
router.post('/:id/return', protect, returnItem);
router.delete('/:id', protect, deleteItem);

// Rotas admin/staff
router.get('/admin/all', protect, isStaff, getAllItems);
router.put('/:id/portaria', protect, isStaff, markAsPortaria);
router.put('/:id/confirm-return', protect, isStaff, confirmReturn);

module.exports = router;
