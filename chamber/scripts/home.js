// ===== OpenWeatherMap configuration =====
// Replace OPENWEATHER_API_KEY with your own free key from openweathermap.org.
const OPENWEATHER_API_KEY = '674f4e29a0f93bfda31fbafaf123ec0e';
const CITY = 'Kyiv,UA';
const UNITS = 'metric';

const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=${UNITS}&appid=${OPENWEATHER_API_KEY}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&units=${UNITS}&appid=${OPENWEATHER_API_KEY}`;

const currentEl = document.getElementById('weather-current');
const forecastEl = document.getElementById('weather-forecast');

async function loadWeather() {
    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl),
        ]);
        if (!currentRes.ok || !forecastRes.ok) {
            throw new Error(`HTTP ${currentRes.status} / ${forecastRes.status}`);
        }
        const current = await currentRes.json();
        const forecast = await forecastRes.json();
        renderCurrent(current);
        renderForecast(forecast);
    } catch (err) {
        currentEl.innerHTML = '<p>Weather is temporarily unavailable.</p>';
        forecastEl.innerHTML = '';
        console.error('Weather load failed:', err);
    }
}

function renderCurrent(data) {
    const temp = Math.round(data.main.temp);
    const feels = Math.round(data.main.feels_like);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const humidity = data.main.humidity;

    currentEl.innerHTML = `
        <img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" width="70" height="70">
        <div>
            <p class="temp">${temp}&deg;C</p>
            <p class="description">${description}</p>
            <p class="meta">Feels like ${feels}&deg;C &middot; Humidity ${humidity}%</p>
        </div>
    `;
}

function renderForecast(data) {
    const noonEntries = data.list
        .filter((entry) => entry.dt_txt.includes('12:00:00'))
        .slice(0, 3);

    forecastEl.innerHTML = noonEntries
        .map((entry) => {
            const date = new Date(entry.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const temp = Math.round(entry.main.temp);
            return `
                <div class="forecast-day">
                    <span class="day-name">${dayName}</span>
                    <span class="day-temp">${temp}&deg;C</span>
                </div>
            `;
        })
        .join('');
}

// ===== Spotlights =====
const MEMBERSHIP_LABELS = {
    1: 'Member',
    2: 'Silver Member',
    3: 'Gold Member',
};

const spotlightContainer = document.getElementById('spotlight-cards');

async function loadSpotlights() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const members = await response.json();

        const eligible = members.filter((m) => m.membership === 2 || m.membership === 3);
        const count = Math.min(3, eligible.length);
        const shuffled = [...eligible].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, count);

        renderSpotlights(selected);
    } catch (err) {
        spotlightContainer.innerHTML = '<p>Spotlights are temporarily unavailable.</p>';
        console.error('Spotlights load failed:', err);
    }
}

function renderSpotlights(members) {
    spotlightContainer.innerHTML = members
        .map(
            (m) => `
        <article class="spotlight-card">
            <img class="spotlight-logo" src="images/members/${m.image}" alt="${m.name} logo" loading="lazy">
            <h3>${m.name}</h3>
            <p class="spotlight-info">${m.address}</p>
            <p class="spotlight-info">${m.phone}</p>
            <p class="spotlight-info"><a href="${m.website}" target="_blank">${m.website.replace(/^https?:\/\//, '')}</a></p>
            <span class="member-level level-${m.membership}">${MEMBERSHIP_LABELS[m.membership]}</span>
        </article>
    `
        )
        .join('');
}

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

// ===== Kick off =====
loadWeather();
loadSpotlights();
