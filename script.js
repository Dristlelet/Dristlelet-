(() => {
  const productsEl = document.getElementById("products");
  const cartButton = document.getElementById("cartButton");
  const countEl = document.getElementById("cartCount");
  const toast = document.getElementById("toast");

  if (!productsEl) return;

  let cart = JSON.parse(localStorage.getItem("dristleletCartItems") || "[]");

  if (!Array.isArray(cart)) {
    cart = [];
  }

  function updateCount() {
    const count = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    if (countEl) {
      countEl.textContent = count;
    }

    localStorage.setItem(
      "dristleletCartItems",
      JSON.stringify(cart)
    );
  }

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove("hide");
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hide");
    }, 1800);
  }

  /* ================================
     IMAGE PREVIEW
     ================================ */

  function createPreview(item) {
    const oldPreview = document.getElementById("imagePreview");

    if (oldPreview) {
      oldPreview.remove();
    }

    const preview = document.createElement("div");

    preview.id = "imagePreview";
    preview.className = "image-preview";

    preview.innerHTML = `
      <button class="preview-close" type="button" aria-label="Close preview">
        ×
      </button>

      <div class="preview-content">
        <img
          src="${item.image}"
          alt="${item.name}"
          class="preview-image"
        >

        <h2>${item.name}</h2>
        <p>${item.description}</p>
        <strong>${item.price}</strong>
      </div>
    `;

    document.body.appendChild(preview);

    requestAnimationFrame(() => {
      preview.classList.add("preview-open");
    });

    preview
      .querySelector(".preview-close")
      .addEventListener("click", () => {
        preview.classList.remove("preview-open");

        setTimeout(() => {
          preview.remove();
        }, 300);
      });

    preview.addEventListener("click", event => {
      if (event.target === preview) {
        preview.classList.remove("preview-open");

        setTimeout(() => {
          preview.remove();
        }, 300);
      }
    });
  }

  /* ================================
     CART
     ================================ */

  function addToCart(item) {
    const existing = cart.find(
      product => product.name === item.name
    );

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
        quantity: 1
      });
    }

    updateCount();

    showToast(`${item.name} added to your bag.`);

    renderCart();
  }

  function removeFromCart(index) {
    if (!cart[index]) return;

    cart[index].quantity--;

    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    updateCount();
    renderCart();
  }

  function getTotal() {
    return cart.reduce((total, item) => {
      const price = Number(
        String(item.price).replace("£", "")
      );

      return total + price * item.quantity;
    }, 0);
  }

  function openCart() {
    let cartPanel = document.getElementById("cartPanel");

    if (!cartPanel) {
      cartPanel = document.createElement("aside");

      cartPanel.id = "cartPanel";
      cartPanel.className = "cart-panel";

      document.body.appendChild(cartPanel);
    }

    renderCart();

    requestAnimationFrame(() => {
      cartPanel.classList.add("cart-open");
    });
  }

  function closeCart() {
    const cartPanel = document.getElementById("cartPanel");

    if (!cartPanel) return;

    cartPanel.classList.remove("cart-open");
  }

  function renderCart() {
    const cartPanel = document.getElementById("cartPanel");

    if (!cartPanel) return;

    if (cart.length === 0) {
      cartPanel.innerHTML = `
        <div class="cart-header">
          <h2>YOUR BAG</h2>
          <button class="cart-close" type="button">×</button>
        </div>

        <div class="cart-empty">
          <div class="cart-empty-icon">D</div>
          <h3>Your bag is empty.</h3>
          <p>Add something from the drop.</p>
        </div>
      `;

      cartPanel
        .querySelector(".cart-close")
        .addEventListener("click", closeCart);

      return;
    }

    cartPanel.innerHTML = `
      <div class="cart-header">
        <h2>YOUR BAG</h2>
        <button class="cart-close" type="button">×</button>
      </div>

      <div class="cart-items">
        ${cart.map((item, index) => `
          <div class="cart-item">

            <div class="cart-item-art">
              <img
                src="${item.image}"
                alt="${item.name}"
              >
            </div>

            <div class="cart-item-info">
              <h3>${item.name}</h3>
              <p>${item.price}</p>

              <div class="quantity">
                <button
                  type="button"
                  class="quantity-remove"
                  data-index="${index}">
                  −
                </button>

                <span>${item.quantity}</span>

                <button
                  type="button"
                  class="quantity-add"
                  data-index="${index}">
                  +
                </button>
              </div>
            </div>

          </div>
        `).join("")}
      </div>

      <div class="cart-footer">
        <div class="cart-total">
          <span>TOTAL</span>
          <strong>£${getTotal()}</strong>
        </div>

        <button class="checkout-button" type="button">
          CHECKOUT
        </button>
      </div>
    `;

    cartPanel
      .querySelector(".cart-close")
      .addEventListener("click", closeCart);

    cartPanel
      .querySelectorAll(".quantity-remove")
      .forEach(button => {
        button.addEventListener("click", () => {
          removeFromCart(Number(button.dataset.index));
        });
      });

    cartPanel
      .querySelectorAll(".quantity-add")
      .forEach(button => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.index);

          if (cart[index]) {
            cart[index].quantity++;
          }

          updateCount();
          renderCart();
        });
      });

    cartPanel
      .querySelector(".checkout-button")
      .addEventListener("click", () => {
        showToast("Checkout is coming soon.");
      });
  }

  /* ================================
     CATALOGUE
     ================================ */

  function renderCatalogue() {
    const items = Array.isArray(window.catalogue)
      ? window.catalogue
      : [];

    productsEl.innerHTML = items.map((item, index) => `
      <article class="product reveal-product">

        <div
          class="product-image-wrap product-preview"
          data-index="${index}"
          role="button"
          tabindex="0"
          aria-label="Preview ${item.name}">

          <img
            src="${item.image}"
            alt="${item.name}"
            class="product-image"
            loading="lazy"
          >

        </div>

        <div class="product-info">

          <h3>${item.name}</h3>

          <p>${item.description}</p>

          <strong>${item.price}</strong>

          <button
            class="add"
            type="button"
            data-index="${index}">
            ADD TO BAG
          </button>

        </div>

      </article>
    `).join("");

    /* ADD TO BAG */

    productsEl
      .querySelectorAll(".add")
      .forEach(button => {
        button.addEventListener("click", () => {
          const item = items[
            Number(button.dataset.index)
          ];

          addToCart(item);
        });
      });

    /* IMAGE PREVIEW */

    productsEl
      .querySelectorAll(".product-preview")
      .forEach(preview => {

        const open = () => {
          const item = items[
            Number(preview.dataset.index)
          ];

          createPreview(item);
        };

        preview.addEventListener("click", open);

        preview.addEventListener("keydown", event => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            open();
          }
        });
      });

    /* SCROLL ANIMATION */

    const revealItems =
      productsEl.querySelectorAll(".reveal-product");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("product-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    revealItems.forEach(item => {
      observer.observe(item);
    });
  }

  /* ================================
     BAG BUTTON
     ================================ */

  if (cartButton) {
    cartButton.addEventListener("click", () => {
      openCart();
    });
  }

  updateCount();
  renderCatalogue();

})();
