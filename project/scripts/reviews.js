import { initNav, stampFooter } from './nav.js';
import { defaultReviews } from '../data/reviews.mjs';

const LS_REVIEWS = 'bukovel.userReviews';
const LS_LIKES = 'bukovel.likedReviews';

const listEl = document.getElementById('reviews-list');
const countEl = document.getElementById('review-count');
const sortButtons = document.querySelectorAll('.filter-btn[data-sort]');
const form = document.getElementById('review-form');
const timestampField = document.getElementById('timestamp');

let currentSort = 'newest';

function loadUserReviews() {
    try {
        return JSON.parse(localStorage.getItem(LS_REVIEWS) || '[]');
    } catch {
        return [];
    }
}

function loadLikes() {
    try {
        return new Set(JSON.parse(localStorage.getItem(LS_LIKES) || '[]'));
    } catch {
        return new Set();
    }
}

function saveLikes(set) {
    localStorage.setItem(LS_LIKES, JSON.stringify([...set]));
}

function getAllReviews() {
    return [...defaultReviews, ...loadUserReviews()];
}

function sortReviews(reviews, mode) {
    const arr = [...reviews];
    if (mode === 'newest') {
        return arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    if (mode === 'liked') {
        return arr.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    return arr;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function stars(rating) {
    const n = Math.max(0, Math.min(5, Number(rating) || 0));
    return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function render() {
    const all = getAllReviews();
    const sorted = sortReviews(all, currentSort);
    const totalLikes = all.reduce((sum, r) => sum + (r.likes || 0), 0);
    const likes = loadLikes();

    countEl.textContent = `${all.length} reviews · ${totalLikes} total likes`;

    listEl.innerHTML = sorted
        .map((r) => {
            const isLiked = likes.has(r.id);
            return `
                <article class="review-card" data-id="${r.id}">
                    <div class="review-header">
                        <span class="author">${escapeHtml(r.author)}</span>
                        <span class="review-rating" aria-label="Rating ${r.rating} out of 5">${stars(r.rating)}</span>
                    </div>
                    <p class="review-date">${new Date(r.date).toLocaleDateString('en-US', { dateStyle: 'long' })} &middot; ${escapeHtml(r.season)}</p>
                    <p class="review-body">${escapeHtml(r.body)}</p>
                    <button type="button" class="like-btn ${isLiked ? 'liked' : ''}" data-id="${r.id}" aria-pressed="${isLiked}">
                        <span>${isLiked ? '♥' : '♡'}</span>
                        <span class="like-count">${r.likes || 0}</span>
                    </button>
                </article>
            `;
        })
        .join('');

    listEl.querySelectorAll('.like-btn').forEach((btn) => {
        btn.addEventListener('click', () => toggleLike(btn.dataset.id));
    });
}

function toggleLike(id) {
    const likes = loadLikes();
    const review = getAllReviews().find((r) => r.id === id);
    if (!review) return;
    if (likes.has(id)) {
        likes.delete(id);
        review.likes = Math.max(0, (review.likes || 0) - 1);
    } else {
        likes.add(id);
        review.likes = (review.likes || 0) + 1;
    }
    saveLikes(likes);
    // Persist counts on user reviews; defaults stay as in-memory only adjustment for display sort
    const userReviews = loadUserReviews();
    const userIndex = userReviews.findIndex((r) => r.id === id);
    if (userIndex >= 0) {
        userReviews[userIndex].likes = review.likes;
        localStorage.setItem(LS_REVIEWS, JSON.stringify(userReviews));
    }
    render();
}

sortButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        sortButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentSort = btn.dataset.sort;
        render();
    });
});

// Stamp the hidden timestamp field at load
if (timestampField) {
    timestampField.value = new Date().toISOString();
}

// Save submitted review to LocalStorage just before the form GETs to the action page
if (form) {
    form.addEventListener('submit', () => {
        const data = new FormData(form);
        const review = {
            id: `u${Date.now()}`,
            author: data.get('author'),
            season: data.get('season'),
            rating: Number(data.get('rating')),
            body: data.get('body'),
            date: new Date().toISOString().slice(0, 10),
            likes: 0
        };
        const userReviews = loadUserReviews();
        userReviews.push(review);
        localStorage.setItem(LS_REVIEWS, JSON.stringify(userReviews));
    });
}

initNav();
stampFooter();
render();
