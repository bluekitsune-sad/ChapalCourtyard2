document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-icon');
    const adminLink = document.querySelector('[data-admin]');

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '\u2600' : '\uD83C\uDF19';
        }
    }

    menuToggle?.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks?.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle?.classList.remove('active');
            navLinks?.classList.remove('active');
        });
    });

    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';
    if (isAdmin) {
        openModal('adminModal');
    }

    adminLink?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('adminModal');
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.dataset.close;
            closeModal(modalId);
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal.id);
        });
    });

    function openModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    const data = {
        inquiries: JSON.parse(localStorage.getItem('cc2_inquiries') || '[]'),
        foodPlaces: JSON.parse(localStorage.getItem('cc2_food') || 'null') || [
            { name: 'CB Courtyard Bistro', type: 'Restaurant', distance: '0.2 km', phone: '0300-1234567', desc: 'On-site dining with Arabian and continental cuisine' },
            { name: 'Boss Cafe', type: 'Cafe, Pakistani', distance: '0.5 km', phone: '0333-7654321', desc: 'Famous for paneer reshmi handi and memoni khausa' },
            { name: 'Hobnob Bakery', type: 'Bakery, Desserts', distance: '0.4 km', phone: '0321-9876543', desc: 'Fresh cakes, breads and desserts' },
            { name: 'KFC Safoora', type: 'Fast Food', distance: '0.8 km', phone: '111-543-210', desc: 'Popular fast food chain near Safoora Chowrangi' }
        ],
        shops: JSON.parse(localStorage.getItem('cc2_shops') || 'null') || [
            { name: 'Bank AL Habib', type: 'Bank', distance: '0.3 km', phone: '021-111-222-444', desc: 'Alaska Residency Branch on Kiran Hospital Road' },
            { name: 'Meezan Bank', type: 'Islamic Bank', distance: '0.4 km', phone: '111-060-060', desc: 'Alaska Residency Branch, Gulzar E Hijri' },
            { name: 'SuperMart', type: 'Grocery', distance: '0.2 km', phone: '0300-5551234', desc: 'Daily essentials and fresh produce' },
            { name: 'PharmaPlus', type: 'Pharmacy', distance: '0.3 km', phone: '0321-4445566', desc: 'Medicines and health products' }
        ],
        settings: JSON.parse(localStorage.getItem('cc2_settings') || 'null') || {
            name: 'Chapal Courtyard 2',
            floors: '16',
            apartments: '84',
            address: 'Scheme 33, Gulzar E Hijri, Karachi',
            phone: '+92 21 1234 5678',
            email: 'info@chapalcourtyard.com'
        }
    };

    function saveData() {
        localStorage.setItem('cc2_inquiries', JSON.stringify(data.inquiries));
        localStorage.setItem('cc2_food', JSON.stringify(data.foodPlaces));
        localStorage.setItem('cc2_shops', JSON.stringify(data.shops));
        localStorage.setItem('cc2_settings', JSON.stringify(data.settings));
    }

    function loadGallery() {
        const container = document.getElementById('galleryGrid');
        if (!container) return;
        const images = ['img1.webp', 'img2.webp', 'img3.webp', 'img4.webp', 'img5.webp', 'img6.webp', 'img7.webp', 'img8.webp', 'img9.webp'];
        container.innerHTML = images.map((img, i) => `
            <div class="gallery-item" onclick="openLightbox('assets/${img}')">
                <img src="assets/${img}" alt="Building Image ${i + 1}" loading="lazy">
            </div>
        `).join('');
    }

    window.openLightbox = function(src) {
        const lightbox = document.getElementById('lightbox');
        const img = document.getElementById('lightboxImg');
        img.src = src;
        lightbox.style.display = 'flex';
    };

    document.querySelector('.lightbox-close')?.addEventListener('click', () => {
        document.getElementById('lightbox').style.display = 'none';
    });

    document.getElementById('lightbox')?.addEventListener('click', (e) => {
        if (e.target === document.getElementById('lightbox')) {
            document.getElementById('lightbox').style.display = 'none';
        }
    });

    function loadFoodPlaces() {
        const container = document.getElementById('foodList');
        if (!container) return;
        if (data.foodPlaces.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--secondary);">No food places added yet.</p>';
        } else {
            container.innerHTML = data.foodPlaces.map((place) => `
                <div class="place-card">
                    <h3>${escapeHtml(place.name)}</h3>
                    <p class="place-type">${escapeHtml(place.type)}</p>
                    <p class="place-distance">${escapeHtml(place.distance)}</p>
                    <p class="place-phone">${escapeHtml(place.phone)}</p>
                    <p class="place-desc">${escapeHtml(place.desc)}</p>
                </div>
            `).join('');
        }
    }

    function loadShops() {
        const container = document.getElementById('shopsList');
        if (!container) return;
        if (data.shops.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--secondary);">No shops added yet.</p>';
        } else {
            container.innerHTML = data.shops.map((shop) => `
                <div class="place-card">
                    <h3>${escapeHtml(shop.name)}</h3>
                    <p class="place-type">${escapeHtml(shop.type)}</p>
                    <p class="place-distance">${escapeHtml(shop.distance)}</p>
                    <p class="place-phone">${escapeHtml(shop.phone)}</p>
                    <p class="place-desc">${escapeHtml(shop.desc)}</p>
                </div>
            `).join('');
        }
    }

    function loadAdminFood() {
        const container = document.getElementById('adminFoodList');
        if (!container) return;
        if (data.foodPlaces.length === 0) {
            container.innerHTML = '<p style="color:var(--secondary);">No food places added yet.</p>';
        } else {
            container.innerHTML = data.foodPlaces.map((place, i) => `
                <div class="data-item">
                    <div class="data-item-info">
                        <h5>${escapeHtml(place.name)}</h5>
                        <p>${escapeHtml(place.type)} | ${escapeHtml(place.phone)}</p>
                    </div>
                    <div class="data-item-actions">
                        <button class="btn btn-danger btn-sm" onclick="deleteFood(${i})">Delete</button>
                    </div>
                </div>
            `).join('');
        }
        document.getElementById('foodCount').textContent = data.foodPlaces.length;
    }

    function loadAdminShops() {
        const container = document.getElementById('adminShopsList');
        if (!container) return;
        if (data.shops.length === 0) {
            container.innerHTML = '<p style="color:var(--secondary);">No shops added yet.</p>';
        } else {
            container.innerHTML = data.shops.map((shop, i) => `
                <div class="data-item">
                    <div class="data-item-info">
                        <h5>${escapeHtml(shop.name)}</h5>
                        <p>${escapeHtml(shop.type)} | ${escapeHtml(shop.phone)}</p>
                    </div>
                    <div class="data-item-actions">
                        <button class="btn btn-danger btn-sm" onclick="deleteShop(${i})">Delete</button>
                    </div>
                </div>
            `).join('');
        }
        document.getElementById('shopsCount').textContent = data.shops.length;
    }

    function loadInquiries() {
        const container = document.getElementById('inquiriesList');
        if (!container) return;
        if (data.inquiries.length === 0) {
            container.innerHTML = '<p style="color:var(--secondary);">No inquiries yet.</p>';
        } else {
            container.innerHTML = data.inquiries.map((inq, i) => `
                <div class="data-item">
                    <div class="data-item-info">
                        <h5>${escapeHtml(inq.name)}</h5>
                        <p><strong>Phone:</strong> ${escapeHtml(inq.phone)}</p>
                        <p><strong>Message:</strong> ${escapeHtml(inq.message)}</p>
                    </div>
                    <div class="data-item-actions">
                        <button class="btn btn-secondary btn-sm" onclick="deleteInquiry(${i})">Delete</button>
                    </div>
                </div>
            `).join('');
        }
        document.getElementById('inquiryCount').textContent = data.inquiries.length;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    window.deleteFood = function(index) {
        if (confirm('Delete this place?')) {
            data.foodPlaces.splice(index, 1);
            saveData();
            loadAdminFood();
            loadFoodPlaces();
        }
    };

    window.deleteShop = function(index) {
        if (confirm('Delete this shop?')) {
            data.shops.splice(index, 1);
            saveData();
            loadAdminShops();
            loadShops();
        }
    };

    window.deleteInquiry = function(index) {
        if (confirm('Delete this inquiry?')) {
            data.inquiries.splice(index, 1);
            saveData();
            loadInquiries();
        }
    };

    document.getElementById('addFoodBtn')?.addEventListener('click', () => openModal('addFoodModal'));
    document.getElementById('addShopBtn')?.addEventListener('click', () => openModal('addShopModal'));
    document.getElementById('openContactForm')?.addEventListener('click', () => openModal('contactFormModal'));

    document.getElementById('addFoodForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        data.foodPlaces.push({
            name: document.getElementById('foodName').value,
            type: document.getElementById('foodType').value,
            distance: document.getElementById('foodDistance').value,
            phone: document.getElementById('foodPhone').value,
            desc: document.getElementById('foodDesc').value
        });
        saveData();
        loadAdminFood();
        loadFoodPlaces();
        closeModal('addFoodModal');
        e.target.reset();
    });

    document.getElementById('addShopForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        data.shops.push({
            name: document.getElementById('shopName').value,
            type: document.getElementById('shopType').value,
            distance: document.getElementById('shopDistance').value,
            phone: document.getElementById('shopPhone').value,
            desc: document.getElementById('shopDesc').value
        });
        saveData();
        loadAdminShops();
        loadShops();
        closeModal('addShopModal');
        e.target.reset();
    });

    document.getElementById('contactForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('inquiryName').value;
        const phone = document.getElementById('inquiryPhone').value;
        const message = document.getElementById('inquiryMessage').value;
        
        data.inquiries.unshift({ name, phone, message, date: new Date().toLocaleString() });
        saveData();
        
        alert(`Thank you ${name}! Your inquiry has been submitted.\n\nWe will contact you at ${phone} shortly.`);
        closeModal('contactFormModal');
        e.target.reset();
    });

    document.getElementById('settingsForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        data.settings = {
            name: document.getElementById('settingName').value,
            floors: document.getElementById('settingFloors').value,
            apartments: document.getElementById('settingApartments').value,
            address: document.getElementById('settingAddress').value,
            phone: document.getElementById('settingPhone').value,
            email: document.getElementById('settingEmail').value
        };
        saveData();
        document.querySelector('.logo').textContent = data.settings.name;
        alert('Settings saved successfully!');
    });

    const emailForm = document.getElementById('emailForm');
    const otpForm = document.getElementById('otpForm');
    const normalLoginForm = document.getElementById('normalLoginForm');

    document.getElementById('showNormalLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginStep1').style.display = 'none';
        document.getElementById('normalLogin').style.display = 'block';
    });

    document.getElementById('backToEmail')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginStep2').style.display = 'none';
        document.getElementById('loginStep1').style.display = 'block';
    });

    document.getElementById('backToOtp')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('normalLogin').style.display = 'none';
        document.getElementById('loginStep1').style.display = 'block';
    });

    emailForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value;
        if (email) {
            document.getElementById('loginStep1').style.display = 'none';
            document.getElementById('loginStep2').style.display = 'block';
        }
    });

    otpForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const otp = document.getElementById('otpInput').value;
        if (otp && otp.length === 6) {
            showDashboard();
        }
    });

    normalLoginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username && password) {
            showDashboard();
        }
    });

    function showDashboard() {
        document.getElementById('loginStep2').style.display = 'none';
        document.getElementById('normalLogin').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        loadAdminFood();
        loadAdminShops();
        loadInquiries();
        document.getElementById('settingName').value = data.settings.name;
        document.getElementById('settingFloors').value = data.settings.floors;
        document.getElementById('settingApartments').value = data.settings.apartments;
        document.getElementById('settingAddress').value = data.settings.address;
        document.getElementById('settingPhone').value = data.settings.phone;
        document.getElementById('settingEmail').value = data.settings.email;
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.dashboard-content').forEach(c => c.style.display = 'none');
            btn.classList.add('active');
            const tabContent = document.getElementById('tab-' + btn.dataset.tab);
            if (tabContent) tabContent.style.display = 'block';
        });
    });

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        closeModal('adminModal');
        document.getElementById('loginStep1').style.display = 'block';
        document.getElementById('adminDashboard').style.display = 'none';
        document.getElementById('adminEmail').value = '';
        document.getElementById('otpInput').value = '';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.querySelector('[data-tab="overview"]').click();
    });

    loadGallery();
    loadFoodPlaces();
    loadShops();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(m => {
                if (m.style.display === 'flex') closeModal(m.id);
            });
        }
    });
});