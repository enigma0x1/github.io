const express = require('express');
const passport = require('passport');
const db = require('../db');

const router = express.Router();

// Middleware to check if user is authenticated
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Yeni sipariş oluştur
router.post('/', authenticateJWT, (req, res) => {
  const order = {
    user: req.user.id,
    products: req.body.products,
    totalAmount: req.body.totalAmount,
    status: 'pending'
  };

  try {
    const newOrder = db.createOrder(order);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Kullanıcının siparişlerini getir
router.get('/myorders', authenticateJWT, (req, res) => {
  try {
    const orders = db.findOrdersByUserId(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sipariş detaylarını getir
router.get('/:id', authenticateJWT, (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const order = db.findOrderById(id);
    if (order && (order.user === req.user.id || req.user.role === 'admin')) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Sipariş bulunamadı veya erişim izniniz yok.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;