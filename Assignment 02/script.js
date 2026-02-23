// 1. Theme Switch (Light/Dark Mode)
const themeBtn = document.querySelector('#theme-toggle');
themeBtn.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

// 2. Show/Hide Product Section
const toggleProductsBtn = document.querySelector('#toggle-products');
const productSection = document.querySelector('#product-section');

toggleProductsBtn.addEventListener('click', function() {
    if (productSection.style.display === 'none') {
        productSection.style.display = 'block';
        toggleProductsBtn.textContent = 'Hide Products';
    } else {
        productSection.style.display = 'none';
        toggleProductsBtn.textContent = 'Show Products';
    }
});

// 3. Dynamic Text Change
const changeTextBtn = document.querySelector('#change-text-btn');
const heroTitle = document.querySelector('#hero-title');

changeTextBtn.addEventListener('click', function() {
    heroTitle.textContent = "Innovation at Your Fingertips!";
    heroTitle.style.color = "#2ecc71";
});