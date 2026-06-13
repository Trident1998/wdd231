import { initNav, stampFooter } from './nav.js';

const params = new URLSearchParams(window.location.search);
const listEl = document.getElementById('submission-list');

const FIELDS = [
    { key: 'author',    label: 'Name' },
    { key: 'season',    label: 'Season' },
    { key: 'rating',    label: 'Rating' },
    { key: 'body',      label: 'Review' },
    { key: 'timestamp', label: 'Submitted at' },
];

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatValue(key, value) {
    if (!value) return '(not provided)';
    if (key === 'timestamp') {
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? value : d.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
    }
    if (key === 'rating') {
        const n = Number(value);
        return Number.isFinite(n) ? `${n} / 5` : value;
    }
    return value;
}

function render() {
    if (!params.has('author')) {
        listEl.innerHTML = '<p>No submission data. Please complete the <a href="reviews.html">review form</a> first.</p>';
        return;
    }
    listEl.innerHTML = FIELDS
        .map(({ key, label }) => `
            <div class="row">
                <dt>${label}</dt>
                <dd>${escapeHtml(formatValue(key, params.get(key)))}</dd>
            </div>
        `)
        .join('');
}

initNav();
stampFooter();
render();
