// --- 1. Data ---
const products = [
    { id: 1, name: "Wireless Headphones", price: 99.00, category: "electronics", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop" },
    { id: 2, name: "Smart Watch", price: 199.00, category: "electronics", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop" },
    { id: 3, name: "Gaming Mouse", price: 49.00, category: "electronics", img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=300&auto=format&fit=crop" },
    { id: 4, name: "Mechanical Keyboard", price: 129.00, category: "electronics", img: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=300&auto=format&fit=crop" },
    { id: 5, name: "Sneakers", price: 89.00, category: "fashion", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop" },
    { id: 6, name: "Backpack", price: 59.00, category: "fashion", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=300&auto=format&fit=crop" },
    { id: 7, name: "Vintage Camera", price: 450.00, category: "electronics", img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=300&auto=format&fit=crop" },
    { id: 8, name: "Sunglasses", price: 85.00, category: "accessories", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=300&auto=format&fit=crop" },
    { id: 9, name: "Smartphone Stand", price: 25.00, category: "accessories", img: "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=300&auto=format&fit=crop" },
    { id: 10, name: "Bluetooth Speaker", price: 79.00, category: "electronics", img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=300&auto=format&fit=crop" },
    { id: 11, name: "Leather Wallet", price: 39.00, category: "accessories", img: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=300&auto=format&fit=crop" },
    { id: 12, name: "Coffee Mug", price: 15.00, category: "accessories", img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=300&auto=format&fit=crop" }
];

// --- 2. State ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentCategory = 'all';
let searchQuery = '';

// --- 3. DOM Elements ---
const productList = document.getElementById('productList');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountElement = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const wishlistCountElement = document.getElementById('wishlistCount');
const wishlistItemsContainer = document.getElementById('wishlistItems');
const productModal = document.getElementById('productModal');
const wishlistModal = document.getElementById('wishlistModal');
const orderModal = document.getElementById('orderModal');
const themeToggleBtn = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// --- 4. LocalStorage Save ---
function saveData() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// --- 5. Dark Mode Logic ---
// Check local storage for theme
if (localStorage.getItem('theme') === 'dark') {
    htmlElement.classList.add('dark');
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
} else {
    htmlElement.classList.remove('dark');
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
}

themeToggleBtn.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    if (htmlElement.classList.contains('dark')) {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
});

// --- 6. Render Products ---
function renderProducts() {
    const filteredProducts = products.filter(product => {
        const matchCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    if (filteredProducts.length === 0) {
        productList.innerHTML = `<div class="col-span-full text-center py-10 text-gray-500">No products found matching your criteria.</div>`;
        return;
    }

    productList.innerHTML = filteredProducts.map(product => {
        // FIX: Check if the product ID is inside the wishlist array correctly
        const isFav = wishlist.some(item => item === product.id); 
        
        return `
        <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
            <div class="relative h-48 overflow-hidden rounded-xl mb-4 bg-gray-100 dark:bg-gray-700 cursor-pointer" onclick="openModal(${product.id})">
                <img src="${product.img}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                <!-- Favorite Heart Icon -->
                <button onclick="event.stopPropagation(); toggleFavorite(${product.id})" class="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center transition hover:scale-110 ${isFav ? 'text-red-500' : 'text-gray-400'}">
                    <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
            </div>
            <h3 class="font-bold text-gray-800 dark:text-white mb-1 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition" onclick="openModal(${product.id})">${product.name}</h3>
            <p class="text-indigo-600 dark:text-indigo-400 font-bold mb-4">$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})" class="w-full bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 py-2 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-2 active:scale-90">
                <i class="fa-solid fa-plus"></i> Add to Cart
            </button>
        </div>
    `}).join('');
}

// --- 7. Toast Notification ---
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    
    // FIX: High contrast colors so it's always visible
    let bgColor = '';
    let icon = '';
    if (type === 'success') {
        bgColor = 'bg-green-600'; 
        icon = 'fa-check-circle';
    } else if (type === 'error') {
        bgColor = 'bg-red-600';
        icon = 'fa-exclamation-circle';
    } else {
        bgColor = 'bg-blue-600';
        icon = 'fa-info-circle';
    }
    
    toast.className = `${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 toast-show mb-2 font-medium border border-white/20`;
    toast.innerHTML = `<i class="fa-solid ${icon} text-lg"></i> <span>${message}</span>`;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- 8. Wishlist Logic ---
function toggleFavorite(productId) {
    const index = wishlist.indexOf(productId);
    if (index === -1) {
        wishlist.push(productId);
        showToast("Added to Wishlist!", "success");
    } else {
        wishlist.splice(index, 1);
        showToast("Removed from Wishlist!", "info");
    }
    saveData();
    renderProducts();
    updateWishlistUI();
}

function updateWishlistUI() {
    wishlistCountElement.textContent = wishlist.length;
    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = `<p class="text-gray-500 dark:text-gray-400 text-center py-4">Your wishlist is empty.</p>`;
    } else {
        wishlistItemsContainer.innerHTML = wishlist.map(id => {
            const product = products.find(p => p.id === id);
            return `
            <div class="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                <img src="${product.img}" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="font-bold text-sm text-gray-800 dark:text-white">${product.name}</h4>
                    <p class="text-indigo-600 dark:text-indigo-400 font-semibold">$${product.price.toFixed(2)}</p>
                </div>
                <button onclick="addToCart(${product.id})" class="text-green-500 hover:text-green-700 p-2 transition"><i class="fa-solid fa-cart-plus"></i></button>
                <button onclick="toggleFavorite(${product.id})" class="text-red-400 hover:text-red-600 p-2 transition"><i class="fa-solid fa-trash-can"></i></button>
            </div>
            `;
        }).join('');
    }
}

function toggleWishlist() {
    wishlistModal.classList.toggle('hidden');
    wishlistModal.classList.toggle('flex');
}

// --- 9. Modal Logic ---
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    document.getElementById('modalImg').src = product.img;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;
    
    document.getElementById('modalAddBtn').onclick = () => {
        addToCart(product.id);
        closeModal();
    };
    productModal.classList.remove('hidden');
    productModal.classList.add('flex');
}

function closeModal() {
    productModal.classList.add('hidden');
    productModal.classList.remove('flex');
}

// --- 10. Cart Logic ---
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const product = products.find(p => p.id === productId);
        cart.push({ ...product, quantity: 1 });
    }
    saveData();
    updateCartUI();
    showToast("Added to cart!", "success");
    
    cartCountElement.classList.add('animate-bounce', 'bg-green-500');
    setTimeout(() => cartCountElement.classList.remove('animate-bounce', 'bg-green-500'), 500);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveData();
    updateCartUI();
    showToast("Removed from cart!", "error");
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveData();
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-gray-500 dark:text-gray-400 text-center py-4">Your cart is empty.</p>`;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 item-fade-in">
                <img src="${item.img}" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="font-bold text-sm text-gray-800 dark:text-white">${item.name}</h4>
                    <p class="text-indigo-600 dark:text-indigo-400 font-semibold">$${item.price.toFixed(2)}</p>
                    <div class="flex items-center gap-3 mt-2">
                        <button onclick="updateQuantity(${item.id}, -1)" class="w-6 h-6 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-800 dark:text-white active:scale-75 transition"><i class="fa-solid fa-minus text-xs"></i></button>
                        <span class="text-sm font-bold text-gray-800 dark:text-white">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="w-6 h-6 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-800 dark:text-white active:scale-75 transition"><i class="fa-solid fa-plus text-xs"></i></button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-red-400 hover:text-red-600 p-2 hover:scale-125 transition"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `).join('');
    }

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// --- 11. Order Summary ---
function openOrderSummary() {
    if (cart.length === 0) {
        showToast("Your cart is empty!", "error");
        return;
    }
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('summarySubtotal').textContent = `$${totalPrice.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `$${totalPrice.toFixed(2)}`;
    orderModal.classList.remove('hidden');
    orderModal.classList.add('flex');
}

function closeOrderSummary() {
    orderModal.classList.add('hidden');
    orderModal.classList.remove('flex');
}

function confirmOrder() {
    closeOrderSummary();
    cart = [];
    saveData();
    updateCartUI();
    showToast("Order placed successfully! Thank you.", "success");
}

// --- 12. Toggle Cart Mobile ---
function toggleCart() {
    if (window.innerWidth < 1024) {
        cartSidebar.classList.toggle('hidden');
        if (!cartSidebar.classList.contains('hidden')) {
            cartSidebar.classList.add('fixed', 'inset-0', 'z-50', 'bg-white', 'dark:bg-gray-800', 'w-full', 'h-screen', 'overflow-y-auto', 'cart-open');
            document.body.style.overflow = 'hidden';
        } else {
            cartSidebar.classList.remove('fixed', 'inset-0', 'z-50', 'bg-white', 'dark:bg-gray-800', 'w-full', 'h-screen', 'overflow-y-auto', 'cart-open');
            document.body.style.overflow = 'auto';
        }
    }
}

// --- 13. Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    updateWishlistUI();
});