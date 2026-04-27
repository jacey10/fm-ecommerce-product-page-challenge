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
  quantity: 0,
  cart: []
};

// ==========================================
// DOM ELEMENTS
// ==========================================

const elements = {
  // Main image gallery
  mainImage: document.querySelector('.gallery__active--image'),
  thumbnails: document.querySelectorAll('.gallery__thumb'),
  prevArrow: document.querySelector('.gallery__btn--prev'),
  nextArrow: document.querySelector('.gallery__btn--next'),
  
  // Lightbox
  lightbox: document.querySelector('.lightbox'),
  lightboxImage: document.querySelector('.lightbox__active--image'),
  lightboxThumbnails: document.querySelectorAll('.lightbox__thumb'),
  lightboxClose: document.querySelector('.lightbox__btn--close'),
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
  cartItem: document.querySelector('.cart__item'),
  cartTotal: document.querySelector('.cart__total'),
  
  // Product info
  productName: document.querySelector('.product__title'),
  productCompany: document.querySelector('.brand'),
  productPrice: document.querySelector('.sles__price'),
  productOriginalPrice: document.querySelector('.original__price'),
  productDiscount: document.querySelector('.discount__badge'),
  productDescription: document.querySelector('.description')
};

// ==========================================
// INITIALIZATION
// ==========================================

function init() {
  renderProductInfo();
  renderThumbnails();
  updateMainImage();
  updateQuantityDisplay();
  attachEventListeners();
}