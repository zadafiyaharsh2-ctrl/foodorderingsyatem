const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', restaurantController.getAllRestaurants);
router.get('/my', auth, requireRole('restaurant'), restaurantController.getMyRestaurant);
router.get('/:id', restaurantController.getRestaurantById);
router.put('/update', auth, requireRole('restaurant'), restaurantController.updateRestaurant);

module.exports = router;
