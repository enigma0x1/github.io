const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = config.get('jwtSecret');

// Kayıt olma
router.post('/signup', async (req, res) => {
  try {
    const { fullname, email, password, userType } = req.body;
    
    let user = db.findUserByEmail(email);
    if (user) {
      return res.status(400).json({ msg: 'Kullanıcı zaten mevcut' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = db.createUser({
      fullname,
      email,
      password: hashedPassword,
      userType
    });

    const token = jwt.sign(
      { userId: user.id, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Giriş yapma
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    const user = db.findUserByEmail(email);
    if (!user || user.userType !== userType) {
      return res.status(400).json({ msg: 'Geçersiz kimlik bilgileri' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Geçersiz kimlik bilgileri' });
    }

    const token = jwt.sign(
      { userId: user.id, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Token'ı veritabanına kaydet
    db.saveUserToken(user.id, token);

    res.json({
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Kullanıcı bilgilerini getir
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = db.findUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Şifre sıfırlama isteği
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = db.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
    }

    // Burada şifre sıfırlama token'ı oluşturup e-posta gönderme işlemi yapılabilir
    // Örnek olarak sadece başarılı yanıt dönüyoruz
    res.json({ msg: 'Şifre sıfırlama talimatları e-posta adresinize gönderildi' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Şifre sıfırlama
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Token doğrulama ve şifre sıfırlama işlemleri burada yapılacak
    // Örnek olarak başarılı yanıt dönüyoruz
    res.json({ msg: 'Şifreniz başarıyla sıfırlandı' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Çıkış yapma
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Token'ı geçersiz kıl
    await db.invalidateUserToken(req.user.userId);
    res.json({ msg: 'Başarıyla çıkış yapıldı' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;