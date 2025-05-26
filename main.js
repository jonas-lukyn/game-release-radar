
let favorites = [];
let currentPage = 1;
const pageSize = 40;

async function loadGames(page = 1) {
    const response = await fetch(`https://api.rawg.io/api/games?dates=2025-01-01,2025-12-31&ordering=-added&page_size=${pageSize}&page=${page}&key=318c95baaf5446f0a2188c65d62251df`);
    const data = await response.json();

    const gamesByGenre = {};

    data.results.forEach(game => {
        const genres = game.genres?.map(g => g.name) || ["Nezařazeno"];
        genres.forEach(genre => {
            if (!gamesByGenre[genre]) {
                gamesByGenre[genre] = [];
            }
            gamesByGenre[genre].push({
                title: game.name,
                release_date: game.released,
                platform: game.platforms?.map(p => p.platform.name).join(', ') || 'Neznámé',
                image: game.background_image || '',
            });
        });
    });

    favorites = getFavorites();
    renderGameRows(gamesByGenre);
}

function renderGameRows(gamesByGenre) {
    const container = document.getElementById('game-list');
    container.innerHTML = '';
    Object.keys(gamesByGenre).forEach(genre => {
        const section = document.createElement('section');
        const title = document.createElement('h2');
        title.textContent = genre;
        title.className = 'row-title';

        const row = document.createElement('div');
        row.className = 'row';

        gamesByGenre[genre].forEach(game => {
            const isFav = favorites.includes(game.title);
            const tile = document.createElement('div');
            tile.className = 'game-tile';

            tile.innerHTML = `
                <img src="${game.image}" alt="${game.title}">
            `;
            tile.title = game.title + " (" + game.release_date + ")\n" + game.platform;
            tile.onclick = () => toggleFavorite(game.title);

            row.appendChild(tile);
        });

        section.appendChild(title);
        section.appendChild(row);
        container.appendChild(section);
    });
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function toggleFavorite(title) {
    if (favorites.includes(title)) {
        favorites = favorites.filter(t => t !== title);
    } else {
        favorites.push(title);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

loadGames(currentPage);
