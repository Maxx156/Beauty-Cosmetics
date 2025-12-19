// Данные товаров
const products = [
    {
        id: 1,
        name: "Матовые помады Classic",
        category: "lipstick",
        price: 1299,
        emoji: "💋",
        description: "Долговечная матовая помада с насыщенным цветом",
        badge: "Хит"
    },
    {
        id: 2,
        name: "Блеск для губ Glossy",
        category: "lipstick",
        price: 899,
        emoji: "✨",
        description: "Блестящий блеск с увлажняющим эффектом",
        badge: null
    },
    {
        id: 3,
        name: "Палетка теней Rainbow",
        category: "eyeshadows",
        price: 2499,
        emoji: "👁️",
        description: "12 оттенков с высокой пигментацией",
        badge: "Новинка"
    },
    {
        id: 4,
        name: "Тени для век Metallic",
        category: "eyeshadows",
        price: 1599,
        emoji: "🌟",
        description: "Металлические тени с эффектом сияния",
        badge: null
    },
    {
        id: 5,
        name: "Хайлайтер Diamond",
        category: "skincare",
        price: 1799,
        emoji: "💎",
        description: "Светоотражающий хайлайтер для сияния кожи",
        badge: "Популярное"
    },
    {
        id: 6,
        name: "Крем для лица Hydra",
        category: "skincare",
        price: 2199,
        emoji: "🧴",
        description: "Увлажняющий крем с гиалуроновой кислотой",
        badge: null
    },
    {
        id: 7,
        name: "Сыворотка Anti-Age",
        category: "skincare",
        price: 3499,
        emoji: "💧",
        description: "Омолаживающая сыворотка с ретинолом",
        badge: "Премиум"
    },
    {
        id: 8,
        name: "Румяна Blush Delight",
        category: "skincare",
        price: 1199,
        emoji: "🌸",
        description: "Нежные румяна с натуральным оттенком",
        badge: null
    },
    {
        id: 9,
        name: "Лак для ногтей Premium",
        category: "nail",
        price: 599,
        emoji: "💅",
        description: "Стойкий лак с глянцевым финишем",
        badge: null
    },
    {
        id: 10,
        name: "Набор лаков Collection",
        category: "nail",
        price: 1999,
        emoji: "🎨",
        description: "Набор из 6 лаков разных оттенков",
        badge: "Выгодно"
    },
    {
        id: 11,
        name: "Помада Velvet",
        category: "lipstick",
        price: 1499,
        emoji: "💄",
        description: "Вельветовая помада с бархатным финишем",
        badge: null
    },
    {
        id: 12,
        name: "Тушь для ресниц Volume",
        category: "eyeshadows",
        price: 999,
        emoji: "👁️",
        description: "Объемная тушь с эффектом наращивания",
        badge: null
    }
];

// Управление корзиной
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Если мы на странице товаров, загружаем товары
    if (document.getElementById('products-grid')) {
        loadProducts();
        setupFilters();
    }
    
    // Если мы на странице корзины, загружаем корзину
    if (document.getElementById('cart-items')) {
        loadCart();
    }
    
    // Обработка формы контактов
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});

// Загрузка товаров
function loadProducts(category = 'all') {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Создание карточки товара
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            ${product.emoji}
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        </div>
        <div class="product-info">
            <div class="product-category">${getCategoryName(product.category)}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-footer">
                <div class="product-price">${product.price} ₽</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    В корзину
                </button>
            </div>
        </div>
    `;
    return card;
}

// Получение названия категории
function getCategoryName(category) {
    const names = {
        'lipstick': 'Помады',
        'eyeshadows': 'Тени',
        'skincare': 'Уход',
        'nail': 'Маникюр'
    };
    return names[category] || category;
}

// Настройка фильтров
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            // Загружаем товары выбранной категории
            const category = this.getAttribute('data-category');
            loadProducts(category);
        });
    });
}

// Добавление в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    
    // Показываем уведомление
    showNotification('Товар добавлен в корзину!');
}

// Удаление из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    loadCart();
    showNotification('Товар удален из корзины');
}

// Изменение количества
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartCount();
        loadCart();
    }
}

// Сохранение корзины
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Обновление счетчика корзины
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// Загрузка корзины
function loadCart() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartSummary.style.display = 'block';
    
    // Очищаем старые элементы (кроме пустой корзины)
    const existingItems = cartItems.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());
    
    // Добавляем товары
    cart.forEach(item => {
        const cartItem = createCartItem(item);
        cartItems.insertBefore(cartItem, cartEmpty);
    });
    
    // Обновляем итоги
    updateCartSummary();
}

// Создание элемента корзины
function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
        <div class="cart-item-image">${item.emoji}</div>
        <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-category">${getCategoryName(item.category)}</div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="cart-item-price">${item.price * item.quantity} ₽</div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Удалить</button>
            </div>
        </div>
    `;
    return cartItem;
}

// Обновление итогов корзины
function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-price').textContent = totalPrice + ' ₽';
    document.getElementById('final-price').textContent = totalPrice + ' ₽';
}

// Очистка корзины
document.addEventListener('DOMContentLoaded', function() {
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите очистить корзину?')) {
                cart = [];
                saveCart();
                updateCartCount();
                loadCart();
                showNotification('Корзина очищена');
            }
        });
    }
    
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            alert('Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
            cart = [];
            saveCart();
            updateCartCount();
            loadCart();
        });
    }
});

// Обработка формы контактов
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };
    
    // В реальном приложении здесь был бы запрос на сервер
    alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
    e.target.reset();
}

// Показ уведомления
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b9d, #c44569);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавляем стили для анимации уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

