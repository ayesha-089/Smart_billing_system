// Smart Billing System — JavaScript fundamentals practice.
// The cart is an array of product objects.
const cart = [];

const elements = {
  productForm: document.querySelector("#product-form"),
  productName: document.querySelector("#product-name"),
  productPrice: document.querySelector("#product-price"),
  productQuantity: document.querySelector("#product-quantity"),
  productMessage: document.querySelector("#product-message"),
  cartBody: document.querySelector("#cart-body"),
  itemCount: document.querySelector("#item-count"),
  discount: document.querySelector("#discount"),
  tax: document.querySelector("#tax"),
  subtotal: document.querySelector("#subtotal"),
  discountAmount: document.querySelector("#discount-amount"),
  taxAmount: document.querySelector("#tax-amount"),
  grandTotal: document.querySelector("#grand-total")
};

const formatCurrency = (amount) => `Rs. ${amount.toLocaleString("en-PK", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}`;

// Function: calculate the sum of price × quantity for all cart items.
function calculateSubtotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Function: calculate discount, tax and final total.
function calculateTotals() {
  const subtotal = calculateSubtotal();
  const discountRate = Math.min(100, Math.max(0, Number(elements.discount.value) || 0));
  const taxRate = Math.min(100, Math.max(0, Number(elements.tax.value) || 0));
  const discountAmount = subtotal * discountRate / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * taxRate / 100;
  const grandTotal = taxableAmount + taxAmount;

  return { subtotal, discountAmount, taxAmount, grandTotal };
}

// Function: add a new product object to the cart array.
function addItem(name, price, quantity) {
  const cleanName = name.trim();
  if (!cleanName || !Number.isFinite(price) || price <= 0 ||
      !Number.isInteger(quantity) || quantity < 1) {
    return false;
  }

  const existingItem = cart.find(item =>
    item.name.toLowerCase() === cleanName.toLowerCase() && item.price === price
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: Date.now() + Math.random(),
      name: cleanName,
      price,
      quantity
    });
  }

  return true;
}

// Function: remove an item by its unique ID.
function removeItem(id) {
  const itemIndex = cart.findIndex(item => item.id === Number(id));
  if (itemIndex !== -1) cart.splice(itemIndex, 1);
  renderInvoice();
}

// Function: update the invoice table and all totals.
function renderInvoice() {
  if (cart.length === 0) {
    elements.cartBody.innerHTML = `<tr class="empty-row"><td colspan="5"><div class="empty-state"><span class="empty-icon">▤</span><strong>No products added</strong><small>Add a product above to start your invoice.</small></div></td></tr>`;
  } else {
    elements.cartBody.innerHTML = cart.map(item => `
      <tr>
        <td><strong>${escapeHTML(item.name)}</strong></td>
        <td>${formatCurrency(item.price)}</td>
        <td>${item.quantity}</td>
        <td><strong>${formatCurrency(item.price * item.quantity)}</strong></td>
        <td><button class="remove-btn" type="button" data-remove="${item.id}" aria-label="Remove ${escapeHTML(item.name)}">×</button></td>
      </tr>
    `).join("");
  }

  const quantityCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  elements.itemCount.textContent = `${quantityCount} ${quantityCount === 1 ? "item" : "items"}`;

  const totals = calculateTotals();
  elements.subtotal.textContent = formatCurrency(totals.subtotal);
  elements.discountAmount.textContent = formatCurrency(totals.discountAmount);
  elements.taxAmount.textContent = formatCurrency(totals.taxAmount);
  elements.grandTotal.textContent = formatCurrency(totals.grandTotal);

  renderPrintPreview(totals);
}

// Escape user-entered product names before inserting them into HTML.
function escapeHTML(value) {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

// Update the printable invoice preview.
function renderPrintPreview(totals) {
  const invoiceNumber = document.querySelector("#invoice-number").value || "—";
  const invoiceDate = document.querySelector("#invoice-date").value;
  const customerName = document.querySelector("#customer-name").value || "Customer name";
  const customerPhone = document.querySelector("#customer-phone").value || "Customer phone";

  document.querySelector("#preview-number").textContent = invoiceNumber;
  document.querySelector("#preview-date").textContent = invoiceDate || "Date not selected";
  document.querySelector("#preview-customer").textContent = customerName;
  document.querySelector("#preview-phone").textContent = customerPhone;

  document.querySelector("#preview-body").innerHTML = cart.length
    ? cart.map(item => `<tr><td>${escapeHTML(item.name)}</td><td>${formatCurrency(item.price)}</td><td>${item.quantity}</td><td>${formatCurrency(item.price * item.quantity)}</td></tr>`).join("")
    : `<tr><td colspan="4">No items added</td></tr>`;

  document.querySelector("#preview-totals").innerHTML = `
    <div class="summary-line"><span>Subtotal</span><strong>${formatCurrency(totals.subtotal)}</strong></div>
    <div class="summary-line"><span>Discount</span><strong>− ${formatCurrency(totals.discountAmount)}</strong></div>
    <div class="summary-line"><span>Tax</span><strong>${formatCurrency(totals.taxAmount)}</strong></div>
    <div class="summary-line summary-total"><span>Grand total</span><strong>${formatCurrency(totals.grandTotal)}</strong></div>
  `;
}

// Add product form event.
elements.productForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = elements.productName.value;
  const price = Number(elements.productPrice.value);
  const quantity = Number(elements.productQuantity.value);

  if (!elements.productForm.checkValidity()) {
    elements.productForm.reportValidity();
    elements.productMessage.textContent = "Please enter a valid product name, price, and quantity.";
    elements.productMessage.className = "form-message error";
    return;
  }

  if (addItem(name, price, quantity)) {
    elements.productMessage.textContent = "Product added to invoice successfully.";
    elements.productMessage.className = "form-message success";
    elements.productForm.reset();
    elements.productQuantity.value = "1";
    elements.productName.focus();
    renderInvoice();
  }
});

// Event delegation for remove buttons.
elements.cartBody.addEventListener("click", event => {
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) removeItem(removeButton.dataset.remove);
});

// Recalculate totals whenever discount or tax changes.
elements.discount.addEventListener("input", renderInvoice);
elements.tax.addEventListener("input", renderInvoice);

// Keep printable invoice details synchronized with customer fields.
["invoice-number", "invoice-date", "customer-name", "customer-phone"].forEach(id => {
  document.querySelector(`#${id}`).addEventListener("input", renderInvoice);
});

// Clear the current invoice after confirmation.
document.querySelector("#clear-invoice").addEventListener("click", () => {
  if (!cart.length || confirm("Are you sure you want to clear this invoice?")) {
    cart.length = 0;
    elements.productMessage.textContent = "Invoice cleared.";
    elements.productMessage.className = "form-message success";
    renderInvoice();
  }
});

// Print the invoice preview.
document.querySelector("#print-invoice").addEventListener("click", () => {
  if (cart.length === 0) {
    const message = document.querySelector("#summary-message");
    message.textContent = "Add at least one product before printing an invoice.";
    message.className = "form-message error";
    return;
  }
  window.print();
});

// Set today's date and render the initial zero-product invoice.
const today = new Date();
document.querySelector("#invoice-date").value =
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

renderInvoice();
