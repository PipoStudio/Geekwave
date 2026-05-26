/* =========================================================
   GEEKWAVE PRODUCT ENGINE V2
   Dynamic Ecommerce Compatible
   ========================================================= */

/* =========================================================
   IMPORTANT
   =========================================================

   ESTE SCRIPT YA NO CREA UN CARRITO NUEVO.
   AHORA SE INTEGRA CON TU SISTEMA EXISTENTE.

   Compatible con:
   - localStorage existente
   - navbar cart sync
   - contador del carrito
   - routing dinámico
   - render dinámico

========================================================= */

/* =========================
   PRODUCT DATA
========================= */

const productData = {
  id: "analogue-pocket",

  title: "Analogue Pocket",

  description:
    "Sistema portátil basado en tecnología FPGA (Field Programmable Gate Array). Replica hardware clásico a nivel de transistores.",

  basePrice: 219.99,

  bundlePrice: 299.99,

  currency: "$",

  variants: [
    {
      id: "black",
      name: "Black",

      image:
        "https://res.cloudinary.com/dn8pns203/image/upload/v1777401914/geekwave_catalog/vzjzspm8e9jv4crf3o8u.webp",
    },

    {
      id: "white",
      name: "White",

      image:
        "https://res.cloudinary.com/dn8pns203/image/upload/v1777401894/geekwave_catalog/e5r0k9m2h6g4dtcbbm2h.webp",
    },

    {
      id: "glow",
      name: "Glow",

      image:
        "https://res.cloudinary.com/dn8pns203/image/upload/v1777401884/geekwave_catalog/n4gsl4tn5xukyn2p8ylu.webp",
    },
  ],
};

/* =========================
   PRODUCT STATE
========================= */

const productState = {
  selectedVariant: 0,

  selectedPlan: "standard",

  quantity: 1,
};

/* =========================
   DOM
========================= */

const DOM = {
  mainImage: document.getElementById("mainProductImage"),

  galleryThumbs: document.getElementById("galleryThumbs"),

  flavorContainer: document.getElementById("flavorContainer"),

  productTitle: document.getElementById("productTitle"),

  productDescription:
    document.getElementById("productDescription"),

  basePrice: document.getElementById("basePrice"),

  bundlePrice: document.getElementById("bundlePrice"),

  quantityValue:
    document.getElementById("quantityValue"),

  cartButton:
    document.getElementById("cartButton"),
};

/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderProduct();

  renderVariants();

  renderGallery();

  bindGlobalEvents();

  initPremiumEffects();
});

/* =========================================================
   RENDER PRODUCT
========================================================= */

function renderProduct() {
  if (!DOM.productTitle) return;

  DOM.productTitle.textContent = productData.title;

  DOM.productDescription.textContent =
    productData.description;

  DOM.basePrice.textContent =
    `${productData.currency}${productData.basePrice}`;

  DOM.bundlePrice.textContent =
    `${productData.currency}${productData.bundlePrice}`;

  updateMainImage();

  updateQuantityUI();
}

/* =========================================================
   UPDATE MAIN IMAGE
========================================================= */

function updateMainImage() {
  const currentVariant =
    productData.variants[
      productState.selectedVariant
    ];

  if (!DOM.mainImage) return;

  DOM.mainImage.style.opacity = 0;

  setTimeout(() => {
    DOM.mainImage.src = currentVariant.image;

    DOM.mainImage.onload = () => {
      DOM.mainImage.style.opacity = 1;
    };
  }, 150);
}

/* =========================================================
   VARIANTS
========================================================= */

function renderVariants() {
  if (!DOM.flavorContainer) return;

  DOM.flavorContainer.innerHTML = "";

  productData.variants.forEach((variant, index) => {
    const button =
      document.createElement("button");

    button.className = `
      flavor-btn
      ${index === productState.selectedVariant
        ? "active"
        : ""}
    `;

    button.dataset.variantIndex = index;

    button.innerHTML = `
      ${variant.name}
    `;

    DOM.flavorContainer.appendChild(button);
  });
}

/* =========================================================
   GALLERY
========================================================= */

