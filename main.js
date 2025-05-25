
async function loadGames() {
    const response = await fetch('games.json');
    const games = await response.json();
    setupFilter(games);
    setupToggle(games);
}

function setupFilter(games) {
    const filter = document.getElementById('platform-filter');
    filter.addEventListener('change', () => {
        renderGames(games);
    });
}

function setupToggle(games) {
    const toggle = document.getElementById('toggle-favorites');
    toggle.addEventListener('click', () => {
        toggle.dataset.mode = toggle.dataset.mode === 'all' ? 'favorites' : 'all';
        toggle.textContent = toggle.dataset.mode === 'all' ? 'Zobrazit oblíbené' : 'Zobrazit všechny';
        renderGames(games);
    });
}

function renderGames(games) {
    const list = document.getElementById('game-list');
    const platform = document.getElementById('platform-filter').value;
    const mode = document.getElementById('toggle-favorites').dataset.mode;
    const favorites = getFavorites();

    list.innerHTML = '';

    let filteredGames = games.filter(game => platform === 'all' || game.platform === platform);
    if (mode === 'favorites') {
        filteredGames = filteredGames.filter(game => favorites.includes(game.title));
    }

    filteredGames.forEach(game => {
        const li = document.createElement('li');
        const isFav = favorites.includes(game.title);

        li.innerHTML = `
            ${game.title} – ${game.release_date} (${game.platform})
            <button onclick="toggleFavorite('${game.title}')" style="margin-left:1em;">
                ${isFav ? '✓ V oblíbených' : '+ Přidat'}
            </button>
        `;
        list.appendChild(li);
    });
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function toggleFavorite(title) {
    let favorites = getFavorites();
    if (favorites.includes(title)) {
        favorites = favorites.filter(t => t !== title);
    } else {
        favorites.push(title);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadGames(); // refresh
}

loadGames();
