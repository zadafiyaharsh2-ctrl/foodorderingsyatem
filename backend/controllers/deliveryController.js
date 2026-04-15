const Order = require('../models/Order');
const User = require('../models/User');

exports.getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      status: 'ready',
      deliveryBoy: null 
    })
      .populate('restaurant', 'name address phone')
      .populate('user', 'name phone address')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.deliveryBoy) {
      return res.status(400).json({ success: false, message: 'Order already assigned' });
    }

    order.deliveryBoy = req.user._id;
    order.status = 'picked_up';
    await order.save();

    // Mark delivery boy as unavailable
    await User.findByIdAndUpdate(req.user._id, { isAvailable: false });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getMyDeliveries = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { deliveryBoy: req.user._id };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('restaurant', 'name address phone')
      .populate('user', 'name phone address')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({ _id: req.params.id, deliveryBoy: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    // If delivered, mark delivery boy available again
    if (status === 'delivered') {
      await User.findByIdAndUpdate(req.user._id, { isAvailable: true });
      order.paymentStatus = 'paid';
      await order.save();
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.isAvailable = !user.isAvailable;
    await user.save();
    res.json({ success: true, isAvailable: user.isAvailable });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
