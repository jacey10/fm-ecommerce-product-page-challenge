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

let state = {
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

  // Product Info
  productCompany: document.querySelector('.brand'),
  productName: document.querySelector('.product__title'),
  productDescription: document.querySelector('.description'),
  productPrice: document.querySelector('.sales__price'),
  productOriginalPrice: document.querySelector('.original__price'),
  productDiscount: document.querySelector('.discount__badge'),

  // Main image gallery
  mainImage: document.querySelector('.gallery__active--image'),
  galleryThumbnails: document.querySelector('.gallery__thumbnails'),
  prevArrow: document.querySelector('.gallery__btn--prev'),
  nextArrow: document.querySelector('.gallery__btn--next'),
  
  // Lightbox
  lightboxImage: document.querySelector('.lightbox__active--image'),
  lightboxThumbnails: document.querySelector('.lightbox__thumbnails'),
  lightboxClose: document.querySelector('.lightbox__close--btn'),
  lightboxPrev: document.querySelector('.lightbox__btn--prev'),
  lightboxNext: document.querySelector('.lightbox__btn--next'),
  
  // Quantity
  quantityMinus: document.querySelector('.stepper__minus'),
  quantityValue: document.querySelector('.stepper__count'),
  quantityPlus: document.querySelector('.stepper__plus'),
  
  // Cart
  addToCartBtn: document.querySelector('.cart__btn'),
  cartIcon: document.querySelector('.header__cart--btn'),
  cartDropdown: document.querySelector('.cart__modal'),
  cartCount: document.querySelector('.header__cart--badge'),
};

// ==========================================
// INITIALIZATION
// ==========================================

function init() {
  renderProductInfo();
  updateQuantityDisplay();
  updateGallery(0);
  renderThumbnails(elements.galleryThumbnails, "gallery__thumb");
  renderThumbnails(elements.lightboxThumbnails, "lightbox__thumb");
  attachEventListeners();
}

// ==========================================
// RENDER FUNCTIONS
// ==========================================

function renderProductInfo() {
  elements.productCompany.textContent = product.company;
  elements.productName.textContent = product.name;
  elements.productDescription.textContent = product.description;
  elements.productPrice.textContent = `$${product.price.toFixed(2)}`;
  elements.productOriginalPrice.textContent = `$${product.originalPrice.toFixed(2)}`;
  elements.productDiscount.textContent = `${product.discount}%`;
}

function updateQuantityDisplay () {
  elements.quantityValue.textContent = state.quantity;
}

function renderThumbnails(container, className) {
  const html = product.thumbnails.map((src, index) => `
    <li>
      <button type="button" class="${className} ${index === state.currentImageIndex ? 'active' : ''}" data-index="${index}">
        <img src="${src}" alt="">
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

function updateGallery(index) {
  state.currentImageIndex = index;
  document.querySelectorAll('.gallery__thumb').forEach((thumb) => {
    const isActive = Number(thumb.dataset.index) === state.currentImageIndex;
    thumb.classList.toggle('active', isActive);
  })
  updateGalleryImage();
}

function handleGalleryThumbnailClick(e) {
  const thumb = e.target.closest('.gallery__thumb', '.lightbox__thumb');
  if (!thumb) return;

  const index =  Number(thumb.dataset.index);
  updateGallery(index);
}

function handleLightboxThumbnailClick(e) {
  const thumb = e.target.closest('.lightbox__thumb');
  if (!thumb) return;

  const index =  Number(thumb.dataset.index);
  updateLightbox(index);
}

// ==========================================
// LIGHTBOX FUNCTIONS
// ==========================================

function openLightbox() {
  updateLightbox(state.currentImageIndex);
  document.querySelector('.lightbox').classList.remove('hidden');
  document.body.classList.add('menu-open');
}

function closeLightbox() {
  updateGallery(state.lightboxIndex)
  document.querySelector('.lightbox').classList.add('hidden');
  document.body.classList.remove('menu-open');
}

function handleLightboxPrev() {
  state.currentImageIndex = (state.currentImageIndex - 1 + product.images.length) % product.images.length;
  updateLightbox(state.currentImageIndex);
}

function handleLightboxNext() {
  state.currentImageIndex = (state.currentImageIndex + 1) % product.images.length;
  updateLightbox(state.currentImageIndex);
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
// EVENT LISTENERS 
// ==========================================

function attachEventListeners() {
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
  
}

init();