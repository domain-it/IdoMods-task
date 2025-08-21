const nav = document.querySelector('.nav');
const settings = document.querySelector('.settings');
const idomodsLogo = document.querySelector('.idomodsLogo');
const hamburger = document.querySelector('.hamburger');
const overlay = document.querySelector('.overlay');
const menu = document.querySelector('.side-menu');
const closeBtn = menu.querySelector('.close-btn');
let menuOpen = false;
const valueSpan = document.querySelector('.select-value');
const preview = document.querySelector('.preview');
const previewHeaderProductName = document.querySelector('.preview-header-product-name');
const previewCloseWindowBtn = document.querySelector('.preview-header-exit-button');
const trigger = document.querySelector('#selectTrigger');
const dropdown = document.querySelector('#selectDropdown');
const list = document.querySelector('#product-list');
const prevBtn = document.querySelector('#prevPage');
const nextBtn = document.querySelector('#nextPage');
const previewImg = document.querySelector('#preview-img');
let currentPage = 1;
let totalPages = 1;
let pageSize = 14; // domyślna liczba produktów na stronę
const values = [14, 24, 36]; // opcje rozmiaru strony
let selectedValue = 14;
const pageData = {
    "": {
        title: "Forma'sint. - Home Page",
        description: "Quality climbing gear and apparel for all levels. Shop trusted brands and gear up for your next adventure with comfort and safety."
    },
    "feature-products": {
        title: "Forma'sint. - Featured Products",
        description: "Discover our top climbing gear and apparel picks—trusted, durable, and ready for your next climb."
    },
    "product-listing": {
        title: "Forma'sint. - Products",
        description: "Explore our full range of climbing gear and clothing for all skill levels and outdoor adventures."
    }
}

function openMenu() {
    menu.classList.add('open');
    overlay.classList.add('active');   // włącz overlay przy otwarciu menu
    hamburger.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    menuOpen = true;
}

function closeMenu() {
    menu.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    menuOpen = false;
}

hamburger.addEventListener('click', () => {
    if (!menuOpen) {
        openMenu();
    } else {
        closeMenu();
    }
});

closeBtn.addEventListener('click', closeMenu);

// Obsługa klawiatury dla dostępności
hamburger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
    }
});
closeBtn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeBtn.click();
    }
});

function checkWidth() {
    if (window.innerWidth > 1033) {
        hamburger.classList.add('hidden');
        nav.classList.remove('hidden');
        settings.classList.remove('hidden');
        idomodsLogo.classList.remove('hidden');
        menu.classList.add('hidden');
    } else {
        hamburger.classList.remove('hidden'); // lub 'block', w zależności od stylu
        nav.classList.add('hidden');
        settings.classList.add('hidden');
        idomodsLogo.classList.add('hidden');
        menu.classList.remove('hidden');
    }
}
// Sprawdzenie przy starcie strony
checkWidth();
// Obsługa zmiany rozmiaru okna
window.addEventListener('resize', checkWidth);

function generateDropdown() {
    let optionsHtml = `<div class="select-option selected">${selectedValue}<img src="src/assets/icons/arrow_down.svg" alt="arrow"/></div>`;
    values
        .filter(v => v !== selectedValue)
        .sort((a, b) => a - b)
        .forEach(v => {
            optionsHtml += `<div class="select-option">${v}</div>`;
        });
    dropdown.innerHTML = optionsHtml;
    document.querySelectorAll('.select-option').forEach(option => {
        option.addEventListener('click', () => {
            if (option.classList.contains('selected')) return;
            selectedValue = parseInt(option.textContent);
            valueSpan.textContent = selectedValue;
            dropdown.style.display = 'none';
            pageSize = selectedValue;
            currentPage = 1; // reset do pierwszej strony przy zmianie rozmiaru
            loadProducts(currentPage).then();
            generateDropdown();
        });
    });
}

function closePreview() {
    previewCloseWindowBtn.addEventListener('click', () => {
        previewImg.setAttribute('src', '#');
        previewImg.setAttribute('loading', 'lazy');
        preview.classList.add('hidden');
        previewHeaderProductName.innerText = '';
        overlay.classList.remove('active');
    });
}

overlay.addEventListener('click', () => {
    if (menuOpen) {
        closeMenu();
    }
    preview.classList.add('hidden');
    previewImg.setAttribute('src', '#');
    previewHeaderProductName.innerText = '';

    overlay.classList.remove('active');
});


closePreview();

async function loadProducts(pageNumber = 1) {
    try {
        const response = await fetch(`https://brandstestowy.smallhost.pl/api/random?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        if (!response.ok) {
            console.error('Error ' + response.status);
            return;
        }
        const products = await response.json();
        totalPages = products.totalPages;
        currentPage = products.currentPage;
        list.innerHTML = '';
        products.data.forEach(product => {
            const li = document.createElement('li');
            li.classList.add('product');
            const text = document.createElement('p');
            text.classList.add('product-text');
            text.textContent = `ID: ${String(product.id).padStart(2, '0')}`;
            const img = document.createElement('img');
            img.classList.add('product-img');
            img.setAttribute('loading', 'lazy');
            img.src = product.image;
            img.alt = product.text;
            img.addEventListener('click', () => {
                const productName = document.createTextNode(`ID: ${String(product.id).padStart(2,'0')}`);
                previewImg.setAttribute('src', img.src);
                previewImg.setAttribute('loading', 'lazy');
                previewHeaderProductName.innerText = ''; // wyczyść przed dodaniem
                previewHeaderProductName.appendChild(productName);
                preview.classList.remove('hidden');
                overlay.classList.add('active');  // dodaj overlay przy otwarciu preview
            });
            li.appendChild(text);
            li.appendChild(img);
            list.appendChild(li);
        });
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
    } catch (error) {
        console.log(error);
    }
}

window.addEventListener("load", () => {
    loadProducts(currentPage).then();
    generateDropdown();

    trigger.addEventListener('click', () => {
        const isOpen = dropdown.style.display === 'block';
        dropdown.style.display = isOpen ? 'none' : 'block';
        trigger.parentElement.classList.toggle('open', !isOpen);
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            loadProducts(currentPage - 1).then();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            loadProducts(currentPage + 1).then();
        }
    });

    document.addEventListener('click', (e) => {
        if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
            trigger.parentElement.classList.remove('open');
        }
    });
});

function setMetaDescription(content) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
    }
    meta.content = content;
}

function updateTitleAndDescriptionFromHash() {
    const hash = window.location.hash.substring(1); // usuwa #
    if (hash && pageData[hash]) {
        document.title = pageData[hash].title;
        setMetaDescription(pageData[hash].description);
    }
}

// Nasłuchuj zmian fragmentu URL
window.addEventListener('hashchange', updateTitleAndDescriptionFromHash);
// Aktualizacja przy załadunku strony
updateTitleAndDescriptionFromHash();



const swiper = new Swiper(".swiper", {
    slidesPerView: "auto",
    centeredSlides: false,
    loop: true,
    spaceBetween:24,
    freeMode: true,
    grabCursor: true,
    autoplay: {
        delay: 3000,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    scrollbar: {
        el: '.swiper-scrollbar',
    }
});