function renderGallery() {
  if (!DOM.galleryThumbs) return;

  DOM.galleryThumbs.innerHTML = "";

  productData.variants.forEach((variant, index) => {
    const thumb =
      document.createElement("button");

    thumb.className = `
      thumb
      ${index === productState.selectedVariant
        ? "active"
        : ""}
    `;

    thumb.dataset.variantIndex = index;

    thumb.innerHTML = `
      <img
        src="${variant.image}"
        alt="${variant.name}"
      >
    `;

    DOM.galleryThumbs.appendChild(thumb);
  });
}

/* =========================================================
   UPDATE VARIANT UI
========================================================= */

function updateVariantUI() {
  updateMainImage();

  document
    .querySelectorAll(".flavor-btn")
    .forEach((btn) => {
      btn.classList.remove("active");
    });

  document
    .querySelectorAll(".thumb")
    .forEach((thumb) => {
      thumb.classList.remove("active");
    });

  document
    .querySelectorAll(
      `[data-variant-index="${productState.selectedVariant}"]`
    )
    .forEach((element) => {
      element.classList.add("active");
    });
}

/* =========================================================
   CONFIGURATION
========================================================= */

function updateConfiguration(plan) {
  productState.selectedPlan = plan;

  document
    .querySelectorAll(".config-option")
    .forEach((option) => {
      option.classList.remove("active");
    });

  const activeOption =
    document.querySelector(
      `.config-option[data-plan="${plan}"]`
    );

  if (activeOption) {
    activeOption.classList.add("active");
  }
}

/* =========================================================
   QUANTITY
========================================================= */

function increaseQuantity() {
  productState.quantity++;

  updateQuantityUI();
}

function decreaseQuantity() {
  if (productState.quantity <= 1) return;

  productState.quantity--;

  updateQuantityUI();
}

function updateQuantityUI() {
  if (!DOM.quantityValue) return;

  DOM.quantityValue.textContent =
    productState.quantity;
}


function addToCart() {
  const currentVariant = productData.variants[productState.selectedVariant];
  const finalPrice = productState.selectedPlan === "bundle" ? productData.bundlePrice : productData.basePrice;

  // Objeto unificado
  const cartItem = {
    id: `${productData.id}-${currentVariant.id}-${productState.selectedPlan}`, 
    nombre: productData.title, // 'nombre' es lo que espera navbar-global.js
    qty: productState.quantity, // 'qty' es lo que espera navbar-global.js
    variant: currentVariant.name,
    price: finalPrice,
    image: currentVariant.image
  };

  if (typeof window.addToCart === "function") {
    // Pasamos el objeto completo, no solo partes
    window.addToCart(cartItem); 
  }
  buttonSuccessFeedback();
}
/* =========================================================
   ADD TO CART

   
/* =========================================================


   FALLBACK CART SYSTEM
========================================================= */

function fallbackCartSystem(cartItem) {
  let cart =
    JSON.parse(
      localStorage.getItem("geekwave-cart")
    ) || [];

  const existingItem =
    cart.find(
      (item) => item.id === cartItem.id
    );

  if (existingItem) {
    existingItem.quantity +=
      cartItem.quantity;

    existingItem.total =
      existingItem.quantity *
      existingItem.price;
  } else {
    cart.push(cartItem);
  }

  localStorage.setItem(
    "geekwave-cart",
    JSON.stringify(cart)
  );

  syncCartCounter();
}

/* =========================================================
   CART COUNTER SYNC
========================================================= */

function syncCartCounter() {
  const cart =
    JSON.parse(
      localStorage.getItem("geekwave-cart")
    ) || [];

  const totalItems =
    cart.reduce(
      (acc, item) =>
        acc + item.quantity,
      0
    );

  /*
     POSIBLES SELECTORES
     para compatibilidad máxima
  */

  const counters =
    document.querySelectorAll(`
      .cart-count,
      .cart-counter,
      .cart-badge,
      #cart-count,
      #cartCounter
    `);

  counters.forEach((counter) => {
    counter.textContent = totalItems;
  });
}

/* =========================================================
   BUTTON FEEDBACK
========================================================= */

