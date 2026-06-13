// Shared navigation + footer date logic used by every page in the final project.

export function initNav() {
    const hamburger = document.getElementById('hamburger');
    const primaryNav = document.getElementById('primary-nav');

    if (hamburger && primaryNav) {
        hamburger.addEventListener('click', () => {
            const isOpen = primaryNav.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
        });
    }
}

export function stampFooter() {
    const yearEl = document.getElementById('currentyear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    const lastModEl = document.getElementById('lastModified');
    if (lastModEl) {
        lastModEl.textContent = `Last Modification: ${document.lastModified}`;
    }
}
