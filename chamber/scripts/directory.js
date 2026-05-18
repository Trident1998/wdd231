const membersContainer = document.getElementById('members');
const gridBtn = document.getElementById('view-grid');
const listBtn = document.getElementById('view-list');
const hamburger = document.getElementById('hamburger');
const primaryNav = document.getElementById('primary-nav');

const MEMBERSHIP_LABELS = {
    1: 'Member',
    2: 'Silver Member',
    3: 'Gold Member',
};

async function loadMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const members = await response.json();
        renderMembers(members);
    } catch (error) {
        membersContainer.innerHTML = `<p class="error">Unable to load members at this time.</p>`;
        console.error('Failed to load members:', error);
    }
}

function renderMembers(members) {
    membersContainer.innerHTML = members
        .map((m) => `
            <article class="member-card">
                <img class="member-logo" src="images/members/${m.image}" alt="${m.name} logo" loading="lazy">
                <h3>${m.name}</h3>
                <p class="member-tagline">${m.tagline}</p>
                <p class="member-info">${m.address}</p>
                <p class="member-info">${m.phone}</p>
                <p class="member-info"><a href="${m.website}" target="_blank">${m.website.replace(/^https?:\/\//, '')}</a></p>
                <span class="member-level level-${m.membership}">${MEMBERSHIP_LABELS[m.membership]}</span>
            </article>
        `)
        .join('');
}

function setView(view) {
    membersContainer.classList.toggle('grid', view === 'grid');
    membersContainer.classList.toggle('list', view === 'list');

    gridBtn.classList.toggle('active', view === 'grid');
    gridBtn.setAttribute('aria-pressed', String(view === 'grid'));

    listBtn.classList.toggle('active', view === 'list');
    listBtn.setAttribute('aria-pressed', String(view === 'list'));
}

gridBtn.addEventListener('click', () => setView('grid'));
listBtn.addEventListener('click', () => setView('list'));

if (hamburger && primaryNav) {
    hamburger.addEventListener('click', () => {
        const isOpen = primaryNav.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });
}

document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Modification: ${document.lastModified}`;

loadMembers();
