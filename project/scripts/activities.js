import { initNav, stampFooter } from './nav.js';
import { activities } from '../data/activities.mjs';

const gridEl = document.getElementById('activities-grid');
const countEl = document.getElementById('activity-count');
const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');

const modal = document.getElementById('activity-modal');
const modalImg = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalSeason = document.getElementById('modal-season');
const modalDesc = document.getElementById('modal-description');
const modalMeta = document.getElementById('modal-meta');

let currentFilter = 'all';

function render() {
    const visible = currentFilter === 'all'
        ? activities
        : activities.filter((a) => a.season === currentFilter);

    countEl.textContent = `${visible.length} activit${visible.length === 1 ? 'y' : 'ies'} - ${currentFilter === 'all' ? 'all seasons' : currentFilter}`;

    gridEl.innerHTML = visible
        .map((a) => `
            <article class="activity-card season-${a.season}" data-id="${a.id}" tabindex="0">
                <img src="images/activities/${a.image}" alt="${a.title}" loading="lazy" width="300" height="200">
                <h3>${a.title}</h3>
                <span class="season-tag">${a.season}</span>
                <p class="activity-desc">${a.short}</p>
            </article>
        `)
        .join('');

    gridEl.querySelectorAll('.activity-card').forEach((card) => {
        card.addEventListener('click', () => openModal(card.dataset.id));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(card.dataset.id);
            }
        });
    });
}

function openModal(id) {
    const a = activities.find((x) => x.id === id);
    if (!a) return;
    modalImg.src = `images/activities/${a.image}`;
    modalImg.alt = a.title;
    modalTitle.textContent = a.title;
    modalSeason.textContent = a.season;
    modalSeason.className = `season-tag season-${a.season}`;
    modalDesc.textContent = a.description;
    modalMeta.textContent = `Difficulty: ${a.difficulty} · Duration: ${a.duration}`;
    modal.showModal();
}

modal.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => modal.close());
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
});

filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
    });
});

initNav();
stampFooter();
render();
