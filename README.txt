SMART BILLING SYSTEM — JAVASCRIPT FUNDAMENTALS

FOLDER STRUCTURE
billing/
  index.html
  css/style.css
  js/app.js

HOW TO RUN
1. Extract Smart_Billing_System.zip.
2. Open the extracted billing folder in Visual Studio Code.
3. Open index.html with Live Server, or open it directly in a browser.
4. Enter invoice/customer details.
5. Enter a product name, unit price, and quantity, then click Add item.
6. Add more products, remove products, and change discount/tax percentages.
7. Click Print invoice to print or save the invoice as PDF.

STEP-BY-STEP REQUIREMENTS COVERED
58. Invoice form: invoice number, date, customer name and phone.
59. Product controls: name, unit price and quantity.
60. Cart array: stores product objects.
61. Add/remove functions: addItem() and removeItem().
62. Subtotal: sum of product price multiplied by quantity.
63. Discount: percentage discount applied to subtotal.
64. Tax: percentage tax applied after discount.
65. Invoice rendering: dynamic item table, totals and printable preview.
66. Testing: supports zero, one and multiple products.

JAVASCRIPT CONCEPTS
- const and let variables
- Functions and reusable calculations
- Array methods: find, findIndex, reduce, map, splice
- Objects for product data
- DOM selection and event listeners
- Form input processing and HTML validation
- Dynamic HTML rendering
- Number formatting and print support

CALCULATION
Subtotal = Sum of (Unit Price × Quantity)
Discount Amount = Subtotal × Discount Rate / 100
Taxable Amount = Subtotal − Discount Amount
Tax Amount = Taxable Amount × Tax Rate / 100
Grand Total = Taxable Amount + Tax Amount

IMPORTANT
This is a front-end educational project. It does not save invoices to a database or connect to a payment system. Refreshing the browser resets the current cart.
