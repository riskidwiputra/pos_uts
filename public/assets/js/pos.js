document.addEventListener('DOMContentLoaded', function() {
    const state = {
        products: [],
        cart: [],
        moneys: [2000, 5000, 10000, 20000, 50000, 100000],
        cash: 0,
        change: 0
    };

    // Load products
    async function loadProducts() {
        try {
            const response = await axios.get('/api/products');
            state.products = response.data.data.products;
            console.log(state.products)
            renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    // Render products grid
    function renderProducts() {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = state.products.map(product => `
            <div class="product-item cursor-pointer" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="w-full">
                <div class="flex pb-3 px-3 text-sm -mt-3">
                    <p class="flex-grow truncate mr-1">${product.name}</p>
                    <p class="nowrap font-semibold">${formatPrice(product.price)}</p>
                </div>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.product-item').forEach(item => {
            item.addEventListener('click', () => {
                const productId = item.dataset.id;
                addToCart(productId);
            });
        });
    }

    // Add to cart
    function addToCart(productId) {
        const product = state.products.find(p => p.id === parseInt(productId));
        if (!product) return;

        const existingItem = state.cart.find(item => item.productId === product.id);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            state.cart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                qty: 1
            });
        }

        renderCart();
        updateTotals();
    }

    // Render cart
    function renderCart() {
        const cartContainer = document.getElementById('cartItems');
        cartContainer.innerHTML = state.cart.map(item => `
            <div class="cart-item p-2 border-b">
                <div class="flex justify-between">
                    <div>
                        <p>${item.name}</p>
                        <p class="text-sm">${formatPrice(item.price)}</p>
                    </div>
                    <div class="flex items-center">
                        <button class="qty-btn" data-id="${item.productId}" data-action="decrease">-</button>
                        <span class="mx-2">${item.qty}</span>
                        <button class="qty-btn" data-id="${item.productId}" data-action="increase">+</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add quantity button handlers
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.dataset.id);
                const action = btn.dataset.action;
                updateQuantity(productId, action);
            });
        });
    }

    // Update quantity
    function updateQuantity(productId, action) {
        const item = state.cart.find(item => item.productId === productId);
        if (!item) return;

        if (action === 'increase') {
            item.qty += 1;
        } else if (action === 'decrease') {
            item.qty -= 1;
            if (item.qty <= 0) {
                state.cart = state.cart.filter(i => i.productId !== productId);
            }
        }

        renderCart();
        updateTotals();
    }

    // Update totals
    function updateTotals() {
        const total = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        state.change = state.cash - total;

        document.getElementById('total').textContent = formatPrice(total);
        document.getElementById('change').textContent = formatPrice(state.change);
    }

    // Format price
    function formatPrice(price) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(price);
    }

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        state.products.forEach(product => {
            const element = document.querySelector(`[data-id="${product.id}"]`);
            if (element) {
                element.style.display = product.name.toLowerCase().includes(keyword) ? 'block' : 'none';
            }
        });
    });

    // Initialize
    loadProducts();
});
