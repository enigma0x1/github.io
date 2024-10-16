const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Yeni ürün ekle
// @route   POST /api/products
// @access  Private
const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, modelPrice } = req.body;

  if (!name || !description || !price || !category || !modelPrice) {
    res.status(400);
    throw new Error('Lütfen tüm alanları doldurun');
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    modelPrice,
    imageUrl: req.files['image'][0].path,
    modelFileUrl: req.files['modelFile'][0].path,
    manufacturer: req.user.id,
  });

  res.status(201).json(product);
});

// @desc    Tüm ürünleri getir
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate('manufacturer', 'name');
  res.json(products);
});

// @desc    Ürün detaylarını getir
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('manufacturer', 'name');
  
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Ürün bulunamadı');
  }
});

module.exports = {
  addProduct,
  getProducts,
  getProductById,
};