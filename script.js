// =========================================
// DRISTLELET — MAIN WEBSITE JAVASCRIPT
// CART + CHECKOUT + DELIVERY CALCULATOR
// =========================================

document.addEventListener("DOMContentLoaded", () => {

  const productsEl = document.getElementById("products");
  const cartButton = document.getElementById("cartButton");
  const countEl = document.getElementById("cartCount");
  const toast = document.getElementById("toast");

  if (!productsEl) {
    console.error("DRISTLELET: products area not found.");
    return;
  }


  // =========================================
  // CART
  // =========================================

  let cart = [];

  try {
    cart = JSON.parse(
      localStorage.getItem("dristleletCartItems") || "[]"
    );

    if (!Array.isArray(cart)) {
      cart = [];
    }

  } catch (error) {
    cart = [];
  }


  // =========================================
  // DELIVERY OPTIONS
  // =========================================

  const deliveryOptions = {

    tracked48: {
      name: "Royal Mail Tracked 48",
      price: 3.65,
      description: "Aims for 2–3 working days"
    },

    tracked24: {
      name: "Royal Mail Tracked 24",
      price: 4.65,
      description: "Aims for next working day"
    },

    special: {
      name: "Royal Mail Special Delivery by 1pm",
      price: 9.45,
      description: "Guaranteed by 1pm next working day*"
    }

  };


  let selectedDelivery = "tracked48";


  // =========================================
  // UPDATE CART COUNT
  // =========================================

  function updateCount() {

    const count = cart.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
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


  // =========================================
  // TOAST
  // =========================================

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


  // =========================================
  // PRODUCT PRICE
  // =========================================

  function priceNumber(price) {

    return Number(
      String(price)
        .replace("£", "")
        .replace(",", "")
        .trim()
    ) || 0;

  }


  // =========================================
  // CART TOTAL
  // =========================================

  function getCartTotal() {

    return cart.reduce(
      (total, item) => {

        return total +
          priceNumber(item.price) *
          Number(item.quantity || 0);

      },
      0
    );

  }


  // =========================================
  // IMAGE PREVIEW
  // =========================================

  function createPreview(item) {

    const old =
      document.getElementById("imagePreview");

    if (old) {
      old.remove();
    }


    const preview =
      document.createElement("div");

    preview.id = "imagePreview";
    preview.className = "image-preview";


    preview.innerHTML = `

      <button
        class="preview-close"
        type="button"
      >
        ×
      </button>

      <div class="preview-content">

        <img
          src="${item.image}"
          alt="${item.name}"
          class="preview-image product-image"
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


    function closePreview() {

      preview.classList.remove(
        "preview-open"
      );

      setTimeout(() => {

        if (preview.parentNode) {
          preview.remove();
        }

      }, 300);

    }


    preview
      .querySelector(".preview-close")
      .addEventListener(
        "click",
        closePreview
      );


    preview.addEventListener(
      "click",
      event => {

        if (event.target === preview) {
          closePreview();
        }

      }
    );

  }


  // =========================================
  // ADD TO CART
  // =========================================

  function addToCart(item) {

    const existing =
      cart.find(
        product =>
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


  // =========================================
  // REMOVE ONE
  // =========================================

  function removeFromCart(index) {

    if (!cart[index]) return;


    cart[index].quantity =
      Number(cart[index].quantity || 0) - 1;


    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }


    updateCount();

    renderCart();

  }


  // =========================================
  // ADD ONE
  // =========================================

  function addOne(index) {

    if (!cart[index]) return;


    cart[index].quantity =
      Number(cart[index].quantity || 0) + 1;


    updateCount();

    renderCart();

  }


  // =========================================
  // OPEN CART
  // =========================================

  function openCart() {

    let cartPanel =
      document.getElementById("cartPanel");


    if (!cartPanel) {

      cartPanel =
        document.createElement("aside");

      cartPanel.id = "cartPanel";

      cartPanel.className =
        "cart-panel";

      document.body.appendChild(
        cartPanel
      );

    }


    renderCart();


    requestAnimationFrame(() => {

      cartPanel.classList.add(
        "cart-open"
      );

    });

  }


  // =========================================
  // CLOSE CART
  // =========================================

  function closeCart() {

    const cartPanel =
      document.getElementById("cartPanel");


    if (!cartPanel) return;


    cartPanel.classList.remove(
      "cart-open"
    );

  }


  // =========================================
  // CHECKOUT STYLE
  // =========================================

  function addCheckoutStyles() {

    if (
      document.getElementById(
        "dristleletCheckoutStyles"
      )
    ) {
      return;
    }


    const style =
      document.createElement("style");

    style.id =
      "dristleletCheckoutStyles";


    style.textContent = `

      .checkout-overlay {
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: rgba(0,0,0,.88);
        backdrop-filter: blur(14px);
        overflow-y: auto;
        padding: 20px;
        opacity: 0;
        transition: opacity .3s ease;
      }

      .checkout-overlay.open {
        opacity: 1;
      }

      .checkout-box {
        width: min(700px, 100%);
        margin: 30px auto;
        background: #0d0d12;
        border: 1px solid #292936;
        padding: 25px;
        color: white;
      }

      .checkout-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        margin-bottom: 25px;
      }

      .checkout-top h2 {
        margin: 0;
      }

      .checkout-close {
        width: 44px;
        height: 44px;
        background: transparent;
        color: white;
        border: 1px solid #444451;
        font-size: 25px;
        cursor: pointer;
      }

      .checkout-section {
        margin-top: 25px;
      }

      .checkout-section h3 {
        margin-bottom: 15px;
      }

      .checkout-form {
        display: grid;
        gap: 14px;
      }

      .checkout-form label {
        font-size: .75rem;
        color: #aaaab5;
      }

      .checkout-form input {
        width: 100%;
        margin-top: 7px;
        padding: 14px;
        background: #08080c;
        color: white;
        border: 1px solid #30303b;
        font-family: inherit;
        outline: none;
      }

      .checkout-form input:focus {
        border-color: #6b8cff;
      }

      .delivery-option {
        display: block;
        padding: 15px;
        margin-bottom: 10px;
        border: 1px solid #30303b;
        cursor: pointer;
        background: #08080c;
      }

      .delivery-option.selected {
        border-color: #6b8cff;
        box-shadow: 0 0 20px rgba(23,119,255,.12);
      }

      .delivery-option input {
        margin-right: 10px;
      }

      .delivery-name {
        font-weight: 800;
      }

      .delivery-description {
        display: block;
        color: #92929d;
        font-size: .7rem;
        margin-top: 7px;
        padding-left: 25px;
      }

      .checkout-summary {
        border-top: 1px solid #30303b;
        margin-top: 25px;
        padding-top: 20px;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        color: #aaaab5;
      }

      .summary-row.total {
        color: white;
        font-size: 1.1rem;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #30303b;
      }

      .place-order {
        width: 100%;
        margin-top: 20px;
        padding: 17px;
        border: 0;
        background: white;
        color: black;
        font-family: inherit;
        font-weight: 800;
        cursor: pointer;
      }

      .test-notice {
        margin-top: 15px;
        padding: 12px;
        border: 1px solid #343444;
        color: #8f8f9a;
        font-size: .65rem;
        line-height: 1.6;
      }

      @media (max-width: 600px) {

        .checkout-overlay {
          padding: 10px;
        }

        .checkout-box {
          padding: 18px;
          margin: 10px auto;
        }

      }

    `;


    document.head.appendChild(style);

  }


  // =========================================
  // CHECKOUT
  // =========================================

  function openCheckout() {

    if (cart.length === 0) {

      showToast(
        "Your bag is empty."
      );

      return;

    }


    addCheckoutStyles();


    const old =
      document.getElementById(
        "checkoutOverlay"
      );


    if (old) {
      old.remove();
    }


    const checkout =
      document.createElement("div");

    checkout.id =
      "checkoutOverlay";

    checkout.className =
      "checkout-overlay";


    checkout.innerHTML = `

      <div class="checkout-box">

        <div class="checkout-top">

          <h2>
            CHECKOUT
          </h2>

          <button
            class="checkout-close"
            type="button"
          >
            ×
          </button>

        </div>


        <form
          class="checkout-form"
          id="checkoutForm"
        >


          <div class="checkout-section">

            <h3>
              YOUR DETAILS
            </h3>


            <label>
              Full name

              <input
                type="text"
                name="fullName"
                autocomplete="name"
                required
                placeholder="Your full name"
              >

            </label>


            <label>
              Email address

              <input
                type="email"
                name="email"
                autocomplete="email"
                required
                placeholder="you@example.com"
              >

            </label>


            <label>
              Phone number

              <input
                type="tel"
                name="phone"
                autocomplete="tel"
                required
                placeholder="Your phone number"
              >

            </label>

          </div>


          <div class="checkout-section">

            <h3>
              DELIVERY ADDRESS
            </h3>


            <label>
              House number and street

              <input
                type="text"
                name="address"
                autocomplete="street-address"
                required
                placeholder="House number and street"
              >

            </label>


            <label>
              Town / City

              <input
                type="text"
                name="city"
                autocomplete="address-level2"
                required
                placeholder="Town or city"
              >

            </label>


            <label>
              Postcode

              <input
                type="text"
                name="postcode"
                autocomplete="postal-code"
                required
                placeholder="Postcode"
              >

            </label>

          </div>


          <div class="checkout-section">

            <h3>
              DELIVERY METHOD
            </h3>


            <div id="deliveryOptions">

              ${Object.entries(
                deliveryOptions
              ).map(
                ([key, option]) => `

                  <label
                    class="delivery-option ${
                      key === selectedDelivery
                        ? "selected"
                        : ""
                    }"
                    data-delivery="${key}"
                  >

                    <input
                      type="radio"
                      name="delivery"
                      value="${key}"
                      ${
                        key === selectedDelivery
                          ? "checked"
                          : ""
                      }
                    >

                    <span class="delivery-name">
                      ${option.name}
                    </span>

                    <strong>
                      £${option.price.toFixed(2)}
                    </strong>

                    <span
                      class="delivery-description"
                    >
                      ${option.description}
                    </span>

                  </label>

                `
              ).join("")}

            </div>

          </div>


          <div
            class="checkout-summary"
            id="checkoutSummary"
          ></div>


          <button
            type="submit"
            class="place-order"
          >
            CONTINUE TO PAYMENT
          </button>


          <div class="test-notice">

            TESTING MODE — This GitHub version
            does not send or store your customer
            details and does not take payment.
            We will connect secure checkout/payment
            services before the official launch.

          </div>


        </form>

      </div>

    `;


    document.body.appendChild(
      checkout
    );


    requestAnimationFrame(() => {
      checkout.classList.add("open");
    });


    const form =
      checkout.querySelector(
        "#checkoutForm"
      );


    const summary =
      checkout.querySelector(
        "#checkoutSummary"
      );


    // =====================================
    // UPDATE CHECKOUT TOTAL
    // =====================================

    function updateCheckoutTotal() {

      const subtotal =
        getCartTotal();


      const delivery =
        deliveryOptions[
          selectedDelivery
        ].price;


      const total =
        subtotal + delivery;


      summary.innerHTML = `

        <div class="summary-row">

          <span>
            Items
          </span>

          <strong>
            £${subtotal.toFixed(2)}
          </strong>

        </div>


        <div class="summary-row">

          <span>
            Delivery
          </span>

          <strong>
            £${delivery.toFixed(2)}
          </strong>

        </div>


        <div class="summary-row total">

          <span>
            TOTAL
          </span>

          <strong>
            £${total.toFixed(2)}
          </strong>

        </div>

      `;

    }


    updateCheckoutTotal();


    // =====================================
    // DELIVERY SELECTION
    // =====================================

    checkout
      .querySelectorAll(
        ".delivery-option"
      )
      .forEach(option => {

        option.addEventListener(
          "click",
          () => {

            selectedDelivery =
              option.dataset.delivery;


            checkout
              .querySelectorAll(
                ".delivery-option"
              )
              .forEach(item => {

                item.classList.remove(
                  "selected"
                );

              });


            option.classList.add(
              "selected"
            );


            const radio =
              option.querySelector(
                "input"
              );


            radio.checked = true;


            updateCheckoutTotal();

          }
        );

      });


    // =====================================
    // CLOSE CHECKOUT
    // =====================================

    checkout
      .querySelector(
        ".checkout-close"
      )
      .addEventListener(
        "click",
        () => {

          checkout.classList.remove(
            "open"
          );

          setTimeout(() => {
            checkout.remove();
          }, 300);

        }
      );


    // =====================================
    // FORM SUBMISSION
    // =====================================

    form.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        if (!form.checkValidity()) {

          form.reportValidity();

          return;

        }


        showToast(
          "Checkout details accepted for testing."
        );


        setTimeout(() => {

          alert(
            "TEST MODE\n\n" +
            "Your checkout form works!\n\n" +
            "No personal information or payment " +
            "has been sent or stored.\n\n" +
            "The next stage will connect this " +
            "to secure payment and order processing."
          );

        }, 300);

      }
    );

  }


  // =========================================
  // RENDER CART
  // =========================================

  function renderCart() {

    const cartPanel =
      document.getElementById("cartPanel");


    if (!cartPanel) return;


    if (cart.length === 0) {

      cartPanel.innerHTML = `

        <div class="cart-header">

          <h2>
            YOUR BAG
          </h2>

          <button
            class="cart-close"
            type="button"
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
        .querySelector(
          ".cart-close"
        )
        .addEventListener(
          "click",
          closeCart
        );


      return;

    }


    cartPanel.innerHTML = `

      <div class="cart-header">

        <h2>
          YOUR BAG
        </h2>

        <button
          class="cart-close"
          type="button"
        >
          ×
        </button>

      </div>


      <div class="cart-items">

        ${cart.map(
          (item, index) => `

          <div class="cart-item">

            <div class="cart-item-art">

              <img
                src="${item.image}"
                alt="${item.name}"
                class="product-image"
              >

            </div>


            <di
