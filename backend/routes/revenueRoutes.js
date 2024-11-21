const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { addRevenue, getRevenues, deleteRevenue, updateRevenue } = require('../controllers/revenueController');

router.post('/add', authenticate, addRevenue);
router.get('/', authenticate, getRevenues);
router.put('/:id', authenticate, updateRevenue);
router.delete('/:id', authenticate, deleteRevenue);

module.exports = router;
