// Theme & Language Logic Initialization
const body = document.body;
const html = document.documentElement;

// 1. Define Helper Functions First
const updateCursorColor = () => {
    const isDark = body.classList.contains('dark-mode');
    const color = isDark ? '214, 213, 142' : '4, 41, 64';
    document.documentElement.style.setProperty('--cursor-color', color);
};

const setTheme = (theme) => {
    body.classList.remove('light-mode', 'dark-mode');
    body.classList.add(theme);
    localStorage.setItem('theme', theme);
    updateCursorColor();
};

const translations = {
    en: { dir: 'ltr', lang: 'en', toggle: 'AR' },
    ar: { dir: 'rtl', lang: 'ar', toggle: 'EN' }
};

const setLanguage = (lang) => {
    const config = translations[lang];
    if (!config) return;
    html.setAttribute('dir', config.dir);
    html.setAttribute('lang', config.lang);
    const langToggleText = document.getElementById('lang-text');
    if (langToggleText) langToggleText.textContent = config.toggle;
    localStorage.setItem('lang', lang);

    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
        } else {
            el.textContent = text;
        }
    });

    // Update footer translation manually as it's not data-driven in HTML yet
    const footerP = document.querySelector('#footer p');
    if (footerP) {
        footerP.textContent = lang === 'ar'
            ? '© 2024 فارس محمد. جميع الحقوق محفوظة.'
            : '© 2024 Fares Mohammed. All rights reserved.';
    }
};

// 2. Initialize State
const savedTheme = localStorage.getItem('theme') || 'dark-mode';
const savedLang = localStorage.getItem('lang') || 'en';

setTheme(savedTheme);
setLanguage(savedLang);

// 3. Event Listeners
document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const newTheme = body.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
    setTheme(newTheme);
});

document.getElementById('lang-toggle')?.addEventListener('click', () => {
    const newLang = html.getAttribute('lang') === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
});

// Custom Cursor Logic
const cursor = document.getElementById('custom-cursor');
const cursorBlur = document.getElementById('cursor-blur');

document.addEventListener('mousemove', (e) => {
    if (!cursor || !cursorBlur) return;
    const x = e.clientX;
    const y = e.clientY;

    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;

    cursorBlur.animate({
        left: `${x}px`,
        top: `${y}px`
    }, { duration: 500, fill: "forwards" });
});

document.addEventListener('mousedown', () => cursor && (cursor.style.transform = 'translate(-50%, -50%) scale(0.8)'));
document.addEventListener('mouseup', () => cursor && (cursor.style.transform = 'translate(-50%, -50%) scale(1)'));

const interactives = 'a, button, .project-card, .skill-badges span, .puzzle-piece, input, textarea, .logo';
document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
});

// 15 Puzzle Logic
const puzzleBoard = document.getElementById('puzzle-board');
const puzzleMsg = document.getElementById('puzzle-msg');
let tiles = [];

const getNeighbors = (index) => {
    const neighbors = [];
    const row = Math.floor(index / 4);
    const col = index % 4;
    if (row > 0) neighbors.push(index - 4);
    if (row < 3) neighbors.push(index + 4);
    if (col > 0) neighbors.push(index - 1);
    if (col < 3) neighbors.push(index + 1);
    return neighbors;
};

const shuffleSolvable = () => {
    let currentTiles = [...Array(15).keys()].map(i => i + 1).concat(null);
    let emptyIndex = 15;
    for (let i = 0; i < 100; i++) {
        const neighbors = getNeighbors(emptyIndex);
        const nextMove = neighbors[Math.floor(Math.random() * neighbors.length)];
        [currentTiles[emptyIndex], currentTiles[nextMove]] = [currentTiles[nextMove], currentTiles[emptyIndex]];
        emptyIndex = nextMove;
    }
    return currentTiles;
};

const renderPuzzle = () => {
    if (!puzzleBoard) return;
    puzzleBoard.innerHTML = '';
    tiles.forEach((tile, index) => {
        const div = document.createElement('div');
        div.className = 'puzzle-piece' + (tile === null ? ' empty' : '');
        div.textContent = tile || '';
        if (tile !== null) {
            div.addEventListener('click', () => moveTile(index));
        }
        puzzleBoard.appendChild(div);
    });
};

const moveTile = (index) => {
    const emptyIndex = tiles.indexOf(null);
    const neighbors = getNeighbors(index);
    if (neighbors.includes(emptyIndex)) {
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        renderPuzzle();
        checkWin();
    }
};

const checkWin = () => {
    const isWin = tiles.slice(0, 15).every((tile, i) => tile === i + 1);
    if (isWin && puzzleMsg) {
        puzzleMsg.textContent = "Congratulations!";
        puzzleBoard.style.pointerEvents = 'none';
        puzzleBoard.style.opacity = '0.5';
    }
};

if (puzzleBoard) {
    tiles = shuffleSolvable();
    renderPuzzle();
}

// Form Handlers
document.getElementById('testimonial-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById('test-name').value,
        email: document.getElementById('test-email').value,
        message: document.getElementById('test-msg').value
    };
    try {
        const res = await fetch('/api/testimonials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            alert('Feedback submitted!');
            e.target.reset();
        }
    } catch (err) { console.error(err); }
});

document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        message: document.getElementById('contact-msg').value
    };
    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) alert('Message sent!');
    } catch (err) { console.error(err); }
});
