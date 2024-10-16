const express = require('express');
const passport = require('passport');
const db = require('../db');

const router = express.Router();

// Middleware to check if user is authenticated
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Tüm ürünleri getir
router.get('/', async (req, res) => {
  try {
    const products = db.findAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni ürün ekle
router.post('/', authenticateJWT, (req, res) => {
  if (req.user.role !== 'uretici' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bu işlem için yetkiniz yok.' });
  }

  const product = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    modelPrice: req.body.modelPrice,
    createdBy: req.user.id
  };

  try {
    const newProduct = db.createProduct(product);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ürün güncelle
router.put('/:id', authenticateJWT, (req, res) => {
  if (req.user.role !== 'uretici' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bu işlem için yetkiniz yok.' });
  }

  const id = parseInt(req.params.id);
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    modelPrice: req.body.modelPrice,
    createdBy: req.user.id
  };

  try {
    const product = db.updateProduct(id, updatedProduct);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Ürün bulunamadı.' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ürün sil
router.delete('/:id', authenticateJWT, (req, res) => {
  if (req.user.role !== 'uretici' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bu işlem için yetkiniz yok.' });
  }

  const id = parseInt(req.params.id);

  try {
    const deleted = db.deleteProduct(id);
    if (deleted) {
      res.json({ message: 'Ürün başarıyla silindi.' });
    } else {
      res.status(404).json({ message: 'Ürün bulunamadı.' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;