function buttonSuccessFeedback() {
  if (!DOM.cartButton) return;

  DOM.cartButton.classList.add("success");

  DOM.cartButton.innerHTML = `
    <i class="fa-solid fa-check"></i>
    <span>AGREGADO</span>
  `;

  setTimeout(() => {
    DOM.cartButton.classList.remove("success");

    DOM.cartButton.innerHTML = `
      <span>AÑADIR AL CARRITO</span>
      <i class="fa-solid fa-arrow-right"></i>
    `;
  }, 1800);
}

/* =========================================================
   EVENT DELEGATION
========================================================= */

function bindGlobalEvents() {
  document.addEventListener(
    "click",
    handleGlobalClicks
  );
}

/* =========================================================
   GLOBAL CLICK ENGINE
========================================================= */

function handleGlobalClicks(e) {
  /* =========================
     VARIANT BUTTONS
  ========================= */

  const variantBtn =
    e.target.closest(".flavor-btn");

  if (variantBtn) {
    const variantIndex =
      Number(
        variantBtn.dataset.variantIndex
      );

    productState.selectedVariant =
      variantIndex;

    updateVariantUI();

    return;
  }

  /* =========================
     THUMBNAILS
  ========================= */

  const thumb =
    e.target.closest(".thumb");

  if (thumb) {
    const variantIndex =
      Number(
        thumb.dataset.variantIndex
      );

    productState.selectedVariant =
      variantIndex;

    updateVariantUI();

    return;
  }

  /* =========================
     CONFIGURATION
  ========================= */

  const configOption =
    e.target.closest(".config-option");

  if (configOption) {
    const selectedPlan =
      configOption.dataset.plan;

    updateConfiguration(
      selectedPlan
    );

    return;
  }

  /* =========================
     QUANTITY +
  ========================= */

  if (
    e.target.closest("#increaseQty")
  ) {
    increaseQuantity();

    return;
  }

  /* =========================
     QUANTITY -
  ========================= */

  if (
    e.target.closest("#decreaseQty")
  ) {
    decreaseQuantity();

    return;
  }

  /* =========================
     ADD TO CART
  ========================= */

  if (
    e.target.closest("#cartButton")
  ) {
    addToCart();

    return;
  }
}

/* =========================================================
   PREMIUM EFFECTS
========================================================= */

function initPremiumEffects() {
  initParallax();

  initRevealAnimations();
}

/* =========================================================
   PARALLAX
========================================================= */

function initParallax() {
  const visual =
    document.querySelector(
      ".product-visual"
    );

  if (!visual || !DOM.mainImage)
    return;

  visual.addEventListener(
    "mousemove",
    (e) => {
      const rect =
        visual.getBoundingClientRect();

      const x =
        e.clientX - rect.left;

      const y =
        e.clientY - rect.top;

      const moveX =
        (x - rect.width / 2) / 30;

      const moveY =
        (y - rect.height / 2) / 30;

      DOM.mainImage.style.transform =
        `
        translate(${moveX}px, ${moveY}px)
        scale(1.02)
      `;
    }
  );

  visual.addEventListener(
    "mouseleave",
    () => {
      DOM.mainImage.style.transform =
        `
        translate(0px, 0px)
        scale(1)
      `;
    }
  );
}

/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

function initRevealAnimations() {
  const revealElements =
    document.querySelectorAll(`
      .detail-card,
      .related-card
    `);

  const observer =
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting
          ) {
            entry.target.classList.add(
              "revealed"
            );
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

  revealElements.forEach((el) => {
    observer.observe(el);
  });
}

/* =========================================================
   REVEAL STYLES
========================================================= */

const premiumStyles =
  document.createElement("style");

premiumStyles.innerHTML = `
  .detail-card,
  .related-card {
    opacity: 0;
    transform: translateY(40px);
    transition:
      opacity 0.8s ease,
      transform 0.8s ease;
  }

  .detail-card.revealed,
  .related-card.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .main-purchase-btn.success {
    background: #ffffff;
    color: #000000;
  }
`;

document.head.appendChild(
  premiumStyles
);