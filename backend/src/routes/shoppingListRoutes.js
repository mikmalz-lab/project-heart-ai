const express = require('express');
const router = express.Router();
const { createList, getLists, updateList, deleteList } = require('../controllers/shoppingListController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createList);
router.get('/', protect, getLists);
router.put('/:id', protect, updateList);
router.delete('/:id', protect, deleteList);

module.exports = router;
