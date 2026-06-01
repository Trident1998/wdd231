// ===== Display required form fields from URL parameters =====
const params = new URLSearchParams(window.location.search);
const listEl = document.getElementById('submissionList');

const REQUIRED_FIELDS = [
    { key: 'firstName',    label: 'First Name' },
    { key: 'lastName',     label: 'Last Name' },
    { key: 'email',        label: 'Email' },
    { key: 'mobile',       label: 'Mobile Phone' },
    { key: 'organization', label: 'Business / Organization' },
    { key: 'timestamp',    label: 'Submitted At' },
];

function formatTimestamp(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
    });
}

function renderSubmission() {
    if (!params.has('firstName')) {
        listEl.innerHTML = '<p>No submission data found. Please complete the <a href="join.html">join form</a> first.</p>';
        return;
    }

    listEl.innerHTML = REQUIRED_FIELDS.map(({ key, label }) => {
        let value = params.get(key) || '(not provided)';
        if (key === 'timestamp') value = formatTimestamp(value);
        return `
            <div class="row">
                <dt>${label}</dt>
                <dd>${escapeHtml(value)}</dd>
            </div>
        `;
    }).join('');
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

renderSubmission();

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
