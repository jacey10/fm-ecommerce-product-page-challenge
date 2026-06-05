// ==========================================
// DATA & STATE MANAGEMENT
// ==========================================

const product = {
  id: 1,
  name: "Fall Limited Edition Sneakers",
  company: "SNEAKER COMPANY",
  price: 125.00,
  originalPrice: 250.00,
  discount: 50,
  description: "These low-profile sneakers are your perfect casual wear companion. Featuring a durable rubber outer sole, they'll withstand everything the weather can offer.",
  images: [
    "assets/images/products/image-product-1.jpg",
    "assets/images/products/image-product-2.jpg",
    "assets/images/products/image-product-3.jpg",
    "assets/images/products/image-product-4.jpg",
  ],
  thumbnails: [
    "assets/images/products/image-product-1-thumbnail.jpg",
    "assets/images/products/image-product-2-thumbnail.jpg",
    "assets/images/products/image-product-3-thumbnail.jpg",
    "assets/images/products/image-product-4-thumbnail.jpg",
  ]
};

const state = {
  currentImageIndex: 0,
  lightboxIndex: 0,
  quantity: 0,
  cart: []
};

// ==========================================
// DOM ELEMENTS
// ==========================================

const elements = {

  // Navigation
  menuButton: document.querySelector('.nav__toggle'),
  menuOverlay: document.querySelector('.nav__drawer'),
  backdrop: document.querySelector('.backdrop'),

  // Main image gallery
  mainImage: document.querySelector('.gallery__active--image'),
  galleryThumbnails: document.querySelector('.gallery__thumbnails'),
  prevArrow: document.querySelector('.gallery__btn--prev'),
  nextArrow: document.querySelector('.gallery__btn--next'),
  
  // Lightbox
  lightboxImage: document.querySelector('.lightbox__active--image'),
  lightboxThumbnails: document.querySelector('.lightbox__thumbnails'),
  lightboxClose: document.querySelector('.lightbox__close--btn'),
  lightboxPrev: document.querySelector('.lightbox__prev--btn'),
  lightboxNext: document.querySelector('.lightbox__next--btn'),
  
  // Quantity
  quantityMinus: document.querySelector('.stepper__minus'),
  quantityValue: document.querySelector('.stepper__count'),
  quantityPlus: document.querySelector('.stepper__plus'),
  
  // Cart
  addToCartBtn: document.querySelector('.cart__btn'),
  cartIcon: document.querySelector('.header__cart--btn'),
  cartDropdown: document.querySelector('.cart__modal'),
  cartCount: document.querySelector('.header__cart--badge'),
  cartBody: document.querySelector('.cart__modal--body')
};

// ==========================================
// INITIALIZATION
// ==========================================

function init() {
  renderProductInfo();
  updateQuantityDisplay();
  renderThumbnails(elements.galleryThumbnails, "gallery__thumb");
  renderThumbnails(elements.lightboxThumbnails, "lightbox__thumb");
  updateGallery(0);
  attachEventListeners();
}

// ==========================================
// RENDER FUNCTIONS
// ==========================================

function renderProductInfo() {
  document.querySelector('.brand').textContent = product.company;
  document.querySelector('.product__title').textContent = product.name;
  document.querySelector('.description').textContent = product.description;
  document.querySelector('.sales__price').textContent = `$${product.price.toFixed(2)}`;
  document.querySelector('.original__price').textContent = `$${product.originalPrice.toFixed(2)}`;
  document.querySelector('.discount__badge').textContent = `${product.discount}%`;
}

function updateQuantityDisplay () {
  elements.quantityValue.textContent = state.quantity;
}

function renderThumbnails(container, className) {
  const html = product.thumbnails.map((src, index) => `
    <li>
      <button type="button" class="${className} ${index === state.currentImageIndex ? 'active' : ''}" data-index="${index}">
        <img src="${src}" alt="Product view ${index + 1}">
      </button>
    </li>
  `).join('');
  container.innerHTML = html;
}

function updateGalleryImage() {
  const index = state.currentImageIndex;
  const imageSrc = product.images[index];
  elements.mainImage.src = imageSrc;
}

function updateLightboxImage() {
  const index = state.lightboxIndex;
  const imageSrc = product.images[index];
  elements.lightboxImage.src = imageSrc;
}

function renderCartBadge() {
  const badge = elements.cartCount;
  if (!badge) return;

  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  badge.textContent = totalItems;
  badge.classList.toggle('hidden', totalItems === 0);
}

function renderCartItems() {
  if (state.cart.length === 0) {
    elements.cartBody.innerHTML = '<p class="cart__empty">Your cart is empty</p>';
    return;
  }

  const itemsHTML = state.cart.map(item => `
    <div class="cart__item" data-id="${item.id}">
      <img class="cart__item--img" src="${item.image}" width="50" height="50" alt="${item.name}">
      <div class="cart__item--info">
        <p class="cart__item--name">${item.name}</p>
        <p class="cart__item--pricing">
          <span class="cart__quantity">$${item.price.toFixed(2)} x ${item.quantity}</span>
          <span class="cart__total">$${(item.price * item.quantity).toFixed(2)}</span>
        </p>
      </div>
      <button type="button" class="delete__btn" data-id="${item.id}">
        <img src="assets/images/icons/icon-delete.svg" alt="Remove item">
      </button>
    </div>
    `).join('');
    
    elements.cartBody.innerHTML = itemsHTML + `
    <button type="button" class="checkout__btn">Checkout</button>
  `;
}

function renderCart() {
  renderCartBadge();
  renderCartItems();
}

// ==========================================
// MOBILE NAVIGATION
// ==========================================

