
async function loadGames() {
    const response = await fetch('https://api.rawg.io/api/games?dates=2025-01-01,2025-12-31&ordering=released&key=318c95baaf5446f0a2188c65d62251df');
    const data = await response.json();
    const games = data.results.map(game => {
        return {
            title: game.name,
            release_date: game.released,
            platform: game.platforms?.map(p => p.platform.name).join(', ') || 'Neznámé'
        };
    });

    setupFilter(games);
    setupToggle(games);
}

function setupFilter(games) {
    const platforms = new Set(games.flatMap(g => g.platform.split(', ')));
    const filter = document.getElementById('platform-filter');
    filter.innerHTML = '<option value="all">Vše</option>' +
        Array.from(platforms).map(p => `<option value="${p}">${p}</option>`).join('');

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

    let filteredGames = games.filter(game => 
        platform === 'all' || game.platform.includes(platform));
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
