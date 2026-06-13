import { initNav, stampFooter } from './nav.js';
import { slides } from '../data/carousel.mjs';
import { news } from '../data/news.mjs';

// ===== Weather configuration (reuses the chamber project key) =====
const OPENWEATHER_API_KEY = '674f4e29a0f93bfda31fbafaf123ec0e';
// Bukovel resort coordinates
const LAT = 48.36;
const LON = 24.40;
const UNITS = 'metric';

const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=${UNITS}&appid=${OPENWEATHER_API_KEY}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=${UNITS}&appid=${OPENWEATHER_API_KEY}`;

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
        currentEl.innerHTML = '<p class="coming-soon">Weather is temporarily unavailable.</p>';
        forecastEl.innerHTML = '';
        console.error('Weather load failed:', err);
    }
}

function renderCurrent(data) {
    const temp = Math.round(data.main.temp);
    const feels = Math.round(data.main.feels_like);
    const icon = data.weather[0].icon;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    currentEl.innerHTML = `
        <img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" width="70" height="70">
        <p class="temp">${temp}&deg;C</p>
        <p class="description">${description}</p>
        <p class="meta">Feels like ${feels}&deg;C &middot; Humidity ${humidity}%</p>
    `;
}

function renderForecast(data) {
    const noon = data.list.filter((e) => e.dt_txt.includes('12:00:00')).slice(0, 3);
    forecastEl.innerHTML = noon
        .map((e) => {
            const day = new Date(e.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
            return `
                <div class="forecast-day">
                    <span class="day-name">${day}</span>
                    <span class="day-temp">${Math.round(e.main.temp)}&deg;C</span>
                </div>
            `;
        })
        .join('');
}

// ===== News =====
function renderNews() {
    const listEl = document.getElementById('news-list');
    if (!listEl) return;
    listEl.innerHTML = news
        .map((n) => `
            <article class="news-item">
                <h3>${n.title}</h3>
                <p class="news-date">${new Date(n.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                <p>${n.body}</p>
            </article>
        `)
        .join('');
}

// ===== Carousel =====
const trackEl = document.getElementById('carousel-track');
const dotsEl = document.getElementById('carousel-dots');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');

let currentSlide = 0;
let carouselTimer = null;

function renderCarousel() {
    trackEl.innerHTML = slides
        .map((s, i) => `
            <div class="carousel-slide">
                <img src="images/carousel/${s.image}" alt="${s.alt}" width="1200" height="675" ${i === 0 ? '' : 'loading="lazy"'}>
                <div class="carousel-caption">${s.caption}</div>
            </div>
        `)
        .join('');
    dotsEl.innerHTML = slides
        .map((_, i) => `<button type="button" class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`)
        .join('');

    dotsEl.querySelectorAll('.carousel-dot').forEach((dot) => {
        dot.addEventListener('click', () => goTo(Number(dot.dataset.index)));
    });
}

function goTo(index) {
    currentSlide = (index + slides.length) % slides.length;
    trackEl.style.transform = `translateX(-${currentSlide * 100}%)`;
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentSlide);
    });
    restartAutoplay();
}

function next() { goTo(currentSlide + 1); }
function prev() { goTo(currentSlide - 1); }

function restartAutoplay() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(next, 6000);
}

if (trackEl) {
    renderCarousel();
    restartAutoplay();
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);
}

// ===== Boot =====
initNav();
stampFooter();
renderNews();
loadWeather();
