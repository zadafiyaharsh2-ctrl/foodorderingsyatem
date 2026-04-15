const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

exports.addMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const item = new MenuItem({
      restaurant: restaurant._id,
      ...req.body
    });

    await item.save();
    res.status(201).json({ success: true, menuItem: item });
  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const item = await MenuItem.findOne({ _id: req.params.id, restaurant: restaurant._id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    const allowedUpdates = ['name', 'description', 'price', 'image', 'category', 'isVeg', 'isAvailable', 'preparationTime', 'tags'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    await item.save();
    res.json({ success: true, menuItem: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const item = await MenuItem.findOneAndDelete({ _id: req.params.id, restaurant: restaurant._id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getMenuByRestaurant = async (req, res) => {
  try {
    const items = await MenuItem.find({ restaurant: req.params.restaurantId });
    res.json({ success: true, menuItems: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
