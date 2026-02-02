const express = require('express');
const router = express.Router();
const { searchProducts, getProductById } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', protect, searchProducts);
router.get('/:id', protect, getProductById);

module.exports = router;
