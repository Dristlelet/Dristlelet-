// =========================================
// DRISTLELET — MAIN WEBSITE JAVASCRIPT
// =========================================

document.addEventListener("DOMContentLoaded", () => {

  const productsEl = document.getElementById("products");
  const cartButton = document.getElementById("cartButton");
  const countEl = document.getElementById("cartCount");
  const toast = document.getElementById("toast");

  // Stop if the products area does not exist
  if (!productsEl) {
    console.error("DRISTLELET: #products was not found.");
    return;
  }


  // =========================================
  // CART STORAGE
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
    console.error("Could not load saved cart:", error);
    cart = [];
  }


  // =========================================
  // UPDATE CART COUNT
  // =========================================

  function updateCount() {

    const count = cart.reduce((total, item) => {
      return total + Number(item.quantity || 0);
    }, 0);

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
  // IMAGE PREVIEW
  // =========================================

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


    const closePreview = () => {

      preview.classList.remove(
        "preview-open"
      );

      setTimeout(() => {

        if (preview.parentNode) {
          preview.remove();
        }

      }, 300);
    };


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

    const existing = cart.find(
      product => product.name === item.name
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
  // REMOVE ONE ITEM
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
  // ADD ONE ITEM
  // =========================================

  function addOne(index) {

    if (!cart[index]) return;


    cart[index].quantity =
      Number(cart[index].quantity || 0) + 1;


    updateCount();

    renderCart();

  }


  // =========================================
  // CART TOTAL
  // =========================================

  function getTotal() {

    return cart.reduce(
      (total, item) => {

        const price = Number(
          String(item.price)
            .replace("£", "")
            .replace(",", "")
            .trim()
        ) || 0;


        return total +
          price *
          Number(item.quantity || 0);

      },
      0
    );

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
  // RENDER CART
  // =========================================

  function renderCart() {

    const cartPanel =
      document.getElementById("cartPanel");


    if (!cartPanel) return;


    // EMPTY BAG

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


    // ITEMS IN BAG

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


      <div class="cart-items">

        ${cart.map((item, index) => `

          <div class="cart-item">

            <div class="cart-item-art">

              <img
                src="${item.image}"
                alt="${item.name}"
                class="product-image"
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


    // CLOSE BUTTON

    cartPanel
      .querySelector(".cart-close")
      .addEventListener(
        "click",
        closeCart
      );


    // MINUS BUTTONS

    cartPanel
      .querySelectorAll(
        ".quantity-remove"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            removeFromCart(
              Number(
                button.dataset.index
              )
            );

          }
        );

      });


    // PLUS BUTTONS

    cartPanel
      .querySelectorAll(
        ".quantity-add"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            addOne(
              Number(
                button.dataset.index
              )
            );

          }
        );

      });


    // CHECKOUT

    const checkoutButton =
      cartPanel.querySelector(
        ".checkout-button"
      );


    if (checkoutButton) {

      checkoutButton.addEventListener(
        "click",
        () => {

          showToast(
            "Checkout is coming soon."
          );

        }
      );

    }

  }


  // =========================================
  // RENDER CATALOGUE
  // =========================================

  function renderCatalogue() {

    // Check that catalogue.js loaded

    if (
      !Array.isArray(
        window.catalogue
      )
    ) {

      console.error(
        "DRISTLELET ERROR: catalogue.js did not load correctly."
      );


      productsEl.innerHTML = `

        <div
          style="
            grid-column: 1 / -1;
            text-align: center;
            padding: 50px 20px;
            color: #888;
          "
        >

          <h3>
            Catalogue loading...
          </h3>

          <p>
            Please refresh the page.
          </p>

        </div>

      `;


      return;

    }


    const items =
      window.catalogue;


    console.log(
      "DRISTLELET catalogue loaded:",
      items
    );


    // If catalogue is empty

    if (items.length === 0) {

      productsEl.innerHTML = `

        <div
          style="
            grid-column: 1 / -1;
            text-align: center;
            padding: 50px;
          "
        >

          <h3>
            No products available yet.
          </h3>

        </div>

      `;


      return;

    }


    // CREATE PRODUCTS

    productsEl.innerHTML =
      items.map(
        (item, index) => `

        <article
          class="product reveal-product"
        >

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


    // =====================================
    // ADD TO BAG BUTTONS
    // =====================================

    productsEl
      .querySelectorAll(".add")
      .forEach(button => {

        button.addEventListener(
          "click",
          event => {

            event.stopPropagation();


            const index =
              Number(
                button.dataset.index
              );


            const item =
              items[index];


            if (item) {
              addToCart(item);
            }

          }
        );

      });


    // =====================================
    // IMAGE PREVIEW
    // =====================================

    productsEl
      .querySelectorAll(
        ".product-preview"
      )
      .forEach(preview => {


        const openPreview = () => {

          const index =
            Number(
              preview.dataset.index
            );


          const item =
            items[index];


          if (item) {
            createPreview(item);
          }

        };


        preview.addEventListener(
          "click",
          openPreview
        );


        preview.addEventListener(
          "keydown",
          event => {

            if (
              event.key === "Enter" ||
              event.key === " "
            ) {

              event.preventDefault();

              openPreview();

            }

          }
        );

      });


    // =====================================
    // PRODUCT SCROLL ANIMATION
    // =====================================

    const revealItems =
      productsEl.querySelectorAll(
        ".reveal-product"
      );


    if (
      "IntersectionObserver"
      in window
    ) {

      const observer =
        new IntersectionObserver(
          entries => {

            entries.forEach(
              entry => {

                if (
                  entry.isIntersecting
                ) {

                  entry.target.classList.add(
                    "product-visible"
                  );


                  observer.unobserve(
                    entry.target
                  );

                }

              }
            );

          },
          {
            threshold: 0.1
          }
        );


      revealItems.forEach(
        item => {
          observer.observe(item);
        }
      );

    } else {

      // Fallback for older browsers

      revealItems.forEach(
        item => {
          item.classList.add(
            "product-visible"
          );
        }
      );

    }

  }


  // =========================================
  // BAG BUTTON
  // =========================================

  if (cartButton) {

    cartButton.addEventListener(
      "click",
      openCart
    );

  }


  // =========================================
  // START WEBSITE
  // =========================================

  updateCount();

  renderCatalogue();

});
