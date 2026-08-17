(() => {
  const productsEl = document.getElementById("products");
  const cartButton = document.getElementById("cartButton");
  const countEl = document.getElementById("cartCount");
  const toast = document.getElementById("toast");

  if (!productsEl) return;

  /* =========================================
     DRISTLELET DELIVERY PRICES
     Change these numbers whenever you need.
     ========================================= */

  const DELIVERY_OPTIONS = {
    tracked48: {
      name: "Royal Mail Tracked 48",
      price: 3.65,
      description: "Tracked delivery — aims for 2–3 working days"
    },

    tracked24: {
      name: "Royal Mail Tracked 24",
      price: 4.65,
      description: "Tracked delivery — next working day aim"
    },

    special: {
      name: "Royal Mail Special Delivery",
      price: 9.45,
      description: "Guaranteed next working day service"
    }
  };

  /* =========================================
     CART
     ========================================= */

  let cart = JSON.parse(
    localStorage.getItem("dristleletCartItems") || "[]"
  );

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

  /* =========================================
     PRODUCT PRICE
     ========================================= */

  function getProductPrice(item) {
    return Number(
      String(item.price)
        .replace("£", "")
        .replace(",", "")
    ) || 0;
  }

  function getSubtotal() {
    return cart.reduce((total, item) => {
      return total +
        getProductPrice(item) * item.quantity;
    }, 0);
  }

  /* =========================================
     IMAGE PREVIEW
     ========================================= */

  function createPreview(item) {
    const oldPreview =
      document.getElementById("imagePreview");

    if (oldPreview) {
      oldPreview.remove();
    }

    const preview = document.createElement("div");

    preview.id = "imagePreview";
    preview.className = "image-preview";

    preview.innerHTML = `
      <button
        class="preview-close"
        type="button"
        aria-label="Close preview">
        ×
      </button>

      <div class="preview-content">

        <img
          src="${item.image}"
          alt="${item.name}"
          class="preview-image">

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
      .addEventListener("click", closePreview);

    preview.addEventListener("click", event => {
      if (event.target === preview) {
        closePreview();
      }
    });

    function closePreview() {
      preview.classList.remove("preview-open");

      setTimeout(() => {
        preview.remove();
      }, 300);
    }
  }

  /* =========================================
     ADD TO CART
     ========================================= */

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

    showToast(
      `${item.name} added to your bag.`
    );

    renderCart();
  }

  /* =========================================
     REMOVE ONE
     ========================================= */

  function removeFromCart(index) {
    if (!cart[index]) return;

    cart[index].quantity--;

    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    updateCount();
    renderCart();
  }

  /* =========================================
     CART PANEL
     ========================================= */

  function openCart() {
    let cartPanel =
      document.getElementById("cartPanel");

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
    const cartPanel =
      document.getElementById("cartPanel");

    if (!cartPanel) return;

    cartPanel.classList.remove("cart-open");
  }

  /* =========================================
     RENDER CART
     ========================================= */

  function renderCart() {
    const cartPanel =
      document.getElementById("cartPanel");

    if (!cartPanel) return;

    if (cart.length === 0) {

      cartPanel.innerHTML = `
        <div class="cart-header">
          <h2>YOUR BAG</h2>

          <button
            class="cart-close"
            type="button">
            ×
          </button>
        </div>

        <div class="cart-empty">

          <div class="cart-empty-icon">
            D
          </div>

          <h3>Your bag is empty.</h3>

          <p>
            Add something from the drop.
          </p>

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

        <button
          class="cart-close"
          type="button">
          ×
        </button>

      </div>

      <div class="cart-items">

        ${cart.map((item, index) => `

          <div class="cart-item">

            <div class="cart-item-art">

              <img
                src="${item.image}"
                alt="${item.name}">

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

                <span>
                  ${item.quantity}
                </span>

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

          <span>SUBTOTAL</span>

          <strong>
            £${getSubtotal().toFixed(2)}
          </strong>

        </div>

        <button
          class="checkout-button"
          type="button">
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

          removeFromCart(
            Number(button.dataset.index)
          );

        });

      });

    cartPanel
      .querySelectorAll(".quantity-add")
      .forEach(button => {

        button.addEventListener("click", () => {

          const index =
            Number(button.dataset.index);

          if (cart[index]) {
            cart[index].quantity++;
          }

          updateCount();
          renderCart();

        });

      });

    cartPanel
      .querySelector(".checkout-button")
      .addEventListener("click", openCheckout);
  }

  /* =========================================
     CHECKOUT
     ========================================= */

  function openCheckout() {

    if (cart.length === 0) {
      showToast("Your bag is empty.");
      return;
    }

    const oldCheckout =
      document.getElementById("checkoutPanel");

    if (oldCheckout) {
      oldCheckout.remove();
    }

    const checkout =
      document.createElement("div");

    checkout.id = "checkoutPanel";
    checkout.className = "checkout-panel";

    checkout.innerHTML = `

      <div class="checkout-box">

        <button
          class="checkout-close"
          type="button"
          aria-label="Close checkout">
          ×
        </button>

        <div class="checkout-heading">

          <p class="eyebrow">
            DRISTLELET
          </p>

          <h2>CHECKOUT</h2>

          <p>
            Enter your delivery details.
          </p>

        </div>


        <form id="checkoutForm">


          <!-- CONTACT -->

          <section class="checkout-section">

            <h3>CONTACT DETAILS</h3>

            <label>
              Full name

              <input
                type="text"
                name="name"
                autocomplete="name"
                required>
            </label>


            <label>
              Email address

              <input
                type="email"
                name="email"
                autocomplete="email"
                required>
            </label>


            <label>
              Phone number

              <input
                type="tel"
                name="phone"
                autocomplete="tel"
                required>
            </label>

          </section>


          <!-- ADDRESS -->

          <section class="checkout-section">

            <h3>DELIVERY ADDRESS</h3>


            <label>
              Address

              <input
                type="text"
                name="address"
                autocomplete="street-address"
                required>
            </label>


            <label>
              Town / City

              <input
                type="text"
                name="city"
                autocomplete="address-level2"
                required>
            </label>


            <label>
              Postcode

              <input
                type="text"
                name="postcode"
                autocomplete="postal-code"
                required>
            </label>

          </section>


          <!-- DELIVERY -->

          <section class="checkout-section">

            <h3>DELIVERY METHOD</h3>

            ${Object.entries(
              DELIVERY_OPTIONS
            ).map(([key, option], index) => `

              <label
                class="delivery-option">

                <input
                  type="radio"
                  name="delivery"
                  value="${key}"
                  ${index === 0 ? "checked" : ""}>

                <span>

                  <strong>
                    ${option.name}
                  </strong>

                  <small>
                    ${option.description}
                  </small>

                </span>

                <b>
                  £${option.price.toFixed(2)}
                </b>

              </label>

            `).join("")}

          </section>


          <!-- ORDER SUMMARY -->

          <section class="checkout-summary">

            <div>
              <span>SUBTOTAL</span>

              <strong id="checkoutSubtotal">
                £${getSubtotal().toFixed(2)}
              </strong>
            </div>


            <div>
              <span>DELIVERY</span>

              <strong id="checkoutDelivery">
                £${DELIVERY_OPTIONS.tracked48.price.toFixed(2)}
              </strong>
            </div>


            <div class="checkout-grand-total">

              <span>TOTAL</span>

              <strong id="checkoutTotal">
                £${(
                  getSubtotal() +
                  DELIVERY_OPTIONS.tracked48.price
                ).toFixed(2)}
              </strong>

            </div>

          </section>


          <button
            type="submit"
            class="place-order-button">

            CONTINUE TO PAYMENT

          </button>


          <p class="checkout-note">
            Your details are only collected here
            for the checkout process. Payment
            processing will be connected separately.
          </p>

        </form>

      </div>
    `;

    document.body.appendChild(checkout);

    requestAnimationFrame(() => {
      checkout.classList.add("checkout-open");
    });


    /* CLOSE */

    checkout
      .querySelector(".checkout-close")
      .addEventListener("click", closeCheckout);


    checkout.addEventListener("click", event => {

      if (event.target === checkout) {
        closeCheckout();
      }

    });


    /* DELIVERY CALCULATION */

    const deliveryInputs =
      checkout.querySelectorAll(
        'input[name="delivery"]'
      );

    deliveryInputs.forEach(input => {

      input.addEventListener("change", () => {

        const selected =
          DELIVERY_OPTIONS[input.value];

        if (!selected) return;

        const deliveryEl =
          checkout.querySelector(
            "#checkoutDelivery"
          );

        const totalEl =
          checkout.querySelector(
            "#checkoutTotal"
          );

        const subtotal =
          getSubtotal();

        deliveryEl.textContent =
          `£${selected.price.toFixed(2)}`;

        totalEl.textContent =
          `£${(
            subtotal +
            selected.price
          ).toFixed(2)}`;

      });

    });


    /* FORM */

    checkout
      .querySelector("#checkoutForm")
      .addEventListener("submit", event => {

        event.preventDefault();

        const form =
          event.currentTarget;

        if (!form.checkValidity()) {

          form.reportValidity();

          return;
        }

        /*
          IMPORTANT:

          We deliberately do NOT save the
          customer's name, phone number,
          email or address into localStorage.

          A secure order/payment backend
          will be connected here later.
        */

        showToast(
          "Details accepted. Payment system coming next."
        );

      });

  }


  /* =========================================
     CLOSE CHECKOUT
     ========================================= */

  function closeCheckout() {

    const checkout =
      document.getElementById("checkoutPanel");

    if (!checkout) return;

    checkout.classList.remove("checkout-open");

    setTimeout(() => {
      checkout.remove();
    }, 300);

  }


  /* =========================================
     CATALOGUE
     ========================================= */

  function renderCatalogue() {

    const items =
      Array.isArray(window.catalogue)
        ? window.catalogue
        : [];

    productsEl.innerHTML =
      items.map((item, index) => `

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
              loading="lazy">

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

          const item =
            items[
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

          const item =
            items[
              Number(preview.dataset.index)
            ];

          createPreview(item);

        };

        preview.addEventListener(
          "click",
          open
        );

        preview.addEventListener(
          "keydown",
          event => {

            if (
              event.key === "Enter" ||
              event.key === " "
            ) {

              event.preventDefault();
              open();

            }

          }
        );

      });


    /* SCROLL ANIMATION */

    const revealItems =
      productsEl.querySelectorAll(
        ".reveal-product"
      );

    if ("IntersectionObserver" in window) {

      const observer =
        new IntersectionObserver(
          entries => {

            entries.forEach(entry => {

              if (entry.isIntersecting) {

                entry.target.classList.add(
                  "product-visible"
                );

                observer.unobserve(
                  entry.target
                );

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

    } else {

      revealItems.forEach(item => {
        item.classList.add(
          "product-visible"
        );
      });

    }

  }


  /* =========================================
     BAG BUTTON
     ========================================= */

  if (cartButton) {

    cartButton.addEventListener(
      "click",
      openCart
    );

  }


  /* =========================================
     START
     ========================================= */

  updateCount();
  renderCatalogue();

})();
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
