// routes/cart.js

const express = require('express');
const passport = require('passport');
const db = require('../db');

const router = express.Router();

// Middleware to check if user is authenticated
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Sepete ürün ekle
router.post('/add', authenticateJWT, (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = db.addToCart(req.user.id, productId, quantity);
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Sepeti görüntüle
router.get('/', authenticateJWT, (req, res) => {
  try {
    const cart = db.getCart(req.user.id);
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Satın alma işlemi
router.post('/purchase', authenticateJWT, (req, res) => {
  try {
    const cart = db.getCart(req.user.id);
    if (cart.length === 0) {
      return res.status(400).json({ message: 'Sepetiniz boş.' });
    }
    const totalAmount = cart.reduce((total, item) => {
      const product = db.findProductById(item.productId);
      return total + (product.price * item.quantity);
    }, 0);
    const purchase = db.createPurchase(req.user.id, cart, totalAmount);
    db.clearCart(req.user.id);
    res.json({ message: 'Satın alma işlemi başarılı', purchase });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;