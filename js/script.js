// app.js

// Global variables
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Redirect to a specific page
function redirectTo(page) {
    window.location.href = page;
}

// Handle order placement
function handleOrder() {
    const quantity = document.querySelector('input[type="number"]').value;
    const product = document.querySelector('#productSelect').value;
    const buyerType = document.querySelector('#buyerType').value;

    if (buyerType === "Select Buyer Type" || product === "Select Product" || quantity <= 0) {
        document.getElementById('responseMessage').innerText = "Please select a buyer type, product, and enter a valid quantity.";
        return;
    }

    const accepted = confirm(`Would you like to negotiate the price for ${quantity} of ${product} as a ${buyerType}?`);

    if (accepted) {
        document.getElementById('responseMessage').innerText = `Your order for ${quantity} of ${product} has been accepted. Redirecting to payment gateway...`;
    } else {
        const newOffer = prompt(`As a ${buyerType}, please make a new offer for ${quantity} of ${product}:`);
        if (newOffer) {
            document.getElementById('responseMessage').innerText = `Your new offer of ${newOffer} for ${quantity} of ${product} has been sent.`;
        }
    }
}

// Add item to cart and save in localStorage
function addToCart(item, price) {
    const existingItem = cart.find(product => product.item === item);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ item, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    alert(`${item} added to cart!`);
}

// Update cart display on cart.html
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    if (cartItems) {
        cartItems.innerHTML = '';

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-gray-600 text-center">Your cart is empty.</p>';
            totalPriceElement.innerText = "0.00";
            return;
        }

        cart.forEach((product, index) => {
            cartItems.innerHTML += `
                <li class="flex justify-between items-center border-b py-2">
                    <span>${product.item} - ₹${product.price.toFixed(2)} x ${product.quantity}</span>
                    <button onclick="removeFromCart(${index})" class="text-red-500 hover:underline">Remove</button>
                </li>
            `;
        });

        totalPriceElement.innerText = cart.reduce((sum, product) => sum + product.price * product.quantity, 0).toFixed(2);
    }
}

// Remove item from cart
function removeFromCart(index) {
    cart[index].quantity -= 1;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

// Redirect to cart page
function redirectToCart() {
    window.location.href = 'cart.html';
}

// Proceed to payment
function proceedToPayment() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before proceeding to payment.");
    } else {
        window.location.href = "payment.html";
    }
}

// Complete payment
function completePayment() {
    alert("Payment completed successfully!");
    localStorage.removeItem("cart"); // Clear cart after payment
    window.location.href = "index.html"; // Redirect to home page
}

// Load cart on cart.html page
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("cart.html")) {
        updateCart();
    }
});

// Chart.js for sales analytics
const ctx = document.getElementById('salesChart')?.getContext('2d');
if (ctx) {
    const salesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May'],
            datasets: [{
                label: 'Sales',
                data: [12, 19, 3, 5, 2],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// View listings
function viewListings() {
    window.location.href = 'your_listings.html';
}

// Add new product
function addNewProduct() {
    window.location.href = 'selling.html';
}

// Set user role and redirect
function selectRole(role) {
    if (role === 'farmer') {
        window.location.href = "farmer-home.html"; // Farmer's dashboard
    } else if (role === 'consumer') {
        window.location.href = "user.html"; // Consumer's dashboard
    }
}

// Quantity input controls
document.addEventListener("DOMContentLoaded", () => {
    const increaseBtn = document.getElementById('increaseBtn');
    const decreaseBtn = document.getElementById('decreaseBtn');
    const quantityInput = document.getElementById('quantityInput');

    if (increaseBtn && decreaseBtn && quantityInput) {
        increaseBtn.addEventListener('click', () => {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        });

        decreaseBtn.addEventListener('click', () => {
            if (quantityInput.value > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
            }
        });
    }

    // Image upload and preview
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');

    if (imageUpload && imagePreview) {
        imageUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Dynamic product selection based on category
    const categorySelect = document.getElementById('categorySelect');
    const productSelect = document.getElementById('productSelect');

    const productsByCategory = {
        vegetables: ["Carrots", "Tomatoes", "Potatoes", "Onions", "Lettuce", "Cucumbers", "Spinach"],
        fruits: ["Apples", "Bananas", "Oranges", "Grapes", "Mangoes", "Strawberries", "Watermelon"],
        grains: ["Wheat", "Rice", "Corn", "Barley", "Oats", "Millet", "Quinoa"]
    };

    if (categorySelect && productSelect) {
        categorySelect.addEventListener("change", function () {
            const selectedCategory = categorySelect.value;
            productSelect.innerHTML = "<option value=''>-- Select Product --</option>";

            if (productsByCategory[selectedCategory]) {
                productsByCategory[selectedCategory].forEach(product => {
                    const option = document.createElement("option");
                    option.value = product;
                    option.textContent = product;
                    productSelect.appendChild(option);
                });
                productSelect.disabled = false;
            } else {
                productSelect.disabled = true;
            }
        });
    }

    // List product
    const listProductBtn = document.getElementById('listProductBtn');

    if (listProductBtn) {
        listProductBtn.addEventListener('click', function() {
            const productName = productSelect.value;
            const productPrice = document.querySelector('input[type="text"]').value;
            const productQuantity = quantityInput.value;
            const productImage = imagePreview.src;

            if (productName && productPrice && productQuantity && productImage) {
                const listings = JSON.parse(localStorage.getItem("productListings")) || [];
                listings.push({
                    name: productName,
                    price: productPrice,
                    quantity: productQuantity,
                    image: productImage
                });
                localStorage.setItem("productListings", JSON.stringify(listings));

                alert("Product listed successfully!");
                window.location.href = "your_listings.html";
            } else {
                alert("Please fill in all fields.");
            }
        });
    }
});

// Load Listings on your_listings.html
function loadListings() {
    const listingsContainer = document.getElementById("listingsContainer");
    if (listingsContainer) {
        listingsContainer.innerHTML = "";

        const listings = JSON.parse(localStorage.getItem("productListings")) || [];

        if (listings.length === 0) {
            listingsContainer.innerHTML = '<p class="text-gray-600 text-center">No products listed yet.</p>';
            return;
        }

        listings.forEach((listing, index) => {
            const listingCard = document.createElement("div");
            listingCard.className = "flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-md mb-4";
            listingCard.innerHTML = `
                <div class="flex items-center space-x-4">
                    <img src="${listing.image}" alt="Product Image" class="w-16 h-16 rounded-lg object-cover">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-800">${listing.name}</h4>
                        <p class="text-gray-600">Price: ₹${listing.price} | Qty: ${listing.quantity}</p>
                    </div>
                </div>
                <button onclick="removeListing(${index})" class="text-red-500 hover:underline">Remove</button>
            `;
            listingsContainer.appendChild(listingCard);
        });
    }
}

// Remove Product from Listings
function removeListing(index) {
    let listings = JSON.parse(localStorage.getItem("productListings")) || [];
    listings.splice(index, 1);
    localStorage.setItem("productListings", JSON.stringify(listings));
    loadListings();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadListings();
});