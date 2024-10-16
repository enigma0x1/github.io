const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
let token;
let productId;

async function register() {
  console.log('Kullanıcı kaydı yapılıyor...');
  try {
    await axios.post(`${API_URL}/auth/register`, {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'uretici'
    });
    console.log('Kullanıcı kaydı başarılı.');
  } catch (error) {
    console.error('Kayıt hatası:', error.response ? error.response.data : error.message);
  }
}

async function login() {
  console.log('Kullanıcı girişi yapılıyor...');
  try {
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      username: 'testuser',
      password: 'password123'
    });
    token = loginResponse.data.token;
    console.log('Kullanıcı girişi başarılı. Token alındı.');
  } catch (error) {
    console.error('Giriş hatası:', error.response ? error.response.data : error.message);
  }
}

async function addProduct() {
  console.log('Ürün ekleniyor...');
  try {
    const productResponse = await axios.post(`${API_URL}/products`, {
      name: 'Test Ürün',
      description: 'Bu bir test ürünüdür',
      price: 99.99,
      category: 'mobilya',
      modelPrice: 19.99
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    productId = productResponse.data.id;
    console.log('Ürün başarıyla eklendi.');
  } catch (error) {
    console.error('Ürün ekleme hatası:', error.response ? error.response.data : error.message);
  }
}

async function addToCart() {
  console.log('Sepete ekleniyor...');
  try {
    await axios.post(`${API_URL}/cart/add`, {
      productId: productId,
      quantity: 1
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Ürün sepete eklendi.');
  } catch (error) {
    console.error('Sepete ekleme hatası:', error.response ? error.response.data : error.message);
  }
}

async function createOrder() {
  console.log('Sipariş oluşturuluyor...');
  try {
    await axios.post(`${API_URL}/orders`, {
      products: [{ product: productId, quantity: 1 }],
      totalAmount: 99.99
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Sipariş başarıyla oluşturuldu.');
  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error.response ? error.response.data : error.message);
  }
}

async function runTests() {
  await register();
  await login();
  await addProduct();
  await addToCart();
  await createOrder();
  console.log('Tüm testler tamamlandı.');
}

runTests();