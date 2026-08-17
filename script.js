console.log("DRISTLELET SCRIPT LOADED");

(() => {

  /* =========================================================
     DRISTLELET — COMPLETE SHOP ENGINE
     Catalogue + Product Preview + Cart + Checkout
     Customer Details + Delivery Calculation
  ========================================================= */

  const productsEl = document.getElementById("products");
  const cartButton = document.getElementById("cartButton");
  const countEl = document.getElementById("cartCount");
  const toast = document.getElementById("toast");

  if (!productsEl) {
    console.error("DRISTLELET: #products was not found.");
    return;
  }

  /* =========================================================
     CATALOGUE
  ========================================================= */

  const items = Array.isArray(window.catalogue)
    ? window.catalogue
    : [];

  if (!Array.isArray(window.catalogue)) {
    console.error("DRISTLELET: catalogue.js did not load correctly.");
  }

  /* =========================================================
     CART STORAGE
  ========================================================= */

  let cart = [];

  try {
    cart = JSON.parse(
      localStorage.getItem("dristleletCartItems") || "[]"
    );

    if (!Array.isArray(cart)) {
      cart = [];
    }

  } catch (error) {
    console.error("DRISTLELET: Could not load cart.", error);
    cart = [];
  }

  /* =========================================================
     PRICE
  ========================================================= */

  function getPrice(price) {
    return Number(
      String(price)
        .replace("£", "")
        .replace(",", "")
        .trim()
    ) || 0;
  }

  /* =========================================================
     SAVE CART
  ========================================================= */

  function saveCart() {
    try {
      localStorage.setItem(
        "dristleletCartItems",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error("DRISTLELET: Could not save cart.", error);
    }
  }

  /* =========================================================
     CART COUNT
  ========================================================= */

  function updateCount() {

    const count = cart.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );

    if (countEl) {
      countEl.textContent = count;
    }

    saveCart();
  }

  /* =========================================================
     CART TOTAL
  ========================================================= */

  function getTotal() {

    return cart.reduce(
      (total, item) =>
        total +
        getPrice(item.price) *
        Number(item.quantity || 0),
      0
    );
  }

  /* =========================================================
     TOAST
  ========================================================= */

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

  /* =========================================================
     PRODUCT PREVIEW
  ========================================================= */

  function createPreview(item) {

    const oldPreview =
      document.getElementById("imagePreview");

    if (oldPreview) {
      oldPreview.remove();
    }

    const preview =
      document.createElement("div");

    preview.id = "imagePreview";
    preview.className = "image-preview";

    preview.innerHTML = `

      <button
        class="preview-close"
        type="button"
        aria-label="Close product preview"
      >
        ×
      </button>

      <div class="preview-content">

        <img
          src="${item.image}"
          alt="${item.name}"
          class="preview-image"
        >

        <h2>
          ${item.name}
        </h2>

        <p>
          ${item.description}
        </p>

        <strong>
          ${item.price}
        </strong>

        <button
          type="button"
          class="preview-add-button"
        >
          ADD TO BAG
        </button>

      </div>
    `;

    document.body.appendChild(preview);

    requestAnimationFrame(() => {
      preview.classList.add("preview-open");
    });

    preview
      .querySelector(".preview-close")
      .addEventListener("click", () => {
        closePreview(preview);
      });

    preview.addEventListener("click", event => {

      if (event.target === preview) {
        closePreview(preview);
      }

    });

    preview
      .querySelector(".preview-add-button")
      .addEventListener("click", () => {

        addToCart(item);
        closePreview(preview);

      });
  }

  /* =========================================================
     CLOSE PREVIEW
  ========================================================= */

  function closePreview(preview) {

    if (!preview) return;

    preview.classList.remove("preview-open");

    setTimeout(() => {

      if (preview.parentNode) {
        preview.remove();
      }

    }, 300);
  }

  /* =========================================================
     ADD TO CART
  ========================================================= */

  function addToCart(item) {

    const existing = cart.find(
      product =>
        product.id === item.id ||
        product.name === item.name
    );

    if (existing) {

      existing.quantity =
        Number(existing.quantity || 0) + 1;

    } else {

      cart.push({

        id: item.id || item.name,

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

  /* =========================================================
     REMOVE ONE
  ========================================================= */

  function removeOne(index) {

    if (!cart[index]) return;

    cart[index].quantity =
      Number(cart[index].quantity || 0) - 1;

    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    updateCount();
    renderCart();
  }

  /* =========================================================
     ADD ONE
  ========================================================= */

  function addOne(index) {

    if (!cart[index]) return;

    cart[index].quantity =
      Number(cart[index].quantity || 0) + 1;

    updateCount();
    renderCart();
  }

  /* =========================================================
     OPEN CART
  ========================================================= */

  function openCart() {

    let cartPanel =
      document.getElementById("cartPanel");

    if (!cartPanel) {

      cartPanel =
        document.createElement("aside");

      cartPanel.id = "cartPanel";
      cartPanel.className = "cart-panel";

      document.body.appendChild(cartPanel);
    }

    renderCart();

    requestAnimationFrame(() => {
      cartPanel.classList.add("cart-open");
    });
  }

  /* =========================================================
     CLOSE CART
  ========================================================= */

  function closeCart() {

    const cartPanel =
      document.getElementById("cartPanel");

    if (!cartPanel) return;

    cartPanel.classList.remove("cart-open");
  }

  /* =========================================================
     RENDER CART
  ========================================================= */

  function renderCart() {

    const cartPanel =
      document.getElementById("cartPanel");

    if (!cartPanel) return;

    /* EMPTY BAG */

    if (cart.length === 0) {

      cartPanel.innerHTML = `

        <div class="cart-header">

          <h2>
            YOUR BAG
          </h2>

          <button
            class="cart-close"
            type="button"
            aria-label="Close bag"
          >
            ×
          </button>

        </div>

        <div class="cart-empty">

          <div class="cart-empty-icon">
            D
          </div>

          <h3>
            Your bag is empty.
          </h3>

          <p>
            Add something from the drop.
          </p>

        </div>
      `;

      cartPanel
        .querySelector(".cart-close")
        .addEventListener(
          "click",
          closeCart
        );

      return;
    }

    /* CART WITH PRODUCTS */

    cartPanel.innerHTML = `

      <div class="cart-header">

        <h2>
          YOUR BAG
        </h2>

        <button
          class="cart-close"
          type="button"
          aria-label="Close bag"
        >
          ×
        </button>

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

              <h3>
                ${item.name}
              </h3>

              <p>
                ${item.price}
              </p>

              <div class="quantity">

                <button
                  type="button"
                  class="quantity-remove"
                  data-index="${index}"
                >
                  −
                </button>

                <span>
                  ${item.quantity}
                </span>

                <button
                  type="button"
                  class="quantity-add"
                  data-index="${index}"
                >
                  +
                </button>

              </div>

            </div>

          </div>

        `).join("")}

      </div>

      <div class="cart-footer">

        <div class="cart-total">

          <span>
            TOTAL
          </span>

          <strong>
            £${getTotal().toFixed(2)}
          </strong>

        </div>

        <button
          class="checkout-button"
          type="button"
        >
          CHECKOUT
        </button>

      </div>
    `;

    /* CLOSE */

    cartPanel
      .querySelector(".cart-close")
      .addEventListener(
        "click",
        closeCart
      );

    /* MINUS */

    cartPanel
      .querySelectorAll(".quantity-remove")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            removeOne(
              Number(button.dataset.index)
            );

          }
        );

      });

    /* PLUS */

    cartPanel
      .querySelectorAll(".quantity-add")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            addOne(
              Number(button.dataset.index)
            );

          }
        );

      });

    /* CHECKOUT */

    cartPanel
      .querySelector(".checkout-button")
      .addEventListener(
        "click",
        event => {

          event.preventDefault();

          openCheckout();

        }
      );
  }

  /* =========================================================
     CHECKOUT
  ========================================================= */
function openCheckout() {

    if (cart.length === 0) {

      showToast(
        "Your bag is empty."
      );

      return;
    }

    const oldCheckout =
      document.getElementById(
        "checkoutOverlay"
      );

    if (oldCheckout) {
      oldCheckout.remove();
    }

    const checkout =
      document.createElement("div");

    checkout.id =
      "checkoutOverlay";

    checkout.className =
      "checkout-overlay";

    checkout.innerHTML = `

      <div class="checkout-box">

        <div class="checkout-header">

          <h1>
            CHECKOUT
          </h1>

          <button
            id="checkoutClose"
            type="button"
            aria-label="Close checkout"
          >
            ×
          </button>

        </div>

        <form id="checkoutForm">

          <!-- CUSTOMER DETAILS -->

          <section>

            <p class="eyebrow">
              YOUR DETAILS
            </p>

            <label for="customerName">
              Full name
            </label>

            <input
              id="customerName"
              type="text"
              placeholder="Your full name"
              autocomplete="name"
              required
            >

            <label for="customerEmail">
              Email address
            </label>

            <input
              id="customerEmail"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              required
            >

            <label for="customerPhone">
              Phone number
            </label>

            <input
              id="customerPhone"
              type="tel"
              placeholder="07..."
              autocomplete="tel"
              required
            >

          </section>

          <!-- DELIVERY ADDRESS -->

          <section>

            <p class="eyebrow">
              DELIVERY ADDRESS
            </p>

            <label for="addressLine1">
              House number / name
            </label>

            <input
              id="addressLine1"
              type="text"
              placeholder="House number or name"
              autocomplete="address-line1"
              required
            >

            <label for="addressLine2">
              Street
            </label>

            <input
              id="addressLine2"
              type="text"
              placeholder="Street"
              autocomplete="address-line2"
              required
            >

            <label for="customerCity">
              Town / City
            </label>

            <input
              id="customerCity"
              type="text"
              placeholder="Town or city"
              autocomplete="address-level2"
              required
            >

            <label for="customerPostcode">
              Postcode
            </label>

            <input
              id="customerPostcode"
              type="text"
              placeholder="e.g. SW1A 1AA"
              autocomplete="postal-code"
              required
            >

          </section>

          <!-- DELIVERY -->

          <section>

            <p class="eyebrow">
              DELIVERY METHOD
            </p>

            <div class="delivery-options">

              <label class="delivery-option">

                <input
                  type="radio"
                  name="delivery"
                  value="tracked48"
                  data-price="3.39"
                  checked
                >

                <span>

                  <strong>
                    Royal Mail Tracked 48
                  </strong>

                  <small>
                    2–3 working days
                  </small>

                </span>

                <b>
                  £3.39
                </b>

              </label>

              <label class="delivery-option">

                <input
                  type="radio"
                  name="delivery"
                  value="tracked24"
                  data-price="4.25"
                >

                <span>

                  <strong>
                    Royal Mail Tracked 24
                  </strong>

                  <small>
                    Next working day aim
                  </small>

                </span>

                <b>
                  £4.25
                </b>

              </label>

              <label class="delivery-option">

                <input
                  type="radio"
                  name="delivery"
                  value="special"
                  data-price="9.45"
                >

                <span>

                  <strong>
                    Royal Mail Special Delivery
                  </strong>

                  <small>
                    Next-day service
                  </small>

                </span>

                <b>
                  £9.45
                </b>

              </label>

            </div>

          </section>

          <!-- ORDER SUMMARY -->

          <section>

            <p class="eyebrow">
              ORDER SUMMARY
            </p>

            <div class="checkout-items">

              ${cart.map(item => `

                <div class="checkout-row">

                  <span>
                    ${item.name}
                    × ${item.quantity}
                  </span>

                  <strong>
                    £${(
                      getPrice(item.price) *
                      Number(item.quantity || 0)
                    ).toFixed(2)}
                  </strong>

                </div>

              `).join("")}

            </div>

            <hr>

            <div class="checkout-row">

              <span>
                Items
              </span>

              <strong>
                £${getTotal().toFixed(2)}
              </strong>

            </div>

            <div class="checkout-row">

              <span>
                Delivery
              </span>

              <strong id="checkoutDelivery">
                £3.39
              </strong>

            </div>

            <div class="checkout-grand-total">

              <strong>
                TOTAL
              </strong>

              <strong id="checkoutGrandTotal">
                £${(
                  getTotal() + 3.39
                ).toFixed(2)}
              </strong>

            </div>

          </section>

          <button
            id="continueToPayment"
            class="checkout-button checkout-submit"
            type="submit"
          >
            CONTINUE TO PAYMENT
          </button>

          <p class="checkout-note">
            Payment will be connected later.
            This is currently a test checkout.
          </p>

        </form>

      </div>
    `;

    document.body.appendChild(
      checkout
    );

    requestAnimationFrame(() => {
      checkout.classList.add(
        "checkout-open"
      );
    });

    /* CLOSE CHECKOUT */

    checkout
      .querySelector("#checkoutClose")
      .addEventListener(
        "click",
        () => {
          checkout.remove();
        }
      );

    /* DELIVERY CALCULATION */

    const deliveryInputs =
      checkout.querySelectorAll(
        'input[name="delivery"]'
      );

    const deliveryOutput =
      checkout.querySelector(
        "#checkoutDelivery"
      );

    const grandTotalOutput =
      checkout.querySelector(
        "#checkoutGrandTotal"
      );

    function updateDelivery() {

      const selected =
        checkout.querySelector(
          'input[name="delivery"]:checked'
        );

      if (!selected) return;

      const deliveryPrice =
        Number(
          selected.dataset.price
        );

      deliveryOutput.textContent =
        `£${deliveryPrice.toFixed(2)}`;

      grandTotalOutput.textContent =
        `£${(
          getTotal() +
          deliveryPrice
        ).toFixed(2)}`;
    }

    deliveryInputs.forEach(input => {

      input.addEventListener(
        "change",
        updateDelivery
      );

    });

    updateDelivery();

    /* FORM */

    checkout
      .querySelector("#checkoutForm")
      .addEventListener(
        "submit",
        event => {

          event.preventDefault();

          const name =
            checkout
              .querySelector("#customerName")
              .value
              .trim();

          const email =
            checkout
              .querySelector("#customerEmail")
              .value
              .trim();

          const phone =
            checkout
              .querySelector("#customerPhone")
              .value
              .trim();

          const postcode =
            checkout
              .querySelector("#customerPostcode")
              .value
              .trim();

          if (
            !name ||
            !email ||
            !phone ||
            !postcode
          ) {

            showToast(
              "Please complete your details."
            );

            return;
          }

          showToast(
            "Details saved. Payment is coming soon."
          );

          checkout
            .querySelector(
              "#continueToPayment"
            )
            .textContent =
              "PAYMENT COMING SOON";
        }
      );
  }

  /* =========================================================
     RENDER CATALOGUE
  ========================================================= */

  function renderCatalogue() {

    if (!items.length) {

      productsEl.innerHTML = `
        <p style="color:#a4a4ad;">
          No products found. Check catalogue.js.
        </p>
      `;

      return;
    }

    productsEl.innerHTML =
      items.map(
        (item, index) => `

        <article class="product reveal-product">

          <div
            class="product-image-wrap product-preview"
            data-index="${index}"
            role="button"
            tabindex="0"
            aria-label="Preview ${item.name}"
          >

            <img
              src="${item.image}"
              alt="${item.name}"
              class="product-image"
              loading="lazy"
            >

          </div>

          <div class="product-info">

            <h3>
              ${item.name}
            </h3>

            <p>
              ${item.description}
            </p>

            <strong>
              ${item.price}
            </strong>

            <button
              class="add"
              type="button"
              data-index="${index}"
            >
              ADD TO BAG
            </button>

          </div>

        </article>

      `
      ).join("");

    /* ADD TO BAG */

    productsEl
      .querySelectorAll(".add")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            addToCart(
              items[
                Number(
                  button.dataset.index
                )
              ]
            );

          }
        );

      });

    /* PRODUCT PREVIEW */

    productsEl
      .querySelectorAll(
        ".product-preview"
      )
      .forEach(preview => {

        const open = () => {

          createPreview(
            items[
              Number(
                preview.dataset.index
              )
            ]
          );

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
  }

  /* =========================================================
     BAG BUTTON
  ========================================================= */

  if (cartButton) {

    cartButton.addEventListener(
      "click",
      openCart
    );

  }

  /* =========================================================
     START
  ========================================================= */

  updateCount();

  renderCatalogue();

})();
                                              
