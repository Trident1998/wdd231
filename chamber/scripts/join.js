// ===== Timestamp (hidden field) =====
const timestampField = document.getElementById('timestamp');
if (timestampField) {
    timestampField.value = new Date().toISOString();
}

// ===== Membership benefit modals =====
const modalTriggers = document.querySelectorAll('[data-modal]');
const modalCloseButtons = document.querySelectorAll('[data-close]');

modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
        const modalId = trigger.dataset.modal;
        const modal = document.getElementById(modalId);
        if (modal && typeof modal.showModal === 'function') {
            modal.showModal();
        }
    });
});

modalCloseButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('dialog');
        if (modal) modal.close();
    });
});

// Close dialog when clicking on the backdrop area
document.querySelectorAll('dialog.benefits-modal').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
});

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
