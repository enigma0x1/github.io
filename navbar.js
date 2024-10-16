// navbar.js
function createNavbar() {
  const navbar = document.createElement('nav');
  navbar.className = 'navbar navbar-expand-lg navbar-light bg-light';
  navbar.innerHTML = `
    <div class="container-fluid">
      <a class="navbar-brand" href="/">3B Model Platformu</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link" href="/products.html">Ürünler</a>
          </li>
        </ul>
        <ul class="navbar-nav" id="authLinks">
          <!-- Bu kısım dinamik olarak doldurulacak -->
        </ul>
      </div>
    </div>
  `;
  return navbar;
}

function updateAuthLinks() {
  const authLinks = document.getElementById('authLinks');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (token && user) {
    authLinks.innerHTML = `
      <li class="nav-item">
        <span class="nav-link">Merhaba, ${user.fullname}</span>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/user-profile.html">Profil</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" onclick="logout()">Çıkış Yap</a>
      </li>
    `;
  } else {
    authLinks.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="/login.html">Giriş Yap</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/signup.html">Kayıt Ol</a>
      </li>
    `;
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

// Bu fonksiyonu her sayfada çağırın
function initNavbar() {
  document.body.insertBefore(createNavbar(), document.body.firstChild);
  updateAuthLinks();
}