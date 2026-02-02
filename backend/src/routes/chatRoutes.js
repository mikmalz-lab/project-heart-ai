const express = require('express');
const router = express.Router();
const { sendMessage, getHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendMessage);
router.get('/history', protect, getHistory);

module.exports = router;
