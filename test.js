// test.js içine eklenecek yeni testler

// Sepete ürün ekleme
console.log('Sepete ürün ekleniyor...');
await axios.post(`${API_URL}/cart/add`, {
  productId: productId,
  quantity: 2
}, {
  headers: { 'Authorization': `Bearer ${token}` }
});
console.log('Ürün sepete eklendi.');

// Sepeti görüntüleme
console.log('Sepet görüntüleniyor...');
const cartResponse = await axios.get(`${API_URL}/cart`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
console.log('Sepet içeriği:', cartResponse.data);

// Satın alma işlemi
console.log('Satın alma işlemi yapılıyor...');
const purchaseResponse = await axios.post(`${API_URL}/cart/purchase`, {}, {
  headers: { 'Authorization': `Bearer ${token}` }
});
console.log('Satın alma işlemi tamamlandı:', purchaseResponse.data);