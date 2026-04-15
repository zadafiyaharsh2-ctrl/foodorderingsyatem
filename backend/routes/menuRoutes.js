const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/restaurant/:restaurantId', menuController.getMenuByRestaurant);
router.post('/', auth, requireRole('restaurant'), menuController.addMenuItem);
router.put('/:id', auth, requireRole('restaurant'), menuController.updateMenuItem);
router.delete('/:id', auth, requireRole('restaurant'), menuController.deleteMenuItem);

module.exports = router;
