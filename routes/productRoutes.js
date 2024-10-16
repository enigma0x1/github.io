const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const {
  addProduct,
  getProducts,
  getProductById,
} = require('../controllers/productController');

// Multer konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

router.post('/', protect, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'modelFile', maxCount: 1 }
]), addProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;