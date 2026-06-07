import { items } from '../data/discover-items.mjs';

// ===== Render the 8 discover cards =====
const gridEl = document.getElementById('discover-grid');

function renderCards() {
    gridEl.innerHTML = items
        .map((item, index) => `
            <section class="discover-card card-${index + 1}">
                <h2>${item.name}</h2>
                <figure>
                    <img src="images/discover/${item.image}" alt="${item.name}" loading="lazy" width="300" height="200">
                </figure>
                <address>${item.address}</address>
                <p>${item.description}</p>
                <button type="button" class="learn-more" data-wiki="${item.wiki}" aria-label="Learn more about ${item.name} on Wikipedia">learn more</button>
            </section>
        `)
        .join('');

    gridEl.querySelectorAll('.learn-more').forEach((btn) => {
        btn.addEventListener('click', () => {
            window.open(btn.dataset.wiki, '_blank');
        });
    });
}

renderCards();

// ===== Visit message via localStorage =====
const messageEl = document.getElementById('visit-message');
const VISIT_KEY = 'kyivChamber.lastVisit';
const DAY_MS = 1000 * 60 * 60 * 24;

function buildVisitMessage(lastVisitMs) {
    if (!lastVisitMs) {
        return 'Welcome! Let us know if you have any questions.';
    }
    const elapsed = Date.now() - Number(lastVisitMs);
    if (elapsed < DAY_MS) {
        return 'Back so soon! Awesome!';
    }
    const days = Math.floor(elapsed / DAY_MS);
    const noun = days === 1 ? 'day' : 'days';
    return `You last visited ${days} ${noun} ago.`;
}

const stored = localStorage.getItem(VISIT_KEY);
messageEl.textContent = buildVisitMessage(stored);
localStorage.setItem(VISIT_KEY, String(Date.now()));

// ===== Hamburger nav =====
const hamburger = document.getElementById('hamburger');
const primaryNav = document.getElementById('primary-nav');

if (hamburger && primaryNav) {
    hamburger.addEventListener('click', () => {
        const isOpen = primaryNav.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });
}

// ===== Footer dates =====
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Modification: ${document.lastModified}`;
