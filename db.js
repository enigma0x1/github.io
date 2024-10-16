// db.js

class Database {
  constructor() {
    this.users = new Map();
    this.purchases = new Map();
    this.products = new Map();
  }

  // Kullanıcı işlemleri
  createUser(user) {
    const userId = this.generateId();
    this.users.set(userId, { ...user, id: userId, cart: [] });
    return { ...this.users.get(userId) };
  }

  findUserByEmail(email) {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  findUserById(id) {
    return this.users.get(id);
  }

  // Ürün işlemleri
  createProduct(product) {
    const productId = this.generateId();
    this.products.set(productId, { ...product, id: productId });
    return { ...this.products.get(productId) };
  }

  getAllProducts() {
    return Array.from(this.products.values());
  }

  findProductById(id) {
    return this.products.get(id);
  }

  // Sepet işlemleri
  addToCart(userId, productId, quantity) {
    const user = this.users.get(userId);
    if (!user) return null;

    const existingItem = user.cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }
    return [...user.cart];
  }
  
  getCart(userId) {
    const user = this.users.get(userId);
    return user ? [...user.cart] : [];
  }
  
  clearCart(userId) {
    const user = this.users.get(userId);
    if (user) {
      user.cart = [];
    }
    return [];
  }
  
  // Satın alma işlemleri
  createPurchase(userId, products, totalAmount) {
    const purchase = {
      id: this.generateId(),
      userId,
      products,
      totalAmount,
      date: new Date()
    };
    this.purchases.set(purchase.id, purchase);
    return { ...purchase };
  }
  
  getUserPurchases(userId) {
    return Array.from(this.purchases.values()).filter(purchase => purchase.userId === userId);
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = new Database();