function toggleNav() {
  const isOpen = document.body.classList.toggle('menu-open');
  elements.backdrop.classList.toggle('mobile-menu-active');

  elements.menuButton.setAttribute('aria-expanded', isOpen);
  elements.menuOverlay.setAttribute('aria-hidden', !isOpen);
  elements.backdrop.setAttribute('aria-hidden', !isOpen);

  if (isOpen) {
    elements.menuOverlay.removeAttribute('inert');
  } else {
    elements.menuOverlay.setAttribute('inert', '');
  }
}

// ==========================================
// IMAGE GALLERY FUNCTIONS
// ==========================================

function handlePrev() {
  state.currentImageIndex = (state.currentImageIndex - 1 + product.images.length) % product.images.length;
  updateGallery(state.currentImageIndex);
}

function handleNext() {
  state.currentImageIndex = (state.currentImageIndex + 1) % product.images.length;
  updateGallery(state.currentImageIndex);
}

function handleGalleryThumbnailClick(e) {
  const thumb = e.target.closest('.gallery__thumb');
  if (!thumb) return;

  const index =  Number(thumb.dataset.index);
  updateGallery(index);
}

function updateGallery(index) {
  state.currentImageIndex = index;
  document.querySelectorAll('.gallery__thumb').forEach((thumb) => {
    const isActive = Number(thumb.dataset.index) === state.currentImageIndex;
    thumb.classList.toggle('active', isActive);
  })
  updateGalleryImage();
}

// ==========================================
// LIGHTBOX FUNCTIONS
// ==========================================

function openLightbox() {
  updateLightbox(state.currentImageIndex);
  document.body.classList.add('lightbox-open');
  document.querySelector('.lightbox').removeAttribute('inert');
  document.querySelector('.lightbox').setAttribute('aria-hidden', 'false');
  elements.backdrop.classList.add('lightbox-active');
}

function closeLightbox() {
  updateGallery(state.lightboxIndex)
  document.body.classList.remove('lightbox-open');
  document.querySelector('.lightbox').setAttribute('inert', '');
  document.querySelector('.lightbox').setAttribute('aria-hidden', 'true');
  elements.backdrop.classList.remove('lightbox-active');
}

function handleLightboxPrev() {
  state.lightboxIndex = (state.lightboxIndex - 1 + product.images.length) % product.images.length;
  updateLightbox(state.lightboxIndex);
}

function handleLightboxNext() {
  state.lightboxIndex = (state.lightboxIndex + 1) % product.images.length;
  updateLightbox(state.lightboxIndex);
}

function handleLightboxThumbnailClick(e) {
  const thumb = e.target.closest('.lightbox__thumb');
  if (!thumb) return;

  const index =  Number(thumb.dataset.index);
  updateLightbox(index);
}

function updateLightbox(index) {
  state.lightboxIndex = index;
  document.querySelectorAll('.lightbox__thumb').forEach((thumb) => {
    const isActive = Number(thumb.dataset.index) === state.lightboxIndex;
    thumb.classList.toggle('active', isActive);
  })
  updateLightboxImage();
}

// ==========================================
// QUANTITY FUNCTIONS
// ==========================================

function increaseQuantity() {
  state.quantity++;
  updateQuantityDisplay();
}

function decreaseQuantity() {
  if (state.quantity > 0) {
    state.quantity--;
    updateQuantityDisplay();
  }
}

// ==========================================
// CART FUNCTIONS
// ==========================================

function addToCart() {
  if (state.quantity === 0) return;

  const existingItem = state.cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += state.quantity;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: state.quantity,
      image: product.thumbnails[0]
    });
  }

  state.quantity = 0;
  updateQuantityDisplay();

  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  renderCart();
}

function openCartModal() {
  const isOpen = document.body.classList.toggle('cart-open');

  if (window.innerWidth >= 768) {
    const rect = elements.cartIcon.getBoundingClientRect();
    elements.cartDropdown.style.top = `${rect.bottom + 8}px`;
    elements.cartDropdown.style.left = `${rect.left}px`;
  }

  renderCart();

  elements.cartIcon.setAttribute('aria-expanded', isOpen);
  elements.cartDropdown.setAttribute('aria-hidden', !isOpen);
}


// ==========================================
// EVENT LISTENERS 
// ==========================================

function attachEventListeners() {
  // Mobile Navigation
  elements.menuButton.addEventListener('click', toggleNav);
  elements.backdrop.addEventListener('click', toggleNav);

  // Gallery
  elements.prevArrow.addEventListener('click', handlePrev);
  elements.nextArrow.addEventListener('click', handleNext);
  document.addEventListener('click', handleGalleryThumbnailClick);

  // Lightbox
  elements.mainImage.addEventListener('click', () => {
    if (window.innerWidth >= 768) {
      openLightbox();
    }
  });
  elements.lightboxClose.addEventListener('click', closeLightbox);
  elements.lightboxPrev.addEventListener('click', handleLightboxPrev);
  elements.lightboxNext.addEventListener('click', handleLightboxNext);
  document.addEventListener('click', handleLightboxThumbnailClick);

  // Quantity
  elements.quantityMinus.addEventListener('click', decreaseQuantity);
  elements.quantityPlus.addEventListener('click', increaseQuantity);

  // Cart
  elements.addToCartBtn.addEventListener('click', addToCart);
  elements.cartIcon.addEventListener('click', openCartModal);
  elements.cartDropdown.addEventListener('click', (e) => {
    const btn = e.target.closest('.delete__btn');
    if (btn) removeFromCart(parseInt(btn.dataset.id));
  });
}

init();