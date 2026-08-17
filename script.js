(() => {

  /* =========================================
     DRISTLELET SHOP
     CART + CATALOGUE + CHECKOUT
  ========================================= */

  const productsEl = document.getElementById("products");
  const cartButton = document.getElementById("cartButton");
  const countEl = document.getElementById("cartCount");
  const toast = document.getElementById("toast");

  if (!productsEl) return;


  /* =========================================
     CART STORAGE
  ========================================= */

  let cart = JSON.parse(
    localStorage.getItem("dristleletCartItems") || "[]"
  );

  if (!Array.isArray(cart)) {
    cart = [];
  }


  /* =========================================
     CART COUNT
  ========================================= */

  function updateCount() {

    const count = cart.reduce(
      (total, item) => total + Number(item.quantity || 0),
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


  /* =========================================
     TOAST
  ========================================= */

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
     PRICE HELPER
  ========================================= */

  function getPrice(price) {

    return Number(
      String(price)
        .replace("£", "")
        .replace(",", "")
    ) || 0;

  }


  /* =========================================
     CART TOTAL
  ========================================= */

  function getTotal() {

    return cart.reduce((total, item) => {

      return total +
        getPrice(item.price) *
        Number(item.quantity || 0);

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

    const preview =
      document.createElement("div");

    preview.id = "imagePreview";
    preview.className = "image-preview";

    preview.innerHTML = `

      <button
        class="preview-close"
        type="button"
        aria-label="Close preview"
      >
        ×
      </button>

      <div class="preview-content">

        <img
          src="${item.image}"
          alt="${item.name}"
          class="preview-image"
        >

        <h2>${item.name}</h2>

        <p>
          ${item.description}
        </p>

        <strong>
          ${item.price}
        </strong>

      </div>
    `;

    document.body.appendChild(preview);

    requestAnimationFrame(() => {
      preview.classList.add("preview-open");
    });


    preview
      .querySelector(".preview-close")
      .addEventListener("click", () => {

        preview.classList.remove(
          "preview-open"
        );

        setTimeout(() => {
          preview.remove();
        }, 300);

      });


    preview.addEventListener(
      "click",
      event => {

        if (event.target === preview) {

          preview.classList.remove(
            "preview-open"
          );

          setTimeout(() => {
            preview.remove();
          }, 300);

        }

      }
    );

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
     REMOVE ONE ITEM
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
     OPEN CART
  ========================================= */

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

      cartPanel.classList.add(
        "cart-open"
      );

    });

  }


  /* =========================================
     CLOSE CART
  ========================================= */

  function closeCart() {

    const cartPanel =
      document.getElementById("cartPanel");

    if (!cartPanel) return;

    cartPanel.classList.remove(
      "cart-open"
    );

  }


  /* =========================================
     RENDER CART
  ========================================= */

  function renderCart() {

    const cartPanel =
      document.getElementById("cartPanel");

    if (!cartPanel) return;


    /* EMPTY BAG */

    if (cart.length === 0) {

      cartPanel.innerHTML = `

        <div class="cart-header">

          <h2>YOUR BAG</h2>

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
        .querySelector(".cart-close")
        .addEventListener(
          "click",
          closeCart
        );

      return;

    }


    /* CART WITH ITEMS */

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

            removeFromCart(
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

            const index =
              Number(button.dataset.index);

            if (cart[index]) {

              cart[index].quantity++;

            }

            updateCount();

            renderCart();

          }
        );

      });


    /* =====================================
       CHECKOUT BUTTON
    ===================================== */

    const checkoutButton =
      cartPanel.querySelector(
        ".checkout-button"
      );

    if (checkoutButton) {

      checkoutButton.addEventListener(
        "click",
        event => {

          event.preventDefault();

          openCheckout();

        }
      );

    }

  }


  /* =========================================
     CHECKOUT
  ========================================= */

  function openCheckout() {

    if (cart.length === 0) {

      showToast(
        "Your bag is empty."
      );

      return;

    }


    /* Remove old checkout */

    const oldCheckout =
      document.getElementById(
        "checkoutOverlay"
      );

    if (oldCheckout) {
      oldCheckout.remove();
    }


    /* Create checkout */

    const checkout =
      document.createElement("div");

    checkout.id =
      "checkoutOverlay";

    checkout.className =
      "checkout-overlay";


    /* Make absolutely sure
       checkout sits above cart */

    checkout.style.position = "fixed";
    checkout.style.inset = "0";
    checkout.style.zIndex = "999999";
    checkout.style.background =
      "rgba(3,3,8,0.98)";
    checkout.style.overflowY =
      "auto";


    /* =====================================
       CHECKOUT HTML
    ===================================== */

    checkout.innerHTML = `

      <div
        class="checkout-box"
        style="
          max-width:700px;
          margin:0 auto;
          padding:30px 20px 60px;
        "
      >


        <div
          class="checkout-header"
          style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:30px;
          "
        >

          <h1>
            CHECKOUT
          </h1>


          <button
            id="checkoutClose"
            type="button"
            style="
              font-size:32px;
              background:none;
              border:0;
              color:white;
              cursor:pointer;
            "
          >
            ×
          </button>

        </div>


        <!-- CUSTOMER DETAILS -->

        <section>

          <p class="eyebrow">
            YOUR DETAILS
          </p>


          <label>
            Full name
          </label>

          <input
            id="customerName"
            type="text"
            placeholder="Your full name"
            autocomplete="name"
            required
          >


          <label>
            Email address
          </label>

          <input
            id="customerEmail"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            required
          >


          <label>
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


          <label>
            House number / name
          </label>

          <input
            id="addressLine1"
            type="text"
            placeholder="House number or name"
            autocomplete="address-line1"
            required
          >


          <label>
            Street
          </label>

          <input
            id="addressLine2"
            type="text"
            placeholder="Street"
            autocomplete="address-line2"
            required
          >


          <label>
            Town / City
          </label>

          <input
            id="customerCity"
            type="text"
            placeholder="Town or city"
            autocomplete="address-level2"
            required
          >


          <label>
            Postcode
          </label>

          <input
            id="customerPostcode"
            type="text"
            placeholder="Postcode"
            autocomplete="postal-code"
            required
          >

        </section>


        <!-- DELIVERY -->

        <section>

          <p class="eyebrow">
            DELIVERY METHOD
          </p>


          <div
            class="delivery-options"
          >


            <label
              class="delivery-option"
            >

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


            <label
              class="delivery-option"
            >

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


            <label
              class="delivery-option"
            >

              <input
                type="radio"
                name="delivery"
                value="special"
                data-price="9.45"
              >

              <span>

                <strong>
                  Special Delivery
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


          <div
            id="checkoutItems"
          >

            ${cart.map(item => `

              <div
                style="
                  display:flex;
                  justify-content:space-between;
                  gap:20px;
                  margin-bottom:12px;
                "
              >

                <span>
                  ${item.name}
                  × ${item.quantity}
                </span>

                <strong>
                  £${(
                    getPrice(item.price) *
                    item.quantity
                  ).toFixed(2)}
                </strong>

              </div>

            `).join("")}

          </div>


          <hr>


          <div
            style="
              display:flex;
              justify-content:space-between;
              margin:15px 0;
            "
          >

            <span>
              Items
            </span>

            <strong>
              £${getTotal().toFixed(2)}
            </strong>

          </div>


          <div
            style="
              display:flex;
              justify-content:space-between;
              margin:15px 0;
            "
          >

            <span>
              Delivery
            </span>

            <strong
              id="checkoutDelivery"
            >
              £3.39
            </strong>

          </div>


          <div
            style="
              display:flex;
              justify-content:space-between;
              font-size:22px;
              margin-top:20px;
            "
          >

            <strong>
              TOTAL
            </strong>

            <strong
              id="checkoutGrandTotal"
            >
              £${(
                getTotal() + 3.39
              ).toFixed(2)}
            </strong>

          </div>

        </section>


        <!-- CONTINUE -->

        <button
          id="continueToPayment"
          type="button"
          class="checkout-button"
          style="
            width:100%;
            margin-top:30px;
          "
        >
          CONTINUE TO PAYMENT
        </button>


        <p
          style="
            text-align:center;
            opacity:.6;
            margin-top:20px;
            font-size:13px;
          "
        >
          Payment will be connected later.
        </p>


      </div>

    `;


    document.body.appendChild(
      checkout
    );


    /* =====================================
       CLOSE CHECKOUT
    ===================================== */

    document
      .getElementById("checkoutClose")
      .addEventListener(
        "click",
        () => {

          checkout.remove();

        }
      );


    /* =====================================
       DELIVERY CALCULATION
    ===================================== */

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


    /* =====================================
       CONTINUE TO PAYMENT
    ===================================== */

    document
      .getElementById(
        "continueToPayment"
      )
      .addEventListener(
        "click",
        () => {

          const name =
            document
              .getElementById(
                "customerName"
              )
              .value.trim();

          const email =
            document
              .getElementById(
                "customerEmail"
              )
              .value.trim();

          const phone =
            document
              .getElementById(
                "customerPhone"
              )
              .value.trim();

          const line1 =
            document
              .getElementById(
                "addressLine1"
              )
              .value.trim();

          const line2 =
            document
              .getElementById(
                "addressLine2"
              )
              .value.trim();

          const city =
            document
              .getElementById(
                "customerCity"
              )
              .value.trim();

          const postcode =
            document
              .getElementById(
         
