const express = require('express');
const router = express.Router();
const goalsController = require('../controllers/goalsController');

router.get('/', goalsController.getGoals);
router.post('/', goalsController.createOrUpdateGoal);
router.put('/:id', goalsController.createOrUpdateGoal);
router.delete('/:id', goalsController.deleteGoal);

module.exports = router